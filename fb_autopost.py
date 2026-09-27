import os
import time
import subprocess
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
    print("✅ ১. ৰাশিফলৰ HD ফটোখন সফলতাৰে তৈয়াৰ হ'ল!")

# ২. ফটোখনৰ পৰা ১০ ছেকেণ্ডৰ HD Reel ভিডিঅ' (1080x1920) তৈয়াৰ কৰা
def generate_reel_video():
    vf_filter = (
        "scale=1080:1920:force_original_aspect_ratio=decrease,"
        "pad=1080:1920:(ow-iw)/2:(oh-ih)/2:#120524,format=yuv420p"
    )
    
    # যদি আপুনি গিটহাবত music.mp3 ফাইল ভৰাই থয় তেন্তে সেইটো বজাব, নহ'লে শান্তিপূৰ্ণ ধ্যানৰ সুৰ নিজে বনাব
    if os.path.exists("music.mp3"):
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", "daily_rashifal.png",
            "-i", "music.mp3",
            "-vf", vf_filter,
            "-c:v", "libx264", "-t", "12", "-r", "30",
            "-c:a", "aac", "-b:a", "128k", "-shortest",
            "daily_reel.mp4"
        ]
    else:
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", "daily_rashifal.png",
            "-f", "lavfi", "-i", "aevalsrc=0.1*sin(2*PI*432*t)+0.08*sin(2*PI*540*t)+0.05*sin(2*PI*648*t):d=10",
            "-vf", vf_filter,
            "-c:v", "libx264", "-t", "10", "-r", "30",
            "-c:a", "aac", "-b:a", "128k", "-shortest",
            "daily_reel.mp4"
        ]
    
    subprocess.run(cmd, check=True)
    print("🎬 ২. ১০ ছেকেণ্ডৰ Facebook Reel ভিডিঅ' (daily_reel.mp4) সফলতাৰে তৈয়াৰ হ'ল!")

# ৩. পোষ্ট বা ৰিলৰ তলত ১ম কমেন্টত ৱেবছাইটৰ লিংক দিয়া ফাংচন
def add_first_comment(object_id, access_token):
    if not object_id:
        return
    time.sleep(3)
    comment_text = (
        f"🌐 আমাৰ অফিচিয়েল ৱেবছাইটত বিনামূলীয়াকৈ আপোনাৰ ভৱিষ্যত গণনা কৰক:\n\n"
        f"💍 ১. আপোনাৰ হাতত কোনটো ৰত্ন (পাথৰ) খাপ খাব চাবলৈ ইয়াত টিপক:\n"
        f"👉 https://jyotishassam.com\n\n"
        f"📜 ২. জন্ম তাৰিখ দি সম্পূৰ্ণ অসমীয়া জন্ম কুণ্ডলী (PDF) ডাউনলোড কৰক:\n"
        f"👉 https://jyotishassam.com\n\n"
        f"❤️ ৩. বিবাহৰ বাবে ল'ৰা-ছোৱালীৰ যোটক বিচাৰ (Kundali Matching) কৰক:\n"
        f"👉 https://jyotishassam.com"
    )
    comment_url = f"https://graph.facebook.com/v20.0/{object_id}/comments"
    res = requests.post(comment_url, data={"message": comment_text, "access_token": access_token})
    if res.status_code == 200:
        print(f"🎉 কমেন্টত ৱেবছাইটৰ লিংক সফলতাৰে যোগ হ'ল! ({object_id})")
    else:
        print("⚠️ কমেন্ট নোট:", res.json())

# ৪. ফেচবুকত ফটো পোষ্ট কৰা
def post_photo_to_facebook(page_id, access_token, caption):
    photo_url = f"https://graph.facebook.com/v20.0/{page_id}/photos"
    with open("daily_rashifal.png", "rb") as img_file:
        response = requests.post(
            photo_url,
            data={"message": caption, "access_token": access_token},
            files={"source": img_file}
        )
    res_data = response.json()
    if response.status_code == 200:
        print("✅ ৩. ফটোখন সফলতাৰে পোষ্ট হ'ল!", res_data)
        post_id = res_data.get("post_id") or res_data.get("id")
        add_first_comment(post_id, access_token)
    else:
        print("❌ ফটো পোষ্টত সমস্যা:", res_data)

# ৫. ফেচবুকত Auto Reel ভিডিঅ' পোষ্ট কৰা
def post_reel_to_facebook(page_id, access_token, caption):
    print("🚀 ৪. Facebook Reels আপলোড আৰম্ভ হৈছে...")
    
    # Step A: Initialize Reel Upload
    init_url = f"https://graph.facebook.com/v20.0/{page_id}/video_reels"
    init_res = requests.post(init_url, data={
        "upload_phase": "start",
        "access_token": access_token
    }).json()

    if "video_id" in init_res:
        video_id = init_res["video_id"]
        upload_url = init_res["upload_url"]
        file_size = os.path.getsize("daily_reel.mp4")

        # Step B: Upload Binary Video
        with open("daily_reel.mp4", "rb") as f:
            headers = {
                "Authorization": f"OAuth {access_token}",
                "offset": "0",
                "file_size": str(file_size)
            }
            requests.post(upload_url, headers=headers, data=f)

        # Step C: Publish the Reel
        finish_res = requests.post(init_url, data={
            "access_token": access_token,
            "video_id": video_id,
            "upload_phase": "finish",
            "video_state": "PUBLISHED",
            "description": caption
        }).json()

        print("🎉 ৫. Facebook Reel সফলতাৰে পাব্লিছ হ'ল!", finish_res)
        add_first_comment(video_id, access_token)
    else:
        # যদি Reels API ত কিবা বাধা আহে, তেন্তে ডাইৰেক্ট ভিডিঅ' হিচাপে আপলোড কৰিব
        print("⚠️ Reels API ৰ সলনি Standard Video হিচাপে আপলোড কৰা হৈছে...")
        vid_url = f"https://graph.facebook.com/v20.0/{page_id}/videos"
        with open("daily_reel.mp4", "rb") as vf:
            v_res = requests.post(
                vid_url,
                data={"description": caption, "access_token": access_token},
                files={"source": vf}
            ).json()
        print("✅ ভিডিঅ' সফলতাৰে পোষ্ট হ'ল!", v_res)
        add_first_comment(v_res.get("id"), access_token)

if __name__ == "__main__":
    page_id = os.environ.get("FB_PAGE_ID")
    access_token = os.environ.get("FB_ACCESS_TOKEN")

    if not page_id or not access_token:
        raise ValueError("❌ FB_PAGE_ID বা FB_ACCESS_TOKEN পোৱা নগ'ল!")

    caption = (
        f"🔮 আজিৰ দৈনিক ৰাশিফল — {date_str} ({day_str}) 🕉️✨\n\n"
        f"⚠️ আজি গ্ৰহৰ স্থান পৰিৱৰ্তনৰ বাবে ৩টা ৰাশিৰ জাতক-জাতিকাই বিশেষ সাৱধান হোৱাটো জৰুৰী!\n\n"
        f"👇 আপোনাৰ জন্ম তাৰিখ অনুসাৰে আঙুলিত কোনটো ৰত্নই (Lucky Gemstone) ভাগ্য সলাব আৰু সম্পূৰ্ণ অসমীয়া জন্ম কুণ্ডলীখন (PDF) চাবলৈ তলৰ প্ৰথম কমেন্টটো (First Comment) চাওক বা আমাৰ ৱেবছাইট jyotishassam.com খোলক! ⬇️\n\n"
        f"💬 আপোনাৰ ৰাশিটো কি? তলত কমেন্টত 'ওঁম নমঃ শিৱায়' লিখি জনাব!\n\n"
        f"#AssameseReels #JyotishAssam #আজিৰৰাশিফল #AssameseRashifal #AssamAstrology #ReelsAssam"
    )

    generate_image()
    generate_reel_video()
    post_photo_to_facebook(page_id, access_token, caption)
    post_reel_to_facebook(page_id, access_token, caption)
