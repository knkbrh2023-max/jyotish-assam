/* Daily Rashifal engine.
   The site automatically selects a deterministic daily entry.
   Replace the sample texts with your own original editorial content.
*/
window.ZODIAC = [
 {id:"aries",as:"মেষ",en:"Aries",s:"♈",base:"আজ নতুন কাম আৰম্ভ কৰাৰ আগতে পৰিকল্পনা কৰক।",love:"প্ৰেমত কথা স্পষ্টকৈ কওক।",career:"কামত initiative ল’লে লাভ পাব।",finance:"অপ্রয়োজনীয় খৰচ কমাওক।"},
 {id:"taurus",as:"বৃষ",en:"Taurus",s:"♉",base:"ধৈৰ্য আৰু স্থিৰতাই আজি আপোনাক আগুৱাই নিব।",love:"সম্পৰ্কত বিশ্বাস বজাই ৰাখক।",career:"ধীৰে কিন্তু নিশ্চিতভাৱে আগবাঢ়ক।",finance:"সঞ্চয়ৰ ওপৰত গুৰুত্ব দিয়ক।"},
 {id:"gemini",as:"মিথুন",en:"Gemini",s:"♊",base:"যোগাযোগৰ জৰিয়তে নতুন সুযোগ আহিব পাৰে।",love:"মন খুলি কথা পাতক।",career:"Networking-এ সহায় কৰিব পাৰে।",finance:"নতুন financial commitment আগতে ভাবি লওক।"},
 {id:"cancer",as:"কৰ্কট",en:"Cancer",s:"♋",base:"পৰিয়াল আৰু ব্যক্তিগত লক্ষ্যৰ মাজত balance ৰাখক।",love:"আপোনাৰ অনুভূতি সন্মানসহ প্ৰকাশ কৰক।",career:"Teamwork-ত ভাল ফল পাব পাৰে।",finance:"ঘৰুৱা খৰচৰ budget বনাওক।"},
 {id:"leo",as:"সিংহ",en:"Leo",s:"♌",base:"নেতৃত্ব লোৱাৰ সুযোগ আহিব পাৰে।",love:"আত্মবিশ্বাসে ইতিবাচক impression দিব।",career:"নিজৰ প্ৰতিভা দেখুওৱাৰ সময়।",finance:"আয় বৃদ্ধিৰ নতুন idea ভাবক।"},
 {id:"virgo",as:"কন্যা",en:"Virgo",s:"♍",base:"সৰু সৰু detail-এ আজি ডাঙৰ পাৰ্থক্য আনিব।",love:"অতি বিশ্লেষণ নকৰি অনুভৱকো মূল্য দিয়ক।",career:"Priority set কৰি কাম কৰক।",finance:"হিচাপ-নিকাচ পুনৰ চাওক।"},
 {id:"libra",as:"তুলা",en:"Libra",s:"♎",base:"সমতা আৰু diplomacy আজি আপোনাৰ শক্তি।",love:"সম্পৰ্কত compromise সহায়ক হ’ব।",career:"Partnership-ৰ সুযোগ বিবেচনা কৰিব পাৰে।",finance:"দুয়োফাল চাই সিদ্ধান্ত লওক।"},
 {id:"scorpio",as:"বৃশ্চিক",en:"Scorpio",s:"♏",base:"গভীৰ মনোযোগে গুৰুত্বপূৰ্ণ কাম সম্পূৰ্ণ কৰাত সহায় কৰিব।",love:"অতি সন্দেহ এৰাই বিশ্বাস বজাই ৰাখক।",career:"গোপনীয় কামত focus ভাল থাকিব।",finance:"ঝুঁকিপূৰ্ণ সিদ্ধান্তত সাৱধান হওক।"},
 {id:"sagittarius",as:"ধনু",en:"Sagittarius",s:"♐",base:"নতুন জ্ঞান আৰু নতুন অভিজ্ঞতাৰ দিন।",love:"সততা সম্পৰ্ক শক্তিশালী কৰিব।",career:"নতুন skill শিকিবলৈ ভাল সময়।",finance:"ভ্ৰমণ বা learning খৰচ পৰিকল্পনা কৰক।"},
 {id:"capricorn",as:"মকৰ",en:"Capricorn",s:"♑",base:"পৰিশ্ৰমৰ ফল ধীৰে ধীৰে দৃশ্যমান হ’ব।",love:"কাজৰ মাজতো আপোনজনক সময় দিয়ক।",career:"Consistency-এ advantage দিব।",finance:"দীৰ্ঘম্যাদী লক্ষ্যত মন দিয়ক।"},
 {id:"aquarius",as:"কুম্ভ",en:"Aquarius",s:"♒",base:"নতুন idea বাস্তৱায়নৰ সুযোগ পাব পাৰে।",love:"বন্ধুত্ব আৰু প্ৰেমৰ মাজত ভাল যোগাযোগ ৰাখক।",career:"Creative approach ব্যৱহাৰ কৰক।",finance:"নতুন income idea note কৰি ৰাখক।"},
 {id:"pisces",as:"মীন",en:"Pisces",s:"♓",base:"সৃজনশীলতা আৰু intuition আজি শক্তিশালী থাকিব পাৰে।",love:"কোমল ব্যৱহাৰে সম্পর্ক মধুৰ কৰিব।",career:"Creative work-ত মনোযোগ দিয়ক।",finance:"আৱেগত কিনাকটা নকৰিব।"}
];

window.dayIndex = function(){
  const d = new Date();
  const start = new Date(d.getFullYear(),0,0);
  return Math.floor((d-start)/86400000);
};
