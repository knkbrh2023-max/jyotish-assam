// Configuration - Added safety check
const C = window.JA_CONFIG || {};

// Global state
let selectedService = null;
let currentOrder = null;

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    if (!window.JA_CONFIG) {
        console.error("সতৰ্কবাণী: config.js ঠিকমতে load হোৱা নাই বা JA_CONFIG পোৱা নাই।");
    }
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
            if (serviceName.includes('Love') || serviceName.includes('প্রেম')) {
                serviceCode = 'love';
            } else if (serviceName.includes('Career') || serviceName.includes('ক্যারিয়ার')) {
                serviceCode = 'career';
            }
            
            selectService(serviceCode, serviceName, price, icon);
        });
    });

    const form = document.getElementById('birthDetailsForm');
    if (form) {
        form.addEventListener('submit', handleFormSubmit);
    }

    const modal = document.getElementById('serviceModal');
    if (modal) {
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                closeServiceModal();
            }
        });
    }

    const langBtns = document.querySelectorAll('.lang-btn');
    langBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            langBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            const lang = this.textContent.trim().substring(0, 2).toLowerCase();
            changeLanguage(lang);
        });
    });
}

// Select service
function selectService(serviceCode, serviceName, price, icon) {
    if (!serviceCode) {
        alert("Error: Service Code undefined হৈ আছে।");
        return;
    }
    selectedService = {
        code: serviceCode,
        name: serviceName,
        price: price,
        icon: icon
    };
    showServiceModal(serviceCode, serviceName, price);
}

// Show service modal with form
function showServiceModal(serviceCode, serviceName, price) {
    let modal = document.getElementById('serviceModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'serviceModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content">
                <span class="modal-close" onclick="closeServiceModal()">&times;</span>
                <div id="modalBody"></div>
            </div>
        `;
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
                @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            `;
            document.head.appendChild(style);
        }
    }

    const modalBody = document.getElementById('modalBody');
    const serviceNames = { birth: 'জন্ম কুণ্ডলী বিশ্লেষণ', love: 'প্রেম আৰু সম্পৰ্ক', career: 'ক্যারিয়ার বিশ্লেষণ' };
    const serviceIcons = { birth: '🔮', love: '❤️', career: '💼' };

    modalBody.innerHTML = `
        <div class="service-header">
            <div class="service-header-icon">${serviceIcons[serviceCode]}</div>
            <h2>${serviceNames[serviceCode]}</h2>
            <p>₹${price}</p>
        </div>
        <div class="error-message" id="errorMessage"></div>
        <form id="birthDetailsForm">
            <div class="form-group"><label>নাম / Name *</label><input type="text" name="name" placeholder="আপোনাৰ সম্পূৰ্ণ নাম" required></div>
            <div class="form-group"><label>ইমেইল / Email *</label><input type="email" name="email" placeholder="your@email.com" required></div>
            <div class="form-row">
                <div class="form-group"><label>জন্ম তাৰিখ / Date *</label><input type="date" name="birthDate" required></div>
                <div class="form-group"><label>জন্ম সময় / Time *</label><input type="time" name="birthTime" required></div>
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

    if (!C.apiBaseUrl) {
        showError("সতৰ্কবাণী: config.js ত apiBaseUrl নাই (undefined)।");
        return;
    }

    if (!selectedService) {
        showError('Service not selected');
        return;
    }

    const form = e.target;
    const formData = new FormData(form);

    if (!formData.get('name') || !formData.get('email') || !formData.get('birthDate') || 
        !formData.get('birthTime') || !formData.get('birthPlace')) {
        showError('সকল field fill কৰক / Fill all fields');
        return;
    }

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
                birthTime: formData.get('birthTime'),
                birthPlace: formData.get('birthPlace'),
                language: formData.get('language')
            })
        });

        if (!orderResponse.ok) {
            throw new Error('Order creation failed (Server error)');
        }

        const orderData = await orderResponse.json();

        if (!orderData.success) {
            throw new Error(orderData.error || 'Order creation failed');
        }

        if (!orderData.razorpayOrderId) {
            showError("Backend-ৰ পৰা razorpayOrderId অহা নাই (undefined)।");
            showLoading(false);
            return;
        }

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
    if (!C.razorpayKeyId) {
        showError("config.js ত Razorpay Key নাই (undefined)।");
        return;
    }

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
        prefill: {
            name: currentOrder.name,
            email: currentOrder.email
        },
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
    if (!orderId) {
        showError("Backend-ৰ পৰা orderId অহা নাই (undefined)।");
        showLoading(false);
        return;
    }

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

// Generate report (Updated with new Edge Function API)
async function generateReport(orderId, language) {
    try {
        const loadingText = document.querySelector('#loadingDiv p');
        if (loadingText) loadingText.innerText = "আপোনাৰ ৰিপোৰ্ট প্ৰস্তুত কৰা হৈছে... অনুগ্ৰহ কৰি অপেক্ষা কৰক";

        const reportResponse = await fetch("https://ihbdrtnkfitytklonnel.supabase.co/functions/v1/calculate-chart", {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ orderId: orderId })
        });

        const result = await reportResponse.json();

        if (!result.success) {
            showError('ৰিপোৰ্ট বনোৱাত সমস্যা হৈছে: ' + result.error);
            showLoading(false);
            return;
        }

        console.log("SUCCESS! Chart Data:", result.chart);
        
        const debugHtml = `
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>আপোনাৰ জ্যোতিষ ৰিপোৰ্ট</title>
                <style>
                    body { font-family: sans-serif; padding: 20px; background: #f8fafc; }
                    .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
                    pre { background: #1e293b; color: #00ff00; padding: 15px; border-radius: 8px; overflow-x: auto; }
                </style>
            </head>
            <body>
                <div class="container">
                    <h2 style="color: #8B5CF6;">✨ ৰিপোৰ্ট সফলতাৰে বনোৱা হৈছে!</h2>
                    <p>আপোনাৰ গ্ৰহ, ৰাশি, লগ্ন আৰু দশাৰ সকলো হিচাপ সম্পূৰ্ণ হৈছে। বৰ্তমান Raw Data তলত দিয়া হৈছে:</p>
                    <pre>${JSON.stringify(result.chart, null, 2)}</pre>
                    <p style="color: #64748b; margin-top: 20px;">(পৰৱৰ্তী Step-ত আমি এই ডাটাখিনি ধুনীয়া ডিজাইনত দেখুৱাম)</p>
                </div>
            </body>
            </html>
        `;

        displayReport(debugHtml);
        showLoading(false);
        closeServiceModal();

    } catch (error) {
        console.error('Report generation error:', error);
        showError('ইণ্টাৰনেটৰ সমস্যা বা চাৰ্ভাৰত সংযোগ হোৱা নাই।');
        showLoading(false);
    }
}

function displayReport(reportHtml) {
    const reportWindow = window.open('', '_blank');
    if(reportWindow) {
        reportWindow.document.write(reportHtml);
        reportWindow.document.close();
    } else {
        showError("আপোনাৰ ব্ৰাউজাৰে Pop-up block কৰিছে। অনুগ্ৰহ কৰি Pop-up allow কৰক।");
    }
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
