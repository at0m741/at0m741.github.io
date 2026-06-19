document.addEventListener("DOMContentLoaded", function () {
  if (!window.renderMathInElement) {
    return;
  }

  window.renderMathInElement(document.querySelector(".main-content") || document.body, {
    delimiters: [
      { left: "$$", right: "$$", display: true },
      { left: "$", right: "$", display: false }
    ],
    ignoredTags: ["script", "noscript", "style", "textarea", "pre", "code"],
    throwOnError: false
  });
});
