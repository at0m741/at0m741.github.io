(function () {
  var keywords = new Set([
    "as",
    "const",
    "else",
    "evolution",
    "field",
    "for",
    "func",
    "if",
    "in",
    "initial_data",
    "let",
    "metric",
    "return",
    "spacetime",
    "surface",
    "where"
  ]);

  var types = new Set([
    "cov_tensor2",
    "cov_tensor3",
    "covector",
    "con_tensor2",
    "mixed_tensor2",
    "scalar",
    "tensor",
    "vector"
  ]);

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function span(className, value) {
    return '<span class="tensorium-token ' + className + '">' + escapeHtml(value) + "</span>";
  }

  function classify(token) {
    if (/^(\/\/|#)/.test(token)) {
      return span("comment", token);
    }
    if (/^"/.test(token) || /^'/.test(token)) {
      return span("string", token);
    }
    if (/^--/.test(token)) {
      return span("flag", token);
    }
    if (/^tensorium\./.test(token) || token === "Tensorium_cc" || token === "func.func") {
      return span("op", token);
    }
    if (/^\d/.test(token)) {
      return span("number", token);
    }
    if (types.has(token)) {
      return span("type", token);
    }
    if (keywords.has(token)) {
      return span("keyword", token);
    }
    if (/^[=+\-*\/<>!&|]+$/.test(token)) {
      return span("operator", token);
    }
    return escapeHtml(token);
  }

  function highlight(text) {
    var pattern = /("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*|#.*|--[A-Za-z0-9][\w-]*|\btensorium\.[A-Za-z_]\w*|\bfunc\.func\b|\bTensorium_cc\b|\b\d+(?:\.\d+)?\b|\b[A-Za-z_][A-Za-z0-9_]*\b|[=+\-*\/<>!&|]+|[^\s])/g;
    var output = "";
    var lastIndex = 0;
    var match;

    while ((match = pattern.exec(text)) !== null) {
      output += escapeHtml(text.slice(lastIndex, match.index));
      output += classify(match[0]);
      lastIndex = pattern.lastIndex;
    }

    output += escapeHtml(text.slice(lastIndex));
    return output;
  }

  document.addEventListener("DOMContentLoaded", function () {
    document.querySelectorAll("code.language-tensorium, .language-tensorium code").forEach(function (code) {
      if (code.dataset.tensoriumHighlighted === "true") {
        return;
      }

      code.innerHTML = highlight(code.textContent);
      code.dataset.tensoriumHighlighted = "true";
    });
  });
})();
