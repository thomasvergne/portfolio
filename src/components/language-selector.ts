const languageSelector =
  document.querySelector<HTMLSelectElement>("#language-selector");

if (!languageSelector) {
  throw new Error("Language selector not found");
}

languageSelector.addEventListener("change", (event) => {
  if (!event.target) return;
  const selector = event.target as HTMLSelectElement;
  const selectedLang = selector.value;

  const currentURL = new URL(window.location.href);
  const currentPath = currentURL.pathname;
  const currentSearch = currentURL.search;
  const currentHash = currentURL.hash;
  const newURL = new URL(currentURL);
  newURL.pathname = currentPath.replace(
    /^\/[a-z]{2}(-[A-Z]{2})?/,
    `/${selectedLang}`
  );
  newURL.search = currentSearch;
  newURL.hash = currentHash;
  window.location.href = newURL.toString();
});
