document.addEventListener("DOMContentLoaded", function () {
  if (window.renderMathInElement) {
    window.renderMathInElement(document.querySelector(".article-body") || document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "$", right: "$", display: false }
      ],
      ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
      throwOnError: false
    });
  }

  if (window.hljs) {
    window.hljs.highlightAll();
  }
});
