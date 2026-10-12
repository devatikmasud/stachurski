(() => {
  const t = (key, fallback) => window.StachurskiI18n?.text(key) || fallback;
  const menuButton = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  if (menuButton && nav) {
    menuButton.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      menuButton.setAttribute('aria-expanded', String(open));
      menuButton.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
    });
    nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
      nav.classList.remove('open');
      menuButton.setAttribute('aria-expanded', 'false');
    }));
  }

  const search = document.getElementById('product-search');
  const searchInput = document.getElementById('search-products');
  const cards = [...document.querySelectorAll('.product-card')];
  const noResults = document.querySelector('.no-results');
  function findProducts(query) {
    if (!cards.length) return;
    const q = query.trim().toLocaleLowerCase();
    let visible = 0;
    cards.forEach(card => {
      const matches = !q || ((card.dataset.search || '') + ' ' + card.innerText).toLocaleLowerCase().includes(q);
      card.hidden = !matches;
      if (matches) visible++;
    });
    if (noResults) noResults.hidden = visible !== 0;
    if (document.getElementById('products')) document.getElementById('products').scrollIntoView({behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
  }
  search?.addEventListener('submit', e => { e.preventDefault(); findProducts(searchInput?.value || ''); });
  searchInput?.addEventListener('input', () => { if (searchInput.value.length > 1) findProducts(searchInput.value); });

  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  form?.addEventListener('submit', async e => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    if (location.protocol === 'file:') {
      status.textContent = t('form.preview', 'Preview mode: the contact form needs PHP. Run the included preview script or use a PHP-enabled host.');
      status.className = 'form-status error';
      return;
    }
    const button = form.querySelector('[type="submit"]');
    button.disabled = true;
    status.textContent = t('form.sending', 'Sending your enquiry…');
    status.className = 'form-status';
    try {
      const response = await fetch(form.action, {method:'POST', body:new FormData(form), headers:{'Accept':'application/json'}});
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'We could not send your enquiry. Please email us directly.');
      status.textContent = result.message || t('form.sent', 'Thank you — your enquiry has been sent.');
      status.className = 'form-status success';
      form.reset();
      document.dispatchEvent(new Event('stachurski-form-reset'));
    } catch (err) {
      status.textContent = err.message || 'Something went wrong. Please try again or email info@stachurski.com.pl.';
      status.className = 'form-status error';
    } finally { button.disabled = false; }
  });

  const lightbox = document.getElementById('gallery-lightbox');
  if (lightbox) {
    const lightboxImg = lightbox.querySelector('img');
    const close = () => { lightbox.classList.remove('open'); document.body.style.overflow=''; };
    document.querySelectorAll('.gallery-card img').forEach(img => img.addEventListener('click', () => {
      lightboxImg.src=img.src; lightboxImg.alt=img.alt; lightbox.classList.add('open'); document.body.style.overflow='hidden';
    }));
    lightbox.querySelector('button')?.addEventListener('click',close);
    lightbox.addEventListener('click',e=>{if(e.target===lightbox)close();});
    document.addEventListener('keydown',e=>{if(e.key==='Escape')close();});
  }

  const revealItems = document.querySelectorAll('.step-card,.product-card,.feature-copy,.about-copy,.contact-heading,.contact-form,.gallery-card,.history-item,.category-hero-copy');
  if (!matchMedia('(prefers-reduced-motion: reduce)').matches && 'IntersectionObserver' in window) {
    revealItems.forEach((el, i) => { el.style.setProperty('--reveal-delay', `${(i % 4) * 65}ms`); el.classList.add('reveal-pending'); });
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); }
    }), {threshold:.12});
    revealItems.forEach(el => observer.observe(el));
  }
})();