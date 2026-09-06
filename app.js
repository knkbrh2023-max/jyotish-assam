const C = window.JA_CONFIG;
const translations = {
  as: { brand: "জ্যোতিষ অসম", nav_rashifal: "ৰাশিফল", nav_services: "সেৱা", nav_about: "আমাৰ বিষয়ে", nav_contact: "যোগাযোগ", hero_pill: "অসমীয়া জ্যোতিষ • দৈনিক মাৰ্গদৰ্শন" },
  en: { brand: "Jyotish Assam", nav_rashifal: "Rashifal", nav_services: "Services", nav_about: "About", nav_contact: "Contact", hero_pill: "Indian Astrology • Daily Guidance" },
  hi: { brand: "ज्योतिष असम", nav_rashifal: "राशिफल", nav_services: "सेवाएँ", nav_about: "हमारे बारे में", nav_contact: "संपर्क", hero_pill: "भारतीय ज्योतिष • दैनिक मार्गदर्शन" }
};

let lang = localStorage.getItem("ja_lang") || "as";

function applyLang() {
  document.documentElement.lang = lang;
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const k = el.dataset.i18n;
    if (translations[lang] && translations[lang][k]) el.textContent = translations[lang][k];
  });
}

function formatDate() {
  return new Date().toLocaleDateString(lang === "as" ? "as-IN" : lang === "hi" ? "hi-IN" : "en-IN", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

function getData(z) { return z.asData; }

function render(filter = "") {
  const q = filter.toLowerCase();
  const list = ZODIAC.filter(z => (z.as + z.en + z.hi).toLowerCase().includes(q));
}

window.openRashi = function (id) {
  const z = ZODIAC.find(x => x.id === id), d = getData(z), t = translations[lang];
  document.getElementById("modalContent").innerHTML = `<h2>${z.as}</h2><p>${d.summary}</p>`;
  document.getElementById("modal").hidden = false;
};

window.closeModal = () => { document.getElementById("modal").hidden = true; };

window.buyService = function (type) {
  const prices = { birth: 299, love: 99, career: 199 };
  const names = { birth: "Birth Chart", love: "Love Reading", career: "Career Reading" };
  const modal = document.getElementById("modal");
  const box = document.getElementById("modalContent");

  box.innerHTML = `
    <h2>আপোনাৰ জন্ম তথ্য দিয়ক</h2>
    <p class="form-service"><b>${names[type]}</b> — ₹${prices[type]}</p>
    <form id="reading-form">
      <input type="hidden" name="service" value="${type}">
      <label>নাম / Name <input type="text" id="name" required></label><br>
      <label>ই-মেইল / Email <input type="email" id="email" required></label><br>
      <label>জন্ম তারিখ / Date of Birth <input type="date" id="dob" required></label><br>
      <label>জন্ম সময় / Time of Birth <input type="time" id="tob" required></label><br>
      <label>জন্ম স্থান / Place of Birth <input type="text" id="pob" required></label><br>
      <label>ৰিপোৰ্টৰ ভাষা / Report Language:
        <select id="report-lang" style="padding: 5px; margin-top: 5px;">
          <option value="as" ${lang === 'as' ? 'selected' : ''}>অসমীয়া (Assamese)</option>
          <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
          <option value="hi" ${lang === 'hi' ? 'selected' : ''}>हिन्दी (Hindi)</option>
        </select>
      </label><br><br>
      <button type="submit" id="pay-btn" style="padding: 10px 20px; background: #b8860b; color: white; border: none; cursor: pointer; font-weight: bold;">Payment লৈ আগবাঢ়ক</button>
    </form>
  `;

  modal.hidden = false;

  document.getElementById("reading-form").onsubmit = async function (e) {
    e.preventDefault();
    
    const userData = {
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      dob: document.getElementById("dob").value,
      tob: document.getElementById("tob").value,
      pob: document.getElementById("pob").value,
      reportLang: document.getElementById("report-lang").value || lang
    };

    const options = {
      key: C.razorpayKeyId,
      amount: prices[type] * 100,
      currency: "INR",
      name: "Jyotish Assam",
      description: names[type],
      prefill: { name: userData.name, email: userData.email },
      theme: { color: "#c89b3c" },
      handler: async function (response) {
        modal.hidden = true;
        await generateAIReportAndDownload(userData);
      }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };
};

// --- Gemini AI Report Generation & PDF Download Function ---
const GEMINI_API_KEY = "AQ.Ab8RN6JPHs1lhBYqc8gt7-60fg6s6AV1jxhB3gu011r-QqLQyg"; 

async function generateAIReportAndDownload(userData) {
  try {
    if (typeof html2pdf === "undefined") {
      alert("Error: html2pdf Library টো index.html-ত নাই! অনুগ্ৰহ কৰি index.html-ত Script Tag টো যোগ কৰক।");
      return;
    }

    const selectedLang = userData.reportLang || "as";

    const languagePrompts = {
      as: `আপুনি এজন অভিজ্ঞ অসমীয়া জ্যোতিষী। তলত দিয়া জন্মৰ তথ্য অনুসৰি এটা বিস্তৃত কুণ্ডলী আৰু ভাগ্যফল ৰিপোৰ্ট প্রস্তুত কৰক:
- নাম: ${userData.name}
- জন্মৰ তারিখ: ${userData.dob}
- জন্মৰ সময়: ${userData.tob}
- জন্মৰ স্থান: ${userData.pob}

ৰিপোৰ্টটোত স্পষ্ট অসমীয়াত অন্তৰ্ভুক্ত কৰক:
১. ব্যক্তিত্ব আৰু গ্ৰহৰ প্ৰভাৱ
২. কেৰিয়াৰ, শিক্ষা আৰু আৰ্থিক দিশ
৩. স্বাস্থ্য আৰু পৰিয়াল
৪. শুভ ৰং, শুভ সংখ্যা আৰু সৰু প্ৰতিকাৰ (Remedies)`,

      en: `You are an expert Indian Astrologer. Generate a detailed Horoscope and Birth Chart reading based on the following details:
- Name: ${userData.name}
- Date of Birth: ${userData.dob}
- Time of Birth: ${userData.tob}
- Place of Birth: ${userData.pob}

Include the following sections clearly in English:
1. Personality & Planetary Influence
2. Career, Education & Financial Outlook
3. Health & Family Life
4. Lucky Color, Lucky Number & Simple Remedies`,

      hi: `आप एक अनुभवी भारतीय ज्योतिषी हैं। निम्नलिखित विवरण के आधार पर एक विस्तृत कुंडली और राशिफल रिपोर्ट तैयार करें:
- नाम: ${userData.name}
- जन्म तिथि: ${userData.dob}
- जन्म समय: ${userData.tob}
- जन्म स्थान: ${userData.pob}

रिपोर्ट में स्पष्ट हिंदी में निम्नलिखित अनुभाग शामिल करें:
१. व्यक्तित्व और ग्रहों का प्रभाव
२. करियर, शिक्षा और वित्तीय स्थिति
३. स्वास्थ्य और परिवार
४. शुभ रंग, शुभ अंक और सरल उपाय`
    };

    const alertMessages = {
      as: "Payment সফল হৈছে! AI-এ আপোনাৰ জ্যোতিষ ৰিপোৰ্ট প্ৰস্তুত কৰি আছে, ১০ ছেকেণ্ড অপেক্ষা কৰক...",
      en: "Payment Successful! Generating your AI Horoscope Report, please wait 10 seconds...",
      hi: "भुगतान सफल हुआ! AI आपकी ज्योतिष रिपोर्ट तैयार कर रहा है, कृपया 10 सेकंड प्रतीक्षा करें..."
    };

    alert(alertMessages[selectedLang] || alertMessages.as);

    const prompt = languagePrompts[selectedLang] || languagePrompts.as;

    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
      }
    );

    const data = await response.json();

    if (data.error) {
      alert("Gemini API Error: " + data.error.message);
      return;
    }

    const reportText = data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!reportText) {
      alert("AI-ৰ পৰা উত্তৰ পোৱা নগ'ল।");
      return;
    }

    const pdfHeaders = {
      as: { title: "জ্যোতিষ অসম", sub: "অনলাইন জন্ম কুণ্ডলী আৰু ভাগ্যফল ৰিপোৰ্ট" },
      en: { title: "Jyotish Assam", sub: "Online Birth Chart & Horoscope Report" },
      hi: { title: "ज्योतिष असम", sub: "ऑनलाइन जन्म कुंडली एवं राशिफल रिपोर्ट" }
    };

    const header = pdfHeaders[selectedLang] || pdfHeaders.as;

    const element = document.createElement("div");
    element.style.padding = "20px";
    element.style.fontFamily = "Nirmala UI, Arial, sans-serif";
    element.innerHTML = `
      <div style="text-align: center; border-bottom: 2px solid #b8860b; padding-bottom: 10px;">
        <h1 style="color: #b8860b; margin: 0;">${header.title}</h1>
        <p style="margin: 5px 0;">${header.sub}</p>
      </div>
      <div style="margin-top: 20px; font-size: 14px; line-height: 1.8; color: #333;">
        ${reportText.replace(/\n/g, '<br/>')}
      </div>
    `;

    const opt = {
      margin:       10,
      filename:     `${userData.name}_Jyotish_Report_${selectedLang.toUpperCase()}.pdf`,
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };

    html2pdf().set(opt).from(element).save();

  } catch (error) {
    alert("আচল সমস্যাটো হ'ল: " + error.message);
  }
}
// --- Global Event Attacher for "Get Reading" Buttons ---
document.addEventListener("DOMContentLoaded", () => {
  if (typeof applyLang === "function") applyLang();
});
