const C = window.JA_CONFIG || {
  brand: "জ্যোতিষ অসম",
  currency: "INR",
  apiBaseUrl: "https://ihbdrtnkfitytklonnel.supabase.co/functions/v1",
  razorpayKeyId: "rzp_test_TXeg61WItGnzFQ",
  siteUrl: "https://knkbrh2023-max.github.io/jyotish-assam/",
  adsensePublisherId: "ca-pub-XXXXXXXXXXXXXXXX",
  useBackend: true
};

const translations = {
  as: {
    brand: "জ্যোতিষ অসম",
    nav_rashifal: "ৰাশিফল",
    nav_services: "সেৱা",
    nav_about: "আমাৰ বিষয়ে",
    nav_contact: "যোগাযোগ",
    hero_pill: "অসমীয়া জ্যোতিষ • দৈনিক মাৰ্গদৰ্শন"
  },
  en: {
    brand: "Jyotish Assam",
    nav_rashifal: "Rashifal",
    nav_services: "Services",
    nav_about: "About",
    nav_contact: "Contact",
    hero_pill: "Indian Astrology • Daily Guidance"
  },
  hi: {
    brand: "ज्योतिष असम",
    nav_rashifal: "राशिफल",
    nav_services: "सेवाएँ",
    nav_about: "हमारे बारे में",
    nav_contact: "संपर्क",
    hero_pill: "भारतीय ज्योतिष • दैनिक मार्गदर्शन"
  }
};

let lang = localStorage.getItem("ja_lang") || "as";

function applyLang() {
  document.documentElement.lang = lang;

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.dataset.i18n;

    if (translations[lang] && translations[lang][key]) {
      el.textContent = translations[lang][key];
    }
  });
}

function formatDate() {
  return new Date().toLocaleDateString(
    lang === "as"
      ? "as-IN"
      : lang === "hi"
      ? "hi-IN"
      : "en-IN",
    {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric"
    }
  );
}

function getData(z) {
  return z.asData;
}

function render(filter = "") {
  if (typeof ZODIAC === "undefined") return;

  const q = filter.toLowerCase();

  const list = ZODIAC.filter(z =>
    (z.as + z.en + z.hi)
      .toLowerCase()
      .includes(q)
  );

  return list;
}


/* =========================================================
   RASHI MODAL
========================================================= */

window.openRashi = function (id) {

  const z = ZODIAC.find(x => x.id === id);

  if (!z) return;

  const d = getData(z);

  document.getElementById("modalContent").innerHTML = `
    <h2>${z.as}</h2>
    <p>${d.summary}</p>
  `;

  document.getElementById("modal").hidden = false;
};


window.closeModal = function () {
  document.getElementById("modal").hidden = true;
};


/* =========================================================
   SERVICE INFORMATION
========================================================= */

const SERVICE_PRICES = {
  birth: 299,
  love: 99,
  career: 199
};

const SERVICE_NAMES = {
  birth: {
    as: "জন্ম কুণ্ডলী",
    en: "Birth Chart",
    hi: "जन्म कुंडली"
  },

  love: {
    as: "প্ৰেম ৰিডিং",
    en: "Love Reading",
    hi: "लव रीडिंग"
  },

  career: {
    as: "কেৰিয়াৰ ৰিডিং",
    en: "Career Reading",
    hi: "करियर रीडिंग"
  }
};


/* =========================================================
   BUY SERVICE
========================================================= */

window.buyService = function (type) {

  if (!SERVICE_PRICES[type]) {
    alert("Invalid service");
    return;
  }

  const modal = document.getElementById("modal");
  const box = document.getElementById("modalContent");

  const price = SERVICE_PRICES[type];

  const serviceName =
    SERVICE_NAMES[type][lang] ||
    SERVICE_NAMES[type].en;

  box.innerHTML = `

    <h2>
      ${
        lang === "as"
          ? "আপোনাৰ জন্ম তথ্য দিয়ক"
          : lang === "hi"
          ? "अपनी जन्म जानकारी दें"
          : "Enter Your Birth Details"
      }
    </h2>

    <p class="form-service">
      <b>${serviceName}</b> — ₹${price}
    </p>

    <form id="reading-form">

      <input
        type="hidden"
        name="service"
        value="${type}"
      >

      <label>
        ${lang === "as" ? "নাম" : lang === "hi" ? "नाम" : "Name"}
        <input
          type="text"
          id="name"
          required
          autocomplete="name"
        >
      </label>

      <br>

      <label>
        ${lang === "as" ? "ই-মেইল" : lang === "hi" ? "ई-मेल" : "Email"}
        <input
          type="email"
          id="email"
          required
          autocomplete="email"
        >
      </label>

      <br>

      <label>
        ${
          lang === "as"
            ? "জন্ম তাৰিখ"
            : lang === "hi"
            ? "जन्म तिथि"
            : "Date of Birth"
        }

        <input
          type="date"
          id="dob"
          required
        >
      </label>

      <br>

      <label>
        ${
          lang === "as"
            ? "জন্ম সময়"
            : lang === "hi"
            ? "जन्म समय"
            : "Time of Birth"
        }

        <input
          type="time"
          id="tob"
          required
        >
      </label>

      <br>

      <label>
        ${
          lang === "as"
            ? "জন্ম স্থান"
            : lang === "hi"
            ? "जन्म स्थान"
            : "Birth Place"
        }

        <input
          type="text"
          id="pob"
          required
          placeholder="Bihpuria, Assam"
        >
      </label>

      <br>

      <label>
        ${
          lang === "as"
            ? "ৰিপোৰ্টৰ ভাষা"
            : lang === "hi"
            ? "रिपोर्ट की भाषा"
            : "Report Language"
        }

        <select
          id="report-lang"
          style="
            padding:8px;
            margin-top:5px;
            width:100%;
          "
        >

          <option
            value="as"
            ${lang === "as" ? "selected" : ""}
          >
            অসমীয়া (Assamese)
          </option>

          <option
            value="en"
            ${lang === "en" ? "selected" : ""}
          >
            English
          </option>

          <option
            value="hi"
            ${lang === "hi" ? "selected" : ""}
          >
            हिन्दी (Hindi)
          </option>

        </select>

      </label>

      <br><br>

      <button
        type="submit"
        id="pay-btn"
        style="
          padding:12px 22px;
          background:#b8860b;
          color:white;
          border:none;
          border-radius:6px;
          cursor:pointer;
          font-weight:bold;
        "
      >
        ${
          lang === "as"
            ? `₹${price} Payment লৈ আগবাঢ়ক`
            : lang === "hi"
            ? `₹${price} भुगतान करें`
            : `Proceed to Pay ₹${price}`
        }
      </button>

    </form>
  `;

  modal.hidden = false;


  /* =======================================================
     FORM SUBMIT
  ======================================================= */

  document.getElementById("reading-form").onsubmit =
    async function (e) {

      e.preventDefault();

      const payButton =
        document.getElementById("pay-btn");

      payButton.disabled = true;

      payButton.textContent =
        lang === "as"
          ? "Order তৈয়াৰ হৈ আছে..."
          : lang === "hi"
          ? "ऑर्डर बनाया जा रहा है..."
          : "Creating Order...";


      const userData = {

        name:
          document.getElementById("name").value.trim(),

        email:
          document.getElementById("email").value.trim(),

        dob:
          document.getElementById("dob").value,

        tob:
          document.getElementById("tob").value,

        pob:
          document.getElementById("pob").value.trim(),

        reportLang:
          document.getElementById("report-lang").value || lang
      };


      try {

        /* =================================================
           1. CREATE RAZORPAY ORDER THROUGH SUPABASE
        ================================================= */

        if (!C.useBackend) {
          throw new Error(
            "Backend payment system is disabled."
          );
        }

        if (!C.apiBaseUrl) {
          throw new Error(
            "Supabase API URL is not configured."
          );
        }


        const createResponse = await fetch(
          `${C.apiBaseUrl}/create-order`,
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json"
            },

            body: JSON.stringify({

              service: type,

              name: userData.name,

              email: userData.email,

              birthDate: userData.dob,

              birthTime: userData.tob,

              birthPlace: userData.pob,

              language: userData.reportLang

            })
          }
        );


        const order = await createResponse.json();


        if (!createResponse.ok || !order.success) {

          throw new Error(
            order.message ||
            "Failed to create order"
          );

        }


        /* =================================================
           2. OPEN RAZORPAY CHECKOUT
        ================================================= */

        if (
          typeof Razorpay === "undefined"
        ) {

          throw new Error(
            "Razorpay Checkout library not loaded."
          );

        }


        if (!order.razorpayOrderId) {

          throw new Error(
            "Razorpay Order ID not received."
          );

        }


        const razorpayOptions = {

          key:
            order.keyId ||
            C.razorpayKeyId,

          amount:
            order.amount,

          currency:
            order.currency || "INR",

          name:
            "জ্যোতিষ অসম",

          description:
            order.serviceName ||
            serviceName,

          order_id:
            order.razorpayOrderId,

          prefill: {

            name:
              userData.name,

            email:
              userData.email

          },

          theme: {
            color: "#c89b3c"
          },


          handler:
            async function (response) {

              await verifyPayment(
                response,
                order.orderId,
                userData
              );

            },


          modal: {

            ondismiss:
              function () {

                payButton.disabled = false;

                payButton.textContent =
                  lang === "as"
                    ? `₹${price} Payment লৈ আগবাঢ়ক`
                    : lang === "hi"
                    ? `₹${price} भुगतान करें`
                    : `Proceed to Pay ₹${price}`;

              }

          }

        };


        const rzp =
          new Razorpay(
            razorpayOptions
          );


        rzp.on(
          "payment.failed",
          function (response) {

            console.error(
              "Razorpay payment failed:",
              response
            );

            alert(
              lang === "as"
                ? "Payment সফল নহ'ল। পুনৰ চেষ্টা কৰক।"
                : lang === "hi"
                ? "भुगतान असफल हुआ। कृपया पुनः प्रयास करें।"
                : "Payment failed. Please try again."
            );

            payButton.disabled = false;

          }
        );


        rzp.open();


      } catch (error) {

        console.error(error);

        alert(
          lang === "as"
            ? "সমস্যা হৈছে: " + error.message
            : lang === "hi"
            ? "समस्या हुई: " + error.message
            : "Error: " + error.message
        );

        payButton.disabled = false;

        payButton.textContent =
          lang === "as"
            ? `₹${price} Payment লৈ আগবাঢ়ক`
            : lang === "hi"
            ? `₹${price} भुगतान करें`
            : `Proceed to Pay ₹${price}`;

      }

    };
};


/* =========================================================
   VERIFY PAYMENT
========================================================= */

async function verifyPayment(
  razorpayResponse,
  orderId,
  userData
) {

  try {

    const verifyResponse = await fetch(
      `${C.apiBaseUrl}/verify-payment`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({

          orderId,

          razorpay_order_id:
            razorpayResponse.razorpay_order_id,

          razorpay_payment_id:
            razorpayResponse.razorpay_payment_id,

          razorpay_signature:
            razorpayResponse.razorpay_signature

        })
      }
    );


    const result =
      await verifyResponse.json();


    if (
      !verifyResponse.ok ||
      !result.success
    ) {

      throw new Error(
        result.message ||
        "Payment verification failed"
      );

    }


    document.getElementById("modal").hidden = true;


    const messages = {

      as:
        "Payment সফল হৈছে! আপোনাৰ জ্যোতিষ ৰিপোৰ্ট প্ৰস্তুত কৰা হৈছে।",

      en:
        "Payment successful! Your astrology report is being prepared.",

      hi:
        "भुगतान सफल हुआ! आपकी ज्योतिष रिपोर्ट तैयार की जा रही है।"

    };


    alert(
      messages[userData.reportLang] ||
      messages.as
    );


    /*
      IMPORTANT:
      Report generation should happen ONLY
      after successful server-side payment verification.
    */

    await requestReport(
      orderId,
      userData.reportLang
    );


  } catch (error) {

    console.error(
      "Payment verification error:",
      error
    );

    alert(
      lang === "as"
        ? "Payment verify কৰোঁতে সমস্যা হৈছে: " +
          error.message
        : lang === "hi"
        ? "भुगतान सत्यापन में समस्या: " +
          error.message
        : "Payment verification error: " +
          error.message
    );

  }

}


/* =========================================================
   REQUEST REPORT
========================================================= */

async function requestReport(
  orderId,
  reportLanguage
) {

  try {

    /*
      Your report Edge Function should eventually
      accept this request.

      Example:
      /generate-report
    */

    const response =
      await fetch(
        `${C.apiBaseUrl}/generate-report`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({

            orderId,

            language:
              reportLanguage

          })
        }
      );


    const data =
      await response.json();


    if (
      !response.ok ||
      !data.success
    ) {

      throw new Error(
        data.message ||
        "Report generation failed"
      );

    }


    /*
      If backend returns a report URL,
      open it.
    */

    if (data.reportUrl) {

      window.location.href =
        data.reportUrl;

      return;

    }


    /*
      If backend returns report HTML,
      open report page.
    */

    window.location.href =
      `report.html?orderId=${encodeURIComponent(
        orderId
      )}`;

  } catch (error) {

    console.error(
      "Report generation error:",
      error
    );

    alert(
      lang === "as"
        ? "Payment সফল হৈছে, কিন্তু report তৈয়াৰ কৰোঁতে সমস্যা হৈছে। Order ID: " +
          orderId
        : lang === "hi"
        ? "भुगतान सफल है, लेकिन रिपोर्ट तैयार करने में समस्या हुई। Order ID: " +
          orderId
        : "Payment was successful, but report generation failed. Order ID: " +
          orderId
    );

  }

}


/* =========================================================
   LANGUAGE BUTTON
========================================================= */

window.setLanguage = function (newLang) {

  if (
    !["as", "en", "hi"].includes(newLang)
  ) {
    return;
  }

  lang = newLang;

  localStorage.setItem(
    "ja_lang",
    lang
  );

  applyLang();

  if (
    typeof render === "function"
  ) {
    render();
  }

};


/* =========================================================
   INITIALIZE
========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  function () {

    applyLang();

    if (
      typeof formatDate === "function"
    ) {

      const dateElements =
        document.querySelectorAll(
          "[data-today-date]"
        );

      dateElements.forEach(
        el => {
          el.textContent =
            formatDate();
        }
      );

    }

  }
);
