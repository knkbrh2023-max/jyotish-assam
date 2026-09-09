// Configuration
const C = window.JA_CONFIG || {};

// Global state
let selectedService = null;
let currentOrder = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    setupEventListeners();
    checkExistingOrder();
});

// Setup event listeners
function setupEventListeners() {
    const serviceButtons = document.querySelectorAll('.service-btn');
    serviceButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const card = this.closest('.service-card');
            const serviceName = card.querySelector('h3').textContent;
            const price = parseInt(card.querySelector('.service-price').textContent.match(/\d+/)[0]);
            const icon = card.querySelector('.service-icon').textContent;
            
            let serviceCode = 'birth';
            if (serviceName.includes('Love') || serviceName.includes('প্রেম') || serviceName.includes('प्रेम')) serviceCode = 'love';
            else if (serviceName.includes('Career') || serviceName.includes('ক্যারিয়ার') || serviceName.includes('करियर')) serviceCode = 'career';
            
            selectService(serviceCode, serviceName, price, icon);
        });
    });

    const form = document.getElementById('birthDetailsForm');
    if (form) form.addEventListener('submit', handleFormSubmit);

    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) closeServiceModal();
        });
    }

    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            langBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            changeLanguage(this.textContent.trim().substring(0, 2).toLowerCase());
        });
    });
}

// Select service
function selectService(serviceCode, serviceName, price, icon) {
    selectedService = { code: serviceCode, name: serviceName, price: price, icon: icon };
    showServiceModal(serviceCode, serviceName, price);
}

// Show service modal with form
function showServiceModal(serviceCode, serviceName, price) {
    let modal = document.getElementById('serviceModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'serviceModal';
        modal.className = 'modal';
        document.body.appendChild(modal);

        if (!document.getElementById('modalStyles')) {
            const style = document.createElement('style');
            style.id = 'modalStyles';
            style.textContent = `
                .modal { display: none; position: fixed; z-index: 2000; left: 0; top: 0; width: 100%; height: 100%; background: rgba(0, 0, 0, 0.6); animation: fadeIn 0.3s; }
                .modal.active { display: flex; justify-content: center; align-items: center; }
                .modal-content { background: white; padding: 2rem; border-radius: 15px; width: 90%; max-width: 500px; max-height: 90vh; overflow-y: auto; position: relative; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3); }
                .modal-close { position: absolute; right: 1.5rem; top: 1.5rem; font-size: 2rem; cursor: pointer; color: #666; transition: color 0.3s; }
                .modal-close:hover { color: #000; }
                .form-group { margin-bottom: 1.5rem; }
                .form-group label { display: block; margin-bottom: 0.5rem; font-weight: 600; color: #333; font-size: 0.95rem; }
                .form-group input, .form-group select { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 6px; font-size: 1rem; transition: border-color 0.3s; }
                .form-group input:focus, .form-group select:focus { outline: none; border-color: #6b46c1; box-shadow: 0 0 0 3px rgba(107, 70, 193, 0.1); }
                .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
                @media (max-width: 600px) { .form-row { grid-template-columns: 1fr; } .modal-content { width: 95%; padding: 1.5rem; } }
                .service-header { text-align: center; margin-bottom: 2rem; padding-bottom: 1.5rem; border-bottom: 2px solid #f0f0f0; }
                .service-header-icon { font-size: 3rem; margin-bottom: 0.5rem; }
                .service-header h2 { font-size: 1.5rem; color: #333; margin-bottom: 0.5rem; }
                .service-header p { color: #d4af37; font-weight: 600; font-size: 1.2rem; }
                .form-actions { display: flex; gap: 1rem; margin-top: 2rem; }
                .form-actions button { flex: 1; padding: 0.75rem 1.5rem; border: none; border-radius: 6px; font-weight: 600; cursor: pointer; transition: all 0.3s; font-size: 1rem; }
                .btn-submit { background: linear-gradient(135deg, #6b46c1, #7c3aed); color: white; }
                .btn-submit:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(107, 70, 193, 0.3); }
                .btn-cancel { background: #f0f0f0; color: #333; }
                .btn-cancel:hover { background: #e0e0e0; }
                .loading { display: none; text-align: center; padding: 2rem; }
                .loading.active { display: block; }
                .spinner { border: 4px solid #f3f3f3; border-top: 4px solid #6b46c1; border-radius: 50%; width: 40px; height: 40px; animation: spin 1s linear infinite; margin: 0 auto 1rem; }
                @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                .error-message { background: #fee; color: #c33; padding: 1rem; border-radius: 6px; margin-bottom: 1rem; display: none; }
                .error-message.show { display: block; }
                .time-inputs { display: flex; gap: 5px; }
                .time-inputs input, .time-inputs select { padding: 0.75rem 0.5rem; text-align: center; }
            `;
            document.head.appendChild(style);
        }
    }

    const serviceIcons = { birth: '🔮', love: '❤️', career: '💼' };

    modal.innerHTML = `
        <div class="modal-content">
            <span class="modal-close" onclick="closeServiceModal()">&times;</span>
            <div id="modalBody">
                <div class="service-header">
                    <div class="service-header-icon">${serviceIcons[serviceCode] || '🔮'}</div>
                    <h2>${serviceName}</h2>
                    <p>₹${price}</p>
                </div>
                <div class="error-message" id="errorMessage"></div>
                <form id="birthDetailsForm">
                    <div class="form-group"><label>নাম / Name *</label><input type="text" name="name" placeholder="আপোনাৰ সম্পূৰ্ণ নাম" required></div>
                    <div class="form-group"><label>ইমেইল / Email *</label><input type="email" name="email" placeholder="your@email.com" required></div>
                    
                    <div class="form-row">
                        <div class="form-group"><label>জন্ম তাৰিখ / Date *</label><input type="date" name="birthDate" required></div>
                        <div class="form-group">
                            <label>জন্ম সময় / Time *</label>
                            <div class="time-inputs">
                                <input type="number" name="birthHour" placeholder="ঘণ্টা" min="1" max="12" required style="width: 33%;">
                                <input type="number" name="birthMinute" placeholder="মিনিট" min="0" max="59" required style="width: 33%;">
                                <select name="birthAmpm" required style="width: 34%;">
                                    <option value="AM">AM</option>
                                    <option value="PM">PM</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div class="form-group"><label>জন্ম স্থান / Place *</label><input type="text" name="birthPlace" placeholder="City, State, Country" required></div>
                    <div class="form-group">
                        <label>ভাষা / Language *</label>
                        <select name="language" required>
                            <option value="as">Assamese (অসমীয়া)</option>
                            <option value="en">English</option>
                            <option value="hi">Hindi (हिन्दी)</option>
                        </select>
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-cancel" onclick="closeServiceModal()">বাতিল / Cancel</button>
                        <button type="submit" class="btn-submit">পেমেন্ট কৰক / Pay ₹${price}</button>
                    </div>
                </form>
                <div class="loading" id="loadingDiv">
                    <div class="spinner"></div>
                    <p>প্রক্রিয়াকরণ চলছে... Processing...</p>
                </div>
            </div>
        </div>
    `;

    document.getElementById('birthDetailsForm').addEventListener('submit', handleFormSubmit);
    modal.classList.add('active');
}

function closeServiceModal() {
    const modal = document.getElementById('serviceModal');
    if (modal) modal.classList.remove('active');
}

// Handle form submission
async function handleFormSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const formData = new FormData(form);

    if (!formData.get('name') || !formData.get('email') || !formData.get('birthDate') || 
        !formData.get('birthHour') || !formData.get('birthMinute') || !formData.get('birthPlace')) {
        showError('সকলো field পূৰণ কৰক / Fill all fields');
        return;
    }

    let hour = parseInt(formData.get('birthHour'));
    const minute = formData.get('birthMinute').padStart(2, '0');
    const ampm = formData.get('birthAmpm');

    if (ampm === 'PM' && hour < 12) hour += 12;
    if (ampm === 'AM' && hour === 12) hour = 0;
    
    const formattedTime = `${hour.toString().padStart(2, '0')}:${minute}:00`;

    const selectedLang = formData.get('language') || 'as';

    showLoading(true);

    try {
        const orderResponse = await fetch(`${C.apiBaseUrl}/create-order`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                service: selectedService.code,
                name: formData.get('name'),
                email: formData.get('email'),
                birthDate: formData.get('birthDate'),
                birthTime: formattedTime,
                birthPlace: formData.get('birthPlace'),
                language: selectedLang
            })
        });

        if (!orderResponse.ok) throw new Error('Order creation failed (Server error)');
        const orderData = await orderResponse.json();
        if (!orderData.success) throw new Error(orderData.error || 'Order creation failed');

        currentOrder = orderData;
        currentOrder.selectedLanguage = selectedLang;
        currentOrder.serviceCode = selectedService.code;

        handleRazorpayPayment(orderData);

    } catch (error) {
        console.error('Error:', error);
        showError('Error: ' + error.message);
        showLoading(false);
    }
}

// Handle Razorpay payment
function handleRazorpayPayment(orderData) {
    const options = {
        key: C.razorpayKeyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: C.brand || 'Jyotish Assam',
        description: `${orderData.serviceName} Reading`,
        order_id: orderData.razorpayOrderId,
        handler: function(response) {
            verifyPayment(
                orderData.orderId,
                response.razorpay_order_id,
                response.razorpay_payment_id,
                response.razorpay_signature
            );
        },
        prefill: { name: currentOrder.name, email: currentOrder.email },
        theme: { color: '#6b46c1' }
    };

    try {
        const razorpay = new Razorpay(options);
        razorpay.open();
    } catch(err) {
        showError("Razorpay SDK load হোৱা নাই। ইণ্টাৰনেট চেক কৰক।");
        showLoading(false);
    }
}

// Verify payment
async function verifyPayment(orderId, razorpayOrderId, razorpayPaymentId, razorpaySignature) {
    try {
        const verifyResponse = await fetch(`${C.apiBaseUrl}/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                orderId: orderId,
                razorpay_order_id: razorpayOrderId,
                razorpay_payment_id: razorpayPaymentId,
                razorpay_signature: razorpaySignature
            })
        });

        const verifyData = await verifyResponse.json();
        if (!verifyData.success) {
            showError('Payment verification failed');
            showLoading(false);
            return;
        }

        const lang = currentOrder ? currentOrder.selectedLanguage : 'as';
        const sCode = currentOrder ? currentOrder.serviceCode : 'birth';
        generateReport(orderId, lang, sCode);

    } catch (error) {
        console.error('Verification error:', error);
        showError('Payment verification error: ' + error.message);
        showLoading(false);
    }
}

// Generate report with Detailed Love Reading & Multi-language Support
async function generateReport(orderId, language, serviceCode) {
    try {
        const loadingText = document.querySelector('#loadingDiv p');
        if (loadingText) loadingText.innerText = "Generating Report... / ৰিপোৰ্ট প্ৰস্তুত কৰা হৈছে...";

        const finalOrderId = orderId || "JA-MTS82YYC-34BBE39C";
        const lang = language || 'as';
        const sCode = serviceCode || 'birth';

        const reportResponse = await fetch("https://ihbdrtnkfitytklonnel.supabase.co/functions/v1/calculate-chart", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: finalOrderId })
        });

        const result = await reportResponse.json();

        if (!result.success) {
            showError('Error: ' + (result.error || JSON.stringify(result)));
            showLoading(false);
            return;
        }

        const c = result.chart;

        // Multi-language Dictionaries
        const dict = {
            as: {
                title: "সম্পূৰ্ণ জ্যোতিষ ৰিপোৰ্ট",
                subtitle: "বৈদিক জ্যোতিষ আৰু লাহিৰী অয়নাংশ (Lahiri Ayanamsa) পদ্ধতিত প্ৰস্তুতকৃত",
                birthTitle: "১. জন্মৰ বিৱৰণ (Birth Details)",
                birthDesc: "আপুনি প্ৰদান কৰা জন্মৰ সঠিক সময় আৰু স্থানৰ ওপৰত ভিত্তি কৰি গ্ৰহগণনা কৰা হৈছে:",
                date: "জন্ম তাৰিখ", time: "জন্ম সময়", place: "জন্ম স্থান",
                ascTitle: "২. লগ্ন আৰু ব্যক্তিত্ব বিশ্লেষণ",
                lagna: "জন্ম লগ্ন", nakshatra: "জন্ম নক্ষত্ৰ", ayanamsa: "অয়নাংশ",
                lagnaDesc: `আপোনাৰ জন্ম <strong>${c.ascendant.rashi} লগ্নত</strong> হৈছে। বৈদিক জ্যোতিষত লগ্নই আপোনাৰ শৰীৰ, স্বভাৱ, আৰু সমগ্ৰ জীৱনৰ দিশ নিৰ্ধাৰণ কৰে।`,
                planetTitle: "৩. নৱগ্ৰহৰ অৱস্থান আৰু ইয়াৰ প্ৰভাৱ",
                planetDesc: "জন্মৰ সময়ত আকাশমণ্ডলত গ্ৰহসমূহ কোনটো ৰাশি আৰু নক্ষত্ৰত অৱস্থান কৰিছিল:",
                thPlanet: "গ্ৰহ আৰু ইয়াৰ কাৰকতা", thSign: "ৰাশি", thNak: "নক্ষত্ৰ আৰু পদ", thDeg: "ডিগ্ৰী",
                dashaTitle: "৪. বিংশোত্তৰী মহা দশা চক্ৰ",
                dashaDesc: "বৈদিক জ্যোতিষশাস্ত্ৰৰ মতে মানুহৰ জীৱনত বিভিন্ন গ্ৰহৰ মহা দশা আহে:",
                thDasha: "মহা দশা", thStart: "আৰম্ভণি", thEnd: "সমাপ্তি", thDur: "সময়কাল",
                printBtn: "🖨️ সম্পূৰ্ণ ৰিপোৰ্ট প্ৰিণ্ট কৰক",
                
                serviceBirth: "🔮 জন্ম কুণ্ডলী বিশ্লেষণ (Complete Birth Chart)",
                serviceLove: "❤️ প্ৰেম আৰু সম্পৰ্ক বিশদ পৰামৰ্শ (Advanced Love & Relationship Reading)",
                serviceCareer: "💼 কেৰিয়াৰ আৰু ব্যৱসায়িক ভৱিষ্যৎ (Career & Business Forecast)",
                
                // Detailed Love Reading Sections in Assamese
                loveTimingTitle: "🕰️ প্ৰেম কেতিয়া হোৱাৰ সম্ভাৱনা আছে?",
                loveTimingDesc: "আপোনাৰ কুণ্ডলীৰ পঞ্চম ভাব (প্ৰেমৰ স্থান), সপ্তম ভাব (বিবাহ) আৰু শুক্ৰ তথা মংগল গ্ৰহৰ অৱস্থান বিচাৰ কৰি দেখা গৈছে যে আপোনাৰ জীৱনত প্ৰেমৰ আগমন এক বিশেষ মহা দশা বা অন্তৰ্দশাৰ সময়ত ঘটিব। বিশেষকৈ শুক্ৰ বা বৃহস্পতিৰ প্ৰভাৱ থকা সময়ছোৱাত প্ৰেম সম্পৰ্কত প্ৰৱেশ কৰাৰ প্ৰবল যোগ থাকে।",
                
                partnerNatureTitle: "👥 সংগী (ল’ৰা/ছোৱালীজন) কেনেকুৱা স্বভাৱৰ হ’ব?",
                partnerNatureDesc: "সপ্তম ভাবৰ ৰাশি আৰু গ্ৰহৰ প্ৰভাৱ অনুসৰি আপোনাৰ ভৱিষ্যৎ সংগী অত্যন্ত আকৰ্ষণীয়, ৰোমাঞ্চপ্ৰিয়, বুধিয়ক আৰু পৰিয়ালৰ প্ৰতি দায়িত্বশীল হোৱাৰ সম্ভাৱনা আছে। তেওঁ মিলাৰী স্বভাৱৰ আৰু আপোনাৰ দুখ-সুখত ভাগ লোৱات আগ্ৰহী হ’ব।",
                
                partnerProfTitle: "💼 সংগীৰ পেছা (Profession) কি হ’ব পাৰে?",
                partnerProfDesc: "গ্ৰহৰ স্থিতিৰ পৰা অনুমান কৰা হয় যে আপোনাৰ সংগীজন শিক্ষা, বেংক, প্ৰযুক্তিবিদ্যা (IT), কলা-সংস্কৃতি, ব্যৱসায় বা চৰকাৰী খণ্ডৰ কোনো সুপ্ৰতিষ্ঠিত পেছাত যুক্ত হোৱাৰ যোগ আছে।",
                
                marriageTypeTitle: "💍 প্ৰেম বিবাহ (Love Marriage) নে এৰেঞ্জ মেৰিজ (Arrange)?",
                marriageTypeDesc: "পঞ্চম আৰু সপ্তম ভাবৰ পতিৰ সম্পৰ্কৰ ওপৰত ভিত্তি কৰি কুণ্ডলীত প্ৰেম বিবাহৰ সম্ভাৱনা প্ৰায় ৬০-৭০% পৰিলক্ষিত হয়। যদি দুয়োটা ভাবৰ সুদৃঢ় যোগ থাকে, তେশেন প্ৰেম সম্পৰ্ক বিবাহলৈ ৰূপান্তৰিত হোৱাৰ পূৰ্ণ সম্ভাৱনা থাকে। অন্যথা পৰিয়ালৰ সন্মতিৰে হোৱা বিবাহো সফল হ’ব।",

                careerDesc: "দশম ভাব (কৰ্মস্থান) আৰু বৃহস্পতি-শনিৰ অৱস্থানৰ ওপਰত ভিত্তি কৰি আপোনাৰ পেছাদাৰী জীৱন, চাকৰি বা ব্যৱসায়ত উন্নতি আৰু সফলতা লাভৰ সঠিক দিশ নির্দেশনা দিয়া হৈছে।"
            },
            en: {
                title: "Complete Astrology Report",
                subtitle: "Prepared using Vedic Astrology & Lahiri Ayanamsa",
                birthTitle: "1. Birth Details",
                birthDesc: "Planetary calculations based on your precise birth time and location:",
                date: "Birth Date", time: "Birth Time", place: "Birth Place",
                ascTitle: "2. Ascendant & Personality Analysis",
                lagna: "Ascendant (Lagna)", nakshatra: "Birth Nakshatra", ayanamsa: "Ayanamsa",
                lagnaDesc: `Your birth is in <strong>${c.ascendant.rashi} Ascendant</strong>. In Vedic astrology, the ascendant determines your physical traits, personality, and life path.`,
                planetTitle: "3. Planetary Positions & Effects",
                planetDesc: "Positions of planets in zodiac signs and nakshatras at the time of your birth:",
                thPlanet: "Planet & Significance", thSign: "Sign", thNak: "Nakshatra & Pada", thDeg: "Degree",
                dashaTitle: "4. Vimshottari Maha Dasha Cycle",
                dashaDesc: "Planetary periods influencing different phases of your life according to Vedic astrology:",
                thDasha: "Maha Dasha", thStart: "Start Date", thEnd: "End Date", thDur: "Duration",
                printBtn: "🖨️ Print Complete Report",
                
                serviceBirth: "🔮 Complete Birth Chart Analysis",
                serviceLove: "❤️ Advanced Love & Relationship Reading",
                serviceCareer: "💼 Career & Business Forecast",
                
                loveTimingTitle: "🕰️ When is Love likely to happen?",
                loveTimingDesc: "Based on your 5th house (romance), 7th house (marriage), and Venus/Mars placements, love is strongly indicated during favorable dasha periods, especially under Venus or Jupiter influences.",
                partnerNatureTitle: "👥 What will your Partner be like?",
                partnerNatureDesc: "Your partner is likely to be charming, affectionate, intelligent, and deeply committed, bringing emotional stability and happiness to your life.",
                partnerProfTitle: "💼 What could be your Partner's Profession?",
                partnerProfDesc: "Indications point towards fields like education, IT, banking, creative arts, business, or administrative sectors.",
                marriageTypeTitle: "💍 Love Marriage vs. Arrange Marriage",
                marriageTypeDesc: "There is a strong possibility of a love marriage (approx 60-70%) if the 5th and 7th house lords form a supportive yoga. Otherwise, a harmonious arranged marriage with mutual understanding is foreseen.",

                careerDesc: "Based on the 10th house (career) and planetary transits, this provides insights for professional growth, job stability, or business success."
            },
            hi: {
                title: "पूर्ण ज्योतिष रिपोर्ट",
                subtitle: "वैदिक ज्योतिष और लाहिरी अयांश पद्धति पर आधारित",
                birthTitle: "1. जन्म विवरण (Birth Details)",
                birthDesc: "आपके सटीक जन्म समय और स्थान के आधार पर ग्रहों की गणना:",
                date: "जन्म तिथि", time: "जन्म समय", place: "जन्म स्थान",
                ascTitle: "2. लग्न और व्यक्तित्व विश्लेषण",
                lagna: "लग्न (Ascendant)", nakshatra: "जन्म नक्षत्र", ayanamsa: "अयांश",
                lagnaDesc: `आपका जन्म <strong>${c.ascendant.rashi} लग्न</strong> में हुआ है। वैदिक ज्योतिष में लग्न आपके स्वभाव और जीवन की दिशा तय करता है।`,
                planetTitle: "3. ग्रह स्थिति और प्रभाव (Planetary Positions)",
                planetDesc: "आपके जन्म के समय आकाशमंडल में ग्रहों की स्थिति:",
                thPlanet: "ग्रह और कारक", thSign: "राशि", thNak: "नक्षत्र और पद", thDeg: "डिग्री",
                dashaTitle: "4. विंशोत्तरी महा दशा चक्र",
                dashaDesc: "वैदिक ज्योतिष के अनुसार जीवन के विभिन्न चरणों को प्रभावित करने वाली महादशाएं:",
                thDasha: "महा दशा", thStart: "ारंभ तिथि", thEnd: "समाप्ति तिथि", thDur: "अवधि",
                printBtn: "🖨️ पूर्ण रिपोर्ट प्रिंट करें",
                
                serviceBirth: "🔮 पूर्ण जन्म कुंडली विश्लेषण",
                serviceLove: "❤️ प्रेम और संबंध विस्तृत परामर्श (Love Reading)",
                serviceCareer: "💼 करियर और व्यवसाय पूर्वानुमान (Career Forecast)",
                
                loveTimingTitle: "🕰️ प्रेम कब होने की संभावना है?",
                loveTimingDesc: "कुंडली के पंचम (प्रेम) और सप्तम (विवाह) भाव के विश्लेषण से, अनुकूल महादशा या शुक्र/गुरु के प्रभाव काल में प्रेम संबंध बनने के प्रबल योग हैं।",
                partnerNatureTitle: "👥 साथी (लड़का/लड़की) का स्वभाव कैसा होगा?",
                partnerNatureDesc: "सप्तम भाव के प्रभाव से आपका जीवनसाथी आकर्षक, मिलनसार, बुद्धिमान और परिवार के प्रति समर्पित स्वभाव का हो सकता है।",
                partnerProfTitle: "💼 साथी का पेशा (Profession) क्या हो सकता है?",
                partnerProfDesc: "संभावना है कि आपके साथी शिक्षा, बैंकिंग, आईटी, कला या व्यवसाय क्षेत्र से जुड़े हों।",
                marriageTypeTitle: "💍 लव मैरिज (Love Marriage) या अरेंज मैरिज?",
                marriageTypeDesc: "पंचम और सप्तमेश के आपसी संबंध के आधार पर लव मैरिज के 60-70% योग बनते हैं। अन्यथा पारिवारिक सहमति से एक सफल और सुखी विवाह का योग है।",

                careerDesc: "दशम (कर्म) भाव और ग्रहों की स्थिति के आधार पर यह आपके पेशेवर जीवन में सफलता का मार्ग प्रशस्त करती है."
            }
        };

        const t = dict[lang] || dict['as'];

        const pNameDict = {
            as: { Sun: 'সূৰ্য', Moon: 'চন্দ্ৰ', Mars: 'মংগল', Mercury: 'বুধ', Jupiter: 'বৃহস্পতি', Venus: 'শুক্ৰ', Saturn: 'শনি', Rahu: 'ৰাহু', Ketu: 'কেতু' },
            en: { Sun: 'Sun', Moon: 'Moon', Mars: 'Mars', Mercury: 'Mercury', Jupiter: 'Jupiter', Venus: 'Venus', Saturn: 'Saturn', Rahu: 'Rahu', Ketu: 'Ketu' },
            hi: { Sun: 'सूर्य', Moon: 'चन्द्र', Mars: 'मंगल', Mercury: 'बुध', Jupiter: 'गुरु', Venus: 'शुक्र', Saturn: 'शनि', Rahu: 'राहु', Ketu: 'केतु' }
        };
        const pN = pNameDict[lang] || pNameDict['as'];

        const rNameDict = {
            as: { Aries: 'মেষ', Taurus: 'বৃষ', Gemini: 'মিথুন', Cancer: 'কৰ্কট', Leo: 'সিংহ', Virgo: 'কন্যা', Libra: 'তুলা', Scorpio: 'বৃশ্চিক', Sagittarius: 'ধনু', Capricorn: 'মকৰ', Aquarius: 'কুম্ভ', Pisces: 'মীন' },
            en: { Aries: 'Aries', Taurus: 'Taurus', Gemini: 'Gemini', Cancer: 'Cancer', Leo: 'Leo', Virgo: 'Virgo', Libra: 'Libra', Scorpio: 'Scorpio', Sagittarius: 'Sagittarius', Capricorn: 'Capricorn', Aquarius: 'Aquarius', Pisces: 'Pisces' },
            hi: { Aries: 'मेष', Taurus: 'वृषभ', Gemini: 'मिथुन', Cancer: 'कर्क', Leo: 'सिंह', Virgo: 'कन्या', Libra: 'तुला', Scorpio: 'वृश्चिक', Sagittarius: 'धनु', Capricorn: 'मकर', Aquarius: 'कुंभ', Pisces: 'मीन' }
        };
        const rN = rNameDict[lang] || rNameDict['as'];

        let planetsHtml = '';
        for (const [planet, data] of Object.entries(c.planets)) {
            planetsHtml += `
                <tr>
                    <td><strong>${pN[planet] || planet}</strong></td>
                    <td>${rN[data.rashi] || data.rashi}</td>
                    <td>${data.nakshatra} (Pad ${data.pada})</td>
                    <td>${data.longitude.toFixed(2)}°</td>
                </tr>
            `;
        }

        let dashasHtml = '';
        c.dashas.forEach(d => {
            dashasHtml += `
                <tr>
                    <td><strong>${pN[d.lord] || d.lord} Maha Dasha</strong></td>
                    <td>${d.start_date}</td>
                    <td>${d.end_date}</td>
                    <td>${d.duration_years} Years</td>
                </tr>
            `;
        });

        // Dynamic Service Specific Section Generation
        let serviceSpecificContent = '';
        if (sCode === 'love') {
            serviceSpecificContent = `
                <div class="section" style="background: #fff1f2; border-left: 6px solid #e11d48;">
                    <h2 class="section-title" style="color: #e11d48;">💖 ${t.serviceLove}</h2>
                    
                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #9f1239; font-size: 18px; margin-bottom: 8px;">${t.loveTimingTitle}</h3>
                        <p style="font-size: 15px; color: #475569; line-height: 1.8;">${t.loveTimingDesc}</p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #9f1239; font-size: 18px; margin-bottom: 8px;">${t.partnerNatureTitle}</h3>
                        <p style="font-size: 15px; color: #475569; line-height: 1.8;">${t.partnerNatureDesc}</p>
                    </div>

                    <div style="margin-bottom: 20px;">
                        <h3 style="color: #9f1239; font-size: 18px; margin-bottom: 8px;">${t.partnerProfTitle}</h3>
                        <p style="font-size: 15px; color: #475569; line-height: 1.8;">${t.partnerProfDesc}</p>
                    </div>

                    <div>
                        <h3 style="color: #9f1239; font-size: 18px; margin-bottom: 8px;">${t.marriageTypeTitle}</h3>
                        <p style="font-size: 15px; color: #475569; line-height: 1.8;">${t.marriageTypeDesc}</p>
                    </div>
                </div>
            `;
        } else if (sCode === 'career') {
            serviceSpecificContent = `
                <div class="section" style="background: #eff6ff; border-left: 6px solid #2563eb;">
                    <h2 class="section-title" style="color: #2563eb;">💼 ${t.serviceCareer}</h2>
                    <p style="font-size: 16px; color: #475569; line-height: 1.8;">${t.careerDesc}</p>
                </div>
            `;
        } else {
            serviceSpecificContent = `
                <div class="section" style="background: #f5f3ff; border-left: 6px solid #7c3aed;">
                    <h2 class="section-title" style="color: #7c3aed;">🔮 ${t.serviceBirth}</h2>
                    <p style="font-size: 16px; color: #475569; line-height: 1.8;">This complete birth chart covers all foundational aspects of your life including overall destiny, strengths, and spiritual path.</p>
                </div>
            `;
        }

        const finalHtml = `
            <!DOCTYPE html>
            <html lang="${lang}">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>${t.title} - Jyotish Assam</title>
                <style>
                    :root {
                        --primary: #6D28D9;
                        --secondary: #DB2777;
                        --dark: #0f172a;
                        --light: #f8fafc;
                        --border: #e2e8f0;
                        --card-bg: #ffffff;
                    }
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f1f5f9;
                        color: var(--dark);
                        margin: 0;
                        padding: 20px;
                        line-height: 1.7;
                    }
                    .report-container {
                        max-width: 900px;
                        margin: 0 auto;
                        background: var(--card-bg);
                        border-radius: 16px;
                        box-shadow: 0 10px 35px rgba(0,0,0,0.1);
                        overflow: hidden;
                    }
                    .header {
                        background: linear-gradient(135deg, var(--primary), var(--secondary));
                        color: white;
                        padding: 50px 20px;
                        text-align: center;
                    }
                    .header h1 { margin: 0 0 10px 0; font-size: 32px; font-weight: 700; }
                    .header p { margin: 0; opacity: 0.95; font-size: 18px; }
                    
                    .section { padding: 35px; border-bottom: 1px solid var(--border); }
                    .section:last-child { border-bottom: none; }
                    
                    .section-title {
                        color: var(--primary);
                        font-size: 22px;
                        margin-top: 0;
                        margin-bottom: 20px;
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        border-left: 5px solid var(--secondary);
                        padding-left: 12px;
                    }
                    
                    .info-grid {
                        display: grid;
                        grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
                        gap: 20px;
                        background: #f8fafc;
                        padding: 20px;
                        border-radius: 12px;
                        border: 1px solid var(--border);
                    }
                    .info-box { text-align: center; background: white; padding: 18px; border-radius: 10px; box-shadow: 0 2px 8px rgba(0,0,0,0.04); }
                    .info-label { font-size: 13px; color: #64748b; font-weight: 600; text-transform: uppercase; }
                    .info-value { font-size: 17px; font-weight: 700; color: var(--dark); margin-top: 6px; }
                    
                    .desc-box {
                        background: #fdf4ff;
                        border: 1px solid #f5d0fe;
                        padding: 20px;
                        border-radius: 10px;
                        margin-top: 20px;
                        color: #701a75;
                        font-size: 15px;
                    }

                    table { width: 100%; border-collapse: collapse; margin-top: 15px; background: white; border-radius: 8px; overflow: hidden; border: 1px solid var(--border); }
                    th, td { padding: 14px 18px; text-align: left; border-bottom: 1px solid var(--border); }
                    th { background-color: var(--primary); color: white; font-weight: 600; font-size: 15px; }
                    tr:hover { background-color: #f8fafc; }
                    
                    .print-btn {
                        display: block;
                        width: 280px;
                        margin: 40px auto;
                        padding: 14px;
                        background: var(--dark);
                        color: white;
                        text-align: center;
                        border: none;
                        border-radius: 10px;
                        font-size: 16px;
                        cursor: pointer;
                        font-weight: bold;
                        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                        transition: 0.3s;
                    }
                    .print-btn:hover { background: var(--primary); transform: translateY(-2px); }
                    
                    @media print {
                        .print-btn { display: none; }
                        body { background: white; padding: 0; }
                        .report-container { box-shadow: none; max-width: 100%; border-radius: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="report-container">
                    <div class="header">
                        <h1>✨ জ্যোতিষ অসম - Jyotish Assam</h1>
                        <p>${t.title}</p>
                    </div>

                    <!-- Dynamic Service Specific Highlight (Love, Career or Birth) -->
                    ${serviceSpecificContent}
                    
                    <div class="section">
                        <h2 class="section-title">👤 ${t.birthTitle}</h2>
                        <p style="color: #64748b; font-size: 14px; margin-bottom: 15px;">${t.birthDesc}</p>
                        <div class="info-grid">
                            <div class="info-box">
                                <div class="info-label">${t.date}</div>
                                <div class="info-value">${c.birth.date}</div>
                            </div>
                            <div class="info-box">
                                <div class="info-label">${t.time}</div>
                                <div class="info-value">${c.birth.time}</div>
                            </div>
                            <div class="info-box">
                                <div class="info-label">${t.place}</div>
                                <div class="info-value" style="text-transform: capitalize;">${c.birth.place}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <h2 class="section-title">🎯 ${t.ascTitle}</h2>
                        <div class="info-grid">
                            <div class="info-box">
                                <div class="info-label">${t.lagna}</div>
                                <div class="info-value">${rN[c.ascendant.rashi] || c.ascendant.rashi}</div>
                            </div>
                            <div class="info-box">
                                <div class="info-label">${t.nakshatra}</div>
                                <div class="info-value">${c.ascendant.nakshatra} (Pad ${c.ascendant.pada})</div>
                            </div>
                            <div class="info-box">
                                <div class="info-label">${t.ayanamsa}</div>
                                <div class="info-value">${c.ayanamsa_value.toFixed(2)}°</div>
                            </div>
                        </div>
                        <div class="desc-box">
                            ${t.lagnaDesc}
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2 class="section-title">🪐 ${t.planetTitle}</h2>
                        <p style="color: #64748b; font-size: 14px; margin-bottom: 15px;">${t.planetDesc}</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>${t.thPlanet}</th>
                                    <th>${t.thSign}</th>
                                    <th>${t.thNak}</th>
                                    <th>${t.thDeg}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${planetsHtml}
                            </tbody>
                        </table>
                    </div>

                    <div class="section">
                        <h2 class="section-title">⏳ ${t.dashaTitle}</h2>
                        <p style="color: #64748b; font-size: 14px; margin-bottom: 15px;">${t.dashaDesc}</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>${t.thDasha}</th>
                                    <th>${t.thStart}</th>
                                    <th>${t.thEnd}</th>
                                    <th>${t.thDur}</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dashasHtml}
                            </tbody>
                        </table>
                    </div>
                    
                    <button class="print-btn" onclick="window.print()">${t.printBtn}</button>
                </div>
            </body>
            </html>
        `;

        displayReport(finalHtml);
        showLoading(false);
        closeServiceModal();

    } catch (error) {
        console.error('Report generation error:', error);
        showError('ইণ্টাৰনেটৰ সমস্যা বা চাৰ্ভাৰত সংযোগ হোৱা নাই।');
        showLoading(false);
    }
}

// Display report in current page
function displayReport(reportHtml) {
    document.open();
    document.write(reportHtml);
    document.close();
}

function showLoading(isLoading) {
    const loading = document.getElementById('loadingDiv');
    const form = document.getElementById('birthDetailsForm');
    if (loading) {
        loading.classList.toggle('active', isLoading);
        if (form) form.style.display = isLoading ? 'none' : 'block';
    }
}

function showError(message) {
    const errorDiv = document.getElementById('errorMessage');
    if (errorDiv) {
        errorDiv.textContent = message;
        errorDiv.classList.add('show');
        setTimeout(() => { errorDiv.classList.remove('show'); }, 6000);
    } else {
        alert(message);
    }
}

function changeLanguage(lang) {
    localStorage.setItem('preferredLanguage', lang);
}

function checkExistingOrder() {
    const params = new URLSearchParams(window.location.search);
    const orderId = params.get('orderId');
    if (orderId) console.log('Loading report for order:', orderId);
}

function loadRazorpayScript() {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.head.appendChild(script);
}

window.addEventListener('load', loadRazorpayScript);
