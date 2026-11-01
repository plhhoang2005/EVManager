import json
import csv

input_file = r'D:\EVManager\docs\github_issues.json'
output_file = r'D:\EVManager\docs\jira_import_all_issues.csv'

with open(input_file, 'r', encoding='utf-8') as f:
    issues = json.load(f)

# Jira CSV format requires at least: Issue Type, Summary, Description, Assignee, Status, Labels
with open(output_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    writer.writerow(["Issue Id", "Issue Type", "Summary", "Description", "Status", "Assignee", "Labels"])
    
    for issue in issues:
        number = issue.get("number")
        title = issue.get("title", "")
        body = issue.get("body", "")
        state = issue.get("state", "OPEN")
        
        # Determine Issue Type from title or labels
        issue_type = "Task"
        if "BUG" in title.upper() or "bug" in [l.get("name", "").lower() for l in issue.get("labels", [])]:
            issue_type = "Bug"
        elif "US" in title or "user story" in title.lower():
            issue_type = "Story"
            
        # Determine Jira Status
        status = "Done" if state == "CLOSED" else "To Do"
        
        # Assignees
        assignee_emails = []
        for assignee in issue.get("assignees", []):
            login = assignee.get("login")
            # Map GitHub login to email
            if login == "plhhoang2005":
                assignee_emails.append("plhhoang2005@gmail.com")
            elif login == "tuminhhien324-svg":
                assignee_emails.append("tuminhhien324@gmail.com")
            elif login == "nhanvo134679":
                assignee_emails.append("nhanvo134679@gmail.com")
            elif login == "phucngo1707":
                assignee_emails.append("phucngo1707@gmail.com")
            elif login == "2005buinguyenchihau":
                assignee_emails.append("2005buinguyenchihau@gmail.com")
            else:
                assignee_emails.append(login)
                
        assignee_str = ",".join(assignee_emails)
        
        # Labels
        labels = ",".join([l.get("name", "") for l in issue.get("labels", [])])
        
        writer.writerow([number, issue_type, title, body, status, assignee_str, labels])

print(f"Exported {len(issues)} issues to {output_file}")
