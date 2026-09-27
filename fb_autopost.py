import os
import time
import requests
from datetime import datetime, timezone, timedelta
from playwright.sync_api import sync_playwright

# ভাৰতীয় সময় (IST) উলিওৱা
ist = timezone(timedelta(hours=5, minutes=30))
now = datetime.now(ist)

assamese_months = ["জানুৱাৰী", "ফেব্ৰুৱাৰী", "মাৰ্চ", "এপ্ৰিল", "মে'", "জুন", "জুলাই", "আগষ্ট", "ছেপ্টেম্বৰ", "অক্টোবৰ", "নৱেম্বৰ", "ডিচেম্বৰ"]
assamese_days = ["সোমবাৰ", "মঙ্গলবাৰ", "বুধবাৰ", "বৃহস্পতিবাৰ", "শুক্ৰবাৰ", "শনিবাৰ", "দেওবাৰ"]

def to_assamese_num(n):
    mapping = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'}
    return ''.join(mapping.get(c, c) for c in str(n))

date_str = f"{to_assamese_num(now.day)} {assamese_months[now.month - 1]} {to_assamese_num(now.year)}"
day_str = assamese_days[now.weekday()]

# ১. HTML ফাইলৰ পৰা HD ফটোখন তৈয়াৰ কৰা
def generate_image():
    html_path = os.path.abspath("auto_rashifal.html")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 1000, "height": 1400}, device_scale_factor=2)
        page.goto(f"file://{html_path}", wait_until="networkidle")
        page.wait_for_timeout(2000)
        element = page.locator("#rashifal-sheet")
        element.screenshot(path="daily_rashifal.png")
        browser.close()
    print("✅ ৰাশিফলৰ HD ফটোখন সফলতাৰে তৈয়াৰ হ'ল!")

# ২. ফেচবুকত পোষ্ট কৰা আৰু ১ম কমেন্টত লিংক দিয়া
def post_to_facebook():
    page_id = os.environ.get("FB_PAGE_ID")
    access_token = os.environ.get("FB_ACCESS_TOKEN")

    if not page_id or not access_token:
        raise ValueError("❌ FB_PAGE_ID বা FB_ACCESS_TOKEN পোৱা নগ'ল!")

    # মূল কেপচন (ইয়াত ডাইৰেক্ট লিংক নাই যাতে ফেচবুকে ভিউজ বঢ়াই দিয়ে!)
    caption = (
        f"🔮 আজিৰ দৈনিক ৰাশিফল — {date_str} ({day_str}) 🕉️✨\n\n"
        f"⚠️ আজি গ্ৰহৰ স্থান পৰিৱৰ্তনৰ বাবে ৩টা ৰাশিৰ জাতক-জাতিকাই ধন আৰু স্বাস্থ্যৰ ক্ষেত্ৰত বিশেষ সাৱধান হোৱাটো জৰুৰী!\n\n"
        f"👇 আপোনাৰ জন্ম তাৰিখ অনুসাৰে আঙুলিত কোনটো ৰত্নই (Lucky Gemstone) ভাগ্য সলাব আৰু আপোনাৰ সম্পূৰ্ণ অসমীয়া জন্ম কুণ্ডলীখন (PDF) বিনামূলীয়াকৈ চাবলৈ তলৰ প্ৰথম কমেন্টটো (First Comment) চাওক! ⬇️\n\n"
        f"💬 আপোনাৰ ৰাশিটো কি? তলত কমেন্টত 'ওঁম নমঃ শিৱায়' বা আপোনাৰ ৰাশিৰ নামটো লিখি জনাবলৈ নাপাহৰিব!\n\n"
        f"#AssameseRashifal #JyotishAssam #আজিৰৰাশিফল #অসমীয়া #AssamAstrology"
    )

    # ফটোখন ফেচবুকত আপলোড কৰা
    photo_url = f"https://graph.facebook.com/v20.0/{page_id}/photos"
    with open("daily_rashifal.png", "rb") as img_file:
         payload = {
             "message": caption,
             "access_token": access_token
         }
         files = {
             "source": img_file
         }
         response = requests.post(photo_url, data=payload, files=files)

    res_data = response.json()
    if response.status_code != 200:
        raise Exception(f"❌ ফেচবুক পোষ্টত সমস্যা: {res_data}")

    print("✅ ফটোখন সফলতাৰে ফেচবুক পেজত পোষ্ট হ'ল!", res_data)

    # ৩. এতিয়া পোনপটীয়াকৈ প্ৰথম কমেন্টত (1st Comment) ৱেবছাইটৰ লিংক দিয়া
    post_id = res_data.get("post_id") or res_data.get("id")
    if post_id:
        time.sleep(3)  # ৩ ছেকেণ্ড ৰৈ কমেন্ট কৰা
        comment_text = (
            f"🌐 আমাৰ অফিচিয়েল ৱেবছাইটত বিনামূলীয়াকৈ আপোনাৰ ভৱিষ্যত গণনা কৰক:\n\n"
            f"💍 ১. আপোনাৰ হাতত কোনটো ৰত্ন (পাথৰ) খাপ খাব চাবলৈ ইয়াত টিপক:\n"
            f"👉 https://jyotishassam.com\n\n"
            f"📜 ২. জন্ম তাৰিখ দি সম্পূৰ্ণ অসমীয়া জন্ম কুণ্ডলী (PDF) ডাউনলোড কৰক:\n"
            f"👉 https://jyotishassam.com\n\n"
            f"❤️ ৩. বিবাহৰ বাবে ল'ৰা-ছোৱালীৰ যোটক বিচাৰ (Kundali Matching) কৰক:\n"
            f"👉 https://jyotishassam.com"
        )
        
        comment_url = f"https://graph.facebook.com/v20.0/{post_id}/comments"
        comment_res = requests.post(comment_url, data={
            "message": comment_text,
            "access_token": access_token
        })

        if comment_res.status_code == 200:
            print("🎉 ১ম কমেন্টত ৱেবছাইটৰ লিংক সফলতাৰে যোগ হ'ল!")
        else:
            # যদি টোকেনটোত কমেন্টৰ অনুমতি নাথাকে, তেন্তে মেইন পোষ্টটো নষ্ট নহয়
            print("⚠️ কমেন্ট দিবলৈ 'pages_manage_engagement' অনুমতিৰ প্ৰয়োজন হ'ব পাৰে:", comment_res.json())

if __name__ == "__main__":
    generate_image()
    post_to_facebook()
