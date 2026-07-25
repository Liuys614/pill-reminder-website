document.querySelectorAll("[data-year]").forEach((el) => {
  el.textContent = new Date().getFullYear();
});

/* Theme toggle.
   The inline script in <head> has already applied the starting theme
   (saved choice, else the OS preference, else light) before first paint. */
(function () {
  const STORAGE_KEY = "pr-theme";
  const root = document.documentElement;
  const toggles = document.querySelectorAll("[data-theme-toggle]");
  if (!toggles.length) return;

  const systemDark = window.matchMedia("(prefers-color-scheme: dark)");

  const current = () => (root.getAttribute("data-theme") === "dark" ? "dark" : "light");

  function apply(theme) {
    root.setAttribute("data-theme", theme);
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", theme === "dark" ? "#181a1d" : "#f4f5f6");
    toggles.forEach((button) => {
      button.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
      button.setAttribute(
        "aria-label",
        theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
      );
    });
  }

  apply(current());

  toggles.forEach((button) => {
    button.addEventListener("click", () => {
      const next = current() === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch (e) {
        /* private browsing — the choice just won't persist */
      }
      apply(next);
    });
  });

  // Keep following the OS until the visitor makes their own choice.
  const onSystemChange = (event) => {
    let saved = null;
    try {
      saved = localStorage.getItem(STORAGE_KEY);
    } catch (e) {
      /* ignore */
    }
    if (saved !== "light" && saved !== "dark") apply(event.matches ? "dark" : "light");
  };

  if (systemDark.addEventListener) systemDark.addEventListener("change", onSystemChange);
  else if (systemDark.addListener) systemDark.addListener(onSystemChange);
})();
