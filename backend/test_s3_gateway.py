import requests

url = "https://bzjnhwvzmmvnvcbzhvwu.supabase.co/storage/v1/s3/brightify-media/products/led-solar-lantern_mKgYmyQ.jpeg"
try:
    r = requests.get(url)
    print(f"URL: {url}")
    print(f"Status: {r.status_code}")
    if r.status_code != 200:
        print(f"Body: {r.text[:500]}")
except Exception as e:
    print(f"Error: {e}")
