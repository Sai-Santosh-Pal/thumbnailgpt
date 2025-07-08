# import cv2
# import numpy as np
# import os

# def shift_hue_to_red(image):
#     # Convert to HSV color space
#     hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)

#     # Set hue to 0 (which represents red in HSV)
#     hsv[..., 0] = 0

#     # Convert back to BGR
#     return cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

# # Path where images are stored (change this)
# input_folder = 'src/assets/'
# output_folder = 'redified'
# os.makedirs(output_folder, exist_ok=True)

# image_files = [f for f in os.listdir(input_folder) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]

# for file in image_files:
#     img_path = os.path.join(input_folder, file)
#     image = cv2.imread(img_path)
#     if image is None:
#         print(f"Error reading {file}")
#         continue

#     red_image = shift_hue_to_red(image)

#     out_path = os.path.join(output_folder, f"red_{file}")
#     cv2.imwrite(out_path, red_image)
#     print(f"Saved: {out_path}")


import os
from rembg import remove
from PIL import Image
import io

# Path to your assets directory
ASSETS_DIR = "./src/assets"

# Ensure output keeps transparency
def remove_background(input_path, output_path):
    with open(input_path, "rb") as i:
        input_bytes = i.read()
        output_bytes = remove(input_bytes)
        img = Image.open(io.BytesIO(output_bytes)).convert("RGBA")
        img.save(output_path)

# Process all files starting with 'red_'
for filename in os.listdir(ASSETS_DIR):
    if filename.startswith("red_"):
        filepath = os.path.join(ASSETS_DIR, filename)
        output_path = filepath  # Overwrite original
        remove_background(filepath, output_path)
