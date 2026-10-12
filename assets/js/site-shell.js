(() => {
  const header = `
  <header class="site-header">
    <a class="brand" href="index.html" aria-label="Stachurski home"><img src="assets/logo/stachurski-logo-light.svg" width="430" height="105" alt="Stachurski — established 1974"></a>
    <nav class="main-nav" id="main-nav" aria-label="Main navigation">
      <a href="catalog.html" data-i18n="nav.catalog">Products</a>
      <a href="O-naszej-firmie.html" data-i18n="nav.about">Our story</a>
      <a href="Galeria.html" data-i18n="nav.gallery">Gallery</a>
      <a href="Kontakt.html" data-i18n="nav.contact">Contact</a>
    </nav>
    <div class="header-actions">
      <a class="header-call" href="tel:+48504182760">+48 504 182 760</a>
      <div class="lang-switch" role="group" aria-label="Choose language">
        <button class="lang-option" type="button" data-lang="en" aria-label="English" title="English"><img src="assets/flags/flag-en.svg" alt=""><span>EN</span></button>
        <button class="lang-option" type="button" data-lang="pl" aria-label="Polski" title="Polski"><img src="assets/flags/flag-pl.svg" alt=""><span>PL</span></button>
        <button class="lang-option" type="button" data-lang="de" aria-label="Deutsch" title="Deutsch"><img src="assets/flags/flag-de.svg" alt=""><span>DE</span></button>
      </div>
      <a class="button button-lime button-small header-quote" href="Valuation.html" data-i18n="nav.quote">Request a quote <span>↗</span></a>
      <button class="menu-toggle" type="button" aria-label="Open navigation" aria-expanded="false" aria-controls="main-nav"><span></span><span></span></button>
    </div>
  </header>`;
  const footer = `
  <footer class="site-footer">
    <div class="footer-brand"><a href="index.html"><img src="assets/logo/stachurski-logo-light.svg" width="430" height="105" alt="Stachurski logo"></a>
      <p data-i18n="footer.tagline">Steelwork for the glass industry.<br>Made in Poland since 1974.</p><span class="footer-location" data-i18n="footer.place">KAMIENNA <i>·</i> POLAND</span></div>
    <div class="footer-links">
      <div><span class="footer-heading" data-i18n="footer.products">PRODUCT RANGE</span><a href="catalog.html" data-i18n="footer.allProducts">Browse all products</a><a href="RACKS.html" data-i18n="footer.racks">Glass racks</a><a href="TROLLEYS.html" data-i18n="footer.trolleys">Trolleys</a><a href="Available-immediately.html" data-i18n="footer.stock">Available from stock</a></div>
      <div><span class="footer-heading" data-i18n="footer.company">STACHURSKI</span><a href="O-naszej-firmie.html" data-i18n="footer.about">Our story</a><a href="Galeria.html" data-i18n="footer.gallery">Gallery</a><a href="Kontakt.html" data-i18n="footer.contact">Contact</a><a href="Valuation.html" data-i18n="footer.quote">Get a quote</a></div>
      <div class="footer-contact"><span class="footer-heading" data-i18n="footer.hello">SAY HELLO</span><a href="mailto:info@stachurski.com.pl">info@stachurski.com.pl</a><a href="tel:+48775466189">+48 77 546 61 89</a><span>ul. Główna 7<br>46-100 Kamienna, Poland</span></div>
    </div>
    <div class="footer-bottom"><span>© 2026 STACHURSKI. <span data-i18n="footer.bottom1">BUILT TO WORK.</span></span><span data-i18n="footer.bottom2">DESIGNED FOR PEOPLE WHO MOVE GLASS.</span><a href="https://www.stachurski.com.pl/Polityka-prywatnosci.html" target="_blank" rel="noopener" data-i18n="footer.privacy">Privacy <span>↗</span></a></div>
  </footer>`;
  if (!document.querySelector('.site-header')) document.body.insertAdjacentHTML('afterbegin', header);
  if (!document.querySelector('.site-footer')) document.body.insertAdjacentHTML('beforeend', footer);
})();