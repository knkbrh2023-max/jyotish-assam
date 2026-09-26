import os
import datetime
import pytz
import requests
from playwright.sync_api import sync_playwright

# ১. ভাৰতীয় সময় (IST) অনুসৰি আজিৰ তাৰিখ আৰু বাৰ উলিওৱা
ist = pytz.timezone('Asia/Kolkata')
now = datetime.datetime.now(ist)

assamese_days = ["সোমবাৰ", "মঙ্গলবাৰ", "বুধবাৰ", "বৃহস্পতিবাৰ", "শুক্ৰবাৰ", "শনিবাৰ", "দেওবাৰ"]
assamese_months = ["জানুৱাৰী", "ফেব্ৰুৱাৰী", "মাৰ্চ", "এপ্ৰিল", "মে'", "জুন", "জুলাই", "আগষ্ট", "ছেপ্টেম্বৰ", "অক্টোবৰ", "নৱেম্বৰ", "ডিচেম্বৰ"]

def to_assamese_num(n):
    mapping = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'}
    return ''.join(mapping.get(c, c) for c in str(n))

day_name = assamese_days[now.weekday()]
date_str = f"{to_assamese_num(now.day)} {assamese_months[now.month - 1]} {to_assamese_num(now.year)}"

# ২. Playwright ৰবটেৰে auto_rashifal.html খুলি HD ফটো তোলা
html_path = f"file://{os.path.abspath('auto_rashifal.html')}"
image_path = "ajir_rashifal.png"

print("🤖 ৰবটে আজিৰ ৰাশিফলৰ ফটো তুলি আছে...")
with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    # ভাৰতীয় সময় আৰু ডাঙৰ স্ক্ৰীণ ছেট কৰা হৈছে যাতে ফটোখন ফাটি নাযায়
    context = browser.new_context(
        viewport={"width": 1000, "height": 1400},
        device_scale_factor=2,
        timezone_id="Asia/Kolkata"
    )
    page = context.new_page()
    page.goto(html_path, wait_until="networkidle")
    page.wait_for_timeout(3000) # অসমীয়া ফণ্টটো ভালদৰে লোড হ'বলৈ ৩ ছেকেণ্ড ৰ'ব
    
    # কেৱল ৰাশিফলৰ বক্সটোৰ ফটো তোলা
    element = page.locator("#rashifal-sheet")
    element.screenshot(path=image_path)
    browser.close()

print("✅ ফটোখন সফলতাৰে তৈয়াৰ হ'ল!")

# ৩. Facebook Graph API ৰ জৰিয়তে পেজত আপলোড কৰা
FB_PAGE_ID = os.environ.get("FB_PAGE_ID")
FB_ACCESS_TOKEN = os.environ.get("FB_ACCESS_TOKEN")

caption = f"""🕉️ আজিৰ অসমীয়া দৈনিক ৰাশিফল ({date_str}, {day_name}) ✨

আজি মেষ ৰাশিৰ পৰা মীন ৰাশিলৈকে ১২টা ৰাশিৰ জাতক-জাতিকাৰ ভাগ্যত কি লিখা আছে ফটোখনত পঢ়ক।

💍 আপোনাৰ জন্ম তাৰিখ দি বিনামূলীয়াকৈ আপোনাৰ শুভ ৰত্ন (Lucky Gemstone), আজিৰ শুভ মুহূৰ্ত, যুটীয়া ৰাশিফল আৰু সম্পূৰ্ণ অসমীয়া জন্ম কুণ্ডলী (PDF) ডাউনলোড কৰিবলৈ তলৰ লিংকত ক্লিক কৰক 👇
🌐 https://jyotishassam.com

#AssameseRashifal #AjirRashifal #JyotishAssam #অসমীয়াৰাশিফল #Assam"""

url = f"https://graph.facebook.com/v20.0/{FB_PAGE_ID}/photos"

with open(image_path, "rb") as img_file:
    payload = {
        "caption": caption,
        "access_token": FB_ACCESS_TOKEN
    }
    files = {
        "source": img_file
    }
    response = requests.post(url, data=payload, files=files)

if response.status_code == 200:
    print("🚀 বঢ়িয়া! ফেচবুক পেজত আজিৰ ৰাশিফল অটোমেটিক পোষ্ট হৈ গ'ল!", response.json())
else:
    print("❌ ফেচবুক পোষ্টত কিবা সমস্যা হৈছে:", response.text)
    exit(1)
