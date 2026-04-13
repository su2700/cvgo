import sys
import subprocess
import os

def extract_text_from_pdf(pdf_path):
    try:
        # Attempt to use pdftotext from poppler-utils
        result = subprocess.run(['pdftotext', pdf_path, '-'], capture_output=True, text=True, check=True)
        return result.stdout
    except subprocess.CalledProcessError:
        print(f"Error: Could not extract text from {pdf_path}. Ensure 'pdftotext' is installed.")
        sys.exit(1)
    except FileNotFoundError:
        print("Error: 'pdftotext' utility not found. Please install poppler-utils.")
        sys.exit(1)

def generate_pdf(input_text, output_pdf):
    # Escape LaTeX special characters
    def tex_escape(text):
        conv = {
            '&': r'\&',
            '%': r'\%',
            '$': r'\$',
            '#': r'\#',
            '_': r'\_',
            '{': r'\{',
            '}': r'\}',
            '~': r'\textasciitilde{}',
            '^': r'\^{}',
            '\\': r'\textbackslash{}',
            '<': r'\textless{}',
            '>': r'\textgreater{}',
        }
        import re
        regex = re.compile('|'.join(re.escape(str(key)) for key in sorted(conv.keys(), key = lambda item: - len(item))))
        return regex.sub(lambda match: conv[match.group()], text)

    escaped_text = tex_escape(input_text)
    
    # Handle paragraphs: split by double newlines, clean single newlines
    paragraphs = escaped_text.split('\n\n')
    processed_paragraphs = []
    for p in paragraphs:
        p_clean = p.replace('\n', ' ')
        processed_paragraphs.append(p_clean)
    
    escaped_text = '\n\n'.join(processed_paragraphs)

    # Read template
    try:
        with open('cl_template.tex', 'r') as f:
            template = f.read()
    except FileNotFoundError:
        print("Error: cl_template.tex not found.")
        sys.exit(1)

    # Insert text into template
    tex_content = template.replace('INSERT_TEXT_HERE', escaped_text)

    # Write temporary tex file
    temp_tex = 'temp_cl.tex'
    with open(temp_tex, 'w') as f:
        f.write(tex_content)

    # Compile with lualatex
    try:
        subprocess.run(['lualatex', '-interaction=nonstopmode', temp_tex], check=True, stdout=subprocess.DEVNULL)
        if os.path.exists('temp_cl.pdf'):
            if os.path.exists(output_pdf):
                os.remove(output_pdf)
            os.rename('temp_cl.pdf', output_pdf)
            print(f"Successfully generated {output_pdf}")
        else:
            print("Error: temp_cl.pdf not generated.")
    except subprocess.CalledProcessError as e:
        print(f"Error during compilation: {e}")
    finally:
        for ext in ['.tex', '.aux', '.log', '.out']:
            f_to_rem = 'temp_cl' + ext
            if os.path.exists(f_to_rem):
                os.remove(f_to_rem)

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python3 convert_cl.py <input_file_or_text> <output_pdf>")
        sys.exit(1)

    input_arg = sys.argv[1]
    output_pdf = sys.argv[2]

    if input_arg.lower().endswith('.pdf'):
        text = extract_text_from_pdf(input_arg)
    elif os.path.exists(input_arg):
        with open(input_arg, 'r', encoding='utf-8') as f:
            text = f.read()
    else:
        text = input_arg

    generate_pdf(text, output_pdf)
