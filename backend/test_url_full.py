import requests
url = "https://bzjnhwvzmmvnvcbzhvwu.supabase.co/storage/v1/object/public/brightify-media/led-solar-lantern_mKgYmyQ.jpeg"
try:
    r = requests.get(url)
    print(f"URL: {url}")
    print(f"Status: {r.status_code}")
    print(f"Body: {r.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
