import os
import math
from PIL import Image, ImageDraw, ImageFont, ImageFilter

OUTPUT_DIR = r"c:\Users\jkals\OneDrive\Documents\HTML Project\images\books"
WIDTH, HEIGHT = 800, 1200

def get_font(font_name, size):
    font_path = os.path.join("C:\\Windows\\Fonts", font_name)
    if os.path.exists(font_path):
        try:
            return ImageFont.truetype(font_path, size)
        except Exception:
            pass
    # Fallback fonts
    for fallback in ["georgia.ttf", "arial.ttf", "calibri.ttf"]:
        fallback_path = os.path.join("C:\\Windows\\Fonts", fallback)
        if os.path.exists(fallback_path):
            return ImageFont.truetype(fallback_path, size)
    return ImageFont.load_default()

def draw_text_centered(draw, text, font, fill, y, max_w=700):
    lines = []
    words = text.split(" ")
    curr_line = ""
    for word in words:
        test_line = f"{curr_line} {word}".strip()
        bbox = draw.textbbox((0, 0), test_line, font=font)
        w = bbox[2] - bbox[0]
        if w <= max_w:
            curr_line = test_line
        else:
            if curr_line:
                lines.append(curr_line)
            curr_line = word
    if curr_line:
        lines.append(curr_line)
    
    total_h = 0
    line_heights = []
    for line in lines:
        bbox = draw.textbbox((0, 0), line, font=font)
        h = bbox[3] - bbox[1] + 15
        line_heights.append(h)
        total_h += h
    
    curr_y = y - total_h / 2
    for i, line in enumerate(lines):
        bbox = draw.textbbox((0, 0), line, font=font)
        w = bbox[2] - bbox[0]
        draw.text(((WIDTH - w) / 2, curr_y), line, font=font, fill=fill)
        curr_y += line_heights[i]

def draw_gradient_rect(img, top_color, bottom_color):
    draw = ImageDraw.Draw(img)
    for y in range(HEIGHT):
        r = int(top_color[0] + (bottom_color[0] - top_color[0]) * (y / HEIGHT))
        g = int(top_color[1] + (bottom_color[1] - top_color[1]) * (y / HEIGHT))
        b = int(top_color[2] + (bottom_color[2] - top_color[2]) * (y / HEIGHT))
        draw.line([(0, y), (WIDTH, y)], fill=(r, g, b))

# ==================== BOOK 3: The Great Gatsby ====================
def make_book_3():
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw_gradient_rect(img, (10, 17, 40), (16, 31, 66))
    draw = ImageDraw.Draw(img)

    # Gold art deco border
    gold = (212, 175, 55)
    light_gold = (255, 215, 0)
    
    # Outer double frame
    draw.rectangle([30, 30, WIDTH - 30, HEIGHT - 30], outline=gold, width=4)
    draw.rectangle([42, 42, WIDTH - 42, HEIGHT - 42], outline=gold, width=2)
    
    # Corner Art Deco fans / geometric diamonds
    def draw_corner_deco(cx, cy, dir_x, dir_y):
        for r in range(15, 75, 15):
            draw.arc([cx - r, cy - r, cx + r, cy + r], 0, 360, fill=gold, width=2)
        draw.polygon([(cx, cy), (cx + dir_x * 80, cy), (cx, cy + dir_y * 80)], outline=gold, width=2)

    draw_corner_deco(42, 42, 1, 1)
    draw_corner_deco(WIDTH - 42, 42, -1, 1)
    draw_corner_deco(42, HEIGHT - 42, 1, -1)
    draw_corner_deco(WIDTH - 42, HEIGHT - 42, -1, -1)

    # Central Deco Emblem
    cx, cy = WIDTH // 2, 500
    for r in range(40, 180, 20):
        draw.polygon([
            (cx, cy - r), (cx + r * 0.7, cy),
            (cx, cy + r), (cx - r * 0.7, cy)
        ], outline=gold, width=2)
    
    # Sunburst rays in emblem center
    for angle in range(0, 360, 20):
        rad = math.radians(angle)
        x2 = cx + math.cos(rad) * 130
        y2 = cy + math.sin(rad) * 130
        draw.line([(cx, cy), (x2, y2)], fill=light_gold, width=1)

    # Typography
    font_title = get_font("georgiab.ttf", 60)
    font_author = get_font("georgia.ttf", 36)
    font_sub = get_font("georgia.ttf", 22)

    draw_text_centered(draw, "THE GREAT GATSBY", font_title, light_gold, 260)
    
    # Divider line
    draw.line([(WIDTH//2 - 150, 340), (WIDTH//2 + 150, 340)], fill=gold, width=3)
    draw_text_centered(draw, "F. SCOTT FITZGERALD", font_author, gold, 920)
    draw_text_centered(draw, "A NOVEL OF THE ROARING TWENTIES", font_sub, (180, 150, 60), 980)

    img.save(os.path.join(OUTPUT_DIR, "book-3.jpg"), quality=95)
    print("Book 3 saved.")

# ==================== BOOK 4: Pride and Prejudice ====================
def make_book_4():
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw_gradient_rect(img, (255, 245, 247), (248, 225, 232))
    draw = ImageDraw.Draw(img)

    rose_gold = (180, 80, 110)
    deep_rose = (136, 14, 79)
    gold = (212, 175, 55)

    # Floral border oval frame
    draw.ellipse([80, 120, WIDTH - 80, HEIGHT - 120], outline=rose_gold, width=3)
    draw.ellipse([92, 132, WIDTH - 92, HEIGHT - 132], outline=gold, width=1)

    # Decorative floral vines around the ellipse
    for i in range(36):
        angle = i * (360 / 36)
        rad = math.radians(angle)
        rx = 320 * math.cos(rad) + WIDTH / 2
        ry = 460 * math.sin(rad) + HEIGHT / 2
        # Petals
        draw.ellipse([rx - 12, ry - 12, rx + 12, ry + 12], fill=(250, 200, 215, 180), outline=rose_gold)
        draw.ellipse([rx - 5, ry - 5, rx + 5, ry + 5], fill=gold)

    # Typography
    font_title = get_font("georgiab.ttf", 54)
    font_author = get_font("georgia.ttf", 36)
    font_deco = get_font("georgiai.ttf", 26)

    draw_text_centered(draw, "PRIDE", font_title, deep_rose, 360)
    draw_text_centered(draw, "&", font_deco, gold, 450)
    draw_text_centered(draw, "PREJUDICE", font_title, deep_rose, 540)

    draw.line([(WIDTH//2 - 120, 640), (WIDTH//2 + 120, 640)], fill=gold, width=2)

    draw_text_centered(draw, "JANE AUSTEN", font_author, deep_rose, 760)
    draw_text_centered(draw, "Classic Romance", font_deco, rose_gold, 830)

    img.save(os.path.join(OUTPUT_DIR, "book-4.jpg"), quality=95)
    print("Book 4 saved.")

# ==================== BOOK 5: The Catcher in the Rye ====================
def make_book_5():
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw_gradient_rect(img, (211, 47, 47), (183, 28, 28))
    draw = ImageDraw.Draw(img)

    white = (255, 255, 255)
    black = (17, 17, 17)

    # Stark minimalist diagonal geometric block
    draw.polygon([(0, 300), (WIDTH, 150), (WIDTH, 900), (0, 1050)], fill=white)
    draw.polygon([(0, 315), (WIDTH, 165), (WIDTH, 885), (0, 1035)], fill=black)

    # Carousel horse silhouette in white line art
    cx, cy = WIDTH // 2, 600
    draw.ellipse([cx - 80, cy - 80, cx + 80, cy + 80], outline=white, width=4)
    draw.line([(cx, cy - 120), (cx, cy + 120)], fill=white, width=4)
    # Horse outline (stylized star/head shape)
    draw.polygon([(cx - 40, cy - 20), (cx + 40, cy - 50), (cx + 20, cy + 30), (cx - 30, cy + 40)], outline=white, width=3)

    font_title = get_font("ariblk.ttf", 64)
    font_author = get_font("arialbd.ttf", 40)
    font_sub = get_font("arial.ttf", 22)

    # Top red section text
    draw_text_centered(draw, "THE CATCHER", font_title, white, 100)
    draw_text_centered(draw, "IN THE RYE", font_title, white, 200)

    # Bottom red section text
    draw_text_centered(draw, "J. D. SALINGER", font_author, white, 1100)

    img.save(os.path.join(OUTPUT_DIR, "book-5.jpg"), quality=95)
    print("Book 5 saved.")

# ==================== BOOK 6: Sapiens ====================
def make_book_6():
    img = Image.new("RGB", (WIDTH, HEIGHT))
    # Dual-tone split background (Teal to Earthy Orange)
    draw_gradient_rect(img, (0, 37, 42), (230, 81, 0))
    draw = ImageDraw.Draw(img)

    white = (255, 255, 255)
    cream = (255, 236, 179)
    teal_light = (128, 203, 196)

    # Evolution silhouettes progression along a glowing horizon line
    horizon_y = 650
    draw.line([(50, horizon_y), (WIDTH - 50, horizon_y)], fill=cream, width=3)
    
    # Glowing sun disc
    draw.ellipse([WIDTH//2 - 100, horizon_y - 150, WIDTH//2 + 100, horizon_y + 50], fill=(255, 204, 128, 120), outline=cream)

    # Human silhouettes dots/shapes along evolution path
    x_positions = [100, 220, 340, 460, 580, 700]
    heights = [40, 60, 80, 100, 120, 140]
    for x, h in zip(x_positions, heights):
        # Head
        draw.ellipse([x - 12, horizon_y - h - 24, x + 12, horizon_y - h], fill=white)
        # Body line
        draw.line([(x, horizon_y - h), (x, horizon_y)], fill=white, width=6)

    font_title = get_font("bahnschrift.ttf", 80)
    font_sub = get_font("calibri.ttf", 28)
    font_author = get_font("calibri.ttf", 42)

    draw_text_centered(draw, "SAPIENS", font_title, white, 220)
    draw_text_centered(draw, "A BRIEF HISTORY OF HUMANKIND", font_sub, cream, 330)

    draw_text_centered(draw, "YUVAL NOAH HARARI", font_author, white, 900)

    img.save(os.path.join(OUTPUT_DIR, "book-6.jpg"), quality=95)
    print("Book 6 saved.")

# ==================== BOOK 7: Atomic Habits ====================
def make_book_7():
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw_gradient_rect(img, (15, 32, 39), (44, 83, 100))
    draw = ImageDraw.Draw(img)

    cyan = (0, 229, 255)
    orange = (255, 107, 107)
    white = (255, 255, 255)

    # Atomic orbital rings
    cx, cy = WIDTH // 2, 500
    for rx, ry, angle in [(220, 90, 30), (220, 90, 90), (220, 90, 150)]:
        # Draw rotated ellipse approximation
        for t in range(0, 360, 5):
            rad = math.radians(t)
            rot = math.radians(angle)
            x0 = rx * math.cos(rad)
            y0 = ry * math.sin(rad)
            x = cx + x0 * math.cos(rot) - y0 * math.sin(rot)
            y = cy + x0 * math.sin(rot) + y0 * math.cos(rot)
            draw.ellipse([x-2, y-2, x+2, y+2], fill=cyan if angle != 90 else orange)
    
    # Glowing center nucleus
    draw.ellipse([cx - 30, cy - 30, cx + 30, cy + 30], fill=orange, outline=white, width=3)

    font_title = get_font("ariblk.ttf", 66)
    font_sub = get_font("calibrib.ttf", 24)
    font_author = get_font("arialbd.ttf", 40)

    draw_text_centered(draw, "ATOMIC", font_title, white, 180)
    draw_text_centered(draw, "HABITS", font_title, orange, 260)

    draw_text_centered(draw, "An Easy & Proven Way to Build Good Habits", font_sub, cyan, 820)
    draw_text_centered(draw, "& Break Bad Ones", font_sub, cyan, 860)

    draw_text_centered(draw, "JAMES CLEAR", font_author, white, 1020)

    img.save(os.path.join(OUTPUT_DIR, "book-7.jpg"), quality=95)
    print("Book 7 saved.")

# ==================== BOOK 8: Educated ====================
def make_book_8():
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw_gradient_rect(img, (30, 60, 114), (109, 213, 237))
    draw = ImageDraw.Draw(img)

    white = (255, 255, 255)
    dark_blue = (15, 23, 42)
    yellow = (255, 214, 0)

    # Mountain landscape silhouettes at bottom half
    points_back = [(0, 750), (180, 550), (400, 700), (600, 500), (WIDTH, 780), (WIDTH, HEIGHT), (0, HEIGHT)]
    draw.polygon(points_back, fill=(20, 40, 80))

    points_front = [(0, 850), (250, 650), (450, 800), (680, 600), (WIDTH, 820), (WIDTH, HEIGHT), (0, HEIGHT)]
    draw.polygon(points_front, fill=dark_blue)

    # Pencil motif extending down center into mountain peak
    px = WIDTH // 2
    draw.polygon([(px - 25, 450), (px + 25, 450), (px + 25, 650), (px - 25, 650)], fill=yellow)
    # Pencil tip
    draw.polygon([(px - 25, 650), (px + 25, 650), (px, 720)], fill=(230, 175, 40))
    # Graphite lead
    draw.polygon([(px - 8, 700), (px + 8, 700), (px, 720)], fill=dark_blue)

    font_title = get_font("georgiab.ttf", 68)
    font_sub = get_font("georgia.ttf", 26)
    font_author = get_font("georgiab.ttf", 42)

    draw_text_centered(draw, "EDUCATED", font_title, white, 200)
    draw_text_centered(draw, "A MEMOIR", font_sub, yellow, 300)

    draw_text_centered(draw, "TARA WESTOVER", font_author, white, 1000)

    img.save(os.path.join(OUTPUT_DIR, "book-8.jpg"), quality=95)
    print("Book 8 saved.")

# ==================== BOOK 9: Becoming ====================
def make_book_9():
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw_gradient_rect(img, (250, 248, 245), (235, 225, 210))
    draw = ImageDraw.Draw(img)

    gold = (212, 175, 55)
    bronze = (44, 29, 17)
    rose_gold = (195, 135, 95)

    # Luxury double border frame
    draw.rectangle([40, 40, WIDTH - 40, HEIGHT - 40], outline=gold, width=3)
    draw.rectangle([52, 52, WIDTH - 52, HEIGHT - 52], outline=rose_gold, width=1)

    # Elegant abstract wave/portrait silhouette arch in center
    cx, cy = WIDTH // 2, 550
    draw.ellipse([cx - 160, cy - 200, cx + 160, cy + 120], outline=gold, width=2)
    draw.ellipse([cx - 140, cy - 180, cx + 140, cy + 100], fill=(245, 230, 210), outline=rose_gold)

    font_title = get_font("georgiab.ttf", 64)
    font_author = get_font("georgia.ttf", 42)
    font_sub = get_font("georgiai.ttf", 24)

    draw_text_centered(draw, "BECOMING", font_title, bronze, 240)
    draw.line([(WIDTH//2 - 100, 320), (WIDTH//2 + 100, 320)], fill=gold, width=2)

    draw_text_centered(draw, "MICHELLE", font_author, bronze, 800)
    draw_text_centered(draw, "OBAMA", font_author, bronze, 870)
    draw_text_centered(draw, "The International Bestseller", font_sub, gold, 960)

    img.save(os.path.join(OUTPUT_DIR, "book-9.jpg"), quality=95)
    print("Book 9 saved.")

# ==================== BOOK 10: The Diary of a Young Girl ====================
def make_book_10():
    img = Image.new("RGB", (WIDTH, HEIGHT))
    draw_gradient_rect(img, (244, 235, 208), (220, 205, 175))
    draw = ImageDraw.Draw(img)

    burgundy = (74, 21, 35)
    sepia = (59, 35, 25)
    ink = (35, 25, 20)

    # Vintage diary border with stitched lines
    draw.rectangle([35, 35, WIDTH - 35, HEIGHT - 35], outline=sepia, width=3)
    
    # Stitched dashed inner rectangle
    for x in range(45, WIDTH - 45, 15):
        draw.line([(x, 45), (x + 8, 45)], fill=sepia, width=1)
        draw.line([(x, HEIGHT - 45), (x + 8, HEIGHT - 45)], fill=sepia, width=1)
    for y in range(45, HEIGHT - 45, 15):
        draw.line([(45, y), (45, y + 8)], fill=sepia, width=1)
        draw.line([(WIDTH - 45, y), (WIDTH - 45, y + 8)], fill=sepia, width=1)

    # Ribbon bookmark hanging down
    draw.polygon([(WIDTH - 120, 35), (WIDTH - 70, 35), (WIDTH - 70, 400), (WIDTH - 95, 360), (WIDTH - 120, 400)], fill=burgundy)

    # Vintage parchment emblem / lines
    draw.line([(100, 500), (WIDTH - 100, 500)], fill=sepia, width=2)
    draw.line([(100, 680), (WIDTH - 100, 680)], fill=sepia, width=2)

    font_title = get_font("georgiab.ttf", 46)
    font_author = get_font("georgia.ttf", 40)
    font_sub = get_font("georgiai.ttf", 26)

    draw_text_centered(draw, "THE DIARY OF A", font_title, burgundy, 260)
    draw_text_centered(draw, "YOUNG GIRL", font_title, burgundy, 340)

    draw_text_centered(draw, "ANNE FRANK", font_author, ink, 590)
    draw_text_centered(draw, "The Definitive Edition", font_sub, sepia, 850)

    img.save(os.path.join(OUTPUT_DIR, "book-10.jpg"), quality=95)
    print("Book 10 saved.")

if __name__ == "__main__":
    make_book_3()
    make_book_4()
    make_book_5()
    make_book_6()
    make_book_7()
    make_book_8()
    make_book_9()
    make_book_10()
    print("All cover images 3-10 generated successfully!")
