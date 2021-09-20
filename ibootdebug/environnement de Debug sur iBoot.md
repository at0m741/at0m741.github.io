

# environnement de Debug sur iBoot

DISCLAILMER!!! à noter que dans ce post les informations traitent en partie de logiciels et matériels internes à Apple, je ne serai pas en mesure de vous livrer quoi que ce soit. Ce post est à caractère éducatif et n'est en aucun cas un tutoriel. Notez également que jouer avec les parties bas niveaux de vos appareils peut causer des dommages irréversible, vous lisez ceci en connaissance de cause, je ne serai pas responsable.






![iboot](iboot.png)






iBoot comme vu dans l'article précédent, est la pièce maitresse du démarrage de nos appareils apple, tout du moins la plus importante, il met en place et s'occupe de bon nombre d'I/O comme l'USB ou l'UART (qui vont nous être extremement utiles ici). Notez que depuis quelques années il n'y à plus qu'un seul Bootloader dans nos iPhones.

Précédement, je vous avais montré l'utilisation de probes SWD afin de pouvoir debugger le SoC et l'iBoot des appareils CPFM00/01 ou exploités avec Checkm8, l'idée ici est d'apporter des modifications à iBoot afin de le rendre plus utile à une éventuelle recherche de vulnérabilité ou une meilleure appréhension de celui-ci. Je vais donc vous expliquer comment j'ai pu obtenir des options supplémentaires dans le bootloader en y ajoutant mes propres fonctions afin d'éviter d'avoir à acheter un de ces câbles magiques.







## premières explorations dans le code source

En 2018 un leaker a publié sur Github le code source (incomplet) d'iBoot iOS 9x (cf les différents articles sur internet), qui après certaines modifications dans le `Makefile` et à l'ajout d'units dans `la device_map.db` et autres petits tricks ont permis une compilation d'images DEVELOPMENT/DEBUG/RELEASE qui ont pu être bootées grâce à kloader et checkm8.

Après quelques recherches dans le code j'ai commencé par essayer d'adapter les commandes iBoot DEBUG à une version DEVELOPMENT ou RELEASE au vu de la complexité de faire démarrer des images DEBUG.

l'idée est dans cette portion de code:




```c
#if WITH_MENU

static int do_reset(int argc, struct cmd_arg *args)
{
	platform_quiesce_display();

#if WITH_HW_POWER
	// Clear any pending PMU events
	power_clr_events(1);
#endif

	platform_system_reset(false);

	return 0;
}

static int do_halt(int argc, struct cmd_arg *args)
{
	halt();
}

MENU_COMMAND(reboot, do_reset, "reboot the device", NULL);
MENU_COMMAND(reset, do_reset, NULL, NULL);
MENU_COMMAND_DEVELOPMENT(halt, do_halt, "halt the system (good for JTAG)", NULL);
```


Ce qui est assez simple en remplaçant

```c
MENU_COMMAND_DEBUG()
```

par

`MENU_COMMAND()` ou `MENU_COMMAND_DEVELOPMENT()`


Néanmoins il est important de savoir que cette méthode est assez limité au vu de l'inutilité de la plupart des commandes qui hors des versions de DEBUG (ou appareils proto), ne fonctionnenent tout simplement pas (certaines sont désactivées dans le code).
Notez que les builds iBoot DEBUG permettent d'écrire et de lire en mémoire. Néanmoins afin d'être démarrées elles nécessitent quelques modifications que je n'expliquerai pas ici.







![debugtag](debugtag.png)







Les versions de debug intègrent des commandes intéressantes et ont des privilèges plus élevés par rapport aux versions RELEASE/DEVELOPMENT. 
Les commandes md/mw par exemple permettent de lire et d'écrire en mémoire ce qui peut s'avérer relativement pratique.
En revanche elles ne fonctionnent nativement que sur les images DEBUG. Pour ce qui est des versions RELEASE/DEVELOPMENT, il est nécessaire d'apporter des patchs supplémentaires.
La commande `md` `<addr>` permet donc d'afficher un dump de memoire à une addresse donnée:

```c
static int
do_memdump(int argc, struct cmd_arg *args)
{
	uintptr_t address;
	size_t count;
	int width;
	size_t i;
	int index_mod = 16;

	/* default dump values */
	static uintptr_t last_address = DEFAULT_LOAD_ADDRESS;
	static size_t last_count = 0x100;

	if (!strcmp(args[0].str, "md")) {
		width = 32;
		if (argc > 1) {
			if (!strcmp(args[1].str, "-help")) {
				memdump_usage();
				return 0;
			} else if (!strcmp(args[1].str, "-64")) {
				width = 64;
				index_mod = 32;
			}
		}
	} else if (!strcmp(args[0].str, "mdh")) {
		width = 16;
	} else {
		width = 8;
	}
```
la structure est celle d'une commande basique d'iBoot, si la commande est entrée, elle print un dump 32bits d'une adresse de base, mais ont peut spécifier `-64` derrière et bien sûr une adresse voulue.
La commande `mw` permet à l'inverse d'écrire en mémoire à peut près tout ce que vous voulez.





### Modifications personnelles

Bien que les différentes commandes intégrées soit bien pratiques je dois bien avouer que la frustration était tout de même de mise. Grâce aux différentes probes SWD et à astris (ou openOCD) il est possible de dumper l'état des registres ARM en arrêtant le processus en cours, chose difficile sans ces précieux outils.
Nativement le seul moyen d'obtenir l'état des registres CPU sur iBoot est de générer un paniclog en ajoutant un breakpoint à une adresse donnée (pas compliqué en ajoutant une simple fonction de crash (BKPT).

![panic](panic.png)



le souci principal étant que cela force un reboot de l'appareil donc utile en certaines circonstances mais pas dans l'idée. J'ai donc cherché à afficher l'état des registres sans avoir à reboot et ce en entrant une commande.



```c
static int do_regs(int argc, struct cmd_arg *args)
{

	printf("\narm registers:\n\n");
 int address = 0;
 __asm__("mov %0, r0\n\t" : "=r" (address));
 printf("r0 = 0x%09x\n", address);

 //same for r1, r2, r3, r4, r5.....etc
}
MENU_COMMAND(regs, do_regs, "print registers addresses", NULL);
```



j'ai donc effectué la même opération pour tous les registres afin de pouvoir obtenir l'adresse de chacun grâce à `__asm__(`) qui appel l'assembleur inline en C et d'afficher via `Printf()` les différentes valeurs.

J'ai donc utilisé `MENU_COMMAND()`afin d'intégrer la commande aux trois types d'images. (à noter que sur un iBoot RELEASE un câble UART est indispensable et que des patchs supplémentaires doivent être appliqués).
Dans les versions non compilées, il est possible d'intégrer ces différentes fonctions grâce à un payload fait avec la base iBEX de Xerub (je m'expliquerai un peu plus tards).

Comme vous pouvez le voir lorsque je rentre la commande regs, la console iRecovery me retourne la valeur de chacuns des registres (c'est également affiché dans le UART log).

![regdump](regdump.png)




### Conclusions


iBoot est à mon sens une partie extrêmement intéressantes d'iOS, néanmoins de par sa position peu accessible, le debug peut s'avérer difficile et doit majoritairement passer par un long travail de reverse, étant quelqu'un d'assez flemmard j'ai donc vite pensé à faciliter un peu les choses. Intégrer de nouvelles portions de code à iBoot permet dans un sens d'aider à son exploration mais surtout à une meilleure compréhension de son fonctionnement interne. L'article ici présent montre à quel point il peut être intéressant de parfois mettre les mains dans le code et de modifier quelque chose afin d'en comprendre certains aspects.
Ce writup évoluera en fonction des avancées que je ferai au cours des prochains mois (le payload iBEX par exemple qui facilitera grandement les choses mais que je dois finir car il ne fonctionne pas encore complètement mais que je publierai par la suite). 


### Remerciement
@matteyeux, @xerub, @nyan_satan, exploit3dguy, @iH8sn0w (qui m'avait donné l'idée de l'ajout d'une fonction de debug il y à quelques années), @nasm




