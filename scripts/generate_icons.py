from PIL import Image
import cairosvg
import os

def convert_svg_to_png(svg_path, output_path, size):
    # Converte SVG para PNG
    cairosvg.svg2png(url=svg_path, write_to=output_path, output_width=size, output_height=size)
    
    # Otimiza o PNG
    img = Image.open(output_path)
    img.save(output_path, optimize=True, quality=95)

def main():
    # Caminhos dos arquivos
    svg_path = "public/icon-base.svg"
    sizes = [192, 512]
    
    for size in sizes:
        output_path = f"public/icon-{size}x{size}.png"
        convert_svg_to_png(svg_path, output_path, size)
        print(f"Gerado ícone {size}x{size}")

if __name__ == "__main__":
    main() 