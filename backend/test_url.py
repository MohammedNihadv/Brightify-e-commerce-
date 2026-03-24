import requests
url = "https://bzjnhwvzmmvnvcbzhvwu.supabase.co/storage/v1/object/public/brightify-media/led-solar-lantern_mKgYmyQ.jpeg"
try:
    r = requests.head(url)
    print(f"URL: {url}")
    print(f"Status: {r.status_code}")
    print(f"Headers: {r.headers.get('Content-Type')}")
except Exception as e:
    print(f"Error: {e}")
