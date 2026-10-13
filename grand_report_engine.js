function generatePalmistryReportHtml(order) {
    const name = order.name || 'গ্ৰাহক';
    const dob = order.birth_date || order.birthDate || 'N/A';
    const tob = order.birth_time || order.birthTime || '10:30';
    const place = order.birth_place || order.birthPlace || 'অসম';
    const hand = order.palmHand || 'right';
    const gender = order.palmGender || 'male';
    const photo = order.palmPhoto || (typeof localStorage !== 'undefined' ? localStorage.getItem('ja_palm_photo_' + (order.public_order_id || order.id)) : null) || null;

    const handAsMap = { 'right': 'সোঁহাত (Right Hand)', 'left': 'বাওঁহাত (Left Hand)' };
    const handName = handAsMap[hand] || 'সোঁহাত (Right Hand)';
    
    const genderAsMap = { 'male': 'পুৰুষ (Male)', 'female': 'মহিলা (Female)', 'other': 'অন্যান্য' };
    const genderName = genderAsMap[gender] || 'পুৰুষ (Male)';

    const toAsDigits = (num) => String(num).replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);

    let clientAge = 28;
    let bYear = 1996;
    if (dob && dob !== 'N/A') {
        const bDate = new Date(dob);
        if (!isNaN(bDate.getTime())) {
            const today = new Date();
            let ageDiff = today.getFullYear() - bDate.getFullYear();
            const mDiff = today.getMonth() - bDate.getMonth();
            if (mDiff < 0 || (mDiff === 0 && today.getDate() < bDate.getDate())) ageDiff--;
            clientAge = Math.max(0, ageDiff);
            bYear = bDate.getFullYear();
        }
    }

    const elements = [
        {
            type: "বায়ু হস্ত (Air Hand - বৰ্গাকাৰ তলুৱা, দীঘলীয়া আঙুলি)",
            nature: "আপোনাৰ হাতৰ গঠন বায়ু তত্ত্বৰ অন্তৰ্গত। ই তীব্ৰ বৌদ্ধিক ক্ষমতা, সূক্ষ্ম বিশ্লেষণ আৰু যোগাযোগৰ পাৰদৰ্শিতা সূচায়।",
            traits: "আপুনি স্পষ্টবাদী, যুক্তিপূৰ্ণ কথা কোৱা আৰু মানসিকভাৱে অত্যন্ত সক্ৰিয় ব্যক্তি। শাৰীৰিক শ্ৰমতকৈ বুদ্ধি আৰু চিন্তাশীল কামত আপুনি সৰ্বাধিক উন্নতি কৰিব পাৰিব।",
            bestFields: "তথ্য-প্ৰযুক্তি (IT), প্ৰশাসন, লেখা-মেলা, শিক্ষকতা, ব্যৱসায়িক পৰামৰ্শদাতা বা বাণিজ্য।"
        },
        {
            type: "পৃথিৱী হস্ত (Earth Hand - বৰ্গাকাৰ তলুৱা, স্থিৰ গঠন)",
            nature: "আপোনাৰ হাতৰ গঠন পৃথিৱী তত্ত্বৰ অন্তৰ্গত। ই ব্যৱহাৰিক চিন্তা, কঠোৰ পৰিশ্ৰম আৰু স্থিৰতাক প্ৰতিনিধিত্ব কৰে।",
            traits: "আপুনি বাস্তৱবাদী, শান্তিপ্ৰিয় আৰু যিকোনো কাম হাতত ল'লে শেষ নকৰাকৈ এৰি নিদিয়া ব্যক্তি। পৰিয়ালৰ প্ৰতি দায়বদ্ধতা আৰু ধন সঞ্চয়ৰ ক্ষমতা আপোনাৰ স্বভাৱজাত গুণ।",
            bestFields: "বেংকিং, ফাইনেন্স, নিৰ্মাণ কাৰ্য (Construction), কৃষিভিত্তিক উদ্যোগ, প্ৰশাসন বা নিজা ব্যৱসায়।"
        },
        {
            type: "অগ্নি হস্ত (Fire Hand - দীঘলীয়া তলুৱা, চুটি শক্তিশালী আঙুলি)",
            nature: "আপোনাৰ হাতৰ গঠন অগ্নি তত্ত্বৰ অন্তৰ্গত। ই অদম্য সাহস, নেতৃত্বপ্ৰদানকাৰী শক্তি আৰু উদ্যমক নিৰ্দেশ কৰে।",
            traits: "আপুনি স্বাধীনচেতা, নতুন প্ৰত্যাহ্বান ল'বলৈ ভাল পোৱা আৰু ক্ষিপ্ৰ সিদ্ধান্ত ল'ব পৰা ব্যক্তি। আনৰ তলত কাম কৰাতকৈ নিজৰ পৰিকল্পনাৰে আগবাঢ়িলে আপোনাৰ প্ৰতিভা সৰ্বাধিক জিলিকি উঠিব।",
            bestFields: "প্ৰতিৰক্ষা, পুলিচ, ৰাজনীতি, পৰিচালনা (Management), ঠিকাদাৰী বা নিজা উদ্যোগ।"
        },
        {
            type: "জল হস্ত (Water Hand - দীঘলীয়া তলুৱা, দীঘল মাৰ্জিত আঙুলি)",
            nature: "আপোনাৰ হাতৰ গঠন জল তত্ত্বৰ অন্তৰ্গত। ই সংবেদনশীলতা, সৃজনশীল কল্পনা আৰু গভীৰ অন্তৰ্দৃষ্টিৰ প্ৰতীক।",
            traits: "আপুনি অত্যন্ত মৰমিয়াল, যত্নশীল আৰু আনৰ মনৰ ভাব সহজে বুজিব পৰা ব্যক্তি। কলা, সংগীত, সাহিত্য বা পৰামৰ্শমূলক কামত আপোনাৰ অন্তৰ্দৃষ্টিয়ে অনন্য সফলতা কঢ়িয়াই আনিব।",
            bestFields: "চিকিৎসা, নাৰ্ছিং, মানৱ সম্পদ (HR), কলা-ডিজাইনিং, সমাজসেৱা বা খাদ্য-পানীয়ৰ ব্যৱসায়।"
        }
    ];

    const elemIdx = (bYear + (dob.length || 0)) % 4;
    const elem = elements[elemIdx];

    let firstRiseAge = 24;
    let bigPeakAge = 32;
    let wealthPeakAge = 40;
    let firstRiseYear = bYear + firstRiseAge;
    let bigPeakYear = bYear + bigPeakAge;
    let wealthPeakYear = bYear + wealthPeakAge;

    const photoHtml = photo 
        ? `<div style="text-align: center; margin: 20px 0;">
                <img src="${photo}" alt="Customer Palm Photo" style="max-width: 260px; max-height: 320px; border-radius: 10px; border: 4px solid #8b0000; box-shadow: 0 8px 20px rgba(0,0,0,0.25);">
                <div style="font-size: 13px; color: #5c3a21; margin-top: 8px; font-weight: bold;">[ আপোনাৰ আপলোড কৰা হস্ততলৰ চিত্ৰ • সমুদ্ৰিক স্কেন সম্পূৰ্ণ ]</div>
           </div>`
        : `<div style="text-align: center; margin: 20px 0;">
                <svg viewBox="0 0 260 300" width="230" height="270" style="background: #fdf5e6; border: 3px solid #8b0000; border-radius: 12px; margin: 0 auto; display: block;">
                    <path d="M 60 170 C 60 110, 70 80, 85 45 C 90 35, 100 35, 103 50 L 110 110 L 115 30 C 120 20, 130 20, 133 35 L 140 110 L 148 40 C 153 30, 163 30, 165 45 L 170 120 L 178 70 C 183 60, 193 60, 195 75 C 200 110, 205 160, 205 190 C 205 240, 185 275, 140 285 C 95 285, 60 250, 60 170 Z" fill="#faeed9" stroke="#8b0000" stroke-width="2.5"/>
                    <path d="M 60 170 C 50 140, 30 135, 25 150 C 20 170, 45 210, 75 240" fill="#faeed9" stroke="#8b0000" stroke-width="2.5"/>
                    <path d="M 50 155 Q 85 180 95 245" fill="none" stroke="#dc2626" stroke-width="2.5"/>
                    <text x="45" y="215" font-size="10" font-weight="bold" fill="#dc2626">জীৱন ৰেখা</text>
                    <path d="M 50 155 Q 120 170 175 195" fill="none" stroke="#2563eb" stroke-width="2.5"/>
                    <text x="130" y="175" font-size="10" font-weight="bold" fill="#2563eb">মস্তিষ্ক ৰেখা</text>
                    <path d="M 195 130 Q 140 125 105 105" fill="none" stroke="#ec4899" stroke-width="2.5"/>
                    <text x="135" y="115" font-size="10" font-weight="bold" fill="#ec4899">হৃদয় ৰেখা</text>
                    <path d="M 135 270 L 135 110" fill="none" stroke="#7c3aed" stroke-width="2.5"/>
                    <text x="140" y="210" font-size="10" font-weight="bold" fill="#7c3aed">ভাগ্য ৰেখা</text>
                </svg>
                <div style="font-size: 13px; color: #5c3a21; margin-top: 8px; font-weight: bold;">[ বৈদিক সমুদ্ৰিক হস্তৰেখা মানচিত্ৰ • মুখ্য ৰেখা আৰু পৰ্বতৰ অৱস্থান ]</div>
           </div>`;

    return `
    <!DOCTYPE html>
    <html lang="as">
    <head>
        <meta charset="UTF-8">
        <title>${name} - হস্তৰেখা বিশদ বিচাৰ</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Assamese:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Noto Sans Assamese', Georgia, serif; line-height: 1.8; color: #3e2723; background: #e8dcc4; margin: 0; padding: 20px; }
            .page { max-width: 850px; margin: 0 auto 30px; background: #fdf5e6; padding: 50px 45px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border: 8px double #8b0000; position: relative; box-sizing: border-box; }
            .page::before { content: ''; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; border: 2px solid #8b0000; pointer-events: none; }
            .cover { text-align: center; display: flex; flex-direction: column; justify-content: center; min-height: 80vh; }
            .om-symbol { font-size: 80px; color: #8b0000; margin-bottom: 20px; }
            .cover-brand { font-size: 45px; font-weight: 700; color: #5c3a21; margin-bottom: 10px; border-bottom: 2px solid #8b0000; display: inline-block; padding-bottom: 10px;}
            .cover-subtitle { font-size: 24px; color: #8b0000; margin-bottom: 40px; font-weight: 600; }
            .cover-details { margin-top: 40px; text-align: left; background: rgba(219, 190, 146, 0.2); padding: 30px; border: 1px solid #c9a961; border-radius: 4px; }
            .detail-row { font-size: 18px; margin-bottom: 12px; border-bottom: 1px dashed #c9a961; padding-bottom: 5px; }
            .detail-label { font-weight: 600; color: #8b0000; display: inline-block; width: 170px; }
            .section-title { font-size: 25px; font-weight: 700; color: #8b0000; text-align: center; margin-bottom: 25px; border-bottom: 2px solid #8b0000; padding-bottom: 10px; }
            .sub-heading { font-size: 19px; color: #5c3a21; margin-top: 25px; margin-bottom: 12px; border-left: 4px solid #8b0000; padding-left: 10px; font-weight: bold;}
            .shloka { text-align: center; font-size: 17px; color: #8b0000; font-style: italic; margin: 15px 0 25px; padding: 12px; background: rgba(139,0,0,0.05); border-radius: 5px; }
            .text-section { font-size: 15.5px; margin-bottom: 18px; text-align: justify; }
            .info-card { background: rgba(219, 190, 146, 0.15); border: 1px solid #d4b483; border-left: 5px solid #8b0000; padding: 18px; margin: 14px 0; border-radius: 3px; }
            .remedy-card { border-left-color: #5c3a21; background: rgba(92, 58, 33, 0.05); }
            .card-title { font-weight: 700; color: #8b0000; margin-bottom: 8px; font-size: 17px; }
            .card-content { font-size: 15.5px; color: #3e2723; text-align: justify; line-height: 1.7; }
            .disclaimer { background: rgba(139, 0, 0, 0.05); padding: 15px; margin-top: 35px; font-size: 13.5px; border: 1px solid #8b0000; text-align: justify; }
            .footer-seal { text-align: center; margin-top: 35px; color: #8b0000; font-size: 17px; font-weight: bold; border-top: 2px dashed #8b0000; padding-top: 15px; }
            .print-btn-wrapper { text-align: center; margin-top: 15px; padding-bottom: 30px; }
            .print-btn { background: #8b0000; color: #fdf5e6; border: 2px solid #5c3a21; padding: 12px 30px; font-size: 17px; cursor: pointer; font-weight: bold; border-radius: 6px; }
            ul { margin: 8px 0 8px 18px; }
            li { margin-bottom: 6px; }
            @media print {
                @page { margin: 8mm; }
                body { background: #fdf5e6; padding: 0; }
                .page { box-shadow: none; margin: 0; border: 4px double #8b0000; width: 100%; max-width: 100%; }
                .page-break { page-break-after: always; }
                .print-btn-wrapper, .no-print { display: none !important; }
            }
        </style>
    </head>
    <body>
        <div class="print-btn-wrapper no-print">
            <button class="print-btn" onclick="window.print()">📥 হস্তৰেখা ৰিপোৰ্ট প্ৰিন্ট বা PDF ছেভ কৰক</button>
        </div>

        <!-- PAGE 1: COVER -->
        <div class="page page-break cover">
            <div class="om-symbol">ॐ</div>
            <div><h1 class="cover-brand">জ্যোতিষ অসম</h1></div>
            <div class="cover-subtitle">হস্তৰেখা বিশদ বিচাৰ (Palmistry Reading)</div>
            <div style="color: #5c3a21; letter-spacing: 2px; font-size: 16px; margin-bottom: 20px;">
                সমুদ্ৰিক শাস্ত্ৰ • আয়ুস • বুদ্ধি • প্ৰেম • ভাগ্য • কৰ্মফল
            </div>
            <div class="cover-details">
                <div class="detail-row"><span class="detail-label">গ্ৰাহকৰ নাম:</span> ${name}</div>
                <div class="detail-row"><span class="detail-label">জন্ম তাৰিখ / বয়স:</span> ${dob} (বয়স প্ৰায় ${toAsDigits(clientAge)} বছৰ)</div>
                <div class="detail-row"><span class="detail-label">প্ৰধান হাত:</span> ${handName} (${hand === 'right' ? 'কৰ্ম আৰু বৰ্তমান ফল' : 'জন্মগত প্ৰতিভা আৰু আভ্যন্তৰীণ স্বভাৱ'})</div>
                <div class="detail-row"><span class="detail-label">লিংগ:</span> ${genderName}</div>
                <div class="detail-row"><span class="detail-label">জন্ম স্থান:</span> ${place}</div>
                <div class="detail-row"><span class="detail-label">সেৱাৰ প্ৰকাৰ:</span> হস্তৰেখা বিশদ বিচাৰ (Palmistry Reading)</div>
            </div>
        </div>

        <!-- PAGE 2: HAND SHAPE & ELEMENT -->
        <div class="page page-break">
            <h2 class="section-title">❁ হস্তাকাৰ, পঞ্চ মহাভূত আৰু প্ৰাথমিক বিচাৰ ❁</h2>
            <div class="shloka">"কৰাগ্ৰে বসতে লক্ষ্মীঃ কৰমধ্যে সৰস্বতী।<br>কৰমূলে তু গোবিন্দঃ প্ৰভাতে কৰদৰ্শনম্॥"</div>
            <div class="text-section">
                বৈদিক সমুদ্ৰিক শাস্ত্ৰ অনুসৰি আমাৰ হাতৰ তলুৱা আৰু আঙুলিসমূহ হৈছে মস্তিষ্কৰ স্নায়ুতন্ত্ৰ আৰু কৰ্মফলৰ প্ৰত্যক্ষ প্ৰতিফলন। জন্ম কুণ্ডলীৰ সময় নথকা অৱস্থাতো হাতৰ ৰেখা আৰু গ্ৰহৰ পৰ্বতসমূহে ব্যক্তিৰ জীৱনৰ হুবহু সত্য প্ৰকাশ কৰে।
            </div>

            <div class="sub-heading">১. হস্তাকাৰ আৰু পঞ্চ মহাভূত তত্ত্ব (Hand Elemental Shape)</div>
            <div class="info-card">
                <div class="card-title">${elem.type}</div>
                <div class="card-content">
                    • <strong>মূল প্ৰকৃতি:</strong> ${elem.nature}<br><br>
                    • <strong>ব্যক্তিত্ব আৰু চিন্তাধাৰা:</strong> ${elem.traits}<br><br>
                    • <strong>সৰ্বাধিক অনুকূল কৰ্মক্ষেত্ৰ:</strong> ${elem.bestFields}
                </div>
            </div>

            <div class="sub-heading">২. বুঢ়া আঙুলিৰ বিশ্লেষণ (Significance of the Thumb)</div>
            <div class="info-card">
                <div class="card-content">
                    সমুদ্ৰিক শাস্ত্ৰত বুঢ়া আঙুলিক <strong>"মনৰ ইচ্ছাশক্তিৰ দাপোন"</strong> বোলা হয়। আপোনাৰ বুঢ়া আঙুলিৰ প্ৰথম পৰ্বই (First Phalanx) সুদৃঢ় ইচ্ছাশক্তি আৰু দ্বিতীয় পৰ্বই গভীৰ যুক্তি-তৰ্কৰ ক্ষমতা সূচায়। আপুনি যিকোনো কামত সহজে প্ৰলোভিত নহৈ নিজৰ যুক্তিত অটল থাকে, যিয়ে আপোনাক জীৱনৰ বহু বিপদৰ পৰা ৰক্ষা কৰিব।
                </div>
            </div>

            ${photoHtml}
        </div>

        <!-- PAGE 3: THREE MAJOR LINES -->
        <div class="page page-break">
            <h2 class="section-title">❁ প্ৰধান ত্ৰি-ৰেখাৰ বিস্তৃত বিশ্লেষণ ❁</h2>
            
            <div class="sub-heading">১. জীৱন ৰেখা (Life Line / আয়ুস আৰু প্ৰাণশক্তি)</div>
            <div class="info-card">
                <div class="card-content">
                    জীৱন ৰেখাই শুক্ৰ পৰ্বতক সুন্দৰভাৱে আৱৰি ধৰিছে, যিয়ে এক <strong>সুদৃঢ় প্ৰাণশক্তি (Strong Vitality)</strong> আৰু সুস্বাস্থ্যক নিৰ্দেশ কৰে।<br><br>
                    • <strong>স্বাস্থ্য আৰু ৰোগ প্ৰতিৰোধ:</strong> আপোনাৰ শৰীৰত ৰোগ প্ৰতিৰোধ ক্ষমতা আৰু পুনৰুজ্জীৱিত হোৱাৰ শক্তি প্ৰৱল। ঋতু পৰিৱৰ্তনৰ সময়ত সাধাৰণ দুৰ্বলতা আহিব পাৰে যদিও দীৰ্ঘম্যাদীভাৱে আপোনাৰ আয়ুস সুৰক্ষিত।<br>
                    • <strong>বাসস্থান আৰু পৰিৱৰ্তন:</strong> জীৱন ৰেখাৰ পৰা ওলোৱা সৰু সৰু উৰ্ধ্বগামী শাখাসমূহে সূচায় যে নিজৰ জন্মস্থানৰ পৰা কিছু দূৰলৈ গৈ বা অন্য ঠাইত কৰ্মসূত্ৰে থাকিলে আপোনাৰ উন্নতিৰ গতি অধিক ক্ষিপ্ৰ হ'ব।
                </div>
            </div>

            <div class="sub-heading">২. মস্তিষ্ক ৰেখা (Head Line / মেধা আৰু সিদ্ধান্ত ক্ষমতা)</div>
            <div class="info-card">
                <div class="card-content">
                    আপোনাৰ মস্তিষ্ক ৰেখা স্পষ্ট, গভীৰ আৰু চন্দ্ৰ পৰ্বতৰ দিশে সামান্য ঢাল খোৱা।<br><br>
                    • <strong>বৌদ্ধিক চাতুৰ্য:</strong> ই বাস্তৱবাদী চিন্তা আৰু সৃজনশীল কল্পনাশক্তিৰ সুন্দৰ সংমিশ্ৰণক সূচায়। আপুনি জটিল সমস্যাৰ সমাধান অতি সহজে আৰু শান্ত মগজুৰে উলিয়াব পাৰে।<br>
                    • <strong>মানসিক স্থিৰতা:</strong> জীৱনৰ সংকটকালতো ধৈৰ্য নেহেৰুৱাই সঠিক সিদ্ধান্ত লোৱাৰ ক্ষমতা আপোনাৰ আছে। হিচাপ-নিকাচ, পৰিকল্পনা আৰু কৌশল নিৰ্ধাৰণত আপোনাৰ মেধা বিশেষভাৱে প্রশংসনীয়।
                </div>
            </div>

            <div class="sub-heading">৩. হৃদয় ৰেখা (Heart Line / প্ৰেম, সংগী আৰু আৱেগ)</div>
            <div class="info-card">
                <div class="card-content">
                    আপোনাৰ হৃদয় ৰেখা বৃহস্পতি পৰ্বতৰ (গুৰু পৰ্বতৰ) দিশে আগবাঢ়িছে, যিটো সমুদ্ৰিক শাস্ত্ৰত এক অতিশয় শুভ আৰু আদৰ্শবাদী লক্ষণ বুলি গণ্য কৰা হয়।<br><br>
                    • <strong>প্ৰেম আৰু সমৰ্পণ:</strong> আপুনি সম্পৰ্কত ১০০% বিশ্বাস আৰু সততাত বিশ্বাসী। সংগীৰ সুখ আৰু সন্মান আপোনাৰ বাবে প্ৰথম অগ্ৰাধিকাৰ।<br>
                    • <strong>দাম্পত্য বুজাবুজি:</strong> বিবাহৰ পিছত সংগীৰ আগমনৰ ফলত আপোনাৰ জীৱনত আৰ্থিক আৰু পাৰিবাৰিক স্থিৰতা বৃদ্ধি পাব। সাময়িক আৱেগিক ভুল বুজাবুজি হ'লেও, পাৰস্পৰিক বিশ্বাসে সম্পৰ্ক আজীৱন সুদৃঢ় কৰি ৰাখিব।
                </div>
            </div>
        </div>

        <!-- PAGE 4: FATE LINE & WEALTH -->
        <div class="page page-break">
            <h2 class="section-title">❁ ভাগ্য ৰেখা, কৰ্মজীৱন আৰু আৰ্থিক সমৃদ্ধি ❁</h2>

            <div class="sub-heading">৪. ভাগ্য ৰেখা (Fate Line / শনি ৰেখা - Career & Success)</div>
            <div class="info-card">
                <div class="card-content">
                    সমুদ্ৰিক শাস্ত্ৰ অনুসৰি ভাগ্য ৰেখাই ব্যক্তিৰ জীৱনৰ কৰ্মক্ষেত্ৰ, আৰ্থিক উত্থান আৰু সমাজত প্ৰতিপত্তিক প্ৰতিনিধিত্ব কৰে। আপোনাৰ হাতত ভাগ্য ৰেখা স্পষ্ট আৰু শনি পৰ্বতৰ দিশে গতি কৰিছে।<br><br>
                    • <strong>চাকৰি নে নিজা ব্যৱসায়:</strong> আপোনাৰ হাতৰ ভাগ্য ৰেখা আৰু বুধ পৰ্বতৰ স্থিতিয়ে সূচায় যে চাকৰিৰ সমান্তৰালকৈ বা স্বতন্ত্ৰভাৱে নিজা ব্যৱসায়/উদ্যোগ গঢ়ি তোলাৰ যোগ অত্যন্ত প্ৰৱল। আনৰ অধীনত সাধাৰণ কাম কৰাতকৈ দায়িত্বশীল পদবীত থাকিলে আপুনি দ্ৰুত উন্নতি কৰিব।<br>
                    • <strong>একাধিক উৎসৰ পৰা ধনলাভ:</strong> ভাগ্য ৰেখাৰ সমান্তৰালভাৱে থকা সহযোগী ৰেখাই একাধিক পথৰ পৰা (Secondary Income) স্থিৰ আয় হোৱাৰ শুভ ইংগিত দিয়ে।
                </div>
            </div>

            <div class="sub-heading">৫. চন আৰু বয়সভিত্তিক ভাগ্যোদয়ৰ নিৰ্দিষ্ট ৰোডমেপ</div>
            <div class="info-card">
                <div class="card-content">
                    হস্তৰেখাৰ গাণিতিক বিভাগ অনুসৰি আপোনাৰ জীৱনৰ গুৰুত্বপূৰ্ণ সাফল্য আৰু সোণালী সময়সীমা:<br><br>
                    • <strong>প্ৰথম আৰম্ভণি আৰু স্থিৰতা (বয়স ২৩–২৫ বছৰ / প্ৰায় ${toAsDigits(firstRiseYear)} চন):</strong><br>
                    নিজৰ ভৰিত থিয় হোৱা, প্ৰথম গুৰুত্বপূৰ্ণ উপাৰ্জন বা পেছাদাৰী জীৱনৰ আৰম্ভণি। এই সময়ছোৱাত আত্মবিশ্বাসৰ ভেটি গঢ় লৈ উঠে।<br><br>
                    • <strong>ডাঙৰ সাফল্য আৰু স্থান পৰিৱৰ্তন (বয়স ৩২–৩৫ বছৰ / প্ৰায় ${toAsDigits(bigPeakYear)} চন):</strong><br>
                    ভাগ্য ৰেখা আৰু মস্তিষ্ক ৰেখাৰ সংযোগস্থল অনুসৰি এই বয়সছোৱাত কেৰিয়াৰত এক ডাঙৰ ইতিবাচক উত্থান, পদোন্নতি বা ব্যৱসায়ৰ ব্যাপক সম্প্ৰসাৰণ ঘটিব। সমাজত এক প্ৰতিষ্ঠিত মৰ্যাদা লাভ হ'ব।<br><br>
                    • <strong>সৰ্বোচ্চ সম্পত্তি আৰু সমৃদ্ধিৰ সোণালী সময় (বয়স ৪০+ বছৰ / প্ৰায় ${toAsDigits(wealthPeakYear)} চনৰ পৰা):</strong><br>
                    স্থায়ী মাটি-বাৰী, বাহন আৰু নিৰাপদ সঞ্চয়ৰ চূড়ান্ত স্থিতি। এই সময়ত পূৰ্বৰ পৰিশ্ৰমৰ সম্পূৰ্ণ ফল ভোগ কৰিব পাৰিব।
                </div>
            </div>

            <div class="sub-heading">৬. সূৰ্য ৰেখা (Sun Line / খ্যাতি, যশ আৰু মান-সন্মান)</div>
            <div class="info-card">
                <div class="card-content">
                    অনামিকা আঙুলিৰ তলত অৱস্থিত সূৰ্য ৰেখাই আপোনাৰ সৃজনশীল প্ৰতিভা, চৰকাৰী সন্মান আৰু সমাজত সন্মানজনক পৰিচয় লাভৰ সম্ভাৱনাক দুগুণ বৃদ্ধি কৰিছে। কৰ্মস্থলীত বৰিষ্ঠ বিষয়া আৰু সমাজৰ উচ্চস্তৰীয় ব্যক্তিৰ সান্নিধ্য লাভ কৰিব।
                </div>
            </div>
        </div>

        <!-- PAGE 5: MOUNTS & AUSPICIOUS SIGNS -->
        <div class="page page-break">
            <h2 class="section-title">❁ গ্ৰহৰ পৰ্বত বিচাৰ আৰু বিশেষ শুভ চিহ্ন ❁</h2>
            
            <div class="sub-heading">৭. সমুদ্ৰিক গ্ৰহ পৰ্বতসমূহৰ অৱস্থান আৰু ফলাফল (Palm Mounts)</div>
            <div class="info-card">
                <div class="card-content">
                    • <strong>বৃহস্পতি পৰ্বত (Jupiter Mount - তৰ্জনী আঙুলিৰ তলত):</strong> সুউচ্চ আৰু পুষ্ট। ই জ্ঞান, নেতৃত্ব, উদাৰতা আৰু ধৰ্মীয় নিষ্ঠা প্ৰদান কৰে। সমাজত আপোনাৰ কথাৰ ওজন থাকিব।<br><br>
                    • <strong>শনি পৰ্বত (Saturn Mount - মাজু আঙুলিৰ তলত):</strong> সুষম আৰু স্থিৰ। ই কৰ্তব্যনিষ্ঠা, ধৈৰ্য আৰু গভীৰ অনুসন্ধানমূলক চিন্তাক উৎসাহিত কৰে।<br><br>
                    • <strong>সূৰ্য পৰ্বত (Sun Mount - অনামিকা আঙুলিৰ তলত):</strong> উজ্জ্বল। কলা, সৌন্দৰ্য আৰু সামাজিক প্ৰশংসা লাভৰ কাৰক।<br><br>
                    • <strong>বুধ পৰ্বত (Mercury Mount - কনিষ্ঠা আঙুলিৰ তলত):</strong> শক্তিশালী। উন্নত ব্যৱসায়িক বুদ্ধি, বাগ্মিতা আৰু বিত্তীয় হিচাপ-নিকাচত বিশেষ পাৰদৰ্শিতা সূচায়।<br><br>
                    • <strong>শুক্ৰ পৰ্বত (Venus Mount - বুঢ়া আঙুলিৰ তলত):</strong> মাংসল আৰু বহল। জীৱনত ভোগ-বিলাস, বাহন, সুন্দৰ বস্ত্ৰ আৰু দাম্পত্য সুখৰ স্থায়িত্ব দিয়ে।<br><br>
                    • <strong>চন্দ্ৰ পৰ্বত (Moon Mount - হাতৰ তলৰ অংশত):</strong> শুভ। উচ্চ কল্পনাশক্তি, ভ্ৰমণপ্ৰিয়তা আৰু মানসিক সংবেদনশীলতা প্ৰদান কৰে।
                </div>
            </div>

            <div class="sub-heading">৮. হস্ততলৰ বিশেষ শুভ চিহ্ন (Auspicious Signs)</div>
            <div class="info-card">
                <div class="card-content">
                    • <strong>মৎস্য চিহ্ন বা ত্ৰিকোণ (Fish / Triangle Sign):</strong> কেতু বা চন্দ্ৰ পৰ্বতৰ ওচৰত ত্ৰিকোণ সদৃশ গঠন থকাৰ বাবে জীৱনত আকস্মিক ধনলাভ আৰু আধ্যাত্মিক সাধনাৰ শুভ যোগ আছে।<br><br>
                    • <strong>ৰক্ষা চতুষ্কোণ (Protection Square):</strong> মস্তিষ্ক ৰেখা বা জীৱন ৰেখাৰ ওচৰৰ চতুষ্কোণ চিহ্নে জীৱনৰ ডাঙৰ দুৰ্ঘটনা, আৰ্থিক সংকট বা অপযশৰ পৰা আপোনাক ঈশ্বৰীয় কৃপাত ৰক্ষা কৰিব।
                </div>
            </div>
        </div>

        <!-- PAGE 6: REMEDIES & SEAL -->
        <div class="page">
            <h2 class="section-title">❁ হস্তৰেখা আধাৰিত বৈদিক নিদান আৰু প্ৰতিকাৰ ❁</h2>
            <div class="text-section">
                হাতৰ ৰেখাসমূহ আমাৰ চিন্তা আৰু কৰ্মৰ ওপৰত নিৰ্ভৰ কৰি সময়ৰ লগে লগে সামান্য ৰূপান্তৰিত হয়। শুভ ৰেখাক বলীয়ান কৰিবলৈ আৰু দুৰ্বল পৰ্বতক শক্তিশালী কৰিবলৈ তলৰ বৈদিক নিয়মসমূহ পালন কৰক:
            </div>

            <div class="info-card remedy-card">
                <div class="card-title">💎 আঙুলি অনুসৰি শুভ ৰত্ন আৰু ধাতু (Gemstone Guide)</div>
                <div class="card-content">
                    • <strong>বৃহস্পতি আৰু জ্ঞান বৃদ্ধিৰ বাবে:</strong> তৰ্জনী আঙুলিত সোণৰ আঙঠিত হালধীয়া পোখৰাজ (Yellow Sapphire) বা পীত ওপাল ধাৰণ কৰিব পাৰে।<br>
                    • <strong>বুধ আৰু ব্যৱসায়িক উন্নতিৰ বাবে:</strong> কনিষ্ঠা আঙুলিত ৰূপ বা সোণত পান্না (Emerald) বা সেউজীয়া গোমেদ ধাৰণ কৰিলে বাকশক্তি আৰু আৰ্থিক সঞ্চয় বৃদ্ধি পায়।<br>
                    • <strong>সৌভাগ্য আৰু স্বাস্থ্যৰ বাবে:</strong> অনামিকা আঙুলিত সোণ বা তামৰ ধাতুৰে ৰঙা প্ৰৱাল বা মাণিক্য পৰিধান কৰাটো অত্যন্ত শুভ।
                </div>
            </div>

            <div class="info-card remedy-card">
                <div class="card-title">🕉️ প্ৰাত্যহিক আধ্যাত্মিক সাধনা আৰু হস্ত শক্তি বৃদ্ধি</div>
                <div class="card-content">
                    <ul>
                        <li><strong>প্ৰাতঃ কৰদৰ্শন সাধনা:</strong> প্ৰতিদিনে পুৱা টোপনিৰ পৰা উঠি দুয়োখন হাতৰ তলুৱা মুখৰ আগত মেলি ধৰি <em>"কৰাগ্ৰে বসতে লক্ষ্মীঃ..."</em> মন্ত্ৰ পাঠ কৰি তলুৱাত মুখ স্পৰ্শ কৰক। ই হস্তৰেখাৰ দুৰ্বল দোষ খণ্ডন কৰে।</li>
                        <li><strong>সূৰ্য অৰ্ঘ্য প্ৰদান:</strong> পুৱা তামৰ পাত্ৰত পানী লৈ সূৰ্য্য দেৱতাক অৰ্পণ কৰিলে হাতৰ সূৰ্য ৰেখা আৰু বুধ পৰ্বত অত্যন্ত শক্তিশালী হৈ পৰে।</li>
                        <li><strong>দান আৰু পুণ্য কৰ্ম:</strong> প্ৰতি বৃহস্পতিবাৰে বা শনিবাৰে অসহায়জনক সাধ্যানুসৰি খাদ্য বা বস্ত্ৰ দান কৰিলে শনি পৰ্বতৰ ভাগ্য ৰেখা বাধামুক্ত হয়।</li>
                    </ul>
                </div>
            </div>

            <div class="disclaimer">
                <strong>⚠️ অস্বীকাৰকৰণ (Disclaimer):</strong><br>
                এই ৰিপোৰ্টখন প্ৰাচীন বৈদিক সমুদ্ৰিক শাস্ত্ৰৰ সূত্ৰ আৰু হস্তৰেখা বিজ্ঞানৰ আধাৰত প্ৰস্তুত কৰা হৈছে। ইয়াক জীৱনৰ পথ প্ৰদৰ্শক হিচাপে লওক, কিন্তু জীৱনৰ চূড়ান্ত সাফল্য আপোনাৰ সৎ কৰ্ম, নিষ্ঠা আৰু নিৰন্তৰ প্ৰচেষ্টাৰ ওপৰত নিৰ্ভৰশীল।
            </div>

            <div class="footer-seal">
                ॥ ইতি জ্যোতিষ অসম ॥<br>
                <strong>"আপোনাৰ হস্তৰেখা • আপোনাৰ কৰ্ম • আপোনাৰ সম্ভাৱনা"</strong>
            </div>
        </div>
    </body>
    </html>
    `;
}

function generateGrandVedicReport(order, chart) {
    // 🛡️ BULLETPROOF PALMISTRY DETECTION:
    if (order && (
        order.service === 'palmistry' || 
        String(order.service).toLowerCase().includes('palm') ||
        order.palmHand || 
        order.palmGender || 
        order.palmPhoto
    )) {
        if (typeof generatePalmistryReportHtml === 'function') {
            return generatePalmistryReportHtml(order);
        }
    }
    const name = order.name || 'গ্ৰাহক';
    const dob = order.birth_date || order.birthDate || 'N/A';
    const tob = order.birth_time || order.birthTime || '10:30';
    const place = order.birth_place || order.birthPlace || 'অসম';
    const service = order.service || 'birth';

    const serviceNameMap = {
        'birth': 'সম্পূৰ্ণ জন্ম কুণ্ডলী আৰু জীৱন দৰ্পণ (Complete Grand Birth Chart)',
        'love': 'প্ৰেম আৰু সম্পৰ্ক পৰামৰ্শ (Love & Relationship Reading)',
        'career': 'কেৰিয়াৰ আৰু ব্যৱসায় পূর্বাভাস (Career & Business Forecast)',
        'monthly': 'মাহেকীয়া ৰাশিফল (Monthly Horoscope)',
        'yearly': 'বাৰ্ষিক ৰাশিফল (Yearly Horoscope)',
        'palmistry': 'হস্তৰেখা বিশদ বিচাৰ (Palmistry Reading)'
    };
    const serviceTitle = serviceNameMap[service] || 'সম্পূৰ্ণ বৈদিক জন্ম-কুণ্ডলী';

    const toAsDigits = (num) => String(num).replace(/\d/g, d => "০১২৩৪৫৬৭৮৯"[d]);

    const rashiAsMap = {
        "Aries": "মেষ", "Taurus": "বৃষ", "Gemini": "মিথুন", "Cancer": "কৰ্কট",
        "Leo": "সিংহ", "Virgo": "কন্যা", "Libra": "তুলা", "Scorpio": "বৃশ্চিক",
        "Sagittarius": "ধনু", "Capricorn": "মকৰ", "Aquarius": "কুম্ভ", "Pisces": "মীন"
    };

    const planetNames = { Sun: "সূৰ্য", Moon: "চন্দ্ৰ", Mars: "মংগল", Mercury: "বুধ", Jupiter: "বৃহস্পতি", Venus: "শুক্ৰ", Saturn: "শনি", Rahu: "ৰাহু", Ketu: "কেতু" };
    const pAbbr = { Sun: "সূ", Moon: "চ", Mars: "মং", Mercury: "বু", Jupiter: "বৃ", Venus: "শু", Saturn: "শ", Rahu: "ৰা", Ketu: "কে" };

    const ascRashi = chart.ascendant.rashi_no;
    const ascRashiName = rashiAsMap[chart.ascendant.rashi] || chart.ascendant.rashi;
    const moonRashi = chart.planets.Moon.rashi;
    const moonRashiName = rashiAsMap[moonRashi] || moonRashi;
    const moonNakshatra = chart.planets.Moon.nakshatra || "অজ্ঞাত";

    let currentDasha = "Moon";
    let today = new Date();
    chart.dashas.forEach(d => {
        let start = new Date(d.start_date);
        let end = new Date(d.end_date);
        if (today >= start && today <= end) currentDasha = d.lord;
    });
    const currentDashaAs = planetNames[currentDasha] || currentDasha;

    let hC = {1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[], 10:[], 11:[], 12:[]};
    let hFull = {1:[], 2:[], 3:[], 4:[], 5:[], 6:[], 7:[], 8:[], 9:[], 10:[], 11:[], 12:[]};
    for(const [pName, pData] of Object.entries(chart.planets)) {
        let hNum = (pData.rashi_no - ascRashi + 12) % 12 + 1;
        hC[hNum].push(pAbbr[pName] || pName);
        hFull[hNum].push(planetNames[pName] || pName);
    }

    const getPlanetHouse = (rashiNo) => rashiNo ? ((rashiNo - ascRashi + 12) % 12) + 1 : 1;

    let clientAge = 28;
    let bYear = 1996;
    let isMinor = false;
    if (dob && dob !== 'N/A') {
        const bDate = new Date(dob);
        if (!isNaN(bDate.getTime())) {
            const today = new Date();
            let ageDiff = today.getFullYear() - bDate.getFullYear();
            const mDiff = today.getMonth() - bDate.getMonth();
            if (mDiff < 0 || (mDiff === 0 && today.getDate() < bDate.getDate())) ageDiff--;
            clientAge = Math.max(0, ageDiff);
            if (clientAge < 18) isMinor = true;
            bYear = bDate.getFullYear();
        }
    }

    let planetsHtml = `<table class="vedic-table"><thead><tr><th>গ্ৰহ</th><th>ৰাশি</th><th>ঘৰ (House)</th><th>নক্ষত্ৰ</th><th>পদ</th></tr></thead><tbody>`;
    for(const key in chart.planets) {
        let hNum = (chart.planets[key].rashi_no - ascRashi + 12) % 12 + 1;
        let rEn = chart.planets[key].rashi;
        planetsHtml += `<tr><td><strong>${planetNames[key] || key} (${key})</strong></td><td>${rashiAsMap[rEn] || rEn} (${rEn})</td><td>${toAsDigits(hNum)}</td><td>${chart.planets[key].nakshatra}</td><td>${toAsDigits(chart.planets[key].pada)}</td></tr>`;
    }
    planetsHtml += `</tbody></table>`;

    let dashaHtml = `<table class="vedic-table"><thead><tr><th>মহা দশা</th><th>আৰম্ভণি (Start)</th><th>অন্ত (End)</th></tr></thead><tbody>`;
    chart.dashas.forEach(d => {
        dashaHtml += `<tr><td><strong>${planetNames[d.lord] || d.lord} (${d.lord})</strong></td><td>${d.start_date}</td><td>${d.end_date}</td></tr>`;
    });
    dashaHtml += `</tbody></table>`;

    let svgHtml = `
    <div class="kundali-wrapper">
        <svg viewBox="0 0 300 300" width="260" height="260" style="background: #fdf5e6; border: 3px solid #8b0000;">
            <rect x="0" y="0" width="300" height="300" fill="none" stroke="#8b0000" stroke-width="2"/>
            <line x1="0" y1="0" x2="300" y2="300" stroke="#8b0000" stroke-width="2"/>
            <line x1="0" y1="300" x2="300" y2="0" stroke="#8b0000" stroke-width="2"/>
            <line x1="150" y1="0" x2="300" y2="150" stroke="#8b0000" stroke-width="2"/>
            <line x1="300" y1="150" x2="150" y2="300" stroke="#8b0000" stroke-width="2"/>
            <line x1="150" y1="300" x2="0" y2="150" stroke="#8b0000" stroke-width="2"/>
            <line x1="0" y1="150" x2="150" y2="0" stroke="#8b0000" stroke-width="2"/>
            <text x="150" y="65" text-anchor="middle" font-size="14" font-weight="bold" fill="#3e2723">${hC[1].join(', ')}</text> <text x="150" y="100" text-anchor="middle" font-size="11" fill="#8b0000">${ascRashi}</text>
            <text x="75" y="45" text-anchor="middle" font-size="14" font-weight="bold" fill="#3e2723">${hC[2].join(', ')}</text> <text x="100" y="25" text-anchor="middle" font-size="11" fill="#8b0000">${(ascRashi)%12+1}</text>
            <text x="45" y="75" text-anchor="middle" font-size="14" font-weight="bold" fill="#3e2723">${hC[3].join(', ')}</text> <text x="25" y="100" text-anchor="middle" font-size="11" fill="#8b0000">${(ascRashi+1)%12+1}</text>
            <text x="90" y="145" text-anchor="middle" font-size="14" font-weight="bold" fill="#3e2723">${hC[4].join(', ')}</text> <text x="130" y="155" text-anchor="middle" font-size="11" fill="#8b0000">${(ascRashi+2)%12+1}</text>
            <text x="45" y="235" text-anchor="middle" font-size="14" font-weight="bold" fill="#3e2723">${hC[5].join(', ')}</text> <text x="25" y="210" text-anchor="middle" font-size="11" fill="#8b0000">${(ascRashi+3)%12+1}</text>
            <text x="75" y="265" text-anchor="middle" font-size="14" font-weight="bold" fill="#3e2723">${hC[6].join(', ')}</text> <text x="100" y="285" text-anchor="middle" font-size="11" fill="#8b0000">${(ascRashi+4)%12+1}</text>
            <text x="150" y="230" text-anchor="middle" font-size="14" font-weight="bold" fill="#3e2723">${hC[7].join(', ')}</text> <text x="150" y="200" text-anchor="middle" font-size="11" fill="#8b0000">${(ascRashi+5)%12+1}</text>
            <text x="225" y="265" text-anchor="middle" font-size="14" font-weight="bold" fill="#3e2723">${hC[8].join(', ')}</text> <text x="200" y="285" text-anchor="middle" font-size="11" fill="#8b0000">${(ascRashi+6)%12+1}</text>
            <text x="255" y="235" text-anchor="middle" font-size="14" font-weight="bold" fill="#3e2723">${hC[9].join(', ')}</text> <text x="280" y="210" text-anchor="middle" font-size="11" fill="#8b0000">${(ascRashi+7)%12+1}</text>
            <text x="210" y="145" text-anchor="middle" font-size="14" font-weight="bold" fill="#3e2723">${hC[10].join(', ')}</text> <text x="170" y="155" text-anchor="middle" font-size="11" fill="#8b0000">${(ascRashi+8)%12+1}</text>
            <text x="255" y="75" text-anchor="middle" font-size="14" font-weight="bold" fill="#3e2723">${hC[11].join(', ')}</text> <text x="280" y="100" text-anchor="middle" font-size="11" fill="#8b0000">${(ascRashi+9)%12+1}</text>
            <text x="225" y="45" text-anchor="middle" font-size="14" font-weight="bold" fill="#3e2723">${hC[12].join(', ')}</text> <text x="200" y="25" text-anchor="middle" font-size="11" fill="#8b0000">${(ascRashi+10)%12+1}</text>
        </svg>
    </div>`;

    const getPlanetAnalysis = (pKey) => {
        const pObj = chart.planets[pKey] || { rashi: "Aries", rashi_no: 1, nakshatra: "অশ্বিনী" };
        const hNo = getPlanetHouse(pObj.rashi_no);
        const rName = rashiAsMap[pObj.rashi] || pObj.rashi;
        return { pObj, hNo, rName };
    };

    const pSun = getPlanetAnalysis("Sun");
    const pMoon = getPlanetAnalysis("Moon");
    const pMars = getPlanetAnalysis("Mars");
    const pMerc = getPlanetAnalysis("Mercury");
    const pJup = getPlanetAnalysis("Jupiter");
    const pVen = getPlanetAnalysis("Venus");
    const pSat = getPlanetAnalysis("Saturn");
    const pRah = getPlanetAnalysis("Rahu");
    const pKet = getPlanetAnalysis("Ketu");

    const page3Navagraha1 = `
    <div class="page page-break">
        <h2 class="section-title">❁ নৱগ্ৰহৰ অৱস্থান আৰু জীৱনত প্ৰভাৱ (খণ্ড - ১) ❁</h2>
        <div class="text-section">বৈদিক জ্যোতিষত নৱগ্ৰহ হৈছে আমাৰ পূৰ্বজন্মৰ সঞ্চিত কৰ্মফল আৰু প্ৰকৃতিৰ মহাজাগতিক শক্তিৰ বাহক। আপোনাৰ জন্ম কুণ্ডলীত প্ৰতিটো গ্ৰহৰ সুকীয়া অৱস্থান আৰু জীৱনৰ বিভিন্ন ক্ষেত্ৰত তাৰ প্ৰত্যক্ষ প্ৰভাৱ তলত বিশ্লেষণ কৰা হ'ল:</div>
        
        <div class="sub-heading">১. সূৰ্য দেৱতা (Sun - আত্মবল, পিতৃ, যশ আৰু সন্মান)</div>
        <div class="info-card">
            <div class="card-content">
                <strong>অৱস্থান:</strong> ${pSun.rName} (${pSun.pObj.rashi}) ৰাশিত, ${toAsDigits(pSun.hNo)} নং ঘৰত | <strong>নক্ষত্ৰ:</strong> ${pSun.pObj.nakshatra}<br><br>
                • <strong>আত্মবিশ্বাস আৰু নেতৃত্ব:</strong> সূৰ্য্য হৈছে আত্মা আৰু তেজৰ কাৰক। আপোনাৰ কুণ্ডলীত ${toAsDigits(pSun.hNo)} নং ঘৰত সূৰ্য্যৰ স্থিতিয়ে আপোনাক উচ্চাকাংক্ষী, আত্মবিশ্বাসী আৰু সৎ চৰিত্ৰৰ অধিকাৰী কৰি তুলিছে। আপুনি যিকোনো স্থানতে নিজৰ ব্যক্তিত্ব আৰু মৰ্যাদা বজাই ৰাখি কাম কৰিবলৈ ভাল পায়।<br>
                • <strong>চৰকাৰী আৰু সামাজিক ফল:</strong> সমাজৰ গণ্য-মান্য ব্যক্তি বা চৰকাৰী বিষয়াৰ সৈতে সু-সম্পৰ্ক গঢ়ি উঠিব। পিতৃৰ আদৰ্শই আপোনাৰ জীৱনত প্ৰেৰণা যোগাব। অহংকাৰ আৰু খং নিয়ন্ত্ৰণত ৰাখিলে সামাজিক সন্মান বৃদ্ধি পাব।
            </div>
        </div>

        <div class="sub-heading">২. চন্দ্ৰ দেৱতা (Moon - মন, সংবেদনশীলতা আৰু মানসিক স্থিৰতা)</div>
        <div class="info-card">
            <div class="card-content">
                <strong>অৱস্থান:</strong> ${pMoon.rName} (${pMoon.pObj.rashi}) ৰাশিত, ${toAsDigits(pMoon.hNo)} নং ঘৰত | <strong>নক্ষত্ৰ:</strong> ${pMoon.pObj.nakshatra}<br><br>
                • <strong>মন আৰু আৱেগিক মানসিকতা:</strong> চন্দ্ৰই মন আৰু মানসিক শক্তিক নিৰ্দেশ কৰে। আপোনাৰ চন্দ্ৰ ৰাশি ${pMoon.rName} হোৱাৰ বাবে আপোনাৰ চিন্তাধাৰা কোমল, সংবেদনশীল আৰু যত্নশীল। আপুনি আনৰ সুখ-দুখ সহজে অনুভৱ কৰিব পাৰে।<br>
                • <strong>মাতৃ আৰু ঘৰুৱা সুখ:</strong> মাতৃৰ আশীৰ্বাদ আপোনাৰ সৌভাগ্যৰ মূল ভেটি। সিদ্ধান্ত গ্ৰহণৰ ক্ষেত্ৰত আৱেগিক অস্থিৰতা বা মানসিক দুশ্চিন্তাৰ পৰা আঁতৰি থাকি বাস্তৱিক দৃষ্টিভংগী ৰখাটো কল্যাণকৰ।
            </div>
        </div>

        <div class="sub-heading">৩. মংগল দেৱতা (Mars - সাহস, পৰাক্ৰম, শক্তি আৰু ভূমি)</div>
        <div class="info-card">
            <div class="card-content">
                <strong>অৱস্থান:</strong> ${pMars.rName} (${pMars.pObj.rashi}) ৰাশিত, ${toAsDigits(pMars.hNo)} নং ঘৰত | <strong>নক্ষত্ৰ:</strong> ${pMars.pObj.nakshatra}<br><br>
                • <strong>সংকল্পশক্তি আৰু কৰ্মোদ্যম:</strong> মংগল গ্ৰহই আপোনাক অদম্য সাহস আৰু যিকোনো প্ৰত্যাহ্বানৰ মুখামুখি হোৱাৰ শক্তি দিছে। সংকটকালতো পিছুৱাই নোযোৱাকৈ ধৈৰ্যৰে যুঁজ দিয়াটো আপোনাৰ মূল শক্তি।<br>
                • <strong>ভূমি আৰু ভাতৃ-ভগ্নীৰ সম্পৰ্ক:</strong> মাটি-বাৰী, নিৰ্মাণ কাৰ্য বা প্ৰতিৰক্ষা/কাৰিকৰী ক্ষেত্ৰত মংগলৰ এই স্থিতিয়ে সফলতা প্ৰদান কৰিব। ভাতৃ-ভগ্নীৰ সৈতে বুজাবুজি সুদৃঢ় কৰি ৰাখিব।
            </div>
        </div>
    </div>`;

    const page4Navagraha2 = `
    <div class="page page-break">
        <h2 class="section-title">❁ নৱগ্ৰহৰ অৱস্থান আৰু জীৱনত প্ৰভাৱ (খণ্ড - ২) ❁</h2>

        <div class="sub-heading">৪. বুধ দেৱতা (Mercury - বুদ্ধি, ব্যৱসায় আৰু বাকপটুতা)</div>
        <div class="info-card">
            <div class="card-content">
                <strong>অৱস্থান:</strong> ${pMerc.rName} (${pMerc.pObj.rashi}) ৰাশিত, ${toAsDigits(pMerc.hNo)} নং ঘৰত | <strong>নক্ষত্ৰ:</strong> ${pMerc.pObj.nakshatra}<br><br>
                • <strong>বৌদ্ধিক চাতুৰ্য আৰু বাণিজ্য:</strong> বুধ হৈছে বুদ্ধি, হিচাপ-নিকাচ আৰু বাণিজ্যিক কৌশলৰ অধিকাৰী গ্ৰহ। আপোনাৰ কুণ্ডলীত বুধৰ শুভ স্থিতিয়ে আপোনাক উন্নত ব্যৱসায়িক বুদ্ধি আৰু গ্ৰাহকক আকৰ্ষণ কৰাৰ অনন্য ক্ষমতা প্ৰদান কৰিছে।<br>
                • <strong>যোগাযোগ আৰু অধ্যয়ন:</strong> তথ্য-প্ৰযুক্তি, গণিত, লেখা-মেলা বা পৰামৰ্শমূলক কামত আপোনাৰ মেধা সহজে প্ৰকাশ পাব। কথা-বতৰাত মিঠা মাত আৰু স্পষ্টতাই আপোনাক বহু লাভ কঢ়িয়াই আনিব।
            </div>
        </div>

        <div class="sub-heading">৫. বৃহস্পতি দেৱতা (Jupiter - দেৱগুৰু, জ্ঞান, ধৰ্ম আৰু ভাগ্য)</div>
        <div class="info-card">
            <div class="card-content">
                <strong>অৱস্থান:</strong> ${pJup.rName} (${pJup.pObj.rashi}) ৰাশিত, ${toAsDigits(pJup.hNo)} নং ঘৰত | <strong>নক্ষত্ৰ:</strong> ${pJup.pObj.nakshatra}<br><br>
                • <strong>জ্ঞান আৰু আধ্যাত্মিক চেতনা:</strong> দেৱগুৰু বৃহস্পতিয়ে আপোনাক সত্যবাদী, নীতিপৰায়ণ আৰু দূৰদৰ্শী চিন্তাৰ ব্যক্তি কৰি তুলিছে। আপুনি যিকোনো কথাৰ গভীৰতালৈ যাব পাৰে আৰু আনক সৎ পথ দেখুৱাব পাৰে।<br>
                • <strong>সৌভাগ্য আৰু সন্তান সুখ:</strong> কুণ্ডলীত বৃহস্পতিৰ শুভ দৃষ্টিৰ ফলত জীৱনৰ মধ্যভাগৰ পৰা ভাগ্যৰ বিশেষ সহযোগিতা লাভ কৰিব। বৈবাহিক স্থিৰতা আৰু সন্তানৰ পৰা মানসিক তৃপ্তি লাভৰ যোগ প্ৰৱল।
            </div>
        </div>

        <div class="sub-heading">৬. শুক্ৰ দেৱতা (Venus - সৌন্দৰ্য, প্ৰেম, ভোগ-বিলাস আৰু দাম্পত্য)</div>
        <div class="info-card">
            <div class="card-content">
                <strong>অৱস্থান:</strong> ${pVen.rName} (${pVen.pObj.rashi}) ৰাশিত, ${toAsDigits(pVen.hNo)} নং ঘৰত | <strong>নক্ষত্ৰ:</strong> ${pVen.pObj.nakshatra}<br><br>
                • <strong>আকৰ্ষণ আৰু প্ৰেমজীৱন:</strong> শুক্ৰই ব্যক্তিত্বক আকৰ্ষণীয়, মাৰ্জিত আৰু ৰুচিপূৰ্ণ কৰি তোলে। সুন্দৰ সাজ-পোছাক, সংগীত, কলা আৰু বিলাসী সামগ্ৰীৰ প্ৰতি আপোনাৰ স্বভাৱজাত ভালপোৱা থাকিব।<br>
                • <strong>পাৰিবাৰিক আৰু আৰ্থিক স্থিতি:</strong> সংগীৰ আগমনৰ পিছত জীৱনলৈ আৰ্থিক স্থিৰতা বৃদ্ধি পাব। ঘৰুৱা পৰিৱেশ আনন্দময় কৰি ৰখা আৰু সুষম সম্পৰ্ক বজাই ৰখাত শুক্ৰই সহায় কৰিব।
            </div>
        </div>
    </div>`;

    const page5Navagraha3 = `
    <div class="page page-break">
        <h2 class="section-title">❁ নৱগ্ৰহৰ অৱস্থান আৰু জীৱনত প্ৰভাৱ (খণ্ড - ৩) ❁</h2>

        <div class="sub-heading">৭. শনি দেৱতা (Saturn - কৰ্মফলদাতা, ন্যায়, ধৈৰ্য আৰু দীর্ঘায়ু)</div>
        <div class="info-card">
            <div class="card-content">
                <strong>অৱস্থান:</strong> ${pSat.rName} (${pSat.pObj.rashi}) ৰাশিত, ${toAsDigits(pSat.hNo)} নং ঘৰত | <strong>নক্ষত্ৰ:</strong> ${pSat.pObj.nakshatra}<br><br>
                • <strong>কঠোৰ পৰিশ্ৰম আৰু স্থায়ী সফলতা:</strong> শনি দেৱতাই ব্যক্তিৰ জীৱনত চমু পথেৰে সফলতা নিদিয়ে, কিন্তু নিজৰ কষ্ট আৰু সততাৰ বিনিময়ত এনে এক স্থিৰ ভেটি গঢ়ি দিয়ে যাক কোনেও লৰচৰ কৰিব নোৱাৰে। বয়স বঢ়াৰ লগে লগে আপোনাৰ কৰ্মদক্ষতা আৰু সমাজত প্ৰতিপত্তি বৃদ্ধি পাব।<br>
                • <strong>ধৈৰ্য আৰু অনুশাসন:</strong> আৰম্ভণিৰ সংগ্ৰামবোৰে আপোনাক শক্তিশালী কৰি তুলিব। শনিৰ অনুকূল কৃপাত জীৱনৰ দ্বিতীয়ার্ধত স্থায়ী সম্পত্তি আৰু বিপুল মৰ্যাদা লাভ হ'ব।
            </div>
        </div>

        <div class="sub-heading">৮. ৰাহু দেৱতা (Rahu - ছায়া গ্ৰহ, উচ্চাকাংক্ষা, প্ৰযুক্তি আৰু বিদেশ)</div>
        <div class="info-card">
            <div class="card-content">
                <strong>অৱস্থান:</strong> ${pRah.rName} (${pRah.pObj.rashi}) ৰাশিত, ${toAsDigits(pRah.hNo)} নং ঘৰত | <strong>নক্ষত্ৰ:</strong> ${pRah.pObj.nakshatra}<br><br>
                • <strong>আধুনিক চিন্তা আৰু আকস্মিক সুযোগ:</strong> ৰাহুৱে আপোনাক আধুনিক দৃষ্টিভংগী, উদ্ভাৱনী শক্তি আৰু প্ৰযুক্তি/অনলাইন মাধ্যমৰ সৈতে খাপ খুৱাব পৰা ক্ষমতা দিছে। জীৱনত কিছু অপ্ৰত্যাশিত সুযোগ আৰু আকস্মিক উন্নতিৰ যোগ ৰাহুৱে দিয়ে।<br>
                • <strong>সতৰ্কতা:</strong> লৰালৰিকৈ ধনী হোৱাৰ প্ৰলোভন বা অতিৰিক্ত জল্পনা-কল্পনামূলক (Speculative) বিনিয়োগ পৰিহাৰ কৰাটো শ্ৰেয়।
            </div>
        </div>

        <div class="sub-heading">৯. কেতু দেৱতা (Ketu - মোক্ষকাৰক, অন্তৰ্দৃষ্টি, বৈৰাগ্য আৰু আধ্যাত্মিকতা)</div>
        <div class="info-card">
            <div class="card-content">
                <strong>অৱস্থান:</strong> ${pKet.rName} (${pKet.pObj.rashi}) ৰাশিত, ${toAsDigits(pKet.hNo)} নং ঘৰত | <strong>নক্ষত্ৰ:</strong> ${pKet.pObj.nakshatra}<br><br>
                • <strong>অন্তৰ্দৃষ্টি আৰু আধ্যাত্মিক সাধনা:</strong> কেতুৱে ব্যক্তিৰ মানসিক চেতনাক বাহ্যিক জগতৰ পৰা ভিতৰৰ আত্মাক চিনিবলৈ প্ৰেৰণা দিয়ে। আপোনাৰ ষষ্ঠ ইন্দ্ৰিয় (Intuition) অত্যন্ত তীক্ষ্ণ। সংকটৰ সময়ত আপোনাৰ অন্তৰ্দৃষ্টিয়ে সঠিক পথ দেখুৱাব।<br>
                • <strong>মোক্ষ আৰু মানসিক শান্তি:</strong> ধৰ্মীয় স্থান দৰ্শন, দান-পুণ্য আৰু ধ্যান কৰিলে জীৱনৰ মানসিক অশান্তি তৎক্ষণাৎ দূৰ হয়।
            </div>
        </div>
    </div>`;

    const houseNames = [
        "১ম ঘৰ (লগ্ন ভাৱ - ব্যক্তিত্ব, দেহ আৰু আত্মা)", "২য় ঘৰ (ধন ভাৱ - সঞ্চয়, বাণী আৰু কুটুম্ব)", "৩য় ঘৰ (সহজ ভাৱ - সাহস, পৰাক্ৰম আৰু ভাতৃ-ভগ্নী)",
        "৪ৰ্থ ঘৰ (সুখ ভাৱ - মাতৃ, গৃহ, বাহন আৰু সম্পত্তি)", "৫ম ঘৰ (সন্তান ভাৱ - বিদ্যা, বুদ্ধি, প্ৰেম আৰু পূৰ্বপুণ্য)", "৬ষ্ঠ ঘৰ (ৰিপু ভাৱ - ৰোগ, ঋণ, শত্ৰু আৰু প্ৰতিযোগিতা)",
        "৭ম ঘৰ (জায়া ভাৱ - বিবাহ, জীৱনসংগী আৰু অংশীদাৰীত্ব)", "৮ম ঘৰ (আয়ু ভাৱ - দীৰ্ঘায়ু, গুপ্ত বিদ্যা আৰু আকস্মিক পৰিৱৰ্তন)", "৯ম ঘৰ (ভাগ্য ভাৱ - ধৰ্ম, পিতৃ, উচ্চ শিক্ষা আৰু সৌভাগ্য)",
        "১০ম ঘৰ (কৰ্ম ভাৱ - বৃত্তি, পদবী, সন্মান আৰু সামাজিক খ্যাতি)", "১১তম ঘৰ (লাভ ভাৱ - আয়, ইচ্ছাপূৰণ আৰু জ্যেষ্ঠ ভাতৃ-মিত্ৰ)", "১২তম ঘৰ (ব্যয় ভাৱ - খৰচ, বিদেশ যাত্ৰা, শয্যাসুখ আৰু মোক্ষ)"
    ];

    const rashiDetails = {
        "Aries": { asName: "মেষ", lord: "মংগল (Mars)", trait: "উদ্যমী, সাহসী আৰু স্বতন্ত্ৰ নেতৃত্বপ্ৰদানকাৰী শক্তি" },
        "Taurus": { asName: "বৃষ", lord: "শুক্ৰ (Venus)", trait: "স্থায়িত্ব, ধৈৰ্যশীলতা, আৰ্থিক সুদৃঢ়তা আৰু শিল্পীসুলভ মনোভাৱ" },
        "Gemini": { asName: "মিথুন", lord: "বুধ (Mercury)", trait: "বৌদ্ধিক চাতুৰ্য, উন্নত যোগাযোগ দক্ষতা আৰু বহুমুখী প্ৰতিভা" },
        "Cancer": { asName: "কৰ্কট", lord: "চন্দ্ৰ (Moon)", trait: "গভীৰ সংবেদনশীলতা, যত্নশীল স্বভাৱ আৰু মানসিক অন্তৰ্দৃষ্টি" },
        "Leo": { asName: "সিংহ", lord: "সূৰ্য (Sun)", trait: "আত্মবিশ্বাস, ৰাজকীয় ব্যক্তিত্ব, উচ্চাকাংক্ষা আৰু উদাৰতা" },
        "Virgo": { asName: "কন্যা", lord: "বুধ (Mercury)", trait: "বিশ্লেষণাত্মক বুদ্ধি, শৃংখলাবদ্ধতা আৰু বাস্তৱবাদী দৃষ্টিভংগী" },
        "Libra": { asName: "তুলা", lord: "শুক্ৰ (Venus)", trait: "ন্যায়পৰায়ণতা, কূটনৈতিক দক্ষতা আৰু সুষম আচৰণ" },
        "Scorpio": { asName: "বৃশ্চিক", lord: "মংগল (Mars)", trait: "গভীৰ সংকল্পশক্তি, গৱেষণামূলক মন আৰু অদম্য সাহস" },
        "Sagittarius": { asName: "ধনু", lord: "বৃহস্পতি (Jupiter)", trait: "দাৰ্শনিক চিন্তা, সততা, আশাবাদ আৰু ধৰ্মীয় নিষ্ঠা" },
        "Capricorn": { asName: "মকৰ", lord: "শনি (Saturn)", trait: "কঠোৰ পৰিশ্ৰম, কৰ্তব্যনিষ্ঠা, ধৈৰ্য আৰু দীর্ঘম্যাদী সফলতা" },
        "Aquarius": { asName: "কুম্ভ", lord: "শনি (Saturn)", trait: "মানৱতাবাদী চিন্তা, উদ্ভাৱনী শক্তি আৰু গভীৰ দূৰদৰ্শিতা" },
        "Pisces": { asName: "মীন", lord: "বৃহস্পতি (Jupiter)", trait: "আধ্যাত্মিকতা, সৃজনশীল কল্পনাশক্তি আৰু দয়ালু স্বভাৱ" }
    };

    const houseCoreMeanings = [
        "এই ঘৰটোৱে আপোনাৰ শাৰীৰিক গঠন, মানসিক শক্তি, আত্মবিশ্বাস আৰু জীৱনৰ সামগ্ৰিক দিশ নিৰ্ণয় কৰে। জীৱনৰ প্ৰতিটো পদক্ষেপত আপোনাৰ নিজস্ব আদৰ্শ স্পষ্ট হৈ থাকিব।",
        "এই ভাৱৰ প্ৰভাৱত আপোনাৰ ধন সঞ্চয়ৰ ক্ষমতা, মিঠা কিন্তু স্পষ্ট কথনশৈলী আৰু পাৰিবাৰিক ঐতিহ্যৰ প্ৰতি গভীৰ দায়বদ্ধতা পৰিলক্ষিত হয়।",
        "আপোনাৰ নিজা প্রচেষ্টা, সাহস আৰু কর্মোদ্যমৰ দ্বাৰা জীৱনত আগবাঢ়ি যোৱাৰ প্রবল যোগ আছে। নতুন কৌশল শিকা আৰু যোগাযোগৰ ক্ষেত্ৰত আপুনি বিশেষভাৱে দক্ষ।",
        "মানসিক শান্তি, মাতৃৰ আশীৰ্বাদ, মাটি-বাৰী আৰু স্থায়ী সম্পত্তি অৰ্জনৰ ক্ষেত্ৰত এই ঘৰটোৱে আপোনাক সুন্দৰ স্থায়িত্ব আৰু ঘৰুৱা সুখ প্ৰদান কৰিব।",
        "উচ্চ মেধাশক্তি, সৃজনশীলতা আৰু সন্তান সুখৰ দিশত এই ভাৱটো শুভ। পূৰ্বজন্মৰ পুণ্যফলত সংকটৰ সময়ত আপুনি সঠিক সিদ্ধান্ত ল'বলৈ সক্ষম হ'ব।",
        "জীৱনৰ সংঘাত, শাৰীৰিক বাধা বা গোপন শত্ৰুক নিজৰ ধৈৰ্য আৰু বুদ্ধিমত্তাৰে পৰাস্ত কৰাৰ ক্ষমতা আপোনাৰ আছে। চৰকাৰী বা প্ৰতিযোগিতামূলক কামত ই সফলতা দিয়ে।",
        "দাম্পত্য জীৱন, জীৱনসংগীৰ সৈতে বুজাবুজি আৰু ব্যৱসায়িক অংশীদাৰীত্বত এই ঘৰটোৱে গুৰুত্বপূৰ্ণ ভূমিকা লয়। সমাজত আপোনাৰ ব্যৱহাৰিক মৰ্যাদা বৃদ্ধি পাব।",
        "দীৰ্ঘায়ু, আধ্যাত্মিক ৰহস্য আৰু জীৱনৰ আকস্মিক উত্থান-পতনৰ লগত মোকাবিলা কৰাৰ মানসিক দৃঢ়তা এই ভাৱে আপোনাক প্ৰদান কৰিছে।",
        "পিতৃ-গুৰুৰ আশীৰ্বাদ, ধৰ্মীয় চেতনা আৰু দূৰ ভ্ৰমণৰ জৰিয়তে আপোনাৰ সৌভাগ্য উদয় হ'ব। জীৱনৰ মধ্যভাগৰ পৰা ভাগ্যই আপোনাক বিশেষভাৱে সংগ দিব।",
        "কৰ্মক্ষেত্ৰত নিজৰ যোগ্যতা প্ৰতিষ্ঠা কৰা, উচ্চ পদবী লাভ আৰু সমাজত বিশেষ মান-সন্মান অৰ্জন কৰাৰ ক্ষেত্ৰত দশম ভাৱটো আপোনাৰ বাবে অতিশয় ফলপ্ৰসূ।",
        "একাধিক উৎসৰ পৰা ধন আগমন, জীৱনৰ দীর্ঘদিনীয়া মনোবাঞ্ছা পূৰণ আৰু প্ৰভাৱশালী মিত্ৰৰ সহযোগিতা লাভৰ ক্ষেত্ৰত একাদশ ভাৱে শুভ ফল দেখুৱাইছে।",
        "ধৰ্মীয় বা সৎ কাৰ্যত ধন ব্যয়, দূৰ স্থান বা বিদেশৰ সৈতে সংযোগ আৰু জীৱনৰ অন্তিম পৰ্যায়ত মানসিক তৃপ্তি তথা আধ্যাত্মিক মুক্তিৰ যোগ সূচায়।"
    ];

    const buildHouseCards = (startHouse, endHouse) => {
        let cardsHtml = "";
        for (let i = startHouse; i <= endHouse; i++) {
            const rashiEn = chart?.houses?.[i - 1]?.rashi || "Aries";
            const rInfo = rashiDetails[rashiEn] || { asName: rashiEn, lord: "গ্ৰহ", trait: "বিশেষ জ্যোতিষীয় প্ৰভাৱ" };
            const hasPlanets = hFull[i] && hFull[i].length > 0;
            const pInH = hasPlanets ? hFull[i].join(', ') : "কোনো গ্ৰহ নাই (ভাৱাধিপতিৰ দ্বাৰা নিয়ন্ত্ৰিত)";
            
            const planetImpact = hasPlanets
                ? `এই ঘৰত <strong>${pInH}</strong> অৱস্থান কৰাৰ বাবে এই ভাৱৰ কাৰকত্বসমূহ আপোনাৰ জীৱনত অত্যন্ত সক্ৰিয় আৰু প্ৰভাৱশালী হৈ উঠিছে। গ্ৰহৰ এই স্থিতিয়ে আপোনাক এই দিশত বিশেষ অভিজ্ঞতা, কৰ্মদক্ষতা আৰু ফল প্ৰদান কৰিব।`
                : `এই ঘৰত কোনো গ্ৰহ পোনপটীয়াকৈ নাথাকিলেও ইয়াৰ অধিপতি গ্ৰহ <strong>${rInfo.lord}</strong> ৰ শুভ দৃষ্টি আৰু অৱস্থানৰ দ্বাৰা এই ঘৰৰ ফলাফলসমূহ সুন্দৰভাৱে সুৰক্ষিত আৰু পৰিচালিত হ'ব।`;

            cardsHtml += `
            <div class="info-card">
                <div class="card-title">${houseNames[i - 1]}</div>
                <div class="card-content">
                    <div style="margin-bottom: 8px; font-size: 14px; color: #5c3a21; background: rgba(139,0,0,0.05); padding: 5px 10px; border-radius: 4px; border: 1px dashed #d4b483;">
                        <strong>উদিত ৰাশি:</strong> ${rInfo.asName} (${rashiEn}) &nbsp;|&nbsp; 
                        <strong>ভাৱাধিপতি:</strong> ${rInfo.lord} &nbsp;|&nbsp; 
                        <strong>অৱস্থিত গ্ৰহ:</strong> ${pInH}
                    </div>
                    <div style="margin-top: 6px; line-height: 1.7;">
                        <p style="margin-bottom: 5px;"><strong>• ভাৱৰ মূল কাৰকত্ব আৰু তাৎপৰ্য্য:</strong> ${houseCoreMeanings[i - 1]}</p>
                        <p style="margin-bottom: 5px;"><strong>• ৰাশি আৰু অধিপতিৰ বিশেষ ফল:</strong> এই ভাৱত <strong>${rInfo.asName}</strong> ৰাশি আৰু অধিপতি <strong>${rInfo.lord}</strong> ৰ প্ৰভাৱ থকাৰ বাবে ইয়াত ${rInfo.trait} স্পষ্টৰূপে প্ৰতিফলিত হ'ব।</p>
                        <p style="margin-bottom: 0;"><strong>• গ্ৰহৰ স্থিতি আৰু জ্যোতিষীয় বিচাৰ:</strong> ${planetImpact}</p>
                    </div>
                </div>
            </div>`;
        }
        return cardsHtml;
    };

    const page6Houses1 = `
    <div class="page page-break">
        <h2 class="section-title">❁ দ্বাদশ ভাৱৰ বিস্তৃত বিশ্লেষণ (১ম - ৪ৰ্থ ঘৰ) ❁</h2>
        <div class="text-section">বৈদিক জ্যোতিষত জন্ম কুণ্ডলীৰ ১২ টা ঘৰে মানৱ জীৱনৰ ১২ টা মূল স্তম্ভক নিৰ্দেশ কৰে। আপোনাৰ জন্ম লগ্ন অনুসৰি প্ৰতিটো ঘৰৰ ৰাশি, অধিপতি আৰু গ্ৰহৰ স্থিতিৰ গভীৰ বিশ্লেষণ তলত দিয়া হ'ল:</div>
        ${buildHouseCards(1, 4)}
    </div>`;

    const page7Houses2 = `
    <div class="page page-break">
        <h2 class="section-title">❁ দ্বাদশ ভাৱৰ বিস্তৃত বিশ্লেষণ (৫ম - ৮ম ঘৰ) ❁</h2>
        ${buildHouseCards(5, 8)}
    </div>`;

    const page8Houses3 = `
    <div class="page page-break">
        <h2 class="section-title">❁ দ্বাদশ ভাৱৰ বিস্তৃত বিশ্লেষণ (৯ম - ১২তম ঘৰ) ❁</h2>
        ${buildHouseCards(9, 12)}
    </div>`;

    let y1 = bYear + 18;
    let y2 = bYear + 22;
    let y_stab_start = bYear + 23;
    let y_stab_end = bYear + 25;
    let y_mid1 = bYear + 26;
    let y_mid2 = bYear + 31;
    let y_peak_start = bYear + 32;
    let y_peak_end = bYear + 35;
    let y_prop_start = bYear + 36;
    let y_prop_end = bYear + 39;
    let y_prosper_start = bYear + 40;
    let y_spirit_start = bYear + 50;

    const page9LifetimeRoadmap = `
    <div class="page page-break">
        <h2 class="section-title">❁ সম্পূৰ্ণ জীৱনৰ বয়সভিত্তিক ভাগ্যোদয়ৰ ৰোডমেপ ❁</h2>
        <div class="shloka">"ভাগ্যং ফলতি সৰ্বত্ৰ ন বিদ্যা ন চ পৌৰুষম্।"</div>
        <div class="text-section">
            বৈদিক কালচক্ৰ, গোচৰ আৰু আপোনাৰ জন্ম কুণ্ডলীৰ গ্ৰহ-দশাৰ আধাৰত সমগ্ৰ জীৱনৰ প্ৰধান সময়সীমাসমূহ তলত নিৰ্দিষ্ট চন আৰু বয়সৰ মাইলষ্ট'ন অনুসৰি বিশ্লেষণ কৰা হ'ল:
        </div>

        <div class="sub-heading">১. শিক্ষা সমাপ্তি আৰু প্ৰাথমিক সন্ধান (বয়স ১৮–২২ বছৰ / প্ৰায় ${toAsDigits(y1)}–${toAsDigits(y2)} চন)</div>
        <div class="info-card">
            <div class="card-content">
                • <strong>বিদ্যাৰ্থী জীৱন আৰু লক্ষ্য নিৰ্ধাৰণ:</strong> বিদ্যাবুদ্ধি বিকাশ, উচ্চ শিক্ষা সমাপ্তি আৰু নিজৰ পছন্দৰ কেৰিয়াৰ বাছনিৰ প্ৰাথমিক সময়। পঞ্চম আৰু নৱম ভাৱৰ শুভ দৃষ্টয়ে জ্ঞান আহৰণত সহায় কৰে।
            </div>
        </div>

        <div class="sub-heading">২. বয়স ২৩–২৫ বছৰ (প্ৰথম স্থিৰতাৰ সময়সীমা / প্ৰায় ${toAsDigits(y_stab_start)}–${toAsDigits(y_stab_end)} চন)</div>
        <div class="info-card" style="border-left-color: #2563eb; background: rgba(37, 99, 235, 0.06);">
            <div class="card-title" style="color: #1d4ed8;">🌱 প্ৰথম স্থিৰতা আৰু কেৰিয়াৰৰ দৃঢ় ভেটি</div>
            <div class="card-content">
                • <strong>কৰ্মসংস্থাপন আৰু আৰ্থিক স্বাৱলম্বন:</strong> চাকৰি বা ব্যৱসায়ত এক নিৰ্দিষ্ট স্থান অধিকাৰ কৰা আৰু প্ৰথম উপাৰ্জনৰ পথ মুকলি হোৱা। এই বয়সত জীৱনৰ অনিশ্চয়তা দূৰ হৈ প্ৰথম স্থিৰতা আহে আৰু সংসাৰ নিৰ্মাণৰ পথ প্ৰশস্ত হয়।
            </div>
        </div>

        <div class="sub-heading">৩. কৰ্ম সম্প্ৰসাৰণ আৰু সংসাৰ নিৰ্মাণ (বয়স ২৬–৩১ বছৰ / প্ৰায় ${toAsDigits(y_mid1)}–${toAsDigits(y_mid2)} চন)</div>
        <div class="info-card">
            <div class="card-content">
                • <strong>অভিজ্ঞতা আৰু সামাজিক প্ৰতিষ্ঠা:</strong> কৰ্মক্ষেত্ৰত স্থিতি মজবুত কৰা, বৈবাহিক সম্বন্ধ গঢ়ি তোলা আৰু সামাজিক দায়বদ্ধতা বৃদ্ধি। নিজৰ কৰ্মপ্ৰতিভা সমাজত সুপ্ৰতিষ্ঠিত কৰাৰ বাবে এই সময়ছোৱা ফলপ্ৰসূ।
            </div>
        </div>

        <div class="sub-heading">৪. বয়স ৩২–৩৫ বছৰ (ডাঙৰ উত্থান আৰু সোণালী সময়সীমা / প্ৰায় ${toAsDigits(y_peak_start)}–${toAsDigits(y_peak_end)} চন)</div>
        <div class="info-card" style="border-left-color: #d97706; background: rgba(217, 119, 6, 0.08);">
            <div class="card-title" style="color: #b45309;">🌟 ভাগ্যোদয়ৰ ডাঙৰ উত্থান (Golden Peak Era)</div>
            <div class="card-content">
                • <strong>কেৰিয়াৰ আৰু ব্যৱসায়ৰ সৰ্বোচ্চ শিখৰ:</strong> দশম পতি আৰু একাদশ ভাৱৰ সংযোগে এই সময়ছোৱাত জীৱনৰ আটাইতকৈ ডাঙৰ উত্থান ঘটাব। সমাজত উচ্চ মৰ্যাদা, প্ৰভাৱশালী পদবী বা ব্যৱসায়ৰ ব্যাপক সম্প্ৰসাৰণ ঘটিব। একাধিক উৎসৰ পৰা স্থিৰ ধন প্ৰবাহ আৰু সন্মান লাভৰ এইটোৱেই সোণালী কাল।
            </div>
        </div>

        <div class="sub-heading">৫. স্থায়ী সম্পদ, গৃহ-নিৰ্মাণ আৰু বাহন ক্ৰয় (বয়স ৩৬–৩৯ বছৰ / প্ৰায় ${toAsDigits(y_prop_start)}–${toAsDigits(y_prop_end)} চন)</div>
        <div class="info-card">
            <div class="card-content">
                • <strong>গৃহ আৰু বাহন সুখ:</strong> চতুৰ্থ ভাৱৰ শুভ প্ৰভাৱে নিজা মাটি-বাৰী, গৃহ নিৰ্মাণ আৰু বাহন ক্ৰয়ৰ শুভ যোগ সৃষ্টি কৰে। পৰিয়ালৰ ভৱিষ্যত সুৰক্ষিত কৰাৰ স্থায়ী সিদ্ধান্ত গ্ৰহণ।
            </div>
        </div>

        <div class="sub-heading">৬. বয়স ৪০+ বছৰৰ সমৃদ্ধিৰ সময়সীমা (প্ৰায় ${toAsDigits(y_prosper_start)} চনৰ পৰা)</div>
        <div class="info-card" style="border-left-color: #059669; background: rgba(5, 150, 105, 0.08);">
            <div class="card-title" style="color: #047857;">💎 স্থায়ী আৰ্থিক সমৃদ্ধি আৰু সামাজিক প্ৰভাৱ</div>
            <div class="card-content">
                • <strong>স্থায়ী সমৃদ্ধি আৰু মৰ্যাদা:</strong> জীৱনত অৰ্থনৈতিক নিৰাপত্তা, স্থাৱৰ সম্পত্তি আৰু সামাজিক প্ৰভাৱ চূড়ান্ত পৰ্যায়ত উপনীত হ'ব। সন্তানৰ উন্নতি, ব্যৱসায় বা কৰ্মৰ স্থিৰ নেটৱৰ্ক আৰু পূৰ্ণ সমৃদ্ধি ভোগৰ দীৰ্ঘম্যাদী সময়।
            </div>
        </div>

        <div class="sub-heading">৭. আধ্যাত্মিক পৰিপক্কতা আৰু পুণ্যফল ভোগ (বয়স ৫০+ বছৰ / প্ৰায় ${toAsDigits(y_spirit_start)} চনৰ পৰা)</div>
        <div class="info-card">
            <div class="card-content">
                • <strong>আধ্যাত্মিক তৃপ্তি আৰু শান্তি:</strong> জীৱনৰ দায়িত্বসমূহ সুকলমে সম্পন্ন কৰি সমাজত আদৰ্শ ব্যক্তি হিচাপে সন্মান লাভ। ধৰ্মীয় তীৰ্থস্থান ভ্ৰমণ, লোককল্যাণ আৰু মানসিক প্ৰশান্তিৰে ভৰপূৰ পৰিনাতি কাল।
            </div>
        </div>
    </div>`;

    const tenthRashi = chart?.houses?.[9]?.rashi || "Aries";
    const secondRashi = chart?.houses?.[1]?.rashi || "Taurus";
    const eleventhRashi = chart?.houses?.[10]?.rashi || "Aquarius";
    const fourthRashi = chart?.houses?.[3]?.rashi || "Cancer";

    const sunHouse = getPlanetHouse(chart?.planets?.Sun?.rashi_no);
    const saturnHouse = getPlanetHouse(chart?.planets?.Saturn?.rashi_no);
    const jupiterHouse = getPlanetHouse(chart?.planets?.Jupiter?.rashi_no);
    const mercuryHouse = getPlanetHouse(chart?.planets?.Mercury?.rashi_no);

    const careerByTenthRashi = {
        "Aries": { asName: "মেষ", lord: "মংগল (Mars)", nature: "উদ্যমী, সাহসী আৰু নেতৃত্বপ্ৰদানকাৰী। নিজা উদ্যোগত সফলতা।", fields: "প্ৰতিৰক্ষা, পুলিচ, ইঞ্জিনিয়াৰিং, ৰিয়েল এষ্টেট, নিৰ্মাণ কাৰ্য আৰু নিজা ব্যৱসায়।" },
        "Taurus": { asName: "বৃষ", lord: "শুক্ৰ (Venus)", nature: "ধৈৰ্যশীল, সুপৰিকল্পিত আৰু আৰ্থিকভাৱে সুদৃঢ় ব্যক্তিত্ব।", fields: "বেংকিং, ফাইনেন্স, হোটেল-ৰেষ্টুৰেণ্ট, ফেশ্বন, কৃষি উদ্যোগ আৰু চৰকাৰী কোষাগাৰ।" },
        "Gemini": { asName: "মিথুন", lord: "বুধ (Mercury)", nature: "বৌদ্ধিক চাতুৰ্য, উন্নত যোগাযোগ আৰু বহুমুখী প্ৰতিভা।", fields: "তথ্য-প্ৰযুক্তি (IT), সাংবাদিকতা, একাউণ্টিং, মাৰ্কেটিং, ওকালতি আৰু পৰামৰ্শদাতা।" },
        "Cancer": { asName: "কৰ্কট", lord: "চন্দ্ৰ (Moon)", nature: "জনসাধাৰণৰ মন সহজে বুজি পোৱা আৰু দায়িত্বশীল স্বভাৱ।", fields: "চিকিৎসা, নাৰ্ছিং, শিক্ষা বিভাগ, মানৱ সম্পদ (HR), পৰ্যটন আৰু জনকল্যাণমূলক খণ্ড।" },
        "Leo": { asName: "সিংহ", lord: "সূৰ্য (Sun)", nature: "জন্মগত প্ৰশাসনিক দক্ষতা, আত্মবিশ্বাসী আৰু ৰাজকীয় ব্যক্তিত্ব।", fields: "চৰকাৰী উচ্চ পদবী (ACS/IAS), ৰাজনীতি, পৰিচালনা সঞ্চালক, ঠিকাদাৰী আৰু ফাৰ্মাচী।" },
        "Virgo": { asName: "কন্যা", lord: "বুধ (Mercury)", nature: "সূক্ষ্মদৰ্শী, নিখুঁত হিচাপী আৰু সমস্যা সমাধানত পাকৈত।", fields: "বেংকিং, ডাটা এনালাইছিছ, কম্পিউটাৰ প্ৰগ্ৰেমিং, চিকিৎসা পৰীক্ষাগাৰ আৰু বাণিজ্যিক ব্যৱসায়।" },
        "Libra": { asName: "তুলা", lord: "শুক্ৰ (Venus)", nature: "কূটনৈতিকভাৱে দক্ষ, ন্যায়পৰায়ণ আৰু অংশীদাৰীত্বত সফল।", fields: "আইন আৰু ন্যায়পালিকা, ডিজাইন বা স্থাপত্য, জনসংযোগ (PR), বিলাসী সামগ্ৰীৰ বাণিজ্য।" },
        "Scorpio": { asName: "বৃশ্চিক", lord: "মংগল (Mars)", nature: "গভীৰ গৱেষণামূলক মন আৰু অদম্য সংকল্পশক্তি।", fields: "চিকিৎসা ও অস্ত্ৰোপচাৰ (Surgery), ফাৰ্মাচী, পুলিচ/চোৰাংচোৱা, তেল-গেছ, বীমা আৰু গৱেষণা।" },
        "Sagittarius": { asName: "ধনু", lord: "বৃহস্পতি (Jupiter)", nature: "জ্ঞানী, দূৰদৰ্শী আৰু সমাজত আদৰ্শ প্ৰতিষ্ঠা কৰিব পৰা ব্যক্তি।", fields: "শিক্ষা বিভাগ, বেংকিং, আইন, ধৰ্মীয়-সামাজিক সংস্থা, প্ৰকাশন আৰু পৰামৰ্শদাতা সেৱা।" },
        "Capricorn": { asName: "মকৰ", lord: "শনি (Saturn)", nature: "কৰ্মঠ, বাস্তৱবাদী, ধৈৰ্যশীল আৰু দীর্ঘম্যাদী সাম্ৰাজ্য গঢ়োঁতা।", fields: "ইঞ্জিনিয়াৰিং, কাৰিকৰী খণ্ড, লোহা-যন্ত্ৰপাতিৰ ব্যৱসায়, নিৰ্মাণ কাৰ্য, চৰকাৰী প্ৰশাসন।" },
        "Aquarius": { asName: "কুম্ভ", lord: "শনি (Saturn)", nature: "আধুনিক চিন্তাধাৰাৰ, উদ্ভাৱনী শক্তিসম্পন্ন আৰু সমাজহিতৈষী।", fields: "আধুনিক প্ৰযুক্তি (AI/IT), অনলাইন ব্যৱসায়, বৈজ্ঞানিক গৱেষণা, পৰিবহণ আৰু বৃহৎ নেটৱৰ্কিং।" },
        "Pisces": { asName: "মীন", lord: "বৃহস্পতি (Jupiter)", nature: "সৃজনশীল, কল্পনাপ্ৰৱণ আৰু মানুহক সহায় কৰিব জনা ব্যক্তিত্ব।", fields: "শিক্ষকতা, চিকিৎসা, সৃজনশীল কলা বা ডিজাইন, আমদানি-ৰপ্তানি, খাদ্য সামগ্ৰী আৰু পৰামৰ্শ।" }
    };
    const cInfo = careerByTenthRashi[tenthRashi] || careerByTenthRashi["Aries"];

    const page10Career = `
    <div class="page page-break">
        <h2 class="section-title">❁ কৰ্মজীৱন, চাকৰি আৰু ব্যৱসায়ৰ মূল দিশ ❁</h2>
        
        <div class="sub-heading">১. দশম ভাৱ আৰু কৰ্মক্ষেত্ৰৰ দিশ (Career Direction)</div>
        <div class="info-card">
            <div class="card-content">
                আপোনাৰ জন্ম কুণ্ডলীৰ দশম ভাৱত <strong>${cInfo.asName} (${tenthRashi})</strong> ৰাশি উদিত হৈছে আৰু ইয়াৰ অধিপতি হৈছে <strong>${cInfo.lord}</strong>।<br><br>
                • <strong>কৰ্ম ব্যক্তিত্ব:</strong> ${cInfo.nature}<br>
                • <strong>গ্ৰহৰ অৱস্থান:</strong> কৰ্মফল দাতা শনি গ্ৰহ ${toAsDigits(saturnHouse)} নং ঘৰত আৰু সূৰ্য্য ${toAsDigits(sunHouse)} নং ঘৰত অৱস্থিত হোৱাৰ বাবে নিজৰ একাগ্ৰতা আৰু পৰিশ্ৰমৰ বলত আপুনি সমাজত এক অতি সন্মানজনক আসন লাভ কৰিব।
            </div>
        </div>

        <div class="sub-heading">২. আপোনাৰ বাবে আটাইতকৈ উপযুক্ত বৃত্তি আৰু ক্ষেত্ৰ (Best Career Fields)</div>
        <div class="info-card">
            <div class="card-content">
                দশম পতি আৰু বুধ-বৃহস্পতিৰ প্ৰভাৱ অনুসৰি আপুনি তলৰ ক্ষেত্ৰসমূহত জড়িত হ'লে সৰ্বাধিক সফলতা আৰু অৰ্থ অৰ্জন কৰিব পাৰিব:<br><br>
                <strong>উপযুক্ত ক্ষেত্ৰসমূহ:</strong> ${cInfo.fields}
            </div>
        </div>

        <div class="sub-heading">৩. চাকৰি নে নিজা ব্যৱসায়: কোনটোত আপুনি বেছি সফল হ'ব?</div>
        <div class="info-card">
            <div class="card-title">চাকৰি আৰু চৰকাৰী সেৱা (Job / Govt & Private Sector)</div>
            <div class="card-content">
                ✓ সূৰ্য্য (${toAsDigits(sunHouse)} নং ঘৰ) আৰু বৃহস্পতি (${toAsDigits(jupiterHouse)} নং ঘৰ) ৰ স্থিতিয়ে প্ৰশাসনিক, তদাৰকী বা নিৰ্দেশনা দিয়া উচ্চ পদবীত চাকৰি পোৱাৰ শুভ যোগ সূচায়।<br>
                ✓ পদোন্নতি আৰু সহকৰ্মীৰ মাজত সন্মান লাভ ক্ষিপ্ৰ হ'ব।
            </div>
        </div>
        <div class="info-card">
            <div class="card-title">নিজা ব্যৱসায় আৰু উদ্যোগ (Business & Entrepreneurship)</div>
            <div class="card-content">
                ✓ ব্যৱসায়ৰ কাৰক বুধ গ্ৰহ ${toAsDigits(mercuryHouse)} নং ঘৰত অৱস্থিত হোৱাৰ বাবে আপোনাৰ ব্যৱসায়িক বুদ্ধি অতি তীক্ষ্ণ। চাকৰিৰ সমান্তৰালকৈ বা স্বতন্ত্ৰভাৱে নিজা উদ্যোগ বা চুক্তিভিত্তিক কামত আপুনি প্ৰভূত ধন অৰ্জন কৰিব পাৰিব।
            </div>
        </div>
    </div>`;

    const page11WealthProperty = `
    <div class="page page-break">
        <h2 class="section-title">❁ ধনযোগ, স্থায়ী সম্পত্তি, গৃহ আৰু বাহন যোগ ❁</h2>

        <div class="sub-heading">৪. ধনযোগ আৰু আৰ্থিক সমৃদ্ধি (Wealth & Inflow)</div>
        <div class="info-card">
            <div class="card-content">
                আপোনাৰ কুণ্ডলীৰ দ্বিতীয় ভাৱত (ধন স্থানত) <strong>${rashiAsMap[secondRashi] || secondRashi}</strong> ৰাশি আৰু একাদশ ভাৱত (লাভ স্থানত) <strong>${rashiAsMap[eleventhRashi] || eleventhRashi}</strong> ৰাশি অৱস্থিত।<br><br>
                • <strong>ধন প্ৰবাহ:</strong> এই শুভ সংযোগে সূচায় যে আপোনাৰ জীৱনত ধনৰ প্ৰবাহ কেতিয়াও স্তব্ধ নহয়। জীৱনৰ প্ৰথম ভাগত কিছু অপ্ৰত্যাশিত খৰচ থাকিলেও, ২৮–৩০ বছৰ বয়সৰ পিছৰ পৰা স্থায়ী সঞ্চয় আৰু সম্পত্তি বৃদ্ধি পাব।<br>
                • <strong>একাধিক উৎসৰ পৰা আয়:</strong> এটা মুখ্য উপাৰ্জনৰ উপৰিও অতিৰিক্ত উৎসৰ পৰা (Secondary Income) স্থিৰ আয় হোৱাৰ প্ৰৱল যোগ কুণ্ডলীত বিদ্যমান।
            </div>
        </div>

        <div class="sub-heading">৫. ভূমি, গৃহ নিৰ্মাণ আৰু স্থায়ী সম্পত্তি যোগ (Property & Real Estate)</div>
        <div class="info-card">
            <div class="card-content">
                কুণ্ডলীৰ ৪ৰ্থ ভাৱত (সুখ আৰু সম্পত্তি স্থানত) <strong>${rashiAsMap[fourthRashi] || fourthRashi}</strong> ৰাশি উদিত হৈছে।<br><br>
                • <strong>মাটি-বাৰী আৰু গৃহযোগ:</strong> নিজৰ নামত মাটি ক্ৰয় কৰা বা নিজস্ব গৃহ নিৰ্মাণৰ সপোন বয়স ৩২–৩৬ বছৰৰ ভিতৰত বাস্তৱায়িত হোৱাৰ প্ৰৱল সম্ভাৱনা আছে। পৈতৃক সম্পত্তি লাভৰ যোগো শুভ।<br>
                • <strong>বাহন সুখ:</strong> নিজৰ উপাৰ্জনেৰে পচন্দৰ বাহন ক্ৰয় কৰাৰ সুন্দৰ যোগ কুণ্ডলীত বিৰাজমান।
            </div>
        </div>

        <div class="sub-heading">৬. আৰ্থিক সমৃদ্ধিৰ বিশেষ নীতি আৰু সাৱধানতা</div>
        <div class="info-card">
            <div class="card-content">
                • আৱেগৰ বশৱৰ্তী হৈ বা কোনো আইনী নথি-পত্ৰ নোহোৱাকৈ কাকো ডাঙৰ অংকৰ ধন ধাৰলৈ নিদিব।<br>
                • মাটি, সোণ বা দীর্ঘম্যাদী সুৰক্ষিত আঁচনিত ধন বিনিয়োগ কৰাটো আপোনাৰ বাবে আটাইতকৈ লাভজনক হ'ব। প্ৰতিদিনে পুৱা সূৰ্য্য অৰ্ঘ্য প্ৰদানে আৰ্থিক বাধা নিমিষতে হ্ৰাস কৰে।
            </div>
        </div>
    </div>`;

    const seventhHouseRashi = chart?.houses?.[6]?.rashi || "Libra";
    const fifthHouseRashi = chart?.houses?.[4]?.rashi || "Leo";
    const venusHouse = getPlanetHouse(chart?.planets?.Venus?.rashi_no);
    const marsHouse = getPlanetHouse(chart?.planets?.Mars?.rashi_no);
    const seventhRashiAs = rashiAsMap[seventhHouseRashi] || seventhHouseRashi;

    const partnerProfiles = {
        "Aries": { look: "সুঠাম দেহ, ক্ৰীড়াসুলভ, তীক্ষ্ণ দৃষ্টি", nature: "উদ্যমী, স্পষ্টবাদী কিন্তু মনৰ পৰা পৰিষ্কাৰ", career: "প্ৰতিৰক্ষা, ইঞ্জিনিয়াৰিং, পুলিচ বা নিজা ব্যৱসায়" },
        "Taurus": { look: "ধুনীয়া মুখমণ্ডল, মাৰ্জিত সাজ-পাৰ, শান্ত ভংগীমা", nature: "ধৈৰ্যশীল, পৰিয়ালপ্ৰিয় আৰু আৰ্থিকভাৱে সচ্ছল", career: "বেংকিং, ফাইনেন্স, কলা বা ব্যৱসায়" },
        "Gemini": { look: "যুৱসুলভ চেহেৰা, হাঁহিমুখীয়া, চঞ্চল চকু", nature: "কথা-বতৰাত পাকৈত, বুদ্ধিমান আৰু ৰসিক", career: "শিক্ষকতা, মিডিয়া, আই.টি. বা ব্যৱসায়" },
        "Cancer": { look: "কোমল মুখমণ্ডল, সংবেদনশীল দৃষ্টি", nature: "মৰমিয়াল, আৱেগিক আৰু ঘৰুৱা স্বভাৱৰ", career: "চিকিৎসা, শিক্ষা বা মানৱ সম্পদ বিভাগ" },
        "Leo": { look: "আকৰ্ষণীয় ব্যক্তিত্ব, ৰাজকীয় চাল-চলন", nature: "প্ৰভাৱশালী, আত্মবিশ্বাসী আৰু উদাৰ", career: "চৰকাৰী চাকৰি, প্ৰশাসন বা পৰিচালনা" },
        "Virgo": { look: "পৰিষ্কাৰ-পৰিচ্ছন্ন, সৰল আৰু শান্ত চেহেৰা", nature: "শৃংখলাবদ্ধ, হিচাপী আৰু বাস্তৱবাদী", career: "একাউণ্টিং, বিশ্লেষণ, চিকিৎসা বা প্ৰশাসন" },
        "Libra": { look: "অত্যন্ত সুন্দৰ ব্যক্তিত্ব, আকৰ্ষণীয় হাঁহি", nature: "ৰোমান্টিক, ন্যায়প্ৰিয় আৰু সামাজিক", career: "আইন, ব্যৱসায়, কলা বা ডিজাইন" },
        "Scorpio": { look: "গভীৰ আৰু তীক্ষ্ণ দৃষ্টি, ৰহস্যময় ব্যক্তিত্ব", nature: "আৱেগিক, বিশ্বস্ত আৰু সংকল্পবদ্ধ", career: "গৱেষণা, চিকিৎসা, প্ৰতিৰক্ষা বা টেকনিকেল" },
        "Sagittarius": { look: "উচ্চ কপাল, আশাবাদী আৰু সজীৱ চেহেৰা", nature: "ধাৰ্মিক, ভ্ৰমণপ্ৰিয় আৰু স্পষ্টবাদী", career: "শিক্ষকতা, আইন, পৰামৰ্শদাতা বা বেংকিং" },
        "Capricorn": { look: "গম্ভীৰ চেহেৰা, পৰিপক্ক ভংগীমা", nature: "পৰিশ্ৰমী, দায়িত্বশীল আৰু পৰম্পৰাপ্ৰিয়", career: "ইঞ্জিনিয়াৰিং, চৰকাৰী খণ্ড বা নিৰ্মাণ কাৰ্য" },
        "Aquarius": { look: "ব্যতিক্ৰমী আৰু আধুনিক চেহেৰা", nature: "বন্ধুত্বপূৰ্ণ, মুক্তমনা আৰু সমাজসেৱক", career: "প্ৰযুক্তি (IT), বৈজ্ঞানিক খণ্ড বা সমাজসেৱা" },
        "Pisces": { look: "কোমল আৰু আৱেগিক চকু", nature: "দয়ালু, আধ্যাত্মিক আৰু কল্পনাপ্ৰৱণ", career: "শিক্ষা, স্বাস্থ্য, বিদেশ সংযোগ বা কলা" }
    };
    const pInfo = partnerProfiles[seventhHouseRashi] || partnerProfiles["Aries"];

    const hasLoveLink = [1, 5, 7, 9, 11].includes(venusHouse);
    const marriageTypeAssessment = hasLoveLink
        ? "আপোনাৰ কুণ্ডলীত পঞ্চম ভাৱ (প্ৰেম) আৰু সপ্তম ভাৱ (বিবাহ)ৰ মাজত শুভ সম্পৰ্ক থকাৰ বাবে <strong>প্ৰেমৰ অন্তত সম্বন্ধভিত্তিক বিবাহ (Love-cum-Arranged Marriage)</strong> বা পাৰিবাৰিক সন্মতিৰে প্ৰেম বিবাহৰ সম্ভাৱনা অত্যন্ত প্ৰৱল।"
        : "আপোনাৰ কুণ্ডলীত পৰম্পৰাগত মূল্যবোধ আৰু গুৰুজনৰ আশীৰ্বাদৰ স্থান অতি গুৰুত্বপূৰ্ণ। সেয়েহে পৰিয়ালৰ মাধ্যমেৰে নিৰ্বাচিত সম্বন্ধ <strong>(Arranged Marriage)</strong> আপোনাৰ বাবে অধিক শুভ, সন্মানজনক আৰু চিৰসুখী হ'ব।";

    let earlyYear = 2027;
    let strongYearStart = 2028;
    let strongYearEnd = 2030;
    if (bYear) {
        const seedVal = (bYear + ascRashi) % 3;
        if (seedVal === 0) { earlyYear = 2027; strongYearStart = 2028; strongYearEnd = 2030; }
        else if (seedVal === 1) { earlyYear = 2028; strongYearStart = 2029; strongYearEnd = 2031; }
        else { earlyYear = 2027; strongYearStart = 2029; strongYearEnd = 2030; }
    }

    const isManglik = [1, 4, 7, 8, 12].includes(marsHouse);
    const manglikAnalysis = isManglik
        ? `আপোনাৰ জন্ম কুণ্ডলীত মংগল গ্ৰহ ${toAsDigits(marsHouse)} নং ঘৰত থকাৰ বাবে <strong>মাংগলিক দোষ (Manglik Dosha)</strong> পৰিলক্ষিত হৈছে। ইয়াৰ প্ৰভাৱত কেতিয়াবা খং বা ভুল বুজাবুজি হ'ব পাৰে। বিবাহৰ পূৰ্বে সংগীৰ কুণ্ডলীৰ সৈতে গুণ মিলান আৰু মংগলৰ স্থিতি নিৰীক্ষণ কৰাটো প্ৰয়োজনীয়।`
        : `আপোনাৰ জন্ম কুণ্ডলীত মংগল গ্ৰহ ${toAsDigits(marsHouse)} নং ঘৰত অৱস্থিত। বৈদিক গণনা অনুসৰি আপোনাৰ কুণ্ডলীত <strong>কোনো মাংগলিক দোষ নাই</strong>। দাম্পত্য জীৱন শান্তিপূৰ্ণ আৰু অনুকূল থাকিব।`;

    const page12Love = `
    <div class="page page-break">
        <h2 class="section-title">❁ প্ৰেম, ৰোমান্স আৰু আৱেগিক মানসিকতা ❁</h2>

        <div class="sub-heading">১. পঞ্চম ভাৱ আৰু প্ৰেমৰ স্বভাৱ (Romance & Nature)</div>
        <div class="info-card">
            <div class="card-content">
                আপোনাৰ কুণ্ডলীৰ পঞ্চম ভাৱত <strong>${rashiAsMap[fifthHouseRashi] || fifthHouseRashi}</strong> ৰাশি উদিত হৈছে।<br><br>
                • <strong>প্ৰেমৰ প্ৰকৃতি:</strong> আপুনি প্ৰেমৰ সম্পৰ্কত অত্যন্ত যত্নশীল, সংবেদনশীল আৰু আন্তৰিক। কাৰোবাৰ প্ৰতি আকৰ্ষিত হ'লে বন্ধুত্বৰ মাধ্যমেৰে গভীৰ আৱেগিক সংযোগ স্থাপন কৰাটো আপোনাৰ স্বভাৱ। কৃত্ৰিমতা বা প্ৰতাৰণা আপুনি সহ্য নকৰে।
            </div>
        </div>

        <div class="sub-heading">২. প্ৰেম বিবাহ নে সম্বন্ধভিত্তিক বিবাহৰ যোগ (Love vs Arranged Marriage)</div>
        <div class="info-card">
            <div class="card-content">
                ${marriageTypeAssessment}
            </div>
        </div>

        <div class="sub-heading">৩. চন্দ্ৰ আৰু শুক্ৰৰ সংমিশ্ৰণত ৰোমান্টিক গুণ</div>
        <div class="info-card">
            <div class="card-content">
                চন্দ্ৰই মন আৰু শুক্ৰই ৰোমান্সক প্ৰতিনিধিত্ব কৰে। কুণ্ডলীত শুক্ৰৰ অৱস্থানে আপোনাক ব্যক্তিত্বত এক মাৰ্জিত সৌন্দৰ্য্য আৰু আকৰ্ষণ দিছে। সংগীৰ সৈতে মুকলি কথা-বতৰা আৰু পাৰস্পৰিক সন্মানে সম্পৰ্কক চিৰদিন সতেজ কৰি ৰাখিব।
            </div>
        </div>
    </div>`;

    const page13Spouse = `
    <div class="page page-break">
        <h2 class="section-title">❁ জীৱনসংগীৰ স্বভাৱ, ৰূপৰেখা আৰু যোটক বিচাৰ ❁</h2>

        <div class="sub-heading">৪. সপ্তম ভাৱ আৰু ভৱিষ্যত জীৱনসংগীৰ ৰূপৰেখা (Spouse Profile)</div>
        <div class="info-card">
            <div class="card-content">
                আপোনাৰ কুণ্ডলীৰ সপ্তম ভাৱত (বিবাহ স্থানত) <strong>${seventhRashiAs}</strong> ৰাশি বিৰাজমান। এই ঘৰৰ আধাৰত আপোনাৰ ভৱিষ্যত জীৱনসংগীৰ বিৱৰণ:<br><br>
                • <strong>শাৰীৰিক চেহেৰা:</strong> ${pInfo.look}।<br>
                • <strong>স্বভাৱ আৰু মানসিকতা:</strong> ${pInfo.nature}। তেওঁ পৰিয়ালৰ মান-মৰ্যাদা বুজি পোৱাৰ লগতে আপোনাৰ জীৱনৰ লক্ষ্যত বিশেষ সহযোগী হ'ব।<br>
                • <strong>সম্ভাব্য কৰ্মক্ষেত্ৰ:</strong> ${pInfo.career}।<br>
                • <strong>বিবাহৰ শুভ দিশ:</strong> সপ্তম ভাৱৰ দৃষ্টি অনুসৰি সংগীৰ জন্মস্থান সাধাৰণতে পূব বা উত্তৰ দিশত হোৱাৰ সম্ভাৱনা বেছি।
            </div>
        </div>

        <div class="sub-heading">৫. ১২ ৰাশিৰ যোটক বিচাৰ আৰু শুভ মৈত্ৰী ৰাশিসমূহ (Zodiac Compatibility)</div>
        <div class="info-card">
            <div class="card-content">
                আপোনাৰ চন্দ্ৰ ৰাশিৰ তত্ত্ব অনুসৰি তলত দিয়া ৰাশিৰ সংগীৰ সৈতে আপোনাৰ আটাইতকৈ মধুৰ, বিশ্বাসযোগ্য আৰু সুখময় বুজাবুজি গঢ়ি উঠিব:<br><br>
                • <strong>সৰ্বাধিক সামঞ্জস্যপূৰ্ণ শুভ ৰাশিসমূহ:</strong> সিংহ, ধনু, মেষ, তুলা আৰু মিথুন ৰাশি।<br>
                • এই ৰাশিৰ ব্যক্তিৰ সৈতে জীৱনসংগী বা ব্যৱসায়িক অংশীদাৰীত্ব আজীৱন সুষম আৰু শান্তিপূৰ্ণ হৈ থাকে।
            </div>
        </div>
    </div>`;

    const page14MarriageTiming = `
    <div class="page page-break">
        <h2 class="section-title">❁ বৈবাহিক সময়সীমা, মাংগলিক বিচাৰ আৰু দাম্পত্য সুখ ❁</h2>

        <div class="sub-heading">৬. মাংগলিক দোষ আৰু দাম্পত্য জীৱনৰ প্ৰত্যাহ্বান (Manglik Analysis)</div>
        <div class="info-card">
            <div class="card-content">
                ${manglikAnalysis}<br><br>
                • <strong>দাম্পত্য সুখৰ সূত্ৰ:</strong> বৃহস্পতি গ্ৰহৰ শুভ প্ৰভাৱত দাম্পত্য জীৱনত সৰু-সুৰা মতানৈক্য হ'লেও, ই কেতিয়াও স্থায়ী বিচ্ছেদৰ দিশে নাযায়। পাৰস্পৰিক বিশ্বাস আৰু সংগীৰ মতামতক গুৰুত্ব দিলে সংসাৰ সদায় আনন্দময় হৈ থাকিব।
            </div>
        </div>

        <div class="sub-heading">৭. কুণ্ডলী আৰু দশা অনুসৰি বিবাহৰ নিৰ্দিষ্ট চন (Marriage Timing)</div>
        <div class="info-card">
            <div class="card-content">
                সপ্তম ভাৱাধিপতি, গুৰু বৃহস্পতিৰ গোচৰ আৰু বৰ্তমান মহাদশাৰ ভিত্তিত শুভ সময়সীমা:<br><br>
                • <strong>প্ৰথম আলোচনা আৰু সম্বন্ধৰ যোগ (${toAsDigits(earlyYear)} চন):</strong><br>
                ${toAsDigits(earlyYear)} চনত বিবাহৰ কথা-বতৰা, নতুন প্ৰস্তাৱ বা সম্বন্ধ আগবঢ়াৰ সুন্দৰ যোগ আছে।<br><br>
                • <strong>সৰ্বাধিক শক্তিশালী শুভ বিবাহ যোগ (${toAsDigits(strongYearStart)}–${toAsDigits(strongYearEnd)} চন):</strong><br>
                <strong>${toAsDigits(strongYearStart)}–${toAsDigits(strongYearEnd)} চনৰ ভিতৰত</strong> কুণ্ডলীত বিবাহৰ যোগ আটাইতকৈ বেছি শক্তিশালী আৰু ফলপ্ৰসূ হ'ব। এই সময়ছোৱাত সংগী নিৰ্বাচন আৰু শুভ বিবাহ সম্পন্ন হোৱাৰ প্ৰৱল যোগ বিৰাজমান।
            </div>
        </div>

        <div class="sub-heading">৮. বৈবাহিক সুখৰ বিশেষ প্ৰতিকাৰ</div>
        <div class="info-card">
            <div class="card-content">
                • শুক্ৰবাৰে বগা মিঠাই বা গাখীৰ দান কৰক আৰু শোৱনি কোঠাত সুগন্ধি ব্যৱহাৰ কৰক।<br>
                • দৈনিক পুৱা <em>"ওঁ কামদেৱায় বিদ্মহে পুষ্পবাণায় ধীমহি তন্নো অনংগঃ প্ৰচোদয়াৎ"</em> মন্ত্ৰ ২১ বাৰ জপ কৰিলে সম্পৰ্কৰ বাধা নিবাৰণ হয়।
            </div>
        </div>
    </div>`;

    const page15Health = `
    <div class="page page-break">
        <h2 class="section-title">❁ স্বাস্থ্য, মানসিক ভাৰসাম্য আৰু আয়ুস বিচাৰ ❁</h2>
        
        <div class="sub-heading">১. ৬ষ্ঠ ভাৱ (ৰোগ) আৰু ৮ম ভাৱ (আয়ু)ৰ বিশ্লেষণ</div>
        <div class="info-card">
            <div class="card-content">
                বৈদিক জ্যোতিষত ষষ্ঠ ভাৱে শাৰীৰিক ৰোগ প্ৰতিৰোধ আৰু অষ্টম ভাৱে দীৰ্ঘায়ু নিৰ্ধাৰণ কৰে।<br><br>
                • <strong>সামগ্ৰিক স্বাস্থ্য আৰু আয়ুস:</strong> আপোনাৰ কুণ্ডলীত লগ্নপতি আৰু অষ্টম ভাৱাধিপতিৰ শুভ দৃষ্টি থকাৰ বাবে আপোনাৰ শৰীৰত ৰোগ প্ৰতিৰোধ ক্ষমতা শক্তিশালী আৰু আয়ুস দীৰ্ঘ। কোনো ভয়াবহ দুৰ্ঘটনাৰ যোগ নাই।<br>
                • <strong>সাৱধান হ'বলগীয়া শৰীৰৰ অংশ:</strong> ঋতু পৰিৱৰ্তনৰ সময়ত পেটৰ হজম শক্তি, এলাৰ্জি, অনিদ্ৰা বা স্নায়ৱিক ভাগৰৰ প্ৰতি সাৱধান হোৱা প্ৰয়োজন।
            </div>
        </div>

        <div class="sub-heading">২. ত্ৰিদোষ বিচাৰ আৰু প্ৰাকৃতিক ভাৰসাম্য (Vata / Pitta / Kapha)</div>
        <div class="info-card">
            <div class="card-content">
                আপোনাৰ ৰাশিৰ তত্ত্ব অনুসৰি শৰীৰত <strong>পিত্ত আৰু বায়ুৰ ভাৰসাম্য</strong> বজাই ৰখাটো অতি জৰুৰী।<br><br>
                • <strong>খাদ্যাভ্যাসৰ পৰামৰ্শ:</strong> অতিৰিক্ত জ্বলা-তেল-মচলাযুক্ত খাদ্য পৰিহাৰ কৰি সময়মতে আহাৰ গ্ৰহণ কৰক। পৰ্যাপ্ত পৰিমাণে পানী পান কৰাটো আপোনাৰ স্নায়ৱিক শক্তিৰ বাবে প্ৰয়োজনীয়।<br>
                • <strong>মানসিক প্ৰশান্তি:</strong> দৈনিক অন্ততঃ ১৫ মিনিট পুৱাৰ ৰ'দত খোজ কঢ়া বা প্ৰাণায়াম কৰিলে মানসিক একাগ্রতা আৰু আত্মবিশ্বাস দুগুণ বৃদ্ধি পায়।
            </div>
        </div>
    </div>`;

    const curYear = new Date().getFullYear();
    const yArr = [curYear, curYear + 1, curYear + 2, curYear + 3, curYear + 4];

    
    const page16PalmistryLines = `
    <div class="page page-break">
        <h2 class="section-title">❁ হস্তৰেখা আৰু সামুদ্ৰিক শাস্ত্ৰ বিচাৰ (প্ৰধান ৰেখাসমূহ) ❁</h2>
        <div class="shloka">"হস্তৰেখা মানৱস্য ভাগ্যস্য স্পষ্ট দৰ্পণম্।"</div>
        <div class="text-section">
            বৈদিক সামুদ্ৰিক শাস্ত্ৰ আৰু হস্তৰেখা বিজ্ঞান অনুসৰি মানুহৰ হাতৰ তলুৱা হৈছে অন্তৰ্নিহিত সম্ভাৱনা আৰু ভাগ্যৰ প্ৰত্যক্ষ প্ৰতিফলন। আপোনাৰ জন্ম কুণ্ডলীৰ লগ্ন-ৰাশি আৰু প্ৰকৃতিৰ আধাৰত প্ৰধান ৰেখাসমূহৰ বিশদ বিশ্লেষণ তলত আগবঢ়োৱা হ'ল:
        </div>

        <div class="sub-heading">১. তলুৱাৰ পঞ্চতত্ত্ব আৰু মূল প্ৰকৃতি</div>
        <div class="info-card">
            <div class="card-content">
                • <strong>হস্তপ্ৰকৃতি আৰু ব্যক্তিত্ব:</strong> আপোনাৰ হাতৰ গঠন শুভ লক্ষণযুক্ত আৰু সুসামঞ্জস্যপূৰ্ণ। তলুৱাৰ দৃঢ়তাই মানসিক সুস্থিৰতা, গভীৰ চিন্তা আৰু আত্মবিশ্বাস প্ৰকাশ কৰে। জটিল আৰু প্ৰত্যাহ্বানপূৰ্ণ পৰিস্থিতিতো সঠিক সিদ্ধান্ত গ্ৰহণ কৰিব পৰা এক জন্মগত ক্ষমতা আপোনাৰ ব্যক্তিত্বত বিদ্যমান।
            </div>
        </div>

        <div class="sub-heading">২. জীৱন ৰেখা (Life Line - প্ৰাণশক্তি, স্বাস্থ্য আৰু আয়ুস)</div>
        <div class="info-card">
            <div class="card-content">
                • <strong>দীৰ্ঘায়ু আৰু জীৱনীশক্তি:</strong> শুক্ৰ পৰ্বতক সুন্দৰভাৱে আৱৰি থকা গভীৰ আৰু নিৰৱচ্ছিন্ন জীৱন ৰেখাই সু-স্বাস্থ্য, প্ৰচুৰ কৰ্মশক্তি আৰু মানসিক সহনশীলতা সূচায়। জীৱনৰ মধ্যভাগত সামান্য কৰ্মব্যস্ততা বা মানসিক চাপ আহিলেও এক অদৃশ্য দৈৱিক ৰক্ষাকৱচে আপোনাক সকলো ব্যাধি আৰু বিপদৰ পৰা সুৰক্ষিত ৰাখিব।
            </div>
        </div>

        <div class="sub-heading">৩. মস্তিষ্ক ৰেখা (Head Line - মেধা আৰু সিদ্ধান্ত গ্ৰহণ)</div>
        <div class="info-card">
            <div class="card-content">
                • <strong>তীক্ষ্ণ বুদ্ধি আৰু বাস্তৱবাদী মন:</strong> স্পষ্ট মস্তিষ্ক ৰেখাই বাস্তৱবাদী চিন্তাধাৰা, গভীৰ বিশ্লেষণাত্মক মেধা আৰু বৌদ্ধিক পৰিপক্কতাৰ ইংগিত দিয়ে। আৱেগৰ বশবৰ্তী নহৈ যুক্তি আৰু জ্ঞানেৰে কাম কৰাৰ অভ্যাসে কেৰিয়াৰ আৰু ব্যৱসায়ত আপোনাক সদায় এক অগ্ৰণী স্থানত ৰাখিব।
            </div>
        </div>

        <div class="sub-heading">৪. হৃদয় ৰেখা (Heart Line - আৱেগ, সম্পৰ্ক আৰু পাৰিবাৰিক বন্ধন)</div>
        <div class="info-card">
            <div class="card-content">
                • <strong>উদাৰ হৃদয় আৰু নিস্বাৰ্থ প্ৰেম:</strong> বৃহস্পতি পৰ্বতৰ দিশে ধাৱমান হৃদয় ৰেখাই উদাৰ, দায়িত্বশীল আৰু গভীৰ সম্বন্ধ গঢ়ি তোলাৰ প্ৰৱণতা দেখুৱায়। সংসাৰ আৰু সম্বন্ধৰ প্ৰতি আপোনাৰ নিষ্ঠা গভীৰ, যিয়ে পৰিয়ালত শান্তি আৰু সুসম্পৰ্ক বজাই ৰখাত গুৰুত্বপূৰ্ণ ভূমিকা ল'ব।
            </div>
        </div>

        <div class="sub-heading">৫. ভাগ্য ৰেখা (Fate Line - কৰ্মজীৱন আৰু স্বাৱলম্বনৰ গতিপথ)</div>
        <div class="info-card" style="border-left-color: #d97706; background: rgba(217, 119, 6, 0.08);">
            <div class="card-title" style="color: #b45309;">🌟 কৰ্মজীৱন আৰু স্বাৱলম্বনৰ গতিপথ</div>
            <div class="card-content">
                • <strong>ভাগ্যোদয়ৰ স্থিৰ দিশ:</strong> শনি পৰ্বতৰ দিশে বিস্তৃত ভাগ্য ৰেখাই স্ব-উদ্যোগ আৰু নিজৰ শ্ৰমৰ বিনিময়ত ডাঙৰ সফলতা পোৱাৰ স্পষ্ট সংকেত দিয়ে। প্ৰাৰম্ভিক সংগ্ৰামৰ পিছত এক নিৰ্দিষ্ট বয়সৰ পৰা আৰ্থিক সমৃদ্ধি আৰু কৰ্মক্ষেত্ৰত স্থায়ী স্থিতি লাভ হ'ব।
            </div>
        </div>
    </div>`;

    const page17PalmistryMounts = `
    <div class="page page-break">
        <h2 class="section-title">❁ হস্তৰেখাৰ গ্ৰহ পৰ্বত আৰু শুভ মাংগলিক চিহ্ন ❁</h2>
        <div class="shloka">"পৰ্বতাঃ কৰতলে স্থিতাঃ শুভাশুভ ফলপ্ৰদাঃ।"</div>
        <div class="text-section">
            হস্ততলৰ বিভিন্ন গ্ৰহ পৰ্বত (Mounts) আৰু তাত অৱস্থিত বিশেষ চিহ্নসমূহে মানৱ জীৱনলৈ দৈৱিক আশীৰ্বাদ, আকস্মিক ভাগ্যোদয় আৰু সামাজিক প্ৰতিষ্ঠা কঢ়িয়াই আনে:
        </div>

        <div class="sub-heading">১. বৃহস্পতি পৰ্বত (Mount of Jupiter - জ্ঞান আৰু নেতৃত্ব)</div>
        <div class="info-card">
            <div class="card-content">
                • <strong>নেতৃত্ব আৰু সমাজত মান-সন্মান:</strong> তৰ্জনী আঙুলিৰ তলৰ শুভ বৃহস্পতি পৰ্বতে আধ্যাত্মিক মেধা, সামাজিক মৰ্যাদা আৰু নেতৃত্বৰ গুণ সূচায়। সমাজত আপোনাৰ কথাক লোকে গুৰুত্ব সহকাৰে ল'ব আৰু পৰামৰ্শদাতা হিচাপে আপোনাৰ উচ্চ সমাদৰ থাকিব।
            </div>
        </div>

        <div class="sub-heading">২. শুক্ৰ পৰ্বত (Mount of Venus - ভোগ, সৌন্দৰ্য আৰু বাহন)</div>
        <div class="info-card">
            <div class="card-content">
                • <strong>সৌন্দৰ্য্যবোধ আৰু বিলাসী জীৱন:</strong> বুঢ়া আঙুলিৰ গুৰিত অৱস্থিত উন্নত শুক্ৰ পৰ্বতে গৃহ সুখ, বাহন প্ৰাপ্তি আৰু পাৰিবাৰিক আনন্দ প্ৰদান কৰে। শিল্প-সংস্কৃতি, সংগীত আৰু সুন্দৰ পৰিৱেশৰ প্ৰতি আপোনাৰ সহজাত আকৰ্ষণ থাকিব।
            </div>
        </div>

        <div class="sub-heading">৩. সূৰ্য পৰ্বত (Mount of Sun - যশ আৰু খ্যাতি)</div>
        <div class="info-card">
            <div class="card-content">
                • <strong>খ্যাতি আৰু চৰকাৰী সমৰ্থন:</strong> অনামিকা আঙুলিৰ তলৰ সূৰ্য পৰ্বতে কৰ্মক্ষেত্ৰত উচ্চ প্ৰশংসা, চৰকাৰী বিষয়া বা গণ্যমান্য ব্যক্তিৰ পৰা সহযোগিতা পোৱাত সহায় কৰে।
            </div>
        </div>

        <div class="sub-heading">৪. হস্ততলৰ বিশেষ শুভ মাংগলিক চিহ্নসমূহ</div>
        <div class="info-card" style="border-left-color: #059669; background: rgba(5, 150, 105, 0.08);">
            <div class="card-title" style="color: #047857;">🔱 দৈৱিক ৰক্ষাকৱচ আৰু ঐশ্বৰ্য যোগ</div>
            <div class="card-content">
                • <strong>ত্ৰিশূল বা পদুম চিহ্ন (Trishul / Lotus):</strong> পৰ্বতৰ শীৰ্ষত ত্ৰিশূল বা পদুম সদৃশ ৰেখাৰ সংমিশ্ৰণে ভগৱানৰ বিশেষ আশীৰ্বাদ আৰু শত্ৰুৰ ওপৰত বিজয় সূচায়।<br>
                • <strong>মাংগলিক ধন ত্ৰিভুজ (Money Triangle):</strong> মস্তিষ্ক, স্বাস্থ্য আৰু ভাগ্য ৰেখাৰ সংযোগত গঠিত ত্ৰিভুজে জীৱনত স্থায়ী সঞ্চয়, ভূমি-সম্পত্তি ক্ৰয় আৰু বিত্তীয় নিৰাপত্তা সুনিশ্চিত কৰে।<br>
                • <strong>মৎস্য চিহ্ন (Fish Symbol):</strong> কেতু বা চন্দ্ৰ পৰ্বতত মৎস্য সদৃশ গঠনে দীৰ্ঘকালীন ভ্ৰমণ, তীৰ্থস্থান গমন আৰু হঠাৎ ভাগ্যোদয়ৰ শুভ ইংগিত বহন কৰে।
            </div>
        </div>

        <div class="sub-heading">৫. হস্তৰেখাভিত্তিক সাধনা আৰু দৈৱিক পৰামৰ্শ</div>
        <div class="info-card">
            <div class="card-content">
                • প্ৰতিদিনে পুৱা সাৰ পাই নিজৰ দুয়োখন হাতৰ তলুৱা একেলগে চাই <em>"কৰাগ্ৰে বসতে লক্ষ্মীঃ কৰমধ্যে সৰস্বতী। কৰমূলে তু গোবিন্দঃ প্ৰভাতে কৰদৰ্শনম্॥"</em> মন্ত্ৰ উচ্চাৰণ কৰিলে হাতৰ শুভ ৰেখাসমূহ সক্ৰিয় হৈ উঠে আৰু জীৱনৰ ঋণাত্মক প্ৰভাৱ নাশ হয়।
            </div>
        </div>
    </div>`;

const page18FiveYearForecast = `
    <div class="page page-break">
        <h2 class="section-title">❁ অহা ৫ বছৰৰ বাৰ্ষিক মহাচক্ৰ আৰু ভৱিষ্যদ্বাণী ❁</h2>
        <div class="text-section">
            পৰৱৰ্তী ৫টা বছৰৰ বাবে গুৰু আৰু শনিৰ মহাজাগতিক গোচৰ ফল অনুসৰি বছৰেকীয়া বিস্তৃত পূৰ্বাভাস:
        </div>

        <div class="sub-heading">🗓️ ${toAsDigits(yArr[0])} চন: কৰ্মক্ষেত্ৰত সক্ৰিয়তা আৰু ভেটি সুদৃঢ় কৰণ</div>
        <div class="info-card">
            <div class="card-content">
                এই বছৰটোত আপোনাৰ কৰ্মক্ষেত্ৰত নতুন দায়িত্ব আৰু সুযোগ আহিব। পূৰ্বৰ আধৰুৱা কামসমূহ সমাপ্ত হ'ব। আৰ্থিক পৰিকল্পনাত শৃংখলা বজাই ৰাখিলে বছৰৰ দ্বিতীয়াৰ্ধত বিশেষ লাভ অৰ্জন কৰিব পাৰিব।
            </div>
        </div>

        <div class="sub-heading">🗓️ ${toAsDigits(yArr[1])} চন: স্থান পৰিৱৰ্তন, নতুন সুযোগ আৰু বিবাহ আলোচনা</div>
        <div class="info-card">
            <div class="card-content">
                কেৰিয়াৰত এক ডাঙৰ ইতিবাচক পৰিৱৰ্তন বা সন্মানজনক স্থান লাভৰ প্ৰৱল যোগ। অবিবাহিতসকলৰ বাবে বিবাহৰ সম্বন্ধ অগ্ৰগতি লাভ কৰিব। নতুন যোগাযোগৰ দ্বাৰা ভৱিষ্যতৰ সুদৃঢ় পথ মুকলি হ'ব।
            </div>
        </div>

        <div class="sub-heading">🗓️ ${toAsDigits(yArr[2])} চন: আৰ্থিক সমৃদ্ধি আৰু সাফল্যৰ শিখৰ</div>
        <div class="info-card">
            <div class="card-content">
                বৃহস্পতি আৰু শনিৰ শুভ সংযোগে এই বছৰত আপোনাৰ আয়ৰ মাত্ৰা বৃদ্ধি কৰিব। ব্যৱসায়িক সম্প্ৰসাৰণ আৰু সামাজিক মান-সন্মান বৃদ্ধি পাব। পাৰিবাৰিক শান্তি বজাই থাকিব।
            </div>
        </div>

        <div class="sub-heading">🗓️ ${toAsDigits(yArr[3])} চন: স্থায়ী সম্পত্তি, গৃহ আৰু বাহন যোগ</div>
        <div class="info-card">
            <div class="card-content">
                মাটি-বাৰী, গৃহ নিৰ্মাণ বা স্থায়ী সম্পত্তি ক্ৰয়ৰ বাবে এই বছৰটো আটাইতকৈ ফলপ্ৰসূ হ'ব। দীৰ্ঘম্যাদী বিনিয়োগত শুভ ফল দেখা যায়। স্বাস্থ্যৰ প্ৰতি সতৰ্ক দৃষ্টি ৰাখিব।
            </div>
        </div>

        <div class="sub-heading">🗓️ ${toAsDigits(yArr[4])} চন: মানসিক স্থিৰতা, পুণ্য অৰ্জন আৰু ভৱিষ্যত পৰিকল্পনা</div>
        <div class="info-card">
            <div class="card-content">
                পূৰ্বৰ পৰিশ্ৰমৰ সুন্দৰ ফল ভোগ কৰাৰ সময়। ধৰ্মীয় কাৰ্যত মন বহিব। পৰিয়াল আৰু সমাজত আপোনাৰ স্থিতি এক আদৰ্শ আৰু প্ৰভাৱশালী স্থান হিচাপে প্ৰতিষ্ঠিত হ'ব।
            </div>
        </div>
    </div>`;

    const gemstoneGuide = {
        "Aries": { gem: "ৰক্ত প্ৰবাল (Red Coral)", alt: "মাণিক্য (Ruby)", metal: "সোণ বা তাম", finger: "অনামিকা (Ring Finger)", day: "মঙলবাৰে পুৱা", lord: "মংগল" },
        "Taurus": { gem: "বগা ওপাল (White Opal) বা হীৰা", alt: "নীলা (Blue Sapphire)", metal: "ৰূপ বা প্লেটিনাম", finger: "মাজু আঙুলি বা অনামিকা", day: "শুক্ৰবাৰে পুৱা", lord: "শুক্ৰ" },
        "Gemini": { gem: "পান্না (Emerald)", alt: "বগা ওপাল", metal: "সোণ বা ব্ৰঞ্জ", finger: "কনিষ্ঠা (Little Finger)", day: "বুধবাৰে পুৱা", lord: "বুধ" },
        "Cancer": { gem: "মুকুতা (Natural Pearl)", alt: "ৰক্ত প্ৰবাল", metal: "ৰূপ (Silver)", finger: "কনিষ্ঠা বা অনামিকা", day: "সোমবাৰে পুৱা", lord: "চন্দ্ৰ" },
        "Leo": { gem: "মাণিক্য (Ruby)", alt: "পীত পোখৰাজ", metal: "সোণ বা তাম", finger: "অনামিকা (Ring Finger)", day: "দেওবাৰে পুৱা", lord: "সূৰ্য" },
        "Virgo": { gem: "পান্না (Emerald)", alt: "বগা ওপাল", metal: "সোণ বা ৰূপ", finger: "কনিষ্ঠা (Little Finger)", day: "বুধবাৰে পুৱা", lord: "বুধ" },
        "Libra": { gem: "বগা ওপাল (White Opal) বা হীৰা", alt: "পান্না", metal: "ৰূপ (Silver)", finger: "মাজু আঙুলি বা অনামিকা", day: "শুক্ৰবাৰে পুৱা", lord: "শুক্ৰ" },
        "Scorpio": { gem: "ৰক্ত প্ৰবাল (Red Coral)", alt: "পীত পোখৰাজ", metal: "সোণ বা তাম", finger: "অনামিকা (Ring Finger)", day: "মঙলবাৰে পুৱা", lord: "মংগল" },
        "Sagittarius": { gem: "পীত পোখৰাজ (Yellow Sapphire)", alt: "মাণিক্য", metal: "সোণ বা পিতল", finger: "তৰ্জনী (Index Finger)", day: "বৃহস্পতিবাৰে পুৱা", lord: "বৃহস্পতি" },
        "Capricorn": { gem: "নীলা (Blue Sapphire)", alt: "পান্না বা জামুনিয়া", metal: "পঞ্চধাতু বা ৰূপ", finger: "মাজু আঙুলি (Middle Finger)", day: "শনিবাৰে সন্ধিয়া", lord: "শনি" },
        "Aquarius": { gem: "নীলা (Blue Sapphire)", alt: "বগা ওপাল", metal: "পঞ্চধাতু বা ৰূপ", finger: "মাজু আঙুলি (Middle Finger)", day: "শনিবাৰে পুৱা", lord: "শনি" },
        "Pisces": { gem: "পীত পোখৰাজ (Yellow Sapphire)", alt: "মুকুতা", metal: "সোণ (Gold)", finger: "তৰ্জনী (Index Finger)", day: "বৃহস্পতিবাৰে পুৱা", lord: "বৃহস্পতি" }
    };
    const gemInfo = gemstoneGuide[chart.ascendant.rashi] || gemstoneGuide["Aries"];

    const dashaRemedies = {
        "Sun": { asName: "সূৰ্য", mantra: "ওঁ হ্ৰাং হ্ৰীং হ্ৰৌং সঃ সূৰ্যায় নমঃ", dan: "দেওবাৰে তামৰ পাত্ৰত জল অৰ্পণ কৰক আৰু ঘেঁহু বা গুড় দান কৰক।" },
        "Moon": { asName: "চন্দ্ৰ", mantra: "ওঁ শ্ৰাং শ্ৰীং শ্ৰৌং সঃ চন্দ্ৰমসে নমঃ", dan: "সোমবাৰে শিৱলিংগত জলাভিষেক কৰক আৰু চাউল বা গাখীৰ দান কৰক।" },
        "Mars": { asName: "মংগল", mantra: "ওঁ ক্ৰাং ক্ৰীং ক্ৰৌং সঃ ভৌমায় নমঃ", dan: "মঙলবাৰে হনুমান চালিছা পাঠ কৰক আৰু মচুৰ দাইল দান কৰক।" },
        "Mercury": { asName: "বুধ", mantra: "ওঁ ব্ৰাং ব্ৰীং ব্ৰৌং সঃ বুধায় নমঃ", dan: "বুধবাৰে গো-মাতাক সেউজীয়া ঘাঁহ খুৱাওক আৰু মগু দাইল দান কৰক।" },
        "Jupiter": { asName: "বৃহস্পতি", mantra: "ওঁ গ্ৰাং গ্ৰীং গ্ৰৌং সঃ গুৰৱে নমঃ", dan: "বৃহস্পতিবাৰে হালধীয়া বস্তু, বুটৰ দাইল বা ধৰ্মীয় গ্ৰন্থ দান কৰক।" },
        "Venus": { asName: "শুক্ৰ", mantra: "ওঁ দ্ৰাং দ্ৰীং দ্ৰৌং সঃ শুক্ৰায় নমঃ", dan: "শুক্ৰবাৰে বগা মিঠাই, দৈ বা সুগন্ধি দ্ৰব্য দান কৰক।" },
        "Saturn": { asName: "শনি", mantra: "ওঁ প্ৰাং প্ৰীং প্ৰৌং সঃ শনৈশ্চৰায় নমঃ", dan: "শনিবাৰে সন্ধিয়া আঁহত গছৰ তলত মিঠাতেলৰ চাকি জ্বলাওক আৰু দৰিদ্ৰক ভোজন কৰাওক।" },
        "Rahu": { asName: "ৰাহু", mantra: "ওঁ ভ্ৰাং ভ্ৰীং ভ্ৰৌং সঃ ৰাহৱে নমঃ", dan: "শনিবাৰে চৰাই-চিৰিকটিক সাতবিধ শস্য দিয়ক আৰু ক'লা তিল দান কৰক।" },
        "Ketu": { asName: "কেতু", mantra: "ওঁ স্ত্ৰাং স্ত্ৰীং স্ত্ৰৌং সঃ কেতৱে নমঃ", dan: "মঙলবাৰে গণেশ দেৱতাক দূবৰি বন অৰ্পণ কৰক আৰু কুকুৰক খাদ্য খুৱাওক।" }
    };
    const dRemedy = dashaRemedies[currentDasha] || { asName: currentDasha, mantra: "ওঁ নমঃ শিৱায়", dan: "সপ্তাহত এদিন দৰিদ্ৰক সাধ্যানুসৰি অন্ন দান কৰক।" };

    const page19Remedies = `
    <div class="page page-break">
        <h2 class="section-title">❁ বৈদিক নিদান, মহা প্ৰতিকাৰ আৰু ৰত্ন ধাৰণ বিধি ❁</h2>
        <div class="text-section">
            বৈদিক জ্যোতিষত প্ৰতিকাৰসমূহ ভয়ৰ আধাৰত নহয়, বৰঞ্চ কুণ্ডলীৰ শুভ গ্ৰহৰ শক্তি বৃদ্ধি কৰিবলৈ আৰু অশুভ প্ৰভাৱ হ্ৰাস কৰিবলৈ ব্যৱহাৰ কৰা হয়।
        </div>

        <div class="info-card remedy-card">
            <div class="card-title">💎 শুভ ৰত্ন আৰু ধাৰণ বিধি (Lucky Gemstone Guide)</div>
            <div class="card-content">
                আপোনাৰ <strong>${ascRashiName}</strong> লগ্নৰ অধিপতি গ্ৰহ (${gemInfo.lord}) ৰ শক্তি বৃদ্ধিৰ বাবে সৰ্বোত্তম ৰত্ন হৈছে <strong>${gemInfo.gem}</strong>।<br><br>
                • <strong>বিকল্প ৰত্ন (সহায়কাৰী):</strong> ${gemInfo.alt} &nbsp;|&nbsp; <strong>ধাতু:</strong> ${gemInfo.metal}<br>
                • <strong>ধাৰণৰ আঙুলি:</strong> সোঁহাতৰ ${gemInfo.finger} &nbsp;|&nbsp; <strong>শুভ সময়:</strong> ${gemInfo.day}<br>
                <em>(বি.দ্ৰ.: ৰত্নটো কেঁচা গাখীৰ আৰু গংগাজলেৰে শুদ্ধ কৰি ইষ্ট দেৱতাক স্মৰণ কৰি ধাৰণ কৰিব)।</em>
            </div>
        </div>

        <div class="info-card remedy-card">
            <div class="card-title">🕉️ বৰ্তমান মহাদশাৰ বিশেষ নিদান (${dRemedy.asName} মহাদশা)</div>
            <div class="card-content">
                বৰ্তমান আপোনাৰ জীৱনত চলি থকা <strong>${dRemedy.asName} মহাদশা</strong>ৰ সৰ্বোচ্চ শুভ ফল লাভ কৰিবলৈ তলৰ বিধি পালন কৰক:<br><br>
                • <strong>বৈদিক বীজ মন্ত্ৰ:</strong> <em>"${dRemedy.mantra}"</em> (দৈনিক পুৱা ১০৮ বাৰ বা অন্ততঃ ২৭ বাৰ জপ কৰিব)।<br>
                • <strong>দশা শান্তি দান:</strong> ${dRemedy.dan}
            </div>
        </div>
    </div>`;

    const page20SpiritualSeal = `
    <div class="page">
        <h2 class="section-title">❁ প্ৰাত্যহিক আধ্যাত্মিক সাধনা আৰু জীৱনৰ মূল মন্ত্ৰ ❁</h2>

        <div class="info-card remedy-card">
            <div class="card-title">🌿 দৈনন্দিন জীৱনশৈলী আৰু আধ্যাত্মিক সাধনা</div>
            <div class="card-content">
                <ul>
                    <li><strong>সূৰ্য অৰ্ঘ্য আৰু গায়ত্ৰী সাধনা:</strong> আত্মবিশ্বাস, সুস্বাস্থ্য আৰু তেজ বৃদ্ধিৰ বাবে প্রতিদিনে পুৱা সূৰ্য দেৱতাক তামৰ পাত্ৰত জল অৰ্পণ কৰক আৰু গায়ত্ৰী মন্ত্ৰ জপ কৰক।</li>
                    <li><strong>মানসিক প্ৰশান্তি:</strong> মানসিক চাপ হ্ৰাস আৰু সঠিক সিদ্ধান্ত গ্ৰহণৰ বাবে দৈনিক ১০ মিনিট <em>"ওঁ নমঃ শিৱায়"</em> মন্ত্ৰ জপ কৰি ধ্যান কৰক।</li>
                    <li><strong>পিতৃ-মাতৃ আৰু গুৰুভক্তি:</strong> পিতৃ-মাতৃ আৰু জ্যেষ্ঠজনক নিতৌ শ্ৰদ্ধা কৰক। ই বৃহস্পতি আৰু সূৰ্য্যৰ দোষ নিমিষতে খণ্ডন কৰে।</li>
                    <li><strong>বাস্তু পৰামৰ্শ:</strong> অধ্যয়ন বা কাম কৰোঁতে সদায় পূব বা উত্তৰ দিশলৈ মুখ কৰি বহিব। ঘৰৰ ঈশান কোণ সদায় পৰিষ্কাৰ কৰি ৰাখিব।</li>
                </ul>
            </div>
        </div>

        <div class="disclaimer">
            <strong>⚠️ অস্বীকাৰকৰণ (Disclaimer):</strong><br>
            এই ৰিপোৰ্টখন লাহিৰী অয়নাংশ আৰু প্ৰাচীন বৈদিক জ্যোতিষ শাস্ত্ৰৰ গাণিতিক সূত্ৰৰ আধাৰত কম্পিউটাৰ জেনেইটেড। ইয়াক জীৱনৰ পথ প্ৰদৰ্শক হিচাপে ব্যৱহাৰ কৰক। জীৱনৰ চূড়ান্ত সফলতা আপোনাৰ সৎ কৰ্ম, নিষ্ঠা আৰু নিৰন্তৰ প্ৰচেষ্টাৰ ওপৰত নিৰ্ভৰশীল।
        </div>

        <div class="footer-seal">
            ॥ ইতি জ্যোতিষ অসম ॥<br>
            <strong>"আপোনাৰ জন্ম-কুণ্ডলী • আপোনাৰ সময় • আপোনাৰ সম্ভাৱনা"</strong>
        </div>
    </div>`;

    let assembledPages = "";
    if (service === 'career') {
        assembledPages = page3Navagraha1 + page6Houses1 + page9LifetimeRoadmap + page10Career + page11WealthProperty + page16PalmistryLines + page18FiveYearForecast + page19Remedies + page20SpiritualSeal;
    } else if (service === 'love') {
        assembledPages = page4Navagraha2 + page6Houses1 + page9LifetimeRoadmap + page12Love + page13Spouse + page14MarriageTiming + page16PalmistryLines + page18FiveYearForecast + page19Remedies + page20SpiritualSeal;
    } else {
        // Complete 18-page Grand Report for birth & full horoscope
        assembledPages = page3Navagraha1 + page4Navagraha2 + page5Navagraha3 + page6Houses1 + page7Houses2 + page8Houses3 + page9LifetimeRoadmap + page10Career + page11WealthProperty + page12Love + page13Spouse + page14MarriageTiming + page15Health + page16PalmistryLines + page17PalmistryMounts + page18FiveYearForecast + page19Remedies + page20SpiritualSeal;
    }

    return `
    <!DOCTYPE html>
    <html lang="as">
    <head>
        <meta charset="UTF-8">
        <title>${name} - জ্যোতিষ অসম ৰিপোৰ্ট</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Assamese:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Noto Sans Assamese', Georgia, serif; line-height: 1.8; color: #3e2723; background: #e8dcc4; margin: 0; padding: 20px; }
            .page { max-width: 850px; margin: 0 auto 30px; background: #fdf5e6; padding: 50px 45px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); border: 8px double #8b0000; position: relative; box-sizing: border-box; }
            .page::before { content: ''; position: absolute; top: 10px; left: 10px; right: 10px; bottom: 10px; border: 2px solid #8b0000; pointer-events: none; }
            .cover { text-align: center; display: flex; flex-direction: column; justify-content: center; min-height: 80vh; }
            .om-symbol { font-size: 80px; color: #8b0000; margin-bottom: 20px; }
            .cover-brand { font-size: 45px; font-weight: 700; color: #5c3a21; margin-bottom: 10px; border-bottom: 2px solid #8b0000; display: inline-block; padding-bottom: 10px;}
            .cover-subtitle { font-size: 24px; color: #8b0000; margin-bottom: 40px; font-weight: 600; }
            .cover-details { margin-top: 40px; text-align: left; background: rgba(219, 190, 146, 0.2); padding: 30px; border: 1px solid #c9a961; border-radius: 4px; }
            .detail-row { font-size: 18px; margin-bottom: 12px; border-bottom: 1px dashed #c9a961; padding-bottom: 5px; }
            .detail-label { font-weight: 600; color: #8b0000; display: inline-block; width: 150px; }
            .section-title { font-size: 26px; font-weight: 700; color: #8b0000; text-align: center; margin-bottom: 30px; border-bottom: 2px solid #8b0000; padding-bottom: 10px; }
            .sub-heading { font-size: 19px; color: #5c3a21; margin-top: 25px; margin-bottom: 12px; border-left: 4px solid #8b0000; padding-left: 10px; font-weight: bold;}
            .shloka { text-align: center; font-size: 18px; color: #8b0000; font-style: italic; margin: 20px 0 35px; padding: 15px; background: rgba(139,0,0,0.05); border-radius: 5px; }
            .text-section { font-size: 16px; margin-bottom: 20px; text-align: justify; }
            .info-card { background: rgba(219, 190, 146, 0.15); border: 1px solid #d4b483; border-left: 5px solid #8b0000; padding: 18px; margin: 14px 0; border-radius: 3px; }
            .remedy-card { border-left-color: #5c3a21; background: rgba(92, 58, 33, 0.05); }
            .card-title { font-weight: 700; color: #8b0000; margin-bottom: 10px; font-size: 18px; }
            .card-content { font-size: 15.5px; color: #3e2723; text-align: justify; line-height: 1.7; }
            .vedic-table { width: 100%; border-collapse: collapse; margin: 20px 0; border: 2px solid #8b0000; }
            .vedic-table th { background: #8b0000; color: #fdf5e6; padding: 10px 12px; text-align: center; font-size: 15px; border: 1px solid #5c3a21; }
            .vedic-table td { padding: 10px 12px; border: 1px solid #a67b5b; text-align: center; color: #3e2723; font-size: 15px; }
            .vedic-table tr:nth-child(even) { background: rgba(219, 190, 146, 0.2); }
            .kundali-wrapper { display: flex; flex-direction: column; align-items: center; margin: 25px 0; }
            .disclaimer { background: rgba(139, 0, 0, 0.05); padding: 15px; margin-top: 35px; font-size: 14px; border: 1px solid #8b0000; text-align: justify; }
            .footer-seal { text-align: center; margin-top: 35px; color: #8b0000; font-size: 18px; font-weight: bold; border-top: 2px dashed #8b0000; padding-top: 18px; }
            .print-btn-wrapper { text-align: center; margin-top: 15px; padding-bottom: 30px; }
            .print-btn { background: #8b0000; color: #fdf5e6; border: 2px solid #5c3a21; padding: 14px 32px; font-size: 18px; cursor: pointer; font-weight: bold; border-radius: 6px; }
            ul { margin: 10px 0 10px 20px; }
            li { margin-bottom: 8px; }
            @media print {
                @page { margin: 8mm; }
                body { background: #fdf5e6; padding: 0; }
                .page { box-shadow: none; margin: 0; border: 4px double #8b0000; width: 100%; max-width: 100%; }
                .page-break { page-break-after: always; }
                .print-btn-wrapper, .report-nav-bar, .no-print { display: none !important; }
            }
        </style>
    </head>
    <body>
        <div class="print-btn-wrapper no-print">
            <button class="print-btn" onclick="window.print()">📥 ৰিপোৰ্ট প্ৰিন্ট বা PDF ছেভ কৰক</button>
        </div>
        
        <!-- PAGE 1: COVER -->
        <div class="page page-break cover">
            <div class="om-symbol">ॐ</div>
            <div><h1 class="cover-brand">জ্যোতিষ অসম</h1></div>
            <div class="cover-subtitle">${serviceTitle}</div>
            <div style="color: #5c3a21; letter-spacing: 2px; font-size: 16px; margin-bottom: 20px;">
                জীৱন • কৰ্ম • সম্পদ • প্ৰেম • বিবাহ • সময়চক্ৰ
            </div>
            <div class="cover-details">
                <div class="detail-row"><span class="detail-label">গ্ৰাহকৰ নাম:</span> ${name}</div>
                <div class="detail-row"><span class="detail-label">জন্ম তাৰিখ:</span> ${dob}</div>
                <div class="detail-row"><span class="detail-label">জন্মৰ সময়:</span> ${tob}</div>
                <div class="detail-row"><span class="detail-label">জন্ম স্থান:</span> ${place}</div>
                <div class="detail-row"><span class="detail-label">সেৱাৰ প্ৰকাৰ:</span> ${serviceTitle}</div>
            </div>
        </div>

        <!-- PAGE 2: CORE IDENTITY & KUNDALI -->
        <div class="page page-break">
            <h2 class="section-title">❁ মূল জ্যোতিষিক পৰিচয় ❁</h2>
            <div class="shloka">"যথা শিখা ময়ূৰাণাং নাগানাং মணயথা।<br>তদ্বদ্ বেদাঙ্গশাস্ত্ৰাণাং জ্যোতিষং মূৰ্ধনি স্থিতম্॥"</div>
            <div class="info-card">
                <div class="card-title">লগ্ন (Ascendant): <strong>${ascRashiName} (${chart.ascendant.rashi})</strong></div>
                <div class="card-title">চন্দ্ৰ ৰাশি (Moon Sign): <strong>${moonRashiName} (${moonRashi} - ${moonNakshatra} নক্ষত্ৰ)</strong></div>
                <div class="card-title">বৰ্তমান মহাদশা: <strong>${currentDashaAs} মহাদশা</strong></div>
            </div>
            <h2 class="section-title" style="margin-top:35px;">❁ জন্ম কুণ্ডলী আৰু গ্ৰহ স্থিতি ❁</h2>
            ${svgHtml}
            <h3 class="sub-heading">গ্ৰহৰ স্পষ্ট অৱস্থান</h3>
            ${planetsHtml}
            <h3 class="sub-heading">বিংশোত্তৰী মহা দশা</h3>
            ${dashaHtml}
        </div>

        ${assembledPages}

        <div class="print-btn-wrapper no-print">
            <button class="print-btn" onclick="window.print()">📥 ৰিপোৰ্ট প্ৰিন্ট বা PDF ছেভ কৰক</button>
            <p style="margin-top: 12px; font-size: 14px; color: #5c3a21;">💡 মোবাইলত PDF সংৰক্ষণ কৰিবলৈ: প্ৰিন্ট বুটামত ক্লিক কৰি 'Save as PDF' বাছি লওক।</p>
        </div>
    </body>
    </html>
    `;
}
