import os
import subprocess

for filename in os.listdir('audits'):
    if not filename.endswith('.md'):
        continue
    issue_num = filename.split('.')[0]
    filepath = os.path.join('audits', filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
        
    title = lines[0].strip()
    body = "".join(lines[1:]).strip()
    
    # Run gh issue edit
    print(f"Updating issue #{issue_num}...")
    subprocess.run(['gh', 'issue', 'edit', issue_num, '--title', title, '--body', body])
    print(f"Updated issue #{issue_num}")
