(() => {
  const data=window.STACHURSKI_CATEGORIES||[];
  const lang=()=>window.StachurskiI18n?.lang||'en';
  const choose=(value,l=lang())=>Array.isArray(value)?value:(value?.[l]||value?.en||[]);
  const escape=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  function card(c,index){
    const title=c.title[lang()],description=c.description[lang()],models=choose(c.models);
    return `<a class="product-card catalogue-card ${index===0?'product-card-large':''}" href="${c.route||`${c.id}.html`}?lang=${lang()}" data-search="${escape([title,...models].join(' '))}"><div class="product-image"><img src="${c.image}" width="500" height="400" alt="${escape(c.alt[lang()])}" loading="lazy"><span class="product-tag">${String(index+1).padStart(2,'0')} <i>—</i> ${escape(title.toLocaleUpperCase())}</span><span class="product-link">↗</span></div><div class="product-info"><div><h3>${escape(title)}</h3><p>${escape(description)}</p></div><span class="product-arrow">↗</span></div><div class="catalogue-models"><span>${models.length} ${escape(window.StachurskiI18n?.text('catalog.models')||'models listed')}</span><b>${escape(models.slice(0,3).join(' · '))}${models.length>3?' …':''}</b></div></a>`;
  }
  function renderGrid(){
    document.querySelectorAll('[data-category-grid]').forEach(el=>{el.innerHTML=data.map(card).join('');});
    const count=document.querySelector('[data-category-count]');if(count)count.textContent=String(data.length).padStart(2,'0');
  }
  function renderTicker(){
    const ids=['racks','trolleys','tables','pallets','conveyors','accessories'];
    document.querySelectorAll('.ticker-track span').forEach((el,i)=>{const c=data.find(item=>item.id===ids[i%ids.length]);if(c)el.innerHTML=`${escape(c.title[lang()].toLocaleUpperCase())} <i>✳</i>`;});
  }
  function renderCategory(){
    const host=document.querySelector('[data-category-detail]');if(!host)return;
    const file=location.pathname.split('/').pop().replace(/\.html?$/i,'');
    const id=host.dataset.category||file;
    const c=data.find(item=>item.id===id)||data.find(item=>item.id===file)||data[0];if(!c)return;
    const l=lang(),models=choose(c.models,l),title=c.title[l],description=c.description[l];
    document.title=`${title} | Stachurski`;
    const modelMarkup=models.map((m,i)=>`<li class="model-row"><span class="model-index">${String(i+1).padStart(2,'0')}</span><span class="model-name">${escape(m)}</span><a class="model-action" href="${m==='STA-TS'?`STA-TS-en.html?lang=${lang()}`:`Valuation.html?category=${encodeURIComponent(c.id)}&model=${encodeURIComponent(m)}&lang=${lang()}`}" aria-label="${escape(title)} — ${escape(m)}">↗</a></li>`).join('');
    host.innerHTML=`<section class="category-hero-page"><div class="category-hero-media"><img src="${c.image}" width="700" height="600" alt="${escape(c.alt[l])}" fetchpriority="high"><span class="photo-index">${escape(title.toUpperCase())} <i>/</i> ${String(models.length).padStart(2,'0')} MODELS</span></div><div class="category-hero-copy"><div class="eyebrow-pill"><span class="status-dot"></span> ${escape(window.StachurskiI18n.text('category.source'))}</div><h1>${escape(title)}<br><em>${l==='pl'?'dla szkła i okien':l==='de'?'für Glas und Fenster':'for glass & windows'}</em></h1><p>${escape(description)}</p><div class="hero-actions"><a class="button button-lime" href="Valuation.html?category=${encodeURIComponent(c.id)}&lang=${lang()}">${escape(window.StachurskiI18n.text('category.quoteButton').replace(/<[^>]*>/g,''))} <span>↗</span></a><a class="product-spec-link" href="#models">${escape(window.StachurskiI18n.text('category.models'))} <span>↓</span></a></div><div class="micro-proof"><span>${escape(window.StachurskiI18n.text('category.item'))} ${models.length}</span><i>·</i><span>STACHURSKI / 1974</span></div></div></section><section class="category-models" id="models"><div class="section-label"><span>—</span> ${escape(window.StachurskiI18n.text('category.products'))}</div><div class="section-heading-row"><h2>${escape(window.StachurskiI18n.text('category.models'))}</h2><p>${escape(window.StachurskiI18n.text('category.note'))}</p></div><ul class="model-list">${modelMarkup}</ul></section><section class="quote-cta"><div class="cta-emblem">S<span>↗</span></div><div class="quote-cta-text"><div class="section-label">${escape(title.toUpperCase())} <i>·</i> ${escape(window.StachurskiI18n.text('category.source').toUpperCase())}</div><h2>${escape(window.StachurskiI18n.text('category.quoteTitle'))}</h2><p>${escape(window.StachurskiI18n.text('category.quoteText'))}</p></div><a class="button button-dark" href="Valuation.html?category=${encodeURIComponent(c.id)}&lang=${lang()}">${window.StachurskiI18n.text('category.quoteButton')}</a></section>`;
  }
  function fillCategorySelect(){
    const s=document.querySelector('[data-category-select]');if(!s)return;
    const selected=new URL(location.href).searchParams.get('category')||'';
    const language=lang();s.innerHTML=`<option value="">${escape(window.StachurskiI18n.text('quote.select'))}</option>`+data.map(c=>`<option value="${c.id}" ${selected===c.id?'selected':''}>${escape(c.title[language])}</option>`).join('');
  }
  function render(){renderGrid();renderTicker();renderCategory();fillCategorySelect();}
  render();document.addEventListener('stachurski-language-change',render);
  const q=document.querySelector('#catalog-search');if(q){q.addEventListener('input',()=>{const query=q.value.trim().toLocaleLowerCase();document.querySelectorAll('.catalogue-card').forEach(c=>c.hidden=!!query&&!(`${c.dataset.search} ${c.innerText}`.toLocaleLowerCase().includes(query)));});}
})();
