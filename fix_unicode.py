import os

def fix_file(filepath):
    with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
        content = f.read()
    
    # Common corrupted chars in this project
    content = content.replace('A', '·')
    content = content.replace('?', '-')
    content = content.replace('-"', '-')
    content = content.replace('29·', '29°')
    content = content.replace('25·', '25°')
    content = content.replace('${Math.round(data.current_weather.temperature)}·', '${Math.round(data.current_weather.temperature)}°')
    content = content.replace('dYO ·,?', '🌤️')
    content = content.replace('', '-') # Any remaining bad chars
    content = content.replace('A+', '-')
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

fix_file('src/components/Layout.jsx')
fix_file('src/components/MainContent.jsx')
fix_file('src/components/OpsDashboard.jsx')
fix_file('src/components/TransportView.jsx')
fix_file('src/components/AccessibilityView.jsx')

print("Done fixing corrupted characters.")
