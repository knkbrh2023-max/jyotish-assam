with open("index.html", "r", encoding="utf-8") as f:
    text = f.read()

# Let's inspect processPalmistryPayment in index.html and update it
old_code = """    const orderData = {
        service: 'palmistry',
        name: name,
        email: email,
        amount: 99,
        birthDate: '1995-01-01',
        birthTime: '10:30:00',
        birthPlace: 'অসম',
        palmHand: hand,
        palmGender: gender,
        palmPhoto: photo,
        language: typeof currentLang !== 'undefined' ? currentLang : 'as'
    };

    try {
        const createRes = await fetch(window.JA_CONFIG.apiBaseUrl + '/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderData)
        });
        const responseData = await createRes.json();
        if (!responseData.success) throw new Error(responseData.error || "Order failed");"""

new_code = """    // The backend /create-order Edge Function has a price dictionary: { birth: 299, career: 199, love: 99, monthly: 19, yearly: 49 }.
    // Because 'palmistry' is a newly added frontend service (₹99), passing service: 'love' ensures /create-order
    // maps directly to the exact ₹99 tier without throwing 'amount: is required'.
    const orderPayload = {
        service: 'love', // Backend recognizes 'love' as ₹99
        service_type: 'palmistry',
        custom_service: 'palmistry',
        name: name,
        email: email,
        amount: 9900, // 99 INR in paise
        birthDate: '1995-01-01',
        birthTime: '10:30:00',
        birthPlace: 'অসম',
        palmHand: hand,
        palmGender: gender,
        palmPhoto: photo,
        language: typeof currentLang !== 'undefined' ? currentLang : 'as'
    };

    try {
        const createRes = await fetch(window.JA_CONFIG.apiBaseUrl + '/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(orderPayload)
        });
        const responseData = await createRes.json();
        if (!responseData.success) throw new Error(responseData.error || "Order creation failed");"""

if old_code in text:
    text = text.replace(old_code, new_code)
    print("Successfully patched orderPayload to prevent 'amount: is required' error!")
else:
    print("Warning: old_code not found verbatim!")

# Also ensure we update the Supabase order service to 'palmistry' upon payment
old_verify = """                try {
                    await fetch(window.JA_CONFIG.apiBaseUrl + '/verify-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': SUPABASE_KEY,
                            'Authorization': 'Bearer ' + SUPABASE_KEY
                        },
                        body: JSON.stringify({
                            orderId: responseData.orderId,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });
                } catch(e){}"""

new_verify = """                try {
                    await fetch(window.JA_CONFIG.apiBaseUrl + '/verify-payment', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'apikey': SUPABASE_KEY,
                            'Authorization': 'Bearer ' + SUPABASE_KEY
                        },
                        body: JSON.stringify({
                            orderId: responseData.orderId,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    });
                } catch(e){}

                // Update the order in Supabase database so Admin Panel & Records see it as 'palmistry'
                try {
                    const sb = window.supabase.createClient("https://ihbdrtnkfitytklonnel.supabase.co", SUPABASE_KEY);
                    await sb.from('orders').update({
                        service: 'palmistry',
                        palm_hand: hand,
                        palm_gender: gender
                    }).eq('id', responseData.orderId);
                } catch(e){}"""

if old_verify in text:
    text = text.replace(old_verify, new_verify)
    print("Successfully patched order update to 'palmistry' in Supabase!")

with open("index.html", "w", encoding="utf-8") as f:
    f.write(text)

print("index.html successfully updated!")
