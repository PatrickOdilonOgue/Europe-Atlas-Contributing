// Usage: node scripts/validate.js  -> checks data and reports missing translations
const fs=require("fs"),D=JSON.parse(fs.readFileSync("data/countries.json"));
let err=0;const bad=m=>{console.error("ERROR:",m);err++};
if(D.length!==50)bad(`expected 50 countries, got ${D.length}`);
const regions=["north","west","central","east","south"];
D.forEach(d=>{["code","region","capital","pop","female_pct","languages","currency","tz"].forEach(k=>d[k]===undefined&&bad(`${d.code}: missing ${k}`));
 if(!regions.includes(d.region))bad(`${d.code}: unknown region`);
 if(d.female_pct<10||d.female_pct>90)bad(`${d.code}: suspicious female_pct`)});
for(const l of ["fr","en","de","zh","ru"]){const T=JSON.parse(fs.readFileSync(`i18n/${l}.json`));
 const miss=D.filter(d=>!T.tips[d.code]).length;
 console.log(`${l}: ${50-miss}/50 tips translated`)}
process.exit(err?1:0);
