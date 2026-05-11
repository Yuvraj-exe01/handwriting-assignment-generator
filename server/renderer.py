from PIL import Image, ImageDraw, ImageFont, ImageFilter, ImageEnhance
from reportlab.pdfgen import canvas as pdfcanvas
import random
import sys
import os

WIDTH, HEIGHT = 1654, 2339  # A4 size

# ===== CREATE REALISTIC PAPER =====
def create_paper():
    img = Image.new("RGB", (WIDTH, HEIGHT), (245, 242, 235))
    pixels = img.load()

    # subtle texture noise
    for _ in range(40000):
        x = random.randint(0, WIDTH - 1)
        y = random.randint(0, HEIGHT - 1)
        noise = random.randint(-5, 5)
        r, g, b = pixels[x, y]
        pixels[x, y] = (
            max(0, min(255, r + noise)),
            max(0, min(255, g + noise)),
            max(0, min(255, b + noise)),
        )
    return img

# ===== DRAW NOTEBOOK LINES =====
def draw_lines(draw, start_y, spacing):
    for y in range(start_y, HEIGHT - 100, spacing):
        drift = random.uniform(-0.5, 0.5)
        draw.line([(100, y + drift), (WIDTH - 80, y + drift)],
                  fill=(170, 190, 240), width=1)

    # left margin red line
    draw.line([(140, 0), (140, HEIGHT)], fill=(200, 80, 80), width=2)

# ===== SAFE TEXT RENDER (NO OVERLAP BUG) =====
def render_pages(text, font, ink):
    words = text.split(" ")
    pages = []

    image = create_paper()
    draw = ImageDraw.Draw(image)

    start_y = 220
    spacing = 64
    margin = 180
    max_width = WIDTH - 260
    line = ""
    line_index = 0
    ascent, descent = font.getmetrics()

    for word in words:
        test_line = line + word + " "
        bbox = draw.textbbox((0, 0), test_line, font=font)
        width = bbox[2] - bbox[0]

        if width < max_width:
            line = test_line
        else:
            y = start_y + (line_index * spacing)

            # New page if overflow
            if y > HEIGHT - 150:
                pages.append(image)
                image = create_paper()
                draw = ImageDraw.Draw(image)
                line_index = 0
                y = start_y

            # Human realism jitter
            x_jitter = random.uniform(-1.5, 1.5)
            y_jitter = random.uniform(-1.2, 1.2)
            pressure = random.randint(-8, 8)

            ink_var = (
                max(0, min(255, ink[0] + pressure)),
                max(0, min(255, ink[1] + pressure)),
                max(0, min(255, ink[2] + pressure))
            )

            draw.text(
                (margin + x_jitter, y - ascent + y_jitter),
                line.strip(),
                fill=ink_var,
                font=font,
            )

            line = word + " "
            line_index += 1

    # Draw last line
    y = start_y + (line_index * spacing)
    draw.text((margin, y - ascent), line.strip(), fill=ink, font=font)
    pages.append(image)

    return pages

# ===== SCAN EFFECT =====
def apply_scan_effect(img, mode):
    img = img.filter(ImageFilter.GaussianBlur(0.3))

    if mode == "scan_bw":
        img = img.convert("L")
        enhancer = ImageEnhance.Contrast(img)
        img = enhancer.enhance(1.6)

    elif mode == "xerox":
        img = img.convert("L")
        img = img.point(lambda x: 0 if x < 150 else 255, "1")

    return img

# ===== SAVE MULTI PAGE PDF =====
def save_pdf(images, output="assignment.pdf"):
    c = pdfcanvas.Canvas(output)
    for i, img in enumerate(images):
        temp = f"temp_{i}.png"
        img.save(temp)
        c.drawImage(temp, 0, 0, width=595, height=842)
        c.showPage()
        os.remove(temp)
    c.save()

# ===== MAIN GENERATOR =====
def generate(text, font_path, ink_type, page_type, scan_mode):
    font = ImageFont.truetype(font_path, 40)

    # Ink colors
    ink = (30, 90, 220)  # blue default
    if ink_type == "black":
        ink = (20, 20, 20)
    elif ink_type == "gel":
        ink = (15, 70, 210)

    pages = render_pages(text, font, ink)

    processed = []
    for page in pages:
        draw = ImageDraw.Draw(page)

        if page_type != "plain":
            draw_lines(draw, 220, 64)

        page = apply_scan_effect(page, scan_mode)
        processed.append(page)

    save_pdf(processed)

# ===== ENTRY POINT =====
if __name__ == "__main__":
    text = sys.argv[1]
    font_path = sys.argv[2]
    ink_type = sys.argv[3]
    page_type = sys.argv[4]
    scan_mode = sys.argv[5]

    generate(text, font_path, ink_type, page_type, scan_mode)