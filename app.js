const C = window.JA_CONFIG;
const translations = {
  as:{brand:"জ্যোতিষ অসম",nav_rashifal:"ৰাশিফল",nav_services:"সেৱা",nav_about:"আমাৰ বিষয়ে",nav_contact:"যোগাযোগ",
  hero_pill:"অসমীয়া জ্যোতিষ • Daily Guidance",hero_title:"আজিৰ ৰাশিফল জানক",hero_desc:"প্ৰেম ❤️ · কেৰিয়াৰ 💼 · ধন 💰 · দৈনিক guidance",
  see_rashifal:"ৰাশিফল চাওক",view_services:"Paid Services",today:"আজিৰ তাৰিখ",rashifal_title:"১২টা ৰাশিৰ আজিৰ ৰাশিফল",
  services_title:"ব্যক্তিগত জ্যোতিষ সেৱা",birth_desc:"জন্ম তাৰিখ, সময় আৰু স্থানৰ ভিত্তিত ব্যক্তিগত birth chart reading.",
  love_desc:"প্ৰেম আৰু relationship সম্পৰ্কীয় ব্যক্তিগত guidance.",career_desc:"কেৰিয়াৰ, work direction আৰু finance-focused astrology guidance.",
  buy_now:"এতিয়াই বুক কৰক",about_title:"সহজ, স্থানীয় আৰু বিশ্বাসযোগ্য অভিজ্ঞতা",about_text:"জ্যোতিষ অসমে Assamese আৰু English ভাষাত দৈনিক astrology guidance আৰু paid personalised readings প্ৰদান কৰে। এই সেৱা entertainment/guidance উদ্দেশ্যৰ বাবে।",contact_title:"আপোনাৰ reading বুক কৰক"},
  en:{brand:"Jyotish Assam",nav_rashifal:"Rashifal",nav_services:"Services",nav_about:"About",nav_contact:"Contact",
  hero_pill:"Assamese Astrology • Daily Guidance",hero_title:"Your Daily Rashifal",hero_desc:"Love ❤️ · Career 💼 · Finance 💰 · Daily guidance",
  see_rashifal:"View Rashifal",view_services:"Paid Services",today:"Today's date",rashifal_title:"Today's Rashifal for 12 Signs",
  services_title:"Personal Astrology Services",birth_desc:"Personal birth-chart reading based on your birth date, time and place.",
  love_desc:"Personal guidance for love and relationships.",career_desc:"Astrology guidance focused on career, work direction and finance.",
  buy_now:"Book Now",about_title:"Simple, local and professional",about_text:"Jyotish Assam provides daily astrology guidance and paid personalised readings in Assamese and English. For entertainment/guidance purposes.",contact_title:"Book your reading"}};
let lang=localStorage.getItem("ja_lang")||"as";

function applyLang(){
 document.documentElement.lang=lang;
 document.querySelectorAll("[data-i18n]").forEach(el=>{let k=el.dataset.i18n;if(translations[lang][k])el.textContent=translations[lang][k]});
 document.getElementById("langToggle").textContent=lang==="as"?"EN":"অসমীয়া";
 render();
}
function formatDate(){
 const d=new Date(); return d.toLocaleDateString(lang==="as"?"as-IN":"en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"});
}
function render(filter=""){
 const idx=window.dayIndex(), q=filter.toLowerCase();
 const list=ZODIAC.filter(z=>(z.as+z.en).toLowerCase().includes(q));
 document.getElementById("zodiacGrid").innerHTML=list.map((z)=>{
   const seed=(idx+ZODIAC.indexOf(z)*7)%10;
   return `<article class="zodiac-card" onclick="openRashi('${z.id}')">
     <div class="zsymbol">${z.s}</div><div><h3>${lang==="as"?z.as:z.en}</h3><p>${z.base}</p></div>
     <div class="meters"><span>❤️ ${["ভাল","ভাল","মধ্যম","ভাল","অতি ভাল"][seed%5]}</span><span>💼 ${["ভাল","মধ্যম","ভাল","অতি ভাল"][seed%4]}</span><span>💰 ${["মধ্যম","ভাল","ভাল","সাৱধান"][seed%4]}</span></div>
   </article>`;
 }).join("");
}
window.openRashi=function(id){
 const z=ZODIAC.find(x=>x.id===id);
 const text=lang==="as"?`${z.base}\n\n❤️ প্ৰেম: ${z.love}\n💼 কেৰিয়াৰ: ${z.career}\n💰 ধন: ${z.finance}`:`${z.base}\n\n❤️ Love: ${z.love}\n💼 Career: ${z.career}\n💰 Finance: ${z.finance}`;
 document.getElementById("modalContent").innerHTML=`<div class="big-symbol">${z.s}</div><h2>${lang==="as"?z.as:z.en}</h2><p class="modal-text">${text.replace(/\n/g,"<br>")}</p><p class="note">Guidance only — not a guaranteed prediction.</p>`;
 document.getElementById("modal").hidden=false;
};
window.closeModal=()=>document.getElementById("modal").hidden=true;

window.buyService=function(type){
 const names={birth:"Birth Chart",love:"Love Reading",career:"Career Reading"};
 const msg=encodeURIComponent(`নমস্কাৰ, মই ${names[type]} বুক কৰিব বিচাৰিছোঁ। Payment আৰু report delivery সম্পৰ্কে জনাব।`);
 if(C.usePaymentLink && C.paymentLink && !C.paymentLink.includes("YOUR_PAYMENT")) window.open(C.paymentLink,"_blank");
 else window.open(`https://wa.me/${C.whatsappNumber}?text=${msg}`,"_blank");
};

document.getElementById("todayDate").textContent=formatDate();
document.getElementById("year").textContent=new Date().getFullYear();
document.getElementById("phoneText").textContent="+"+C.whatsappNumber;
document.getElementById("waMain").href=`https://wa.me/${C.whatsappNumber}?text=${encodeURIComponent("নমস্কাৰ, মই ব্যক্তিগত astrology reading বুক কৰিব বিচাৰিছোঁ।")}`;
document.getElementById("langToggle").onclick=()=>{lang=lang==="as"?"en":"as";localStorage.setItem("ja_lang",lang);applyLang()};
document.getElementById("searchRashi").oninput=e=>render(e.target.value);
applyLang();
