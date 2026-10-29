import { useEffect, useRef, useState } from 'react';
import { content, REPO, DOCS } from './content.js';
import './reference.css';
import './remi.css';

const assets = '/assets/';
const iconFiles = { github: 'icon-5.svg', arrow: 'icon-6.svg', language: 'icon-1.svg', chevron: 'icon-2.svg', download: 'icon-4.svg' };
function Icon({ name, className = '' }) {
  return <img className={`ui-icon ${className}`} src={`${assets}icons/${iconFiles[name]}`} alt="" aria-hidden="true" width="18" height="18" />;
}
function Brand({ hero = false }) {
  return <span className={`wordmark ${hero ? 'wordmark-hero' : 'wordmark-nav'}`}>REMI<span className="brand-cursor" aria-hidden="true">_</span></span>;
}
function SectionHeading({ index, children }) {
  return <div className="sec-head" data-reveal><span className="sec-index">// {index}</span><span className="sec-name">{children}</span></div>;
}
function Ticker({ items, reverse = false }) {
  return <div className={`ticker-wrap ${reverse ? 'reverse' : ''}`} aria-hidden="true"><div className={`ticker ${reverse ? 'ticker-ink' : ''}`}><div className="ticker-track">{[...items, ...items, ...items].map((item, i) => <span className="ticker-item" key={i}>{item}<em>◆</em></span>)}</div></div></div>;
}
function ExternalLink({ href, children, ...props }) {
  return <a href={href} target="_blank" rel="noreferrer" {...props}>{children}</a>;
}
const commands = 'git clone https://github.com/Serguiales16/remi.git\ncd remi\npnpm install\npnpm build\npnpm ui:build\npnpm openclaw onboard';

function InstallDialog({ open, onClose, t, lang }) {
  const dialog = useRef(null);
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [platform, setPlatform] = useState('Windows');
  useEffect(() => {
    if (open && !dialog.current.open) dialog.current.showModal();
    if (!open && dialog.current.open) dialog.current.close();
    if (open) { setCopied(false); setCopyError(false); }
    const previous = document.body.style.overflow;
    if (open) document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previous; };
  }, [open]);
  async function copy() {
    try { await navigator.clipboard.writeText(commands); setCopied(true); setCopyError(false); }
    catch { setCopyError(true); }
  }
  function moveTab(e, p) {
    if (!['ArrowLeft','ArrowRight'].includes(e.key)) return;
    e.preventDefault();
    const choices = ['Windows','macOS','Linux'];
    const next = choices[(choices.indexOf(p) + (e.key === 'ArrowRight' ? 1 : 2)) % 3];
    setPlatform(next); document.getElementById(`tab-${next}`).focus();
  }
  return <dialog ref={dialog} className="install-dialog" aria-labelledby="install-title" onCancel={onClose} onClose={onClose} onKeyDown={e => { if (e.key === 'Escape') { e.preventDefault(); onClose(); } }} onClick={e => { if (e.target === dialog.current) onClose(); }}>
    <div className="install-content">
      <button type="button" className="dialog-close" aria-label={t.close} onClick={onClose}>×</button>
      <div className="install-eyebrow">{t.eyebrow}</div><h2 id="install-title">{t.title}</h2><p className="install-intro">{t.intro}</p>
      <div className="platform-tabs" role="tablist" aria-label={lang === 'es' ? 'Sistema operativo' : 'Operating system'}>{['Windows', 'macOS', 'Linux'].map(p => <button type="button" key={p} id={`tab-${p}`} role="tab" aria-selected={platform === p} aria-controls="install-commands" tabIndex={platform === p ? 0 : -1} onClick={() => setPlatform(p)} onKeyDown={e => moveTab(e,p)}>{p}</button>)}</div>
      <div className="install-command-panel" role="tabpanel" id="install-commands" aria-labelledby={`tab-${platform}`} tabIndex="0"><div className="command-top"><span>{platform === 'Windows' ? 'POWERSHELL' : 'TERMINAL'} // {t.source}</span><span className="terminal-status">●</span></div><pre><code>{commands}</code></pre></div>
      <button type="button" className="btn btn-red install-copy" onClick={copy}>{copied ? t.copied : t.copy}<Icon name="arrow" /></button>
      <p aria-live="polite" className={`copy-feedback ${copyError ? 'error' : ''}`}>{copyError ? t.error : copied ? t.copied : ''}</p>
      <p className="install-note">{t.note}</p><ExternalLink href={`${DOCS}/start/setup.md`}>{t.docs} <span aria-hidden="true">↗</span></ExternalLink><div className="install-bottom">{t.step}</div>
    </div>
  </dialog>;
}

export function App() {
  const [lang, setLang] = useState(() => { try { return localStorage.getItem('remi-language') === 'en' ? 'en' : 'es'; } catch { return 'es'; } });
  const [languageOpen, setLanguageOpen] = useState(false);
  const [installOpen, setInstallOpen] = useState(false);
  const [alternate, setAlternate] = useState(true);
  const [glitching, setGlitching] = useState(false);
  const [openFaq, setOpenFaq] = useState([]);
  const [progress, setProgress] = useState(0);
  const languageRef = useRef(null);
  const glitchTimer = useRef(null);
  const t = content[lang];
  useEffect(() => {
    document.title = t.title; document.documentElement.lang = lang;
    try { localStorage.setItem('remi-language', lang); } catch { /* Storage is optional. */ }
  }, [lang, t.title]);
  useEffect(() => {
    const onScroll = () => { const max = document.documentElement.scrollHeight - innerHeight; setProgress(max > 0 ? scrollY / max : 0); };
    const observer = new IntersectionObserver(entries => entries.forEach(entry => { if (entry.isIntersecting) { entry.target.classList.add('revealed', 'visible'); observer.unobserve(entry.target); } }), { threshold: 0.08 });
    document.querySelectorAll('[data-reveal], .feature-item').forEach(el => observer.observe(el));
    window.addEventListener('scroll', onScroll, { passive: true }); onScroll();
    return () => { observer.disconnect(); window.removeEventListener('scroll', onScroll); clearTimeout(glitchTimer.current); };
  }, []);
  useEffect(() => {
    if (!languageOpen) return;
    const close = e => { if (!languageRef.current?.contains(e.target)) setLanguageOpen(false); };
    const key = e => { if (e.key === 'Escape') { setLanguageOpen(false); languageRef.current?.querySelector('button').focus(); } };
    document.addEventListener('pointerdown', close); document.addEventListener('keydown', key);
    return () => { document.removeEventListener('pointerdown', close); document.removeEventListener('keydown', key); };
  }, [languageOpen]);
  function switchForm() { setAlternate(v => !v); setGlitching(true); clearTimeout(glitchTimer.current); glitchTimer.current = setTimeout(() => setGlitching(false), 700); }
  const openInstall = () => setInstallOpen(true);
  const links = ['#multi-harness', '#open-source', '#memory', '#get-started', '#faq'];

  return <>
    <a className="skip-link" href="#main">{lang === 'es' ? 'Saltar al contenido' : 'Skip to content'}</a>
    <div className="scroll-progress" style={{ transform: `scaleX(${progress})` }} />
    <nav aria-label={lang === 'es' ? 'Navegación principal' : 'Main navigation'}><div className="nav-inner"><a href="#" className="nav-logo" aria-label="Remi"><Brand /></a><div className="nav-links">{t.nav.map((label,i) => <a className="desktop-link" key={links[i]} href={links[i]}>{label}</a>)}
      <div className="locale-switcher" ref={languageRef}><button type="button" className={`locale-trigger ${languageOpen ? 'is-open' : ''}`} aria-label={lang === 'es' ? 'Elegir idioma' : 'Choose language'} aria-expanded={languageOpen} aria-controls="language-options" onClick={() => setLanguageOpen(v => !v)}><Icon name="language" /><Icon name="chevron" className="locale-chevron" /></button>{languageOpen && <div className="language-dropdown" id="language-options">{[['es','Español'],['en','English']].map(([code,label]) => <button type="button" key={code} lang={code} aria-pressed={lang === code} className={lang === code ? 'selected' : ''} onClick={() => {setLang(code);setLanguageOpen(false);}}>{label}<span>{code.toUpperCase()}</span></button>)}</div>}</div>
      <button type="button" className="nav-cta nav-download-cta" onClick={openInstall}>{t.start}</button>
    </div></div></nav>
    <main id="main">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-watermark" aria-hidden="true">REMI</div><div className="hero-grid" aria-hidden="true"/><div className="hero-edge-fx" aria-hidden="true"/><div className="hero-side-tag" data-hero-reveal="5" aria-hidden="true">PROJECT REMI <span className="sep">◆</span> AGENT_READY</div>
        <div className="hero-chara" data-hero-reveal="3"><button type="button" className={`chara-stage ${glitching ? 'glitching' : ''}`} aria-label={lang === 'es' ? 'Cambiar apariencia de Remi' : 'Switch Remi’s form'} aria-pressed={!alternate} onClick={switchForm}>
          <img className={`chara-img ${alternate ? 'is-hidden' : ''}`} src={`${assets}character-hero.webp`} alt={alternate ? '' : lang === 'es' ? 'El gato negro de Remi con reflejos rojos y azules' : 'Remi’s black cat with red and blue rim lighting'} width="1024" height="1536" fetchPriority="high"/>
          <img className={`chara-img chara-img-alt ${alternate ? '' : 'is-hidden'}`} src={`${assets}character-hero-alt.webp`} alt={alternate ? lang === 'es' ? 'Remi, una chica de pelo oscuro con un gato negro sobre el hombro' : 'Remi, a dark-haired girl with a black cat on her shoulder' : ''} width="1024" height="1536" fetchPriority="high"/>
          <span className="chara-scanline" aria-hidden="true"/><span className="chara-tag">REMI <span className="dot">//</span> {alternate ? 'ALTER EGO' : 'READY'}</span><span className="cross tl" aria-hidden="true"/><span className="cross br" aria-hidden="true"/>
        </button></div>
        <div className="container hero-inner"><div className="hero-copy"><div className="hero-tag" data-hero-reveal="1">{t.tag}</div><div className="hero-brand" data-hero-reveal="2"><Brand hero/></div><h1 id="hero-title" className="h-cn hero-title" data-hero-reveal="3">{t.think} <span className="accent glitch" data-text={t.done}>{t.done}</span></h1><p className="hero-lead" data-hero-reveal="4">{t.intro}</p><div data-hero-reveal="5"><div className="device-download-actions hero-ctas"><button type="button" className="btn btn-red" onClick={openInstall}><Icon name="download"/>{t.start}</button><ExternalLink href={REPO} className="btn btn-line device-download-other"><span className="device-download-other-label"><Icon name="github"/><span>GitHub</span></span><Icon name="arrow"/></ExternalLink></div><ExternalLink href={REPO} className="hero-more-link">{t.guide} <span aria-hidden="true">→</span></ExternalLink></div><div className="hero-meta" data-hero-reveal="5">{t.meta.map(item => <span key={item}>{item}</span>)}</div></div></div>
      </section>
      <Ticker items={t.ticker}/>
      <section className="section section-cream" id="multi-harness"><div className="container"><SectionHeading index="01">{t.models.label}</SectionHeading><div className="harness-layout"><div className="harness-copy" data-reveal><h2 className="h-cn">{t.models.title}</h2><p className="lead">{t.models.lead}</p><p className="harness-motto">{t.models.motto}</p></div><div className="harness-map" data-reveal><div className="harness-map-label">{t.models.deck}</div><div className="harness-deck motion-ready" role="list">{t.models.names.map((name,i) => <div key={i} role="listitem" className={`harness-card ${i < 3 ? 'harness-card-live' : 'harness-card-future'} ${i === 4 ? 'harness-card-native' : ''}`}><span className="harness-card-id">MODEL_0{i+1}</span><strong>{name.split('\n').map((line,j) => <span key={j}>{j>0 && <br/>}{line}</span>)}</strong><span className={`harness-card-status ${i<3 ? 'live':'future'}`}>{t.models.status[i]}</span></div>)}</div><div className="harness-core"><div className="harness-core-head"><span>REMI</span><span>{t.models.routing}</span></div><div className="harness-core-items">{t.models.items.map(item => <span key={item}>{item}</span>)}</div><p>{t.models.note}</p></div></div></div>
        <div className="orca-block" data-reveal><div className="orca-copy"><div className="orca-copy-heading"><span className="orca-kicker">{t.models.crewTag}</span><h3 className="h-cn orca-title">{t.models.crew}</h3></div><p>{t.models.crewLead}</p></div><div className="orca-pipeline motion-ready"><div className="orca-pipeline-head"><span>{t.models.pipeline}</span><span>{t.models.held}</span></div><div className="orca-pipeline-stages"><div className="orca-stage orca-stage-plan"><div className="orca-stage-meta"><span>{t.models.plan}</span><span>{t.models.reason}</span></div><div className="orca-combo"><strong>{t.models.agent}</strong><i>×</i><strong>PLAN</strong></div><p>{t.models.architecture}</p></div><div className="orca-stage orca-stage-execute"><div className="orca-stage-meta"><span>{t.models.execute}</span><span>{t.models.workers}</span></div><div className="orca-worker-grid">{t.models.workerNames.map((name,i) => <div key={i} className="orca-worker-card"><span>WORKER_0{i+1}</span><strong>REMI × {['RESEARCH','BUILD','DOCS'][i]}</strong><em>{name}</em></div>)}</div></div><div className="orca-stage orca-stage-review"><div className="orca-stage-meta"><span>{t.models.review}</span><span>{t.models.quality}</span></div><div className="orca-combo"><strong>{t.models.agent}</strong><i>×</i><strong>REVIEW</strong></div><p>{t.models.reviewNote}</p></div></div><div className="orca-continuity"><span>{t.models.continuity}</span><strong>{t.models.criteria}</strong></div></div></div>
      </div></section>
      <section className="section section-ink" id="toolbox"><div className="container"><SectionHeading index="02">{t.tools.label}</SectionHeading><div className="ready-intro"><h2 className="h-cn" data-reveal>{t.tools.title}</h2><div className="ready-intro-copy" data-reveal><p className="lead">{t.tools.lead}</p><div className="access-options">{t.tools.options.map(([name,sub]) => <span key={name}>{name}<em>{sub}</em></span>)}</div><p className="access-own"><strong>{t.tools.own}</strong>{t.tools.ownDetail}</p></div></div><div className="tool-groups" data-reveal>{t.tools.groups.map(([label,title,body]) => <div className="tool-group" key={label}><span>{label}</span><strong>{title}</strong><p>{body}</p></div>)}</div></div></section>
      <section className="section section-cream" id="trust"><div className="container"><SectionHeading index="03">{t.trust.label}</SectionHeading><h2 className="h-cn" data-reveal>{t.trust.title}</h2><p className="lead section-intro" data-reveal>{t.trust.lead}</p><div className="trust-grid">{t.trust.cards.map(([title,body]) => <article className="trust-item" key={title} data-reveal><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>
      <section className="section section-ink" id="anywhere"><div className="container"><SectionHeading index="04">{t.anywhere.label}</SectionHeading><h2 className="h-cn" data-reveal>{t.anywhere.title}</h2><p className="lead section-intro" data-reveal>{t.anywhere.lead}</p><div className="features-list anywhere-list">{t.anywhere.cards.map(([title,body],i) => <article key={i} className="feature-item"><span className="corner tl" aria-hidden="true"/><span className="corner br" aria-hidden="true"/><span className="fi-num">0{i+1}</span><h3>{title}{i===0 && <span className="live-badge">LIVE</span>}</h3><p>{body}</p></article>)}</div></div></section>
      <section className="section section-cream" id="open-source"><div className="container"><SectionHeading index="05">{t.shape.label}</SectionHeading><div className="shape-intro"><h2 className="h-cn" data-reveal>{t.shape.title}</h2><div className="shape-intro-copy" data-reveal><p className="lead">{t.shape.lead}</p><p className="open-source-line"><strong>{t.shape.line}</strong><span>{t.shape.license}</span></p></div></div><div className="ownership-matrix" data-reveal><div className="ownership-head">{t.shape.headers.map(header => <span key={header}>{header}</span>)}</div>{t.shape.rows.map(([subject,method,value,status],i) => <div className="ownership-row" key={subject}><strong className="ownership-subject">{subject}</strong><span className="ownership-mechanism">{method}</span><p className="ownership-value">{value}</p><span className={`ownership-status ${i===4?'is-future':i===5?'is-open':'is-live'}`}>{status}</span></div>)}</div><p className="ownership-note">{t.shape.note}</p><div className="ownership-actions"><ExternalLink href={REPO} className="btn btn-ink"><Icon name="github"/>{t.shape.contribute}<Icon name="arrow"/></ExternalLink></div><p className="growth-motto" data-reveal>{t.shape.motto}</p></div></section>
      <section className="manifesto"><div className="container"><div className="mf-tag">{t.manifesto.tag}</div><p className="mf-line" data-reveal>{t.manifesto.title}</p><p className="mf-sub" data-reveal>{t.manifesto.lead}</p><div className="mf-grid">{t.manifesto.cards.map(([title,body]) => <article className="mf-item" key={title} data-reveal><h3>{title}</h3><p>{body}</p></article>)}</div></div></section>
      <section className="section section-cream" id="memory"><div className="container"><SectionHeading index="06">{t.memory.label}</SectionHeading><div className="split"><div className="panel memory-panel" data-reveal><div className="panel-label">{t.memory.panel}</div>{t.memory.keys.map((name,i) => <div className="panel-row" key={name}><span className="k">{name}</span><span className="v">{t.memory.values[i]}</span></div>)}<div className="memory-pulse"><span className="pulse-dot"/>PERSISTENT · SEARCHABLE · YOURS</div></div><div className="split-content" data-reveal><h2 className="h-cn">{t.memory.title}</h2><p className="lead">{t.memory.lead}</p><ul className="split-list">{t.memory.list.map(item => <li key={item}>{item}</li>)}</ul><ExternalLink href={`${DOCS}/concepts/memory-architecture.md`} className="btn btn-line section-action">{t.memory.action}<Icon name="arrow"/></ExternalLink></div></div></div></section>
      <section className="section section-ink" id="get-started"><div className="container"><SectionHeading index="07">{t.access.label}</SectionHeading><h2 className="h-cn" data-reveal>{t.access.title}</h2><p className="lead section-intro" data-reveal>{t.access.lead}</p><ExternalLink href={`${REPO}/blob/main/LICENSE`} className="case-link">{t.access.link} <span aria-hidden="true">→</span></ExternalLink><div className="pricing-grid">{t.access.cards.map(([name,price,desc,list,action],i) => <article className={`price-card ${i===1?'highlight':''}`} key={i} data-reveal><div className="pc-name">{name}</div><div className="pc-price">{price}</div><div className="pc-desc">{desc}</div><ul className="pc-list">{list.map(item => <li key={item}>{item}</li>)}</ul>{i===2 ? <button type="button" className="btn btn-line price-action" onClick={openInstall}>{action}<Icon name="arrow"/></button> : <ExternalLink href={[REPO,`${DOCS}/concepts/model-providers.md`,'',`${REPO}/issues`][i]} className="btn btn-line price-action">{action}<Icon name="arrow"/></ExternalLink>}</article>)}</div></div></section>
      <Ticker items={t.ticker} reverse/>
      <section className="download-hit" id="download"><div className="download-art" aria-hidden="true"><img className="download-girl" src={`${assets}red-girl.webp`} alt="" width="1536" height="1024" loading="lazy"/><img className="download-cat" src={`${assets}red-cat.webp`} alt="" width="802" height="798" loading="lazy"/><img className="download-bell" src={`${assets}red-bell.webp`} alt="" width="452" height="460" loading="lazy"/></div><div className="container"><h2 className="display-huge" data-reveal>{t.download.title} <span className="hollow">REMI</span></h2><p className="download-sub" data-reveal>{t.download.lead}</p><div className="device-download-actions hero-ctas" data-reveal><button type="button" className="btn btn-ink" onClick={openInstall}><Icon name="download"/>{t.start}</button><ExternalLink href={DOCS} className="btn btn-line device-download-other"><span>{t.download.all}</span><Icon name="arrow"/></ExternalLink></div><div className="download-small"><ExternalLink href={REPO}>{t.download.source}</ExternalLink><ExternalLink href={`${REPO}/blob/main/CONTRIBUTING.md`}>{t.download.contribute}</ExternalLink><span>{t.download.platforms}</span></div></div></section>
      <section className="section section-cream" id="faq"><div className="container"><SectionHeading index="08">{t.faqLabel}</SectionHeading><h2 className="h-cn" data-reveal>{t.faqTitle}</h2><div className="faq-list">{t.faq.map(([question,answer],i) => {const isOpen=openFaq.includes(i);return <div className={`faq-item ${isOpen?'open':''}`} key={i}><h3><button type="button" className="faq-q" aria-expanded={isOpen} aria-controls={`faq-answer-${i}`} id={`faq-question-${i}`} onClick={() => setOpenFaq(prev => isOpen?prev.filter(n=>n!==i):[...prev,i])}>{question}</button></h3><div className="faq-a" id={`faq-answer-${i}`} role="region" aria-labelledby={`faq-question-${i}`} aria-hidden={!isOpen}>{answer}</div></div>;})}</div></div></section>
    </main>
    <footer><div className="container"><div className="footer-inner"><div className="footer-links">{[REPO,DOCS,`${REPO}/blob/main/CHANGELOG.md`,`${REPO}/blob/main/LICENSE`,`${REPO}/blob/main/CONTRIBUTING.md`].map((href,i) => <ExternalLink key={href} href={href}>{t.footer[i]}</ExternalLink>)}</div><div className="footer-copy">© 2026 {t.credit}</div></div></div><div className="footer-cat" data-reveal><img src={`${assets}cat.webp`} alt="" width="1024" height="1024" loading="lazy"/></div><div className="footer-wordmark" aria-hidden="true">REMI</div></footer>
    <InstallDialog open={installOpen} onClose={() => setInstallOpen(false)} t={t.install} lang={lang}/>
  </>;
}
