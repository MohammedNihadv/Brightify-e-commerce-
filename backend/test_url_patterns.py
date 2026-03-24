import requests

project_ref = "bzjnhwvzmmvnvcbzhvwu"
bucket_names = ["brightify-media", "brightify"]
paths = ["products/led-solar-lantern_mKgYmyQ.jpeg", "led-solar-lantern_mKgYmyQ.jpeg", "led-solar-lantern.jpeg"]

print("Testing Supabase URL permutations...")
for b in bucket_names:
    for p in paths:
        url = f"https://{project_ref}.supabase.co/storage/v1/object/public/{b}/{p}"
        try:
            r = requests.get(url)
            print(f"[{r.status_code}] {url}")
            if r.status_code == 200:
                print(">>> SUCCESS! Found working URL pattern.")
        except Exception as e:
            print(f"Error: {e}")
