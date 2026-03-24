import requests
import json
import os

BASE_URL = "http://127.0.0.1:8000"

def test_api():
    # 1. Login to get token
    login_url = f"{BASE_URL}/api/users/login/"
    login_data = {
        "username": "admin@brightify.com", # Assuming this email from earlier logs or admin
        "password": "Brightify@786" # From DB password in .env or assumptions
    }
    
    print(f"Attempting login to {login_url}...")
    try:
        response = requests.post(login_url, json=login_data)
        if response.status_code != 200:
            # Try with username 'admin' if email fails
            login_data = {"username": "admin", "password": "Brightify@786"}
            response = requests.post(login_url, json=login_data)
        
        if response.status_code == 200:
            token = response.json().get('token')
            print("Login successful! Token acquired.")
            
            headers = {"Authorization": f"Bearer {token}"}
            
            # 2. Test Users endpoint
            users_res = requests.get(f"{BASE_URL}/api/users/", headers=headers)
            print(f"Users API: {users_res.status_code}, Count: {len(users_res.json()) if users_res.status_code == 200 else 'N/A'}")
            
            # 3. Test Orders endpoint
            orders_res = requests.get(f"{BASE_URL}/api/orders/", headers=headers)
            print(f"Orders API: {orders_res.status_code}, Count: {len(orders_res.json()) if orders_res.status_code == 200 else 'N/A'}")
            
            # 4. Test Products endpoint
            products_res = requests.get(f"{BASE_URL}/api/products/?page=all&admin=true")
            print(f"Products API: {products_res.status_code}, Count: {len(products_res.json().get('products', [])) if products_res.status_code == 200 else 'N/A'}")
            
        else:
            print(f"Login failed: {response.status_code} - {response.text}")
            
    except Exception as e:
        print(f"Error testing API: {e}")

if __name__ == "__main__":
    test_api()
