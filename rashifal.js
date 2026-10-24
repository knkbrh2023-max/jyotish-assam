/* ============================================================================
 * জ্যোতিষ অসম (Jyotish Assam) — ১০০% শুদ্ধ অসমীয়া স্বয়ংক্ৰিয় দৈনিক ৰাশিফল ইঞ্জিন
 * প্ৰতিদিনে ভাৰতীয় সময় (IST - Asia/Kolkata) অনুসৰি ৰাতি ১২ বজাত স্বয়ংক্ৰিয়ভাৱে সলনি হয়।
 * ============================================================================ */
(function(global) {
  const ASSAMESE_DIGITS = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'};
  function toAssameseNum(n) {
    return String(n).replace(/[0-9]/g, m => ASSAMESE_DIGITS[m] || m);
  }

  const ASSAMESE_MONTHS = ["জানুৱাৰী", "ফেব্ৰুৱাৰী", "মাৰ্চ", "এপ্ৰিল", "মে’", "জুন", "জুলাই", "আগষ্ট", "ছেপ্টেম্বৰ", "অক্টোবৰ", "নৱেম্বৰ", "ডিচেম্বৰ"];
  const ASSAMESE_DAYS = ["দেওবাৰ", "সোমবাৰ", "মঙ্গলবাৰ", "বুধবাৰ", "বৃহস্পতিবাৰ", "শুক্ৰবাৰ", "শনিবাৰ"];
  const DAY_LORDS = [
    { day: "দেওবাৰ", lord: "গ্ৰহৰাজ সূৰ্য দেৱতা", quality: "আত্মবল, তেজ, নেতৃত্ব আৰু সামাজিক প্ৰতিষ্ঠা", deity: "ভগৱান সূৰ্য নাৰায়ণ" },
    { day: "সোমবাৰ", lord: "মনোকাৰক চন্দ্ৰ দেৱতা", quality: "মানসিক প্ৰশান্তি, সৃজনশীলতা, স্নেহ আৰু পাৰিবাৰিক সুখ", deity: "দেৱাদিদেৱ মহাদেৱ শিৱ" },
    { day: "মঙ্গলবাৰ", lord: "ভূমিপুত্ৰ মংগল দেৱতা", quality: "সাহস, কৰ্মশক্তি, সংকল্প আৰু বাধা জয়ৰ ক্ষমতা", deity: "সংকটমোচন হনুমানজী" },
    { day: "বুধবাৰ", lord: "বুদ্ধিদাতা বুধ দেৱতা", quality: "বৌদ্ধিক কৌশল, বাণিজ্যিক লাভ, যোগাযোগ আৰু শিক্ষা", deity: "সিদ্ধিদাতা ভগৱান গণেশ আৰু বিষ্ণু" },
    { day: "বৃহস্পতিবাৰ", lord: "দেৱগুৰু বৃহস্পতি", quality: "ভাগ্যোদয়, জ্ঞান, ধৰ্মীয় মংগল আৰু আৰ্থিক সমৃদ্ধি", deity: "জগতগুৰু ভগৱান বিষ্ণু আৰু মা লক্ষ্মী" },
    { day: "শুক্ৰবাৰ", lord: "দৈত্যগুৰু শুক্ৰাচাৰ্য", quality: "ঐশ্বৰ্য, দাম্পত্য মধুৰতা, কলা-সৌন্দৰ্য আৰু আকস্মিক লাভ", deity: "মাতা মহালক্ষ্মী আৰু মা দুৰ্গা" },
    { day: "শনিবাৰ", lord: "ন্যায়াধিপতি শনি দেৱতা", quality: "কঠোৰ পৰিশ্ৰমৰ স্থায়ী ফল, শৃংখলা, ন্যায় আৰু স্থাৱৰ সম্পত্তি", deity: "শনি দেৱতা আৰু ভগৱান শিৱ" }
  ];

  const NAKSHATRAS = [
    "অশ্বিনী", "ভৰণী", "কৃত্তিকা", "ৰোহিণী", "মৃগশিৰা", "আৰ্দ্ৰা", "পুনৰ্বসু", "পুষ্যা", "অশ্লেষা",
    "মঘা", "পূৰ্বফাল্গুনী", "উত্তৰফাল্গুনী", "হস্তা", "চিত্ৰা", "স্বাতী", "বিশাখা", "অনুৰাধা", "জ্যেষ্ঠা",
    "মূলা", "পূৰ্বাষাঢ়া", "উত্তৰাষাঢ়া", "শ্ৰৱণা", "ধনিষ্ঠা", "শতভিষা", "পূৰ্বভাদ্ৰপদ", "উত্তৰভাদ্ৰপদ", "ৰেৱতী"
  ];

  const VEDIC_YOGAS = [
    "সৰ্বাৰ্থ সিদ্ধি যোগ", "অমৃত সিদ্ধি যোগ", "প্ৰীতি যোগ", "আয়ুষ্মান যোগ", "সৌভাগ্য যোগ", "শোভন যোগ",
    "সুকৰ্মা যোগ", "ধৃতি যোগ", "বৃদ্ধি যোগ", "ধ্ৰুৱ যোগ", "হৰ্ষণ যোগ", "সিদ্ধি যোগ", "বৰীয়ান যোগ",
    "শিৱ যোগ", "সাধ্য যোগ", "শুভ যোগ", "শুক্ল যোগ", "ব্ৰহ্ম যোগ", "ইন্দ্ৰ যোগ", "ৰবি যোগ"
  ];

  const TITHIS = [
    "প্ৰতিপদ", "দ্বিতীয়া", "তৃতীয়া", "চতুৰ্থী", "পঞ্চমী", "ষষ্ঠী", "সপ্তমী",
    "অষ্টমী", "নৱমী", "দশমী", "একাদশী", "দ্বাদশী", "ত্ৰয়োদশী", "চতুৰ্দশী", "পূৰ্ণিমা/অমাৱস্যা"
  ];

  const RASHI_BASE = [
    { id: "aries", symbol: "♈", as: "মেষ", name: "মেষ ৰাশি (Aries)", lord: "মংগল গ্ৰহ", element: "অগ্নি তত্ত্ব", baseColors: ["ৰঙা", "গেৰুৱা", "সোণালী", "কমলা", "পবিত্ৰ বগা"], baseNums: [9, 1, 3, 6], dirs: ["পূব", "উত্তৰ-পূব", "দক্ষিণ-পূব"] },
    { id: "taurus", symbol: "♉", as: "বৃষ", name: "বৃষ ৰাশি (Taurus)", lord: "শুক্ৰ গ্ৰহ", element: "পৃথিৱী তত্ত্ব", baseColors: ["বগা", "আকাশী নীলা", "গুলপীয়া", "পাতল সেউজীয়া", "ক্ৰীম"], baseNums: [6, 2, 5, 8], dirs: ["দক্ষিণ-পূব", "পশ্চিম", "উত্তৰ"] },
    { id: "gemini", symbol: "♊", as: "মিথুন", name: "মিথুন ৰাশি (Gemini)", lord: "বুধ গ্ৰহ", element: "বায়ু তত্ত্ব", baseColors: ["সেউজীয়া", "পাতল হালধীয়া", "বগা", "আকাশী", "কমলা"], baseNums: [5, 3, 6, 1], dirs: ["উত্তৰ", "পশ্চিম", "উত্তৰ-পূব"] },
    { id: "cancer", symbol: "♋", as: "কৰ্কট", name: "কৰ্কট ৰাশি (Cancer)", lord: "চন্দ্ৰ গ্ৰহ", element: "জল তত্ত্ব", baseColors: ["ৰূপালী বগা", "ক্ৰীম", "হালধীয়া", "পাতল ৰঙা", "মুগা"], baseNums: [2, 7, 9, 3], dirs: ["উত্তৰ-পশ্চিম", "উত্তৰ", "পূব"] },
    { id: "leo", symbol: "♌", as: "সিংহ", name: "সিংহ ৰাশি (Leo)", lord: "সূৰ্য গ্ৰহ", element: "অগ্নি তত্ত্ব", baseColors: ["সোণালী", "কমলা", "উজ্জ্বল ৰঙা", "হালধীয়া", "গেৰুৱা"], baseNums: [1, 5, 9, 3], dirs: ["পূব", "উত্তৰ-পূব", "দক্ষিণ"] },
    { id: "virgo", symbol: "♍", as: "কন্যা", name: "কন্যা ৰাশি (Virgo)", lord: "বুধ গ্ৰহ", element: "পৃথিৱী তত্ত্ব", baseColors: ["সেউজীয়া", "বগা", "পাতল নীলা", "হালধীয়া", "সোণালী"], baseNums: [5, 6, 2, 8], dirs: ["উত্তৰ", "দক্ষিণ-পূব", "উত্তৰ-পশ্চিম"] },
    { id: "libra", symbol: "♎", as: "তুলা", name: "তুলা ৰাশি (Libra)", lord: "শুক্ৰ গ্ৰহ", element: "বায়ু তত্ত্ব", baseColors: ["গুলপীয়া", "বগা", "আকাশী নীলা", "ক্ৰীম", "পাতল সেউজীয়া"], baseNums: [6, 9, 5, 2], dirs: ["পশ্চিম", "দক্ষিণ-পূব", "উত্তৰ"] },
    { id: "scorpio", symbol: "♏", as: "বৃশ্চিক", name: "বৃশ্চিক ৰাশি (Scorpio)", lord: "মংগল গ্ৰহ", element: "জল তত্ত্ব", baseColors: ["গাঢ় ৰঙা", "মেৰুণ", "কমলা", "হালধীয়া", "বগা"], baseNums: [9, 3, 1, 7], dirs: ["দক্ষিণ", "পূব", "উত্তৰ"] },
    { id: "sagittarius", symbol: "♐", as: "ধনু", name: "ধনু ৰাশি (Sagittarius)", lord: "বৃহস্পতি গ্ৰহ", element: "অগ্নি তত্ত্ব", baseColors: ["হালধীয়া", "সোণালী", "কেশৰীয়া", "কমলা", "বগা"], baseNums: [3, 9, 1, 2], dirs: ["উত্তৰ-পূব", "পূব", "উত্তৰ"] },
    { id: "capricorn", symbol: "♑", as: "মকৰ", name: "মকৰ ৰাশি (Capricorn)", lord: "শনি গ্ৰহ", element: "পৃথিৱী তত্ত্ব", baseColors: ["নীলা", "ছাই ৰং", "বগা", "সেউজীয়া", "বেঙুনীয়া"], baseNums: [8, 6, 5, 4], dirs: ["পশ্চিম", "দক্ষিণ", "উত্তৰ-পশ্চিম"] },
    { id: "aquarius", symbol: "♒", as: "কুম্ভ", name: "কুম্ভ ৰাশি (Aquarius)", lord: "শনি গ্ৰহ", element: "বায়ু তত্ত্ব", baseColors: ["আকাশী নীলা", "বেঙুনীয়া", "বগা", "সেউজীয়া", "নীলা"], baseNums: [8, 4, 6, 5], dirs: ["পশ্চিম", "উত্তৰ", "দক্ষিণ-পশ্চিম"] },
    { id: "pisces", symbol: "♓", as: "মীন", name: "মীন ৰাশি (Pisces)", lord: "বৃহস্পতি গ্ৰহ", element: "জল তত্ত্ব", baseColors: ["হালধীয়া", "কেশৰীয়া", "সাগৰীয় নীলা", "বগা", "গুলপীয়া"], baseNums: [3, 7, 9, 2], dirs: ["উত্তৰ", "উত্তৰ-পূব", "পূব"] }
  ];

  // Rich 100% pure Assamese daily pools (16 distinct daily themes per dimension)
  const SHORT_OPENERS = [
    "কৰ্মক্ষেত্ৰত নতুন সুযোগ, বৰিষ্ঠজনৰ সহযোগিতা আৰু আত্মবিশ্বাস বৃদ্ধি পাব।",
    "আৰ্থিক সঞ্চয় বৃদ্ধি, ব্যৱসায়িক লাভ আৰু পাৰিবাৰিক সুখ-শান্তি বিৰাজ কৰিব।",
    "বৌদ্ধিক কাম, শিক্ষা আৰু গুৰুত্বপূৰ্ণ যোগাযোগত আশানুৰূপ সফলতা লাভ কৰিব।",
    "জ্যেষ্ঠজনৰ আশীৰ্বাদত পুৰণি সমস্যাৰ সমাধান হ'ব আৰু মানসিক প্ৰশান্তি বাঢ়িব।",
    "সমাজত মান-সন্মান বৃদ্ধি, নেতৃত্বমূলক কামত প্ৰশংসা আৰু নতুন অগ্ৰগতিৰ যোগ।",
    "শৃংখলাবদ্ধ পৰিকল্পনাৰ জৰিয়তে স্থগিত কামবোৰ সুকলমে সম্পন্ন কৰিব পাৰিব।",
    "দাম্পত্য আৰু প্ৰেমৰ সম্পৰ্কত মধুৰতা বাঢ়িব তথা অংশীদাৰী কামত লাভ হ'ব।",
    "সাহসিক সিদ্ধান্তৰ দ্বাৰা জটিল কামত বিজয় আৰু আকস্মিক ধন লাভৰ শুভ সংকেত।",
    "ভাগ্যৰ সম্পূৰ্ণ সহযোগিতা পাব, মাংগলিক কাৰ্য আৰু শুভ ভ্ৰমণৰ যোগ মুকলি হ'ব।",
    "কঠোৰ পৰিশ্ৰমৰ উচিত সুফল লাভ কৰিব আৰু স্থাৱৰ সম্পত্তি সম্পৰ্কীয় কামত উন্নতি হ'ব।",
    "নতুন উদ্ভাৱনী পৰিকল্পনা সফল হ'ব আৰু মিত্ৰৰ সহযোগত আয়ৰ নতুন পথ মুকলি হ'ব।",
    "সৃজনশীল কামত বিশেষ সাফল্য, আধ্যাত্মিক শান্তি আৰু সন্তানৰ ফালৰ পৰা আনন্দ লাভ।",
    "চৰকাৰী বা প্ৰশাসনিক কামত থকা বাধা আঁতৰিব আৰু আৰ্থিক লেনদেনত শুভ ফল পাব।",
    "ব্যৱসায়-বাণিজ্যত নতুন চুক্তি সম্পাদন হ'ব আৰু ঘৰলৈ কোনো সুখবৰ আহিব পাৰে।",
    "দীৰ্ঘদিনীয়া পৰিশ্ৰমৰ স্বীকৃতি লাভ কৰিব আৰু পাৰিবাৰিক একতা অধিক সুদৃঢ় হ'ব।",
    "ইষ্ট দেৱতাৰ কৃপাত মনৰ শংকা দূৰ হ'ব আৰু নতুন বিনিয়োগৰ বাবে উত্তম পৰিৱেশ পাব।"
  ];

  const SHORT_CLOSERS = [
    "দিনটোৰ দ্বিতীয়াৰ্ধত কোনো প্ৰিয়জনৰ পৰা বিশেষ শুভ বাতৰি লাভৰ যোগ আছে।",
    "পূৰ্বতে কৰা সৎ প্ৰচেষ্টাৰ সুফল আজি হাতে হাতে দেখিবলৈ পাব।",
    "হাতত লোৱা গুৰুত্বপূৰ্ণ কামবোৰ নিৰ্ধাৰিত সময়ৰ ভিতৰতে সম্পূৰ্ণ হ'ব।",
    "আবদ্ধ হৈ থকা ধন ঘূৰি অহাৰ লগতে নতুন সঞ্চয়ৰ পথ প্ৰশস্ত হ'ব।",
    "ঘৰুৱা পৰিৱেশত মাংগলিক আলোচনা আৰু আনন্দ-উৎসাহে বিৰাজ কৰিব।",
    "ধৈৰ্য আৰু মিঠা ব্যৱহাৰে সকলো কঠিন পৰিস্থিতি আপোনাৰ পক্ষলৈ আনিব।",
    "নতুন মানুহৰ সৈতে হোৱা সৌহাৰ্দ্যপূৰ্ণ পৰিচয়ে ভৱিষ্যতৰ পথ উজ্জ্বল কৰিব।",
    "সন্ধিয়াৰ ভাগত মানসিক তৃপ্তি আৰু আধ্যাত্মিক আনন্দ লাভ কৰিব।"
  ];

  const OVERALL_MIDDLES = [
    "বহুদিন ধৰি স্থগিত হৈ থকা কোনো গুৰুত্বপূৰ্ণ কাম আজি পুনৰ গতিশীল হ'ব আৰু আপোনাৰ দূৰদৰ্শী সিদ্ধান্তই কৰ্মক্ষেত্ৰত তথা সমাজত বিশেষ সমাদৰ লাভ কৰিব।",
    "আপোনাৰ ধৈৰ্য, সংযম আৰু মাধুৰ্যপূৰ্ণ আচৰণে বিৰোধীসকলকো আপোনাৰ সমৰ্থক কৰি তুলিব। ঘৰুৱা সুখ-স্বাচ্ছন্দ্য বৃদ্ধিৰ বাবে নতুন পৰিকল্পনা গ্ৰহণ কৰিব পাৰে।",
    "বৌদ্ধিক চিন্তাশক্তি আৰু উপস্থিত বুদ্ধিৰ বলত আজি আপুনি যিকোনো জটিল সমস্যা অতি সহজেই সমাধান কৰিবলৈ সক্ষম হ'ব। ছাত্ৰ-ছাত্ৰী আৰু গৱেষকৰ বাবে দিনটো বিশেষভাৱে ফলপ্ৰসূ।",
    "পৰিয়ালৰ জ্যেষ্ঠসকলৰ আশীৰ্বাদ আৰু সুপৰামৰ্শই আপোনাক সঠিক দিশ দেখুৱাব। মাটি-বাৰী, গৃহ নিৰ্মাণ বা বাহন সম্পৰ্কীয় আলোচনাত ইতিবাচক অগ্ৰগতি দেখা যাব।",
    "আপোনাৰ আত্মবিশ্বাস আৰু কৰ্মোদ্যম আজি শীৰ্ষত থাকিব। ৰাজহুৱা বা সামাজিক ক্ষেত্ৰত আপোনাৰ মতামতক সকলোৱে গুৰুত্ব সহকাৰে গ্ৰহণ কৰিব।",
    "মনত চলি থকা অহেতুক দ্বিধা বা খেলিমেলি আঁতৰি আজি এক স্পষ্ট লক্ষ্য নিৰ্ধাৰণ কৰিব পাৰিব। আত্মীয়-স্বজনৰ সৈতে সম্পৰ্ক অধিক সৌহাৰ্দ্যপূৰ্ণ হৈ উঠিব।",
    "সৃজনশীলতা আৰু ন্যায়পৰায়ণ মনোভাৱে আপোনাক আজি নতুন সাফল্যৰ মুখ দেখুৱাব। ঘৰ সজোৱা বা মাংগলিক সামগ্ৰী ক্ৰয় কৰাৰ বাবে আজিৰ দিনটো অত্যন্ত শুভ।",
    "আপোনাৰ একাগ্ৰতা আৰু সংকল্পশক্তিৰ সন্মুখত সকলো বাধা ম্লান হৈ পৰিব। গোপন শত্ৰু বা সমালোচকসকলৰ কৌশল ব্যৰ্থ হ'ব আৰু আপুনি নিজৰ লক্ষ্যত উপনীত হ'ব।",
    "ধৰ্মপৰায়ণতা, উদাৰ চিন্তা আৰু আশাবাদী দৃষ্টিভংগীয়ে আজি আপোনাৰ চৌপাশে এক পৱিত্ৰ আৰু আনন্দময় বাতাবৰণ গঢ়ি তুলিব। দূৰণিবটীয়া যাত্ৰা বা যোগাযোগ শুভ হ'ব।",
    "লৰালৰি নকৰি ধীৰে-সুস্থিৰে লোৱা বাস্তৱসন্মত পদক্ষেপে আজি আপোনাক স্থায়ী লাভ প্ৰদান কৰিব। আপোনাৰ অভিজ্ঞতা আৰু গধুৰ ব্যক্তিত্বই আনকো অনুপ্ৰাণিত কৰিব।"
  ];

  const CAREER_TEMPLATES = [
    "চাকৰিয়ালসকলৰ বাবে আজি নতুন দায়িত্ব বা পদোন্নতিৰ যোগ উজ্জ্বল; উর্ধ্বতন কৰ্তৃপক্ষই আপোনাৰ নিষ্ঠাৰ শলাগ ল'ব। ব্যৱসায়ীসকলে নতুন চুক্তি বা গ্ৰাহকৰ পৰা আশা কৰাতকৈ অধিক লভ্যাংশ অৰ্জন কৰিব পাৰিব।",
    "অৰ্থনৈতিক দিশত আজি স্থায়িত্ব আহিব আৰু উপাৰ্জনৰ অতিৰিক্ত উৎস মুকলি হোৱাৰ সংকেত আছে। বেংকিং, কৃষি, শিক্ষা বা খুচুৰা ব্যৱসায়ৰ লগত জড়িতসকলে বিশেষ আৰ্থিক লাভ দেখিবলৈ পাব।",
    "বাণিজ্য, তথ্য-প্ৰযুক্তি, চৰকাৰী সেৱা আৰু বিপণন ক্ষেত্ৰত কৰ্মৰত লোকসকলে আজি নিজৰ দক্ষতা প্ৰমাণ কৰাৰ উত্তম সুযোগ পাব। পূৰ্বতে কৰা সঞ্চয় বা বিনিয়োগৰ পৰা সুফল লাভৰ যোগ আছে।",
    "কৰ্মস্থলীত সহকৰ্মীসকলৰ সম্পূৰ্ণ সহযোগিতা লাভ কৰিব আৰু দলীয় কামত আপোনাৰ নেতৃত্ব সফল হ'ব। ফচি থকা বা বকেয়া ধন ঘূৰি অহাৰ ফলত আৰ্থিক স্থিতি অধিক টনকিয়াল হ'ব।",
    "নতুন ব্যৱসায় আৰম্ভ কৰা বা পুৰণি ব্যৱসায় সম্প্ৰসাৰণ কৰাৰ বাবে আজিৰ দিনটো অনুকূল। চাকৰিৰ বাবে সাক্ষাৎকাৰ বা প্ৰতিযোগিতামূলক পৰীক্ষাত অৱতীৰ্ণ হোৱা যুৱক-যুৱতীসকলে শুভ ফলাফল লাভ কৰিব।",
    "আজি আপোনাৰ পেছাদাৰী যোগাযোগ বৃদ্ধি পাব আৰু প্ৰভাৱশালী ব্যক্তিৰ সহযোগত জটিল দাপ্তৰিক কামবোৰ সমাধা হ'ব। অৱশ্যে খৰখেদাকৈ কোনো অচিনাকি আঁচনিত ধন বিনিয়োগ নকৰিব।",
    "কৰ্মক্ষেত্ৰত আপোনাৰ উদ্ভাৱনী চিন্তা আৰু সময়ানুৱৰ্তিতাই বিশেষ প্ৰশংসা কঢ়িয়াই আনিব। আৰ্থিক লেনদেনত স্বচ্ছতা বজাই ৰাখিলে ভৱিষ্যতে ডাঙৰ সঞ্চয় গঢ়ি তুলিব পাৰিব।",
    "স্বতন্ত্ৰ বৃত্তিধাৰী, ঠিকাদাৰ, শিপিনী, শিল্পী আৰু ব্যৱসায়ীসকলৰ বাবে আজি অৰ্থাগমনৰ যোগ অতি উত্তম। অপ্ৰয়োজনীয় বিলাসী খৰচ নিয়ন্ত্ৰণ কৰি বাজেট অনুসৰি চলাটো মংগলজনক হ'ব।"
  ];

  const LOVE_TEMPLATES = [
    "পাৰিবাৰিক জীৱনত সুখ-শান্তি আৰু পাৰস্পৰিক বুজাবুজি বৃদ্ধি পাব। প্ৰেমৰ সম্পৰ্কত থকা পুৰণি ভুল বুজাবুজিবোৰ আঁতৰি মধুৰতা ঘূৰি আহিব আৰু অবিবাহিতসকলৰ বাবে বিবাহৰ শুভ আলোচনা আগবাঢ়িব পাৰে।",
    "দাম্পত্য জীৱনত পতি-পত্নীৰ মাজত বিশ্বাস, সমৰ্পণ আৰু আন্তৰিকতা অধিক গভীৰ হ'ব। প্ৰিয়জনৰ পৰা কোনো সুন্দৰ উপহাৰ বা মানসিক সমৰ্থন লাভ কৰি মন আনন্দিত হৈ উঠিব।",
    "বন্ধুত্ব আৰু প্ৰেমৰ সম্পৰ্কত আজি এক উজ্জীৱিত পৰিৱেশে বিৰাজ কৰিব। মনৰ কথা স্পষ্ট আৰু মধুৰভাৱে প্ৰকাশ কৰাৰ বাবে আজিৰ দিনটো অতি উত্তম। পৰিয়ালৰ সৈতে আনন্দময় সময় অতিবাহিত হ'ব।",
    "জীৱনসংগীয়ে আপোনাৰ অনুভূতি আৰু দায়িত্বক সন্মান জনাব। সন্তানৰ শিক্ষা বা কোনো সুন্দৰ কৃতিত্বই ঘৰখনলৈ গৌৰৱ আৰু হাঁহি কঢ়িয়াই আনিব।",
    "প্ৰেমৰ সম্পৰ্কত ধৈৰ্য আৰু বিশ্বাস অটুট ৰাখক; সংগীৰ কথাও মনোযোগেৰে শুনিলে সম্পৰ্ক অধিক মধুৰ হ'ব। সন্ধিয়া পৰিয়ালৰ সৈতে ধৰ্মীয় বা মাংগলিক স্থান দর্শনৰ যোগ আছে।",
    "ঘৰুৱা সিদ্ধান্তসমূহত জীৱনসংগী আৰু পিতৃ-মাতৃৰ একমত লাভ কৰিব। বহুদিন দেখা নোহোৱা কোনো আপোন আত্মীয় বা বাল্যবন্ধুৰ সৈতে যোগাযোগ হৈ মন পুলকিত হ'ব।",
    "অবিবাহিত যুৱক-যুৱতীসকলে কোনো মাংগলিক অনুষ্ঠান বা সামাজিক মাধ্যমৰ জৰিয়তে মন পচন্দৰ ব্যক্তিৰ সঁহাৰি পাব পাৰে। দাম্পত্য জীৱনত পাৰস্পৰিক শ্ৰদ্ধাই ঘৰখন স্বৰ্গীয় কৰি ৰাখিব।",
    "পৰিয়ালত সৰু-সুৰা মাংগলিক আলোচনা বা ভোজ-ভাতৰ আয়োজন হ'ব পাৰে। প্ৰিয়জনৰ সৈতে ভৱিষ্যতৰ সঞ্চয় আৰু গৃহ-সুখ সন্দৰ্ভত ফলপ্ৰসূ আলোচনা সম্পন্ন হ'ব।"
  ];

  const HEALTH_TEMPLATES = [
    "শাৰীৰিকভাৱে আজি আপুনি যথেষ্ট উদ্যমী আৰু সতেজ অনুভৱ কৰিব। অৱশ্যে একাগ্ৰভাৱে বহু সময় কাম কৰাৰ ফলত চকু বা মূৰৰ সামান্য ভাগৰ অনুভৱ হ'ব পাৰে, সেয়ে পর্যাপ্ত পানী খাওক।",
    "স্বাস্থ্য সামগ্ৰিকভাৱে ভালে থাকিব। বতৰৰ পৰিৱৰ্তনৰ সময়ত ঠাণ্ডা পানীয় বা অতিমাত্ৰা তেল-মছলাযুক্ত খাদ্যৰ পৰা বিৰত থাকক আৰু পুৱা খোজ কঢ়াৰ অভ্যাস ৰাখক।",
    "দেহ-মনত নতুন শক্তি আৰু স্ফূৰ্তি বিৰাজ কৰিব। মানসিক প্ৰশান্তি অটুট ৰাখিবলৈ নিশা সোনকালে শোৱাৰ অভ্যাস কৰক আৰু পুৱা ১০ মিনিট প্ৰাণায়াম বা যোগাভ্যাস কৰক।",
    "পুৰণি শাৰীৰিক অস্বস্তিৰ পৰা আজি যথেষ্ট উপশম লাভ কৰিব। ঘৰুৱা সতেজ আৰু সুষম আহাৰ গ্ৰহণ কৰক তথা সময়মতে বিশ্ৰাম ল'বলৈ অৱহেলা নকৰিব।",
    "মানসিকভাৱে আপুনি আজি চাপমুক্ত আৰু আনন্দিত থাকিব। অৱশ্যে কঁকাল বা গাঁঠিৰ বিষত ভোগা লোকসকলে একে ঠাইতে বহু সময় বহি নাথাকি মাজে মাজে লঘু অঙ্গ সঞ্চালন কৰিব।",
    "হজম শক্তি আৰু ৰোগ প্ৰতিৰোধ ক্ষমতা ভালে থাকিব। দিনটোত কুহুমীয়া পানী, ফল-মূল আৰু শাক-পাচলি গ্ৰহণ কৰিলে দেহৰ ক্লান্তি সহজেই দূৰ হ'ব।"
  ];

  const ADVICE_TEMPLATES = [
    "পুৱা স্নান কৰি সূৰ্য দেৱতাক তামৰ পাত্ৰত জল অৰ্পণ কৰক আৰু ইষ্ট দেৱতাৰ নাম স্মৰণ কৰি দিনটো আৰম্ভ কৰক। খঙত বা খৰখেদাকৈ কোনো সিদ্ধান্ত নল'ব।",
    "গোঁসাই ঘৰত বা তুলসী তলত ধূপ-চাকি জ্বলাওক আৰু গাই গৰু বা চৰাইক এমুঠি আহাৰ খুৱাওক। অপ্ৰয়োজনীয় তৰ্ক-বিতৰ্কৰ পৰা নিজকে আঁতৰাই ৰাখক।",
    "ভগৱান গণেশ বা বিষ্ণু চৰণত সতেজ ফুল অৰ্পণ কৰক আৰু পিতৃ-মাতৃ তথা গুৰুজনৰ আশীৰ্বাদ লৈ কৰ্মক্ষেত্ৰলৈ ওলাওক। একেলগে বহুত কাম হাতত নলৈ একাগ্ৰতাৰে কাম কৰক।",
    "শিৱলিংগত বা তুলসী গছৰ গুৰিত বিশুদ্ধ জল অৰ্পণ কৰি 'ওঁ নমঃ শিৱায়' মন্ত্ৰ ১১ বাৰ জপ কৰক। মনত অযথা শংকা বা ঋণাত্মক চিন্তা স্থান নিদিব।",
    "কপালত চন্দন বা হালধিৰ ফোঁট লগাওক আৰু অসহায় বা শ্ৰমজীৱী লোকক সাধ্যানুসৰি সহায় কৰক। নিজৰ গোপন ব্যৱসায়িক পৰিকল্পনা সকলোৰে আগত প্ৰকাশ নকৰিব।",
    "সন্ধিয়া ঘৰৰ মূল দুৱাৰমুখত আৰু গোঁসাই ঘৰত ঘিউ বা মিঠাতেলৰ চাকি জ্বলাওক। সদায় সত্য আৰু মিঠা বচন ব্যৱহাৰ কৰক, সফলতা আপোনাৰ লগতে থাকিব।"
  ];

  const SHUBHA_TIMES = [
    "পুৱা ০৭:১৫ বজাৰ পৰা ০৯:৩০ বজালৈ",
    "পুৱা ০৮:৩০ বজাৰ পৰা ১১:০০ বজালৈ",
    "পুৱা ০৯:৪৫ বজাৰ পৰা ১২:১৫ বজালৈ",
    "দুপৰীয়া ১২:০০ বজাৰ পৰা ০২:১৫ বজালৈ",
    "বিয়লি ০৩:১৫ বজাৰ পৰা ০৫:০০ বজালৈ",
    "সন্ধিয়া ০৫:৩০ বজাৰ পৰা ০৭:১৫ বজালৈ"
  ];

  function parseISTDate(dateStr) {
    if (dateStr && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
      const parts = dateStr.split('-').map(Number);
      return new Date(parts[0], parts[1] - 1, parts[2], 12, 0, 0);
    }
    // Current time converted to IST (UTC+5:30)
    const now = new Date();
    const utcMs = now.getTime() + (now.getTimezoneOffset() * 60000);
    const istDate = new Date(utcMs + (5.5 * 3600000));
    return new Date(istDate.getFullYear(), istDate.getMonth(), istDate.getDate(), 12, 0, 0);
  }

  function getISTDateString(dateStr) {
    const d = parseISTDate(dateStr);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  }

  function getDaySeed(d) {
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    const day = d.getDate();
    // Deterministic daily hash that shifts significantly every single day
    const jd = Math.floor(365.25 * y) + Math.floor(30.6001 * (m + 1)) + day;
    return { y, m, day, jd, dow: d.getDay() };
  }

  function generateDailyAssameseRashifal(dateStr) {
    const d = parseISTDate(dateStr);
    const { y, m, day, jd, dow } = getDaySeed(d);
    const dayLordInfo = DAY_LORDS[dow];
    const nakshatra = NAKSHATRAS[(jd * 3 + dow) % NAKSHATRAS.length];
    const yoga = VEDIC_YOGAS[(jd * 5 + day) % VEDIC_YOGAS.length];
    const tithi = TITHIS[(jd + day) % TITHIS.length];
    const formattedDateAs = `${toAssameseNum(day)} ${ASSAMESE_MONTHS[m - 1]}, ${toAssameseNum(y)} (${dayLordInfo.day})`;

    const rashis = RASHI_BASE.map((r, idx) => {
      // Unique daily index per rashi using coprime multipliers so every day + every rashi gets a distinct combination
      const h1 = (jd * 7 + idx * 5 + dow * 3) % SHORT_OPENERS.length;
      const h2 = (jd * 11 + idx * 3 + day) % SHORT_CLOSERS.length;
      const hOverall = (jd * 13 + idx * 7 + dow) % OVERALL_MIDDLES.length;
      const hCareer = (jd * 5 + idx * 3 + day * 2) % CAREER_TEMPLATES.length;
      const hLove = (jd * 9 + idx * 5 + dow * 2) % LOVE_TEMPLATES.length;
      const hHealth = (jd * 3 + idx * 2 + day) % HEALTH_TEMPLATES.length;
      const hAdvice = (jd * 7 + idx * 4 + dow) % ADVICE_TEMPLATES.length;

      const color1 = r.baseColors[(jd + idx) % r.baseColors.length];
      const color2 = r.baseColors[(jd + idx + 2) % r.baseColors.length];
      const luckyNum = toAssameseNum(r.baseNums[(jd + idx) % r.baseNums.length]);
      const luckyDir = r.dirs[(jd + idx) % r.dirs.length];
      const shubhaTime = SHUBHA_TIMES[(jd + idx) % SHUBHA_TIMES.length];
      const fortuneScore = toAssameseNum(82 + ((jd * 3 + idx * 7) % 17)); // 82% - 98%

      const shortText = `${SHORT_OPENERS[h1]} ${SHORT_CLOSERS[h2]}`;
      const overallText = `আজি ${formattedDateAs} — পৱিত্ৰ '${nakshatra}' নক্ষত্ৰ আৰু '${yoga}'ৰ সংযোগত তথা ৰাশিপতি ${r.lord} আৰু আজিৰ বাৰেশ্বৰ ${dayLordInfo.lord}ৰ অনুকূল দৃষ্টিত আপোনাৰ দিনটো অত্যন্ত ইতিবাচক আৰু ফলপ্ৰসূ হ'ব। ${OVERALL_MIDDLES[hOverall]} ${SHORT_CLOSERS[h2]}`;
      const careerText = `${CAREER_TEMPLATES[hCareer]} আজি ${dayLordInfo.day} হোৱা হেতু ${dayLordInfo.quality}ৰ ক্ষেত্ৰত আপুনি বিশেষ অগ্ৰগতি লাভ কৰিব।`;
      const loveText = LOVE_TEMPLATES[hLove];
      const healthText = HEALTH_TEMPLATES[hHealth];
      const adviceText = `${ADVICE_TEMPLATES[hAdvice]} আজি ${dayLordInfo.deity}ৰ স্মৰণ আপোনাৰ বাবে বিশেষ সৌভাগ্যদায়ক হ'ব।`;
      const luckyText = `${color1} আৰু ${color2} | শুভ সংখ্যা: ${luckyNum} | শুভ দিশ: ${luckyDir} | শুভ সময়: ${shubhaTime} | ভাগ্যাংক: ${fortuneScore}%`;

      return {
        id: r.id,
        symbol: r.symbol,
        as: r.as,
        name: r.name,
        lord: r.lord,
        short: shortText,
        overall: overallText,
        career: careerText,
        love: loveText,
        health: healthText,
        advice: adviceText,
        lucky: luckyText,
        luckyColor: `${color1}, ${color2}`,
        luckyNumber: luckyNum,
        luckyDir: luckyDir,
        shubhaTime: shubhaTime,
        fortuneScore: fortuneScore,
        panchang: {
          dateStr: getISTDateString(dateStr),
          formattedDateAs,
          weekday: dayLordInfo.day,
          dayLord: dayLordInfo.lord,
          nakshatra,
          yoga,
          tithi
        }
      };
    });

    return {
      isDynamicDaily: true,
      date: getISTDateString(dateStr),
      formattedDateAs,
      weekday: dayLordInfo.day,
      dayLord: dayLordInfo.lord,
      nakshatra,
      yoga,
      tithi,
      data: rashis
    };
  }

  function generatePersonalDailyReport(dob, rashiInput, dateStr) {
    const daily = generateDailyAssameseRashifal(dateStr);
    const q = String(rashiInput || "মেষ").trim().toLowerCase();
    const found = daily.data.find(r =>
      r.id === q ||
      r.name.toLowerCase().includes(q) ||
      r.as === rashiInput
    ) || daily.data[0];

    // Calculate Birth Mulank (मूलांक) from DOB for personalized touch
    let mulank = 1;
    let birthYear = 1995;
    if (dob) {
      const parts = String(dob).split(/[-/]/);
      if (parts.length >= 3) {
        birthYear = parseInt(parts[0], 10) || 1995;
        const bDay = parseInt(parts[2], 10) || 1;
        mulank = ((bDay - 1) % 9) + 1;
      }
    }
    const mulankAs = toAssameseNum(mulank);
    const mulankPlanets = {
      1: "সূৰ্য (নেতৃত্ব আৰু আত্মবল)",
      2: "চন্দ্ৰ (মনোবল আৰু সৃজনশীলতা)",
      3: "বৃহস্পতি (জ্ঞান আৰু সৌভাগ্য)",
      4: "ৰাহু (উদ্ভাৱনী শক্তি আৰু সাহস)",
      5: "বুধ (বুদ্ধিমত্তা আৰু বাণিজ্যিক সাফল্য)",
      6: "শুক্ৰ (ঐশ্বৰ্য, সুখ আৰু আকৰ্ষণ)",
      7: "কেতু (অন্তৰ্দৃষ্টি আৰু আধ্যাত্মিক তেজ)",
      8: "শনি (কৰ্মনিষ্ঠা আৰু স্থায়ী সমৃদ্ধি)",
      9: "মংগল (পৰাক্ৰম আৰু বিজয়)"
    };
    const mPlanet = mulankPlanets[mulank] || mulankPlanets[1];

    const reportHtml = `
      <div style="text-align:left;font-family:'Noto Sans Assamese',sans-serif;line-height:1.75;color:#1e293b;">
        <div style="background:linear-gradient(135deg,#4c1d95,#6d28d9);color:#fff;padding:16px 18px;border-radius:14px;margin-bottom:14px;">
          <div style="font-size:12px;color:#fde047;font-weight:700;">📅 ${daily.formattedDateAs} • নক্ষত্ৰ: ${daily.nakshatra} • ${daily.yoga}</div>
          <h3 style="margin:6px 0 4px;font-size:21px;color:#fff;">${found.symbol} ${found.name} — আজিৰ ব্যক্তিগত দৈনিক ৰাশিফল</h3>
          <div style="font-size:12.5px;color:#e9d5ff;">🎂 জন্ম তাৰিখ: ${dob || 'সংযুক্ত'} | জন্ম মূলাংক: ${mulankAs} (${mPlanet}) | ৰাশিপতি: ${found.lord}</div>
        </div>
        <div style="background:#f5f3ff;padding:15px;border-radius:12px;border-left:4px solid #6D28D9;margin-bottom:12px;">
          <strong style="color:#5b21b6;display:block;margin-bottom:4px;">🌟 আজিৰ সামগ্ৰিক গ্ৰহফল:</strong>
          ${found.overall} আপোনাৰ জন্ম মূলাংক ${mulankAs} হোৱা হেতু আজি ${mPlanet}ৰ শুভ প্ৰভাৱো আপোনাৰ সিদ্ধান্তসমূহত সহায়ক হ'ব।
        </div>
        <div style="background:#eff6ff;padding:13px 15px;border-radius:10px;border:1px solid #bfdbfe;border-left:4px solid #2563eb;margin-bottom:10px;">
          <strong style="color:#1d4ed8;">💼 কৰ্মক্ষেত্ৰ, চাকৰি আৰু অৰ্থনীতি:</strong><br>${found.career}
        </div>
        <div style="background:#fff1f2;padding:13px 15px;border-radius:10px;border:1px solid #fecdd3;border-left:4px solid #e11d48;margin-bottom:10px;">
          <strong style="color:#be123c;">❤️ প্ৰেম, বিবাহ আৰু পাৰিবাৰিক জীৱন:</strong><br>${found.love}
        </div>
        <div style="background:#ecfdf5;padding:13px 15px;border-radius:10px;border:1px solid #a7f3d0;border-left:4px solid #059669;margin-bottom:10px;">
          <strong style="color:#047857;">🧘 স্বাস্থ্য আৰু মানসিক স্থিতি:</strong><br>${found.health}
        </div>
        <div style="background:#fffbeb;padding:13px 15px;border-radius:10px;border:1px solid #fde68a;border-left:4px solid #d97706;">
          <strong style="color:#b45309;">🕉️ আজিৰ বৈদিক প্ৰতিকাৰ:</strong> ${found.advice}<br>
          <div style="margin-top:8px;padding-top:8px;border-top:1px dashed #fcd34d;font-weight:700;color:#6d28d9;">
            🍀 শুভ ৰং আৰু সংখ্যা: ${found.lucky}
          </div>
        </div>
      </div>`;

    return {
      success: true,
      isDynamicDaily: true,
      date: daily.date,
      report: reportHtml,
      data: found
    };
  }

  function generateCoupleDailyReport(boyDob, boyRashi, girlDob, girlRashi, dateStr) {
    const daily = generateDailyAssameseRashifal(dateStr);
    const bRashi = String(boyRashi || "মেষ").trim();
    const gRashi = String(girlRashi || "বৃষ").trim();
    const d = parseISTDate(dateStr);
    const { jd, dow } = getDaySeed(d);

    const bCode = bRashi.charCodeAt(0) + (boyDob ? boyDob.charCodeAt(boyDob.length - 1) : 5);
    const gCode = gRashi.charCodeAt(0) + (girlDob ? girlDob.charCodeAt(girlDob.length - 1) : 7);
    const gunaScore = 25 + ((bCode + gCode) % 10); // 25 to 34 out of 36
    const dailyHarmony = 86 + ((jd + bCode + gCode) % 13); // 86% to 98%

    const coupleThemes = [
      "আজি চন্দ্ৰ আৰু শুক্ৰ গ্ৰহৰ শুভ তৰংগই আপোনালোক দুয়োৰে মাজত মানসিক বুজাবুজি, আন্তৰিকতা আৰু আৱেগিক টান অধিক সুদৃঢ় কৰি তুলিব। ইজনে সিজনৰ সপোন আৰু মতামতক সন্মান জনালে সম্পৰ্কত নতুন মাধুৰ্য যোগ হ'ব।",
      "আজিৰ দিনটোত দুয়োৰে মাজত খোলাখুলি কথা-বতৰা আৰু বিশ্বাসৰ বান্ধোন অত্যন্ত মধুৰ থাকিব। ভৱিষ্যতৰ যুটীয়া পৰিকল্পনা, সঞ্চয় বা ভ্ৰমণৰ বিষয়ে আলোচনা কৰাৰ বাবে আজিৰ দিনটো অতি শুভ।",
      "পুৰণি কোনো সৰু-সুৰা অভিমান বা ভুল বুজাবুজি থাকিলে আজি মৰমেৰে কথা পাতিলে নিমিষতে আঁতৰি যাব। দুয়োৰে সমন্বয়ে পৰিয়ালত আনন্দ আৰু ইতিবাচক শক্তি বৃদ্ধি কৰিব।",
      "দেৱগুৰু বৃহস্পতি আৰু শুক্ৰৰ অনুকূল দৃষ্টিত আজি আপোনালোকৰ যুটীয়া ভাগ্য উজ্জ্বল থাকিব। ইজনে সিজনক মানসিক সমৰ্থন দিলে কৰ্মক্ষেত্ৰ আৰু ব্যক্তিগত জীৱন দুয়োটাতে সুন্দৰ সফলতা লাভ কৰিব।",
      "আজি সংগীৰ পৰা কোনো অপ্ৰত্যাশিত মৰমৰ বাৰ্তা বা সহযোগিতা লাভ কৰি মন আনন্দিত হ'ব। পাৰস্পৰিক ধৈৰ্য আৰু সহানুভূতিয়ে আপোনালোকৰ সম্পৰ্কক সকলো নেতিবাচক দৃষ্টিৰ পৰা সুৰক্ষিত ৰাখিব।"
    ];

    const coupleAdvices = [
      "আজি কাকো খঙত বা অভিমানত তিতা কথা নক'ব; সন্ধিয়া গোঁসাই ঘৰত ধূপ-চাকি জ্বলাই লক্ষ্মী-নাৰায়ণ বা শিৱ-পাৰ্বতীৰ আশীৰ্বাদ লওক।",
      "সংগীৰ কথা ধৈৰ্যৰে শুনক আৰু আজি তৃতীয় কোনো ব্যক্তিৰ কথাত ভোল গৈ নিজৰ মাজত সন্দেহৰ সৃষ্টি নকৰিব।",
      "পুৱা বা সন্ধিয়া দুয়ো একেলগে ইষ্ট দেৱতাক স্মৰণ কৰক আৰু পাৰিলে বগা বা হালধীয়া ফুল ভগৱানৰ চৰণত অৰ্পণ কৰক।",
      "পাৰস্পৰিক সন্মান বজাই ৰাখক আৰু আজি সন্ধিয়া কিছু সময় মোবাইলৰ পৰা আঁতৰি দুয়ো শান্তভাৱে কথা পাতক।"
    ];

    const themeText = coupleThemes[(jd + bCode + dow) % coupleThemes.length];
    const adviceText = coupleAdvices[(jd + gCode) % coupleAdvices.length];
    const luckyPairColors = ["গুলপীয়া আৰু বগা", "হালধীয়া আৰু সোণালী", "আকাশী নীলা আৰু ক্ৰীম", "ৰঙা আৰু বগা", "পাতল সেউজীয়া আৰু হালধীয়া"];
    const pairColor = luckyPairColors[(jd + bCode + gCode) % luckyPairColors.length];

    const reportHtml = `
      <div style="text-align:left;font-family:'Noto Sans Assamese',sans-serif;line-height:1.75;color:#1e293b;">
        <div style="background:linear-gradient(135deg,#be123c,#e11d48);color:#fff;padding:16px 18px;border-radius:14px;margin-bottom:14px;">
          <div style="font-size:12px;color:#fde047;font-weight:700;">📅 ${daily.formattedDateAs} • নক্ষত্ৰ: ${daily.nakshatra}</div>
          <h3 style="margin:6px 0 4px;font-size:20px;color:#fff;">❤️ আজিৰ যুটীয়া ৰাশিফল (${bRashi} আৰু ${gRashi})</h3>
          <div style="font-size:12.5px;color:#ffe4e6;">✨ অষ্টকূট গুণ মিলন আভাস: ${toAssameseNum(gunaScore)} / ৩৬ গুণ | আজিৰ প্ৰেমৰ সামঞ্জস্য: ${toAssameseNum(dailyHarmony)}%</div>
        </div>
        <div style="background:#fff1f2;padding:15px;border-radius:12px;border-left:4px solid #E11D48;margin-bottom:12px;">
          <strong style="color:#9f1239;display:block;margin-bottom:4px;">💑 আজিৰ প্ৰেম আৰু দাম্পত্য ফলাফল:</strong>
          ${themeText}
        </div>
        <div style="background:#f5f3ff;padding:13px 15px;border-radius:10px;border:1px solid #ddd6fe;margin-bottom:12px;">
          <strong style="color:#5b21b6;">🌟 দুয়োৰে ৰাশিৰ আজিৰ সংযোগ:</strong><br>
          ${bRashi} ৰাশিৰ উৎসাহ আৰু ${gRashi} ৰাশিৰ সংবেদনশীলতাই আজি '${daily.yoga}'ত এক সুন্দৰ ভাৰসাম্য সৃষ্টি কৰিছে। পাৰিবাৰিক আৰু আৰ্থিক বিষয়ত দুয়ো মিলি লোৱা সিদ্ধান্তই শুভ ফল দিব।
        </div>
        <div style="background:#fffbeb;padding:13px 15px;border-radius:10px;border:1px solid #fde68a;border-left:4px solid #d97706;">
          <strong style="color:#b45309;">🕉️ যুটীয়া শুভ পৰামৰ্শ:</strong> ${adviceText}<br>
          <div style="margin-top:8px;padding-top:8px;border-top:1px dashed #fcd34d;font-weight:700;color:#be123c;">
            🍀 আজিৰ যুটীয়া শুভ ৰং: ${pairColor} | শুভ সময়: সন্ধিয়া ০৫:৩০ – ০৭:৩০ বজা
          </div>
        </div>
      </div>`;

    return {
      success: true,
      isDynamicDaily: true,
      date: daily.date,
      report: reportHtml
    };
  }

  global.generateDailyAssameseRashifal = generateDailyAssameseRashifal;
  global.generatePersonalDailyReport = generatePersonalDailyReport;
  global.generateCoupleDailyReport = generateCoupleDailyReport;
  global.dayIndex = function() {
    const d = parseISTDate();
    const start = new Date(d.getFullYear(), 0, 0);
    return Math.floor((d - start) / 86400000);
  };

  // Populate window.ZODIAC dynamically for today
  const todayResult = generateDailyAssameseRashifal();
  global.ZODIAC = todayResult.data.map(r => ({
    id: r.id,
    as: r.as,
    en: r.id.charAt(0).toUpperCase() + r.id.slice(1),
    s: r.symbol,
    asData: {
      overview: r.overall,
      love: r.love,
      career: r.career,
      finance: r.career,
      health: r.health,
      advice: r.advice,
      lucky: r.luckyColor,
      number: r.luckyNumber
    }
  }));
})(typeof window !== "undefined" ? window : globalThis);
