from rembg import remove
from PIL import Image
import io
import os

input_dir = r"C:\Users\ayorindeawarun\CascadeProjects\bestfit\public\products"
images = [f for f in os.listdir(input_dir) if f.endswith((".jpg", ".jpeg", ".png"))]

for filename in images:
    input_path = os.path.join(input_dir, filename)
    print(f"Processing {filename}...")
    with open(input_path, "rb") as f:
        input_data = f.read()
    output_data = remove(input_data)
    img = Image.open(io.BytesIO(output_data)).convert("RGBA")
    white_bg = Image.new("RGBA", img.size, (255, 255, 255, 255))
    white_bg.paste(img, mask=img.split()[3])
    final = white_bg.convert("RGB")
    final.save(input_path, "JPEG", quality=92)
    print(f"  Done: {filename}")

print("\nAll images processed!")
