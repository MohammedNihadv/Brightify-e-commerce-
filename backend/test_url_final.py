import requests
# Testing the EXACT key that we know EXISTS
url = "https://bzjnhwvzmmvnvcbzhvwu.supabase.co/storage/v1/object/public/brightify-media/products/led-solar-lantern_mKgYmyQ.jpeg"
try:
    r = requests.get(url)
    print(f"URL: {url}")
    print(f"Status: {r.status_code}")
    if r.status_code != 200:
        print(f"Body: {r.text}")
    else:
        print("SUCCESS! URL IS ACCESSIBLE.")
except Exception as e:
    print(f"Error: {e}")
