// Europe Atlas: data in data/countries.json, texts in i18n/<lang>.json
const LANGS=["fr","en","de","zh","ru"];
const $=s=>document.querySelector(s), j=u=>fetch(u).then(r=>r.json());
let D,T,EN,lang,reg="all",q="";
const bar=$("#bar"),grid=$("#grid");
const sel=document.createElement("select");
const inp=document.createElement("input");
const rbtn=[];

const nf=(n,d=1)=>n.toLocaleString(lang,{maximumFractionDigits:d});
const pop=n=>n>=1?`${nf(n)} ${T.u.m}`:`${nf(n*1000,0)} ${T.u.k}`;
const money=n=>n==null?"—":n>=1000?`${nf(n/1000)} ${T.u.tn}`:`${nf(n)} ${T.u.bn}`;
const dn=(type,v)=>{try{return new Intl.DisplayNames([lang],{type}).of(v)||v}catch(e){return v}};
const cname=d=>dn("region",d.code.toUpperCase());

async function init(){
  D=await j("data/countries.json"); EN=await j("i18n/en.json");
  LANGS.forEach(l=>{const o=new Option(l.toUpperCase(),l);sel.append(o)});
  const urlL=new URLSearchParams(location.search).get("lang");
  const nav=(navigator.language||"en").slice(0,2);
  const start=[urlL,localStorage.getItem("lang"),nav].find(l=>LANGS.includes(l))||"en";
  sel.onchange=()=>setLang(sel.value);
  inp.oninput=e=>{q=e.target.value.toLowerCase();draw()};
  await setLang(start);
}
async function setLang(l){
  lang=l;sel.value=l;localStorage.setItem("lang",l);
  T=await j(`i18n/${l}.json`);
  document.documentElement.lang=l; document.title=T.title;
  $("#title").textContent=T.title;$("#sub").textContent=T.sub;$("#foot").textContent=T.foot;
  const tp=D.reduce((a,d)=>a+d.pop,0);
  $("#tot").innerHTML=`<div><b>${D.length}</b>${T.n_countries}</div><div><b>~${nf(tp/1000,2)} ${T.u.bn.startsWith("Md")?"Md":T.u.bn.split(" ")[0]}</b>${T.n_people}</div><div><b>5</b>${T.n_regions}</div>`;
  bar.innerHTML="";rbtn.length=0;
  ["all","north","west","central","east","south"].forEach(r=>{
    const b=document.createElement("button");b.textContent=r==="all"?T.all:T.regions[r];
    b.dataset.r=r;b.onclick=()=>{reg=r;draw()};bar.append(b)});
  inp.placeholder=T.search;bar.append(inp,sel);
  draw();
}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function draw(){
  [...bar.querySelectorAll("button")].forEach(b=>b.classList.toggle("on",b.dataset.r===reg));
  grid.innerHTML="";
  D.filter(d=>(reg==="all"||d.region===reg)&&(cname(d)+d.capital.en+d.capital.fr).toLowerCase().includes(q)).forEach(d=>{
    const fp=d.pop*d.female_pct/100, mp=d.pop-fp;
    const tip=T.tips[d.code], miss=!tip;
    const cap=d.capital[lang]||d.capital.en;
    const e=document.createElement("article");e.className="c";
    e.innerHTML=`<div class="ph" data-t="${esc(d.wiki||d.capital.en)}" data-c="${d.code}"><img class="fl" loading="lazy" src="https://flagcdn.com/w80/${d.code}.png" alt=""><span></span></div>
    <div class="bd"><div><h2>${esc(cname(d))}</h2><div class="sub">${T.regions[d.region]} · ${T.capital}: <span class="cap">${esc(cap)}</span></div></div>
    <div class="g"><div><small>${T.pop}</small>${pop(d.pop)}</div><div><small>${T.langs}</small>~${d.languages}</div>
    <div><small>${T.gdp}</small>${money(d.gdp_bn)}</div><div><small>${T.ppp}</small>${money(d.gdp_ppp_bn)}</div>
    <div><small>${T.cur}</small>${esc(dn("currency",d.currency))} (${d.currency})</div><div><small>${T.tz}</small>${d.tz}</div></div>
    <div><div class="gb"><i style="width:${d.female_pct}%"></i></div><div class="gl"><span>♀ ${nf(d.female_pct)}% (${pop(fp)})</span><span>♂ ${nf(100-d.female_pct)}% (${pop(mp)})</span></div></div>
    <div class="tip${miss?" miss":""}">💡 ${esc(tip||EN.tips[d.code])}${miss?`<small>${T.missing}</small>`:""}</div>
    <a target="_blank" rel="noopener" href="https://anvaka.github.io/city-roads/?q=${encodeURIComponent(d.capital.en)}">🗺️ ${T.map} <span class="cap">${esc(cap)}</span></a></div>`;
    grid.append(e);io.observe(e.querySelector(".ph"));
  });
}
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){io.unobserve(e.target);load(e.target)}}),{rootMargin:"200px"});
async function load(el){
  const t=el.dataset.t,d=D.find(x=>x.code===el.dataset.c),api="https://en.wikipedia.org/";
  try{
    const r=await j(api+"api/rest_v1/page/summary/"+encodeURIComponent(t.replace(/ /g,"_")));
    const u=(r.originalimage||r.thumbnail||{}).source;
    if(u){el.style.backgroundImage=`url("${u}")`;el.querySelector("span").textContent=T.photo}
  }catch(e){}
  if(!d.capital[lang]&&lang!=="en"){ // localized capital name via Wikipedia interlanguage links
    try{
      const r=await j(`${api}w/api.php?action=query&titles=${encodeURIComponent(t)}&prop=langlinks&lllang=${lang}&format=json&origin=*`);
      const p=Object.values(r.query.pages)[0],n=p.langlinks&&p.langlinks[0]["*"];
      if(n)el.closest(".c").querySelectorAll(".cap").forEach(s=>s.textContent=n.replace(/[ ]?[(（].*$|,.*$/,""));
    }catch(e){}
  }
}
init();
