const C=window.JA_CONFIG;
const translations={
 as:{brand:"জ্যোতিষ অসম",nav_rashifal:"ৰাশিফল",nav_services:"সেৱা",nav_about:"আমাৰ বিষয়ে",nav_contact:"যোগাযোগ",hero_pill:"অসমীয়া জ্যোতিষ • দৈনিক পথপ্ৰদৰ্শন",hero_title:"আজিৰ ৰাশিফল জানক",hero_desc:"প্ৰেম ❤️ · কেৰিয়াৰ 💼 · ধন 💰 · স্বাস্থ্য 🌿 · দৈনিক পথপ্ৰদৰ্শন",see_rashifal:"ৰাশিফল চাওক",view_services:"পেইড সেৱা",today:"আজিৰ তাৰিখ",rashifal_title:"১২টা ৰাশিৰ আজিৰ বিস্তৃত ৰাশিফল",search_placeholder:"ৰাশি বিচাৰক...",love:"প্ৰেম",career:"কেৰিয়াৰ",finance:"ধন",health:"স্বাস্থ্য",advice:"আজিৰ পৰামৰ্শ",lucky:"শুভ ৰং",number:"শুভ সংখ্যা",services_title:"ব্যক্তিগত জ্যোতিষ সেৱা",birth_title:"🔮 জন্ম কুণ্ডলী",birth_desc:"জন্ম তাৰিখ, সময় আৰু স্থানৰ ভিত্তিত ব্যক্তিগত birth chart reading.",love_title:"❤️ लव रीडिंग",love_desc:"প্ৰেম আৰু relationship সম্পৰ্কীয় ব্যক্তিগত guidance.",career_title:"💼 करियर रीडिंग",career_desc:"কেৰিয়াৰ, work direction আৰু finance-focused astrology guidance.",buy_now:"এতিয়াই লওক",one_time:"এবাৰ",about_title:"সহজ, স্থানীয় আৰু পেছাদাৰী অভিজ্ঞতা",about_text:"জ্যোতিষ অসমে Assamese, English আৰু Hindi ভাষাত দৈনিক astrology guidance আৰু personalised readings প্ৰদান কৰে। এই সেৱা guidance/entertainment উদ্দেশ্যৰ বাবে।",trust1:"✓ Assamese + English + Hindi",trust2:"✓ Mobile Friendly",trust3:"✓ Secure Payment Gateway",trust4:"✓ Personalised Reports",contact_title:"আপোনাৰ reading আৰম্ভ কৰক",contact_text:"Service বাছি লৈ payment কৰক। Payment সফল হোৱাৰ পিছত report system-ত process কৰা হ’ব।",pay_note:"Payment কৰক",footer_about:"© Jyotish Assam",privacy:"Privacy Policy",terms:"Terms",disclaimer:"Disclaimer",guidance:"Guidance only — guaranteed prediction নহয়।",daily_label:"দৈনিক ৰাশিফল",premium_label:"প্ৰিমিয়াম জ্যোতিষ",about_label:"আমাৰ বিষয়ে",contact_label:"যোগাযোগ",popular:"জনপ্ৰিয়",advertisement:"বিজ্ঞাপন",ad_text:"AdSense ad space — অনুমোদিত publisher code adsense.js-ত যোগ কৰক।"},
 en:{brand:"Jyotish Assam",nav_rashifal:"Rashifal",nav_services:"Services",nav_about:"About",nav_contact:"Contact",hero_pill:"Indian Astrology • Daily Guidance",hero_title:"Your Daily Rashifal",hero_desc:"Love ❤️ · Career 💼 · Finance 💰 · Health 🌿 · Daily guidance",see_rashifal:"View Rashifal",view_services:"Paid Services",today:"Today's date",rashifal_title:"Detailed Daily Rashifal for 12 Signs",search_placeholder:"Search zodiac...",love:"Love",career:"Career",finance:"Finance",health:"Health",advice:"Today's Advice",lucky:"Lucky Color",number:"Lucky Number",services_title:"Personal Astrology Services",birth_title:"🔮 Birth Chart",birth_desc:"Personal birth-chart reading based on your birth date, time and place.",love_title:"❤️ Love Reading",love_desc:"Personal guidance for love and relationships.",career_title:"💼 Career Reading",career_desc:"Astrology guidance focused on career, work direction and finance.",buy_now:"Get Reading",one_time:"one-time",about_title:"Simple, local and professional",about_text:"Jyotish Assam provides daily astrology guidance and personalised readings in Assamese, English and Hindi. For guidance/entertainment purposes.",trust1:"✓ Assamese + English + Hindi",trust2:"✓ Mobile Friendly",trust3:"✓ Secure Payment Gateway",trust4:"✓ Personalised Reports",contact_title:"Start your reading",contact_text:"Choose a service and complete payment. After successful payment, your report can be processed by the system.",pay_note:"Make Payment",footer_about:"© Jyotish Assam",privacy:"Privacy Policy",terms:"Terms",disclaimer:"Disclaimer",guidance:"Guidance only — not a guaranteed prediction.",daily_label:"DAILY RASHIFAL",premium_label:"PREMIUM ASTROLOGY",about_label:"ABOUT",contact_label:"CONTACT",popular:"POPULAR",advertisement:"ADVERTISEMENT",ad_text:"AdSense ad space — add your approved publisher code in adsense.js."},
 hi:{brand:"ज्योतिष असम",nav_rashifal:"राशिफल",nav_services:"सेवाएँ",nav_about:"हमारे बारे में",nav_contact:"संपर्क",hero_pill:"भारतीय ज्योतिष • दैनिक मार्गदर्शन",hero_title:"आज का राशिफल जानें",hero_desc:"प्रेम ❤️ · करियर 💼 · वित्त 💰 · स्वास्थ्य 🌿 · दैनिक मार्गदर्शन",see_rashifal:"राशिफल देखें",view_services:"पेड सेवाएँ",today:"आज की तारीख",rashifal_title:"12 राशियों का विस्तृत आज का राशिफल",search_placeholder:"राशि खोजें...",love:"प्रेम",career:"करियर",finance:"वित्त",health:"स्वास्थ्य",advice:"आज की सलाह",lucky:"शुभ रंग",number:"शुभ अंक",services_title:"व्यक्तिगत ज्योतिष सेवाएँ",birth_title:"🔮 जन्म कुंडली",birth_desc:"जन्म तारीख, समय और स्थान के आधार पर व्यक्तिगत जन्म कुंडली रीडिंग।",love_title:"❤️ Love Reading",love_desc:"प्रेम और रिश्तों के लिए व्यक्तिगत मार्गदर्शन।",career_title:"💼 Career Reading",career_desc:"करियर, काम की दिशा और वित्त पर केंद्रित ज्योतिष मार्गदर्शन।",buy_now:"रीडिंग लें",one_time:"एक बार",about_title:"सरल, स्थानीय और पेशेवर अनुभव",about_text:"ज्योतिष असम Assamese, English और Hindi में दैनिक ज्योतिष मार्गदर्शन और व्यक्तिगत रीडिंग प्रदान करता है। यह सेवा मार्गदर्शन/मनोरंजन के उद्देश्य से है।",trust1:"✓ Assamese + English + Hindi",trust2:"✓ Mobile Friendly",trust3:"✓ Secure Payment Gateway",trust4:"✓ Personalised Reports",contact_title:"अपनी रीडिंग शुरू करें",contact_text:"सेवा चुनें और भुगतान पूरा करें। सफल भुगतान के बाद रिपोर्ट को सिस्टम द्वारा प्रोसेस किया जा सकता है।",pay_note:"भुगतान करें",footer_about:"© ज्योतिष असम",privacy:"Privacy Policy",terms:"Terms",disclaimer:"Disclaimer",guidance:"केवल मार्गदर्शन — निश्चित भविष्यवाणी नहीं।",daily_label:"दैनिक राशिफल",premium_label:"प्रीमियम ज्योतिष",about_label:"हमारे बारे में",contact_label:"संपर्क",popular:"लोकप्रिय",advertisement:"विज्ञापन",ad_text:"AdSense स्थान — अनुमोदित publisher code adsense.js में जोड़ें।"}
};
let lang=localStorage.getItem("ja_lang")||"as";
function applyLang(){document.documentElement.lang=lang;document.querySelectorAll("[data-i18n]").forEach(el=>{const k=el.dataset.i18n;if(translations[lang][k])el.textContent=translations[lang][k]});const s=document.getElementById("searchRashi");if(s)s.placeholder=translations[lang].search_placeholder;document.getElementById("langToggle").textContent=lang.toUpperCase();document.querySelectorAll(".lang-option").forEach(b=>b.classList.toggle("active",b.dataset.lang===lang));render();}
function formatDate(){return new Date().toLocaleDateString(lang==="as"?"as-IN":lang==="hi"?"hi-IN":"en-IN",{weekday:"long",year:"numeric",month:"long",day:"numeric"});}
function getData(z){return lang==="as"?z.asData:lang==="hi"?z.hiData:z.enData;}
function render(filter=""){const q=filter.toLowerCase();const list=ZODIAC.filter(z=>(z.as+z.en+z.hi).toLowerCase().includes(q));document.getElementById("zodiacGrid").innerHTML=list.map(z=>{const d=getData(z);const seed=(dayIndex()+ZODIAC.indexOf(z)*7)%10;const levels=lang==="hi"?["अच्छा","मध्यम","बहुत अच्छा","सावधान"]:lang==="en"?["Good","Moderate","Very Good","Caution"]:["ভাল","মধ্যম","অতি ভাল","সাৱধান"];return `<article class="zodiac-card" onclick="openRashi('${z.id}')"><div class="zsymbol">${z.s}</div><div><h3>${lang==="as"?z.as:lang==="hi"?z.hi:z.en}</h3><p>${d.overview}</p></div><div class="meters"><span>❤️ ${levels[seed%4]}</span><span>💼 ${levels[(seed+1)%4]}</span><span>💰 ${levels[(seed+2)%4]}</span></div></article>`}).join("");}
window.openRashi=function(id){const z=ZODIAC.find(x=>x.id===id),d=getData(z),t=translations[lang];document.getElementById("modalContent").innerHTML=`<div class="big-symbol">${z.s}</div><h2>${lang==="as"?z.as:lang==="hi"?z.hi:z.en}</h2><div class="modal-text"><p><strong>✨ ${lang==="as"?"সাৰাংশ":lang==="hi"?"सारांश":"Overview"}:</strong> ${d.overview}</p><p>❤️ <strong>${t.love}:</strong> ${d.love}</p><p>💼 <strong>${t.career}:</strong> ${d.career}</p><p>💰 <strong>${t.finance}:</strong> ${d.finance}</p><p>🌿 <strong>${t.health}:</strong> ${d.health}</p><p>💡 <strong>${t.advice}:</strong> ${d.advice}</p><p>🎨 <strong>${t.lucky}:</strong> ${d.lucky} &nbsp; • &nbsp; 🔢 <strong>${t.number}:</strong> ${d.number}</p></div><p class="note">${t.guidance}</p>`;document.getElementById("modal").hidden=false;};
window.closeModal=()=>document.getElementById("modal").hidden=true;
window.buyService=function(type){
  const prices={birth:299,love:99,career:199};
  const names={birth:"Birth Chart",love:"Love Reading",career:"Career Reading"};
  const modal=document.getElementById("modal");
  const box=document.getElementById("modalContent");
  const labels=lang==="as"
    ? {title:"আপোনাৰ জন্ম তথ্য দিয়ক",name:"নাম",email:"ই-মেইল",dob:"জন্ম তাৰিখ",tob:"জন্ম সময়",pob:"জন্ম স্থান",language:"ৰিপ'ৰ্টৰ ভাষা",submit:"Payment লৈ আগবাঢ়ক",note:"সঠিক জন্ম সময় আৰু স্থান দিলে reading অধিক উপযোগী হ'ব।"}
    : lang==="hi"
    ? {title:"अपनी जन्म जानकारी दें",name:"नाम",email:"ईमेल",dob:"जन्म तिथि",tob:"जन्म समय",pob:"जन्म स्थान",language:"रिपोर्ट की भाषा",submit:"भुगतान पर जाएँ",note:"सही जन्म समय और स्थान देने से reading अधिक उपयोगी होगी।"}
    : {title:"Enter your birth details",name:"Name",email:"Email",dob:"Birth date",tob:"Birth time",pob:"Birth place",language:"Report language",submit:"Continue to Payment",note:"Accurate birth time and place help make the reading more useful."};

  box.innerHTML=`<h2>${labels.title}</h2>
    <p class="form-service"><b>${names[type]}</b> — ₹${prices[type]}</p>
    <form id="readingForm" class="reading-form">
      <input type="hidden" name="service" value="${type}">
      <label>${labels.name}<input name="name" required maxlength="80" autocomplete="name"></label>
      <label>${labels.email}<input name="email" type="email" required maxlength="160" autocomplete="email"></label>
      <div class="form-row">
        <label>${labels.dob}<input name="birthDate" type="date" required></label>
        <label>${labels.tob}<input name="birthTime" type="time" required></label>
      </div>
      <label>${labels.pob}<input name="birthPlace" required maxlength="160" placeholder="Village/Town, District, State, Country"></label>
      <label>${labels.language}<select name="reportLanguage"><option value="as">অসমীয়া</option><option value="en">English</option><option value="hi">हिन्दी</option></select></label>
      <label class="consent"><input type="checkbox" name="consent" required> I agree to the Privacy Policy and Terms.</label>
      <button class="btn gold" type="submit">${labels.submit} ₹${prices[type]}</button>
      <p class="form-note">${labels.note}</p>
      <p id="formStatus" class="form-status" aria-live="polite"></p>
    </form>`;
  modal.hidden=false;
  const f=document.getElementById("readingForm");
  f.reportLanguage.value=lang;
  f.onsubmit=(e)=>submitReading(e);
};
document.getElementById("todayDate").textContent=formatDate();document.getElementById("year").textContent=new Date().getFullYear();document.getElementById("langToggle").onclick=()=>{const order=["as","en","hi"];lang=order[(order.indexOf(lang)+1)%3];localStorage.setItem("ja_lang",lang);applyLang()};document.querySelectorAll(".lang-option").forEach(b=>b.onclick=()=>{lang=b.dataset.lang;localStorage.setItem("ja_lang",lang);applyLang()});document.getElementById("searchRashi").oninput=e=>render(e.target.value);applyLang();

async function submitReading(e){
  e.preventDefault();
  const f=e.currentTarget, status=document.getElementById("formStatus");
  const data=Object.fromEntries(new FormData(f).entries());
  status.textContent=lang==="as"?"Processing...":lang==="hi"?"प्रोसेस हो रहा है...":"Processing...";
  try{
    if(!JA_CONFIG.useBackend || !JA_CONFIG.apiBaseUrl || JA_CONFIG.apiBaseUrl.includes("YOUR-BACKEND")){
      if(JA_CONFIG.paymentLink && !JA_CONFIG.paymentLink.includes("YOUR_PAYMENT")){
        localStorage.setItem("ja_pending_reading",JSON.stringify(data));
        window.open(JA_CONFIG.paymentLink,"_blank");
        status.textContent=lang==="as"?"Payment link খোলিছে। Payment কৰাৰ পিছত admin/backend সংযোগ কৰিব লাগিব।":
          lang==="hi"?"Payment link खुल रहा है। Automated report के लिए backend connect करना होगा।":
          "Payment link opened. Connect the backend to enable automated reports.";
        return;
      }
      throw new Error("Backend is not configured.");
    }

    const res = await fetch(
  JA_CONFIG.apiBaseUrl.replace(/\/$/, "") + "/create-order",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "apikey": JA_CONFIG.supabaseAnonKey,
      "Authorization": `Bearer ${JA_CONFIG.supabaseAnonKey}`
    },
    body: JSON.stringify({...data, language: data.reportLanguage})
  }
);
    if(!res.ok) throw new Error("Unable to create order");
    const order=await res.json();

    if(!window.Razorpay) throw new Error("Razorpay checkout is not loaded.");
    const rzp=new Razorpay({
      key:order.keyId, amount:order.amount, currency:order.currency,
      name:JA_CONFIG.brand, description:order.serviceName,
      order_id:order.razorpayOrderId,
      prefill:{name:data.name,email:data.email},
      theme:{color:"#c89b3c"},
     handler: async function (response) {
        status.textContent = "Payment সফল! AI ৰিপোৰ্ট প্ৰস্তুত হৈ আছে...";
        
        const userData = {
          name: data?.name || document.getElementById("name")?.value || "গ্ৰাহক",
          dob: data?.dob || document.getElementById("dob")?.value || "",
          tob: data?.tob || document.getElementById("tob")?.value || "",
          pob: data?.pob || document.getElementById("pob")?.value || ""
        };

        if (modal) modal.hidden = true;

        await generateAIReportAndDownload(userData);
      },
  // মডাল বন্ধ কৰা
  modal.hidden = true;

  // পোনপটীয়াকৈ AI ৰিপোৰ্ট বনাই PDF Download কৰোৱা
  if (typeof generateAIReportAndDownload === "function") {
    await generateAIReportAndDownload(formData);
  } else {
    alert("Payment সফল হৈছে! কিন্তু ৰিপোৰ্ট ফংচন পোৱা নগ'ল।");
  }
},
      modal:{ondismiss:()=>{status.textContent="Payment cancelled.";}}
    });
    rzp.open();
  }catch(err){
    console.error(err);
    status.textContent=err.message||"Something went wrong.";
  }
}
// --- Gemini AI Report Generation & PDF Download ---
const GEMINI_API_KEY = "AQ.Ab8RN6JPHsllhBYqc8gt7-60fg6s6AVljxhB3gu01lr-QqLQyg"; 

async function generateAIReportAndDownload(userData) {
  try {
    alert("Payment সফল হৈছে! AI-এ আপোনাৰ জ্যোতিষ ৰিপোৰ্ট প্ৰস্তুত কৰি আছে, অনুগ্ৰহ কৰি ১০ ছেকেণ্ড অপেক্ষা কৰক...");

    const prompt = `
আপুনি এজন অভিজ্ঞ অসমীয়া জ্যোতিষী। তলত দিয়া জন্মৰ তথ্য অনুসৰি এটা বিস্তৃত কুণ্ডলী আৰু ভাগ্যফল ৰিপোৰ্ট প্রস্তুত কৰক:
- নাম: ${userData.name}
- জন্মৰ তারিখ: ${userData.dob}
- জন্মৰ সময়: ${userData.tob}
- জন্মৰ স্থান: ${userData.pob}

ৰিপোৰ্টটোত স্পষ্ট অসমীয়াত অন্তৰ্ভুক্ত কৰক:
১. ব্যক্তিত্ব আৰু গ্ৰহৰ প্ৰভাৱ
২. কেৰিয়াৰ, শিক্ষা আৰু আৰ্থিক দিশ
৩. স্বাস্থ্য আৰু পৰিয়াল
৪. শুভ ৰং, শুভ সংখ্যা আৰু সৰু প্ৰতিকাৰ (Remedies)`;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );

    const data = await response.json();
    const reportText = data.candidates[0].content.parts[0].text;

    const element = document.createElement("div");
    element.style.padding = "20px";
    element.style.fontFamily = "Nirmala UI, Arial, sans-serif";
    element.innerHTML = `
      <div style="text-align: center; border-bottom: 2px solid #b8860b; padding-bottom: 10px;">
        <h1 style="color: #b8860b; margin: 0;">জ্যোতিষ অসম</h1>
        <p style="margin: 5px 0;">অনলাইন জন্ম কুণ্ডলী আৰু ভাগ্যফল ৰিপোৰ্ট</p>
      </div>
      <div style="margin-top: 20px; font-size: 14px; line-height: 1.8; color: #333;">
        ${reportText.replace(/\n/g, '<br/>')}
      </div>
    `;

    const opt = {
      margin:       10,
      filename:     `${userData.name}_Jyotish_Report.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();

  } catch (error) {
    console.error("Report generation error:", error);
    alert("ৰিপোৰ্ট তৈয়াৰ কৰাত অসুবিধা হ'ল।");
  }
}
