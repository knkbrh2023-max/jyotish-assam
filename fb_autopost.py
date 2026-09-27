import os
import time
import math
import wave
import struct
import shutil
import subprocess
import requests
from datetime import datetime, timezone, timedelta
from playwright.sync_api import sync_playwright

# ভাৰতীয় সময় (IST)
ist = timezone(timedelta(hours=5, minutes=30))
now = datetime.now(ist)

assamese_months = ["জানুৱাৰী", "ফেব্ৰুৱাৰী", "মাৰ্চ", "এপ্ৰিল", "মে'", "জুন", "জুলাই", "আগষ্ট", "ছেপ্টেম্বৰ", "অক্টোবৰ", "নৱেম্বৰ", "ডিচেম্বৰ"]
assamese_days = ["সোমবাৰ", "মঙ্গলবাৰ", "বুধবাৰ", "বৃহস্পতিবাৰ", "শুক্ৰবাৰ", "শনিবাৰ", "দেওবাৰ"]

def to_assamese_num(n):
    mapping = {'0':'০','1':'১','2':'২','3':'৩','4':'৪','5':'৫','6':'৬','7':'৭','8':'৮','9':'৯'}
    return ''.join(mapping.get(c, c) for c in str(n))

date_str = f"{to_assamese_num(now.day)} {assamese_months[now.month - 1]} {to_assamese_num(now.year)}"
day_str = assamese_days[now.weekday()]

# ১. সুমধুৰ ভাৰতীয় আধ্যাত্মিক সংগীত (Raga Bhupali Spiritual Melody) তৈয়াৰ কৰা
def generate_pleasant_music(filename=" pleasant_bgm.wav", duration=16):
    sample_rate = 44100
    num_samples = duration * sample_rate
    
    # ভাৰতীয় শাস্ত্ৰীয় ৰাগ ভূপালীৰ স্বৰ (Sa, Re, Ga, Pa, Dha, Sa')
    notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 440.00, 392.00, 329.63, 293.66]
    note_len = 0.85  # প্ৰতিটো সুৰৰ সময়

    with wave.open(filename, 'w') as wav_file:
        wav_file.setnchannels(2)
        wav_file.setsampwidth(2)
        wav_file.setframerate(sample_rate)

        for i in range(num_samples):
            t = i / sample_rate
            
            # মৃদু তানপুৰা ড্ৰোন (Soft Tanpura Drone: Sa + Pa)
            drone = 0.04 * math.sin(2 * math.pi * 130.81 * t) + 0.03 * math.sin(2 * math.pi * 196.00 * t)
            
            # জল-তৰংগ / সন্তুৰৰ সুমধুৰ মেল'ডি (Plucked Bell/Santoor Envelope)
            note_idx = int(t / note_len) % len(notes)
            note_t = t % note_len
            freq = notes[note_idx]
            envelope = math.exp(-3.2 * note_t) * (1 - math.exp(-40 * note_t))
            
            melody = envelope * (
                0.22 * math.sin(2 * math.pi * freq * t) +
                0.10 * math.sin(2 * math.pi * (freq * 2) * t) +
                0.04 * math.sin(2 * math.pi * (freq * 3) * t)
            )
            
            # আৰম্ভণি আৰু শেষত মিহিকৈ ফেড-ইন/ফেড-আউট (Fade In & Out)
            fade = 1.0
            if t < 1.5:
                fade = t / 1.5
            elif t > duration - 2.0:
                fade = max(0.0, (duration - t) / 2.0)

            val = (drone + melody) * fade
            sample = max(-32767, min(32767, int(val * 32767)))
            wav_file.writeframesraw(struct.pack('<hh', sample, sample))

    print("🎵 ১. সুমধুৰ আধ্যাত্মিক সংগীত সফলতাৰে তৈয়াৰ হ'ল!")

# ২. ফটো পোষ্টৰ বাবে মূল ফটো + ১৬:৯ ভিডিঅ'ৰ বাবে ৩টা বিশেষ স্লাইড তৈয়াৰ কৰা
def generate_images_and_slides():
    html_path = os.path.abspath("auto_rashifal.html")
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        
        # (ক) মেইন ফটো পোষ্টৰ বাবে ষ্টেণ্ডাৰ্ড ফটো
        page = browser.new_page(viewport={"width": 1000, "height": 1400}, device_scale_factor=2)
        page.goto(f"file://{html_path}", wait_until="networkidle")
        page.wait_for_timeout(1500)
        page.locator("#rashifal-sheet").screenshot(path="daily_rashifal.png")
        page.close()

        # (খ) ১৬:৯ ওয়াইড-স্ক্ৰীণ (1920x1080) ভিডিঅ'ৰ বাবে ৩টা দৃশ্য তৈয়াৰ কৰা
        vpage = browser.new_page(viewport={"width": 1920, "height": 1080}, device_scale_factor=1)
        vpage.goto(f"file://{html_path}", wait_until="networkidle")
        vpage.wait_for_timeout(1000)

        # ১৬:৯ টিভি স্ক্ৰীণৰ বাবে ডিজাইনটো ফিট কৰা
        vpage.evaluate("""() => {
            document.querySelector('.btn-bar').style.display = 'none';
            document.body.style.padding = '0';
            document.body.style.margin = '0';
            document.body.style.background = '#120524';
            const sheet = document.getElementById('rashifal-sheet');
            sheet.style.width = '1920px';
            sheet.style.height = '1080px';
            sheet.style.borderRadius = '0';
            sheet.style.border = '8px solid #ffd700';
            sheet.style.display = 'flex';
            sheet.style.flexDirection = 'column';
            sheet.style.justifyContent = 'space-between';
            sheet.style.padding = '20px 35px';
        }""")

        # দৃশ্য ১: প্ৰথম ৬টা ৰাশি (মেষ - কন্যা) ডাঙৰকৈ ১৬:৯ স্ক্ৰীণত
        vpage.evaluate("""() => {
            const cards = document.querySelectorAll('.rashi-card');
            cards.forEach((c, i) => {
                c.style.display = (i < 6) ? 'flex' : 'none';
                c.querySelector('.rashi-head').style.fontSize = '24px';
                c.querySelector('.rashi-head').style.padding = '12px 16px';
                c.querySelector('.rashi-body').style.fontSize = '20px';
                c.querySelector('.rashi-body').style.lineHeight = '1.6';
                c.querySelector('.rashi-body').style.padding = '16px';
            });
            const grid = document.getElementById('rashi-container');
            grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
            grid.style.gap = '20px';
        }""")
        vpage.wait_for_timeout(300)
        vpage.screenshot(path="slide1.png")

        # দৃশ্য ২: বাকী ৬টা ৰাশি (তুলা - মীন) ডাঙৰকৈ ১৬:৯ স্ক্ৰীণত
        vpage.evaluate("""() => {
            const cards = document.querySelectorAll('.rashi-card');
            cards.forEach((c, i) => {
                c.style.display = (i >= 6) ? 'flex' : 'none';
            });
        }""")
        vpage.wait_for_timeout(300)
        vpage.screenshot(path="slide2.png")

        # দৃশ্য ৩: সম্পূৰ্ণ ১২টা ৰাশি একেলগে ১৬:৯ স্ক্ৰীণত (4x3 Widescreen Grid)
        vpage.evaluate("""() => {
            const cards = document.querySelectorAll('.rashi-card');
            cards.forEach(c => {
                c.style.display = 'flex';
                c.querySelector('.rashi-head').style.fontSize = '18px';
                c.querySelector('.rashi-head').style.padding = '7px 12px';
                c.querySelector('.rashi-body').style.fontSize = '14.5px';
                c.querySelector('.rashi-body').style.lineHeight = '1.42';
                c.querySelector('.rashi-body').style.padding = '10px 12px';
            });
            const grid = document.getElementById('rashi-container');
            grid.style.gridTemplateColumns = 'repeat(4, 1fr)';
            grid.style.gap = '12px';
        }""")
        vpage.wait_for_timeout(300)
        vpage.screenshot(path="slide3.png")

        browser.close()
    print("✅ ২. ফটো আৰু ১৬:৯ ভিডিঅ'ৰ ৩টা স্লাইড সফলতাৰে তৈয়াৰ হ'ল!")

# ৩. ১৬:৯ এনিমেটেড ভিডিঅ' (Smooth Zoom + Crossfade Transitions) তৈয়াৰ কৰা
def generate_animated_16_9_video():
    if not shutil.which("ffmpeg"):
        print("⚙️ ছাৰ্ভাৰত FFmpeg ইনষ্টল কৰা হৈছে...")
        subprocess.run(["sudo", "apt-get", "update", "-y"], check=True)
        subprocess.run(["sudo", "apt-get", "install", "-y", "ffmpeg"], check=True)

    # যদি গিটহাবত আপোনাৰ নিজা music.mp3 থাকে তেন্তে সেইটো ল'ব, নহ'লে সুমধুৰ ৰাগ ভূপালী বজাব
    audio_file = "music.mp3" if os.path.exists("music.mp3") else "pleasant_bgm.wav"
    if audio_file == "pleasant_bgm.wav":
        generate_pleasant_music(audio_file, duration=16)

    # প্ৰতিটো দৃশ্যত মৃদু জুম এনিমেচন (Ken Burns Zoom) আৰু এটা দৃশ্যৰ পৰা আনটোলৈ স্মুথ ফেড এনিমেচন
    filter_complex = (
        "[0:v]scale=2112:1188,zoompan=z='min(zoom+0.0006,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1920x1080:fps=25,settb=1/25,fps=25,format=yuv420p[v0];"
        "[1:v]scale=2112:1188,zoompan=z='min(zoom+0.0006,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1920x1080:fps=25,settb=1/25,fps=25,format=yuv420p[v1];"
        "[2:v]scale=2112:1188,zoompan=z='min(zoom+0.0006,1.08)':x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=150:s=1920x1080:fps=25,settb=1/25,fps=25,format=yuv420p[v2];"
        "[v0][v1]xfade=transition=fade:duration=1:offset=5[vx];"
        "[vx][v2]xfade=transition=fade:duration=1:offset=10,format=yuv420p[vout]"
    )

    cmd = [
        "ffmpeg", "-y",
        "-i", "slide1.png",
        "-i", "slide2.png",
        "-i", "slide3.png",
        "-i", audio_file,
        "-filter_complex", filter_complex,
        "-map", "[vout]", "-map", "3:a",
        "-c:v", "libx264", "-preset", "fast", "-crf", "20",
        "-c:a", "aac", "-b:a", "192k",
        "-t", "16", "-shortest",
        "daily_video_16_9.mp4"
    ]
    subprocess.run(cmd, check=True)
    print("🎬 ৩. ১৬:৯ এনিমেটেড HD ভিডিঅ' (daily_video_16_9.mp4) সফলতাৰে তৈয়াৰ হ'ল!")

# ৪. পোষ্টৰ তলত ১ম কমেন্টত ৱেবছাইটৰ লিংক দিয়া
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
        print(f"🎉 ১ম কমেন্টত ৱেবছাইটৰ লিংক যোগ হ'ল! ({object_id})")

# ৫. ফেচবুকত ফটো পোষ্ট কৰা
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
        print("✅ ৪. ফটোখন সফলতাৰে পোষ্ট হ'ল!", res_data)
        post_id = res_data.get("post_id") or res_data.get("id")
        add_first_comment(post_id, access_token)
    else:
        raise Exception(f"❌ ফটো পোষ্টত সমস্যা: {res_data}")

# ৬. ফেচবুকত ১৬:৯ ফুল-স্ক্ৰীণ ভিডিঅ' পোষ্ট কৰা
def post_16_9_video_to_facebook(page_id, access_token, caption):
    print("🚀 ৫. ১৬:৯ এনিমেটেড ভিডিঅ' ফেচবুকত আপলোড আৰম্ভ হৈছে...")
    vid_url = f"https://graph.facebook.com/v20.0/{page_id}/videos"
    with open("daily_video_16_9.mp4", "rb") as vf:
        v_res = requests.post(
            vid_url,
            data={
                "title": f"আজিৰ দৈনিক ৰাশিফল — {date_str} ({day_str}) | জ্যোতিষ অসম",
                "description": caption,
                "access_token": access_token
            },
            files={"source": vf}
        )
    v_data = v_res.json()
    if v_res.status_code == 200:
        print("🎉 ৬. ১৬:৯ এনিমেটেড ভিডিঅ' সফলতাৰে পোষ্ট হ'ল!", v_data)
        add_first_comment(v_data.get("id"), access_token)
    else:
        print("⚠️ ভিডিঅ' আপলোডত সমস্যা:", v_data)

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
        f"#JyotishAssam #আজিৰৰাশিফল #AssameseRashifal #AssamAstrology #অসমীয়াৰাশিফল"
    )

    generate_images_and_slides()
    generate_animated_16_9_video()
    post_photo_to_facebook(page_id, access_token, caption)
    post_16_9_video_to_facebook(page_id, access_token, caption)
