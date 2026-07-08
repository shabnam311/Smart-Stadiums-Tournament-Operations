import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Replace em-dashes with hyphens
    content = content.replace('—', '-')
    
    # Replace mangled chars if any exist
    content = content.replace('?"', '-')
    content = content.replace('+', '+')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

for root, _, files in os.walk('src/components'):
    for file in files:
        if file.endswith('.jsx'):
            fix_file(os.path.join(root, file))

# Also layout and app if necessary
print("Done fixing em-dashes and mangled characters")
