import os
import psycopg2
from urllib.parse import urlparse

db_url = "postgresql://postgres.bzjnhwvzmmvnvcbzhvwu:Brightify%40786@aws-1-ap-southeast-2.pooler.supabase.com:6543/postgres"

def test_conn(url, port_override=None):
    try:
        if port_override:
            parsed = urlparse(url)
            # Reconstruct URL with new port
            url = f"{parsed.scheme}://{parsed.username}:{parsed.password}@{parsed.hostname}:{port_override}{parsed.path}"
        
        print(f"Testing connection to: {urlparse(url).hostname}:{urlparse(url).port}")
        conn = psycopg2.connect(url, connect_timeout=10)
        print("Connection successful!")
        conn.close()
    except Exception as e:
        print(f"Connection failed: {e}")

print("Testing with port 6543 (from ENV)...")
test_conn(db_url)

print("\nTesting with port 5432...")
test_conn(db_url, port_override=5432)
