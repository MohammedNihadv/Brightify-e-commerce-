import requests
# Testing without the suffix as shown in the Supabase screenshot
url = "https://bzjnhwvzmmvnvcbzhvwu.supabase.co/storage/v1/object/public/brightify-media/led-solar-lantern.jpeg"
try:
    r = requests.get(url)
    print(f"URL: {url}")
    print(f"Status: {r.status_code}")
    print(f"Body: {r.text[:500]}")
except Exception as e:
    print(f"Error: {e}")

# Also test another one seen in screenshot
url2 = "https://bzjnhwvzmmvnvcbzhvwu.supabase.co/storage/v1/object/public/brightify-media/30w-max-power-rechargeable-led-bulb.jpeg"
try:
    r = requests.get(url2)
    print(f"URL: {url2}")
    print(f"Status: {r.status_code}")
except Exception as e:
    print(f"Error: {e}")
