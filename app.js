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
            if (serviceName.includes('Love') || serviceName.includes('প্রেম')) serviceCode = 'love';
            else if (serviceName.includes('Career') || serviceName.includes('ক্যারিয়ার')) serviceCode = 'career';
            
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
                language: formData.get('language')
            })
        });

        if (!orderResponse.ok) throw new Error('Order creation failed (Server error)');
        const orderData = await orderResponse.json();
        if (!orderData.success) throw new Error(orderData.error || 'Order creation failed');

        currentOrder = orderData;
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

        generateReport(orderId, currentOrder.language || 'as');

    } catch (error) {
        console.error('Verification error:', error);
        showError('Payment verification error: ' + error.message);
        showLoading(false);
    }
}

// Generate report with Detailed Assamese Explanations
async function generateReport(orderId, language) {
    try {
        const loadingText = document.querySelector('#loadingDiv p');
        if (loadingText) loadingText.innerText = "আপোনাৰ ৰিপোৰ্ট প্ৰস্তুত কৰা হৈছে... অনুগ্ৰহ কৰি অপেক্ষা কৰক";

        const finalOrderId = orderId || "JA-MTS82YYC-34BBE39C";

        const reportResponse = await fetch("https://ihbdrtnkfitytklonnel.supabase.co/functions/v1/calculate-chart", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: finalOrderId })
        });

        const result = await reportResponse.json();

        if (!result.success) {
            showError('ৰিপোৰ্ট বনোৱাত সমস্যা হৈছে: ' + (result.error || JSON.stringify(result)));
            showLoading(false);
            return;
        }

        const c = result.chart;

        const pName = { Sun: 'সূৰ্য', Moon: 'চন্দ্ৰ', Mars: 'মংগল', Mercury: 'বুধ', Jupiter: 'বৃহস্পতি', Venus: 'শুক্ৰ', Saturn: 'শনি', Rahu: 'ৰাহু', Ketu: 'কেতু' };
        const rName = { Aries: 'মেষ', Taurus: 'বৃষ', Gemini: 'মিথুন', Cancer: 'কৰ্কট', Leo: 'সিংহ', Virgo: 'কন্যা', Libra: 'তুলা', Scorpio: 'বৃশ্চিক', Sagittarius: 'ধনু', Capricorn: 'মকৰ', Aquarius: 'কুম্ভ', Pisces: 'মীন' };

        // গ্ৰহৰ ফলবোৰ সহজকৈ বুজাবলৈ সৰু বৰ্ণনা
        const pDesc = {
            Sun: 'আত্মা, নেতৃত্ব, আৰু আত্মবিশ্বাসৰ কাৰক।',
            Moon: 'মন, আৱেগ, আৰু মানসিক শান্তিৰ প্ৰতীক।',
            Mars: 'সাহস, শক্তি, পৰাক্ৰম আৰু ভাই-ভনীৰ কাৰক।',
            Mercury: 'বুদ্ধিমত্তা, বাকশক্তি, শিক্ষা আৰু ব্যৱসায়ৰ কাৰক।',
            Jupiter: 'জ্ঞান, ভাগ্য়, ধৰ্মীয় চিন্তা আৰু ধন-সম্পত্তিৰ কাৰক।',
            Venus: 'প্ৰেম, সৌন্দৰ্য, আনন্দ আৰু বৈভৱৰ কাৰক।',
            Saturn: 'কৰ্মফলদাতা, অনুশাসন, ধৈৰ্য আৰু ন্যায়ৰ দেৱতা।',
            Rahu: 'মায়া, উচ্চাকাংক্ষা, আকস্মিক পৰিৱৰ্তন আৰু উদ্ভাৱনী শক্তি।',
            Ketu: 'আধ্যাত্মিকতা, মোক্ষ, অন্তৰ্দৃষ্টি আৰু বৈৰাগ্যৰ কাৰক।'
        };

        let planetsHtml = '';
        for (const [planet, data] of Object.entries(c.planets)) {
            planetsHtml += `
                <tr>
                    <td><strong>${pName[planet] || planet}</strong><br><small style="color:#64748b;">${pDesc[planet] || ''}</small></td>
                    <td>${rName[data.rashi] || data.rashi}</td>
                    <td>${data.nakshatra} (পদ ${data.pada})</td>
                    <td>${data.longitude.toFixed(2)}°</td>
                </tr>
            `;
        }

        let dashasHtml = '';
        c.dashas.forEach(d => {
            dashasHtml += `
                <tr>
                    <td><strong>${pName[d.lord] || d.lord} মহা দশা</strong></td>
                    <td>${d.start_date}</td>
                    <td>${d.end_date}</td>
                    <td>${d.duration_years} বছৰ</td>
                </tr>
            `;
        });

        const finalHtml = `
            <!DOCTYPE html>
            <html lang="as">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>সম্পূৰ্ণ জ্যোতিষ ৰিপোৰ্ট - Jyotish Assam</title>
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
                        <h1>✨ জ্যোতিষ অসম - সম্পূৰ্ণ কুুণ্ডলী ৰিপোৰ্ট</h1>
                        <p>বৈদিক জ্যোতিষ আৰু লাহিৰী অয়নাংশ (Lahiri Ayanamsa) পদ্ধতিত প্ৰস্তুতকৃত</p>
                    </div>
                    
                    <div class="section">
                        <h2 class="section-title">👤 ১. জন্মৰ বিৱৰণ (Birth Details)</h2>
                        <p style="color: #64748b; font-size: 14px; margin-bottom: 15px;">আপুনি প্ৰদান কৰা জন্মৰ সঠিক সময় আৰু স্থানৰ ওপৰত ভিত্তি কৰি গ্ৰহগণনা কৰা হৈছে:</p>
                        <div class="info-grid">
                            <div class="info-box">
                                <div class="info-label">জন্ম তাৰিখ</div>
                                <div class="info-value">${c.birth.date}</div>
                            </div>
                            <div class="info-box">
                                <div class="info-label">জন্ম সময়</div>
                                <div class="info-value">${c.birth.time}</div>
                            </div>
                            <div class="info-box">
                                <div class="info-label">জন্ম স্থান</div>
                                <div class="info-value" style="text-transform: capitalize;">${c.birth.place}</div>
                            </div>
                        </div>
                    </div>

                    <div class="section">
                        <h2 class="section-title">🎯 ২. লগ্ন আৰু ব্যক্তিত্ব বিশ্লেষণ (Ascendant Analysis)</h2>
                        <div class="info-grid">
                            <div class="info-box">
                                <div class="info-label">জন্ম লগ্ন</div>
                                <div class="info-value">${rName[c.ascendant.rashi] || c.ascendant.rashi} লগ্ন</div>
                            </div>
                            <div class="info-box">
                                <div class="info-label">জন্ম নক্ষত্ৰ</div>
                                <div class="info-value">${c.ascendant.nakshatra} (পদ ${c.ascendant.pada})</div>
                            </div>
                            <div class="info-box">
                                <div class="info-label">অয়নাংশ</div>
                                <div class="info-value">লাহিৰী (${c.ayanamsa_value.toFixed(2)}°)</div>
                            </div>
                        </div>
                        <div class="desc-box">
                            <strong>লগ্নৰ গুত্বপূৰ্ণ ফল:</strong> আপোনাৰ জন্ম <strong>${rName[c.ascendant.rashi] || c.ascendant.rashi} লগ্নত</strong> হৈছে। বৈদিক জ্যোতিষত লগ্নই আপোনাৰ শৰীৰ, স্বভাৱ, আৰু সমগ্ৰ জীৱনৰ দিশ নিৰ্ধাৰণ কৰে। এই লগ্নৰ প্ৰভাৱে আপোনাক জীৱনৰ প্ৰতিটো ক্ষেত্ৰতে সঠিক সিদ্ধান্ত ল’বলৈ আৰু নিজৰ লক্ষ্যত অবিচল থাকিবলৈ সহায় কৰিব।
                        </div>
                    </div>
                    
                    <div class="section">
                        <h2 class="section-title">🪐 ৩. নৱগ্ৰহৰ অৱস্থান আৰু ইয়াৰ প্ৰভাৱ (Planetary Positions)</h2>
                        <p style="color: #64748b; font-size: 14px; margin-bottom: 15px;">জন্মৰ সময়ত আকাশমণ্ডলত গ্ৰহসমূহ কোনটো ৰাশি আৰু নক্ষত্ৰত অৱস্থান কৰিছিল তাৰ সম্পূৰ্ণ বিৱৰণ:</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>গ্ৰহ আৰু ইয়াৰ কাৰকতা</th>
                                    <th>ৰাশি</th>
                                    <th>নক্ষত্ৰ আৰু পদ</th>
                                    <th>ডিগ্ৰী</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${planetsHtml}
                            </tbody>
                        </table>
                    </div>

                    <div class="section">
                        <h2 class="section-title">⏳ ৪. বিংশোত্তৰী মহা দশা চক্ৰ (Vimshottari Dasha Cycle)</h2>
                        <p style="color: #64748b; font-size: 14px; margin-bottom: 15px;">বৈদিক জ্যোতিষশাস্ত্ৰৰ মতে মানুহৰ জীৱনত বিভিন্ন গ্ৰহৰ মহা দশা আহে। তলত আপোনাৰ জীৱনৰ দশাৰ কালছোৱা দেখুৱाइ হ’ল:</p>
                        <table>
                            <thead>
                                <tr>
                                    <th>মহা দশা</th>
                                    <th>আৰম্ভণি তাৰিখ</th>
                                    <th>সমাপ্তি তাৰিখ</th>
                                    <th>সময়কাল</th>
                                </tr>
                            </thead>
                            <tbody>
                                ${dashasHtml}
                            </tbody>
                        </table>
                    </div>
                    
                    <button class="print-btn" onclick="window.print()">🖨️ সম্পূৰ্ণ ৰিপোৰ্ট প্ৰিণ্ট কৰক</button>
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
