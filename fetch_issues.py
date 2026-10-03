import json
import os
import subprocess

issues_json = subprocess.check_output(['gh', 'issue', 'list', '--limit', '200', '--state', 'all', '--json', 'number,title,body'])
issues = json.loads(issues_json)

os.makedirs('audits', exist_ok=True)
for i in issues:
    if 'BE-' in i['title']:
        filename = f"audits/{i['number']}.md"
        with open(filename, 'w', encoding='utf-8') as f:
            f.write(i['title'] + '\n\n' + i['body'])
