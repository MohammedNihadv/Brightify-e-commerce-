import re
import math

with open('seed_data.py', 'r', encoding='utf-8') as f:
    content = f.read()

def convert_price(match):
    price = float(match.group(1))
    inr_price = price * 85
    # Round to nearest 99
    rounded = math.floor(inr_price / 100) * 100 + 99
    # If the original price was low (like 2.99), the rounding might be weird. Let's just do standard rounding.
    if rounded < 100:
        rounded = 99
    return f"'price': {rounded}.00"

new_content = re.sub(r"'price':\s*(\d+\.\d+)", convert_price, content)

with open('seed_data.py', 'w', encoding='utf-8') as f:
    f.write(new_content)
print("Prices updated in seed_data.py")
