import json
import csv
import re

input_file = r'D:\EVManager\docs\github_issues_final.json'
output_file = r'D:\EVManager\docs\JIRA_Import_156_Issues.csv'

with open(input_file, 'r', encoding='utf-8') as f:
    issues = json.load(f)

# Email mapping
email_map = {
    "hoang": "plhhoang2005@gmail.com",
    "hien": "tuminhhien324@gmail.com",
    "nhan": "nhanvo134679@gmail.com",
    "phuc": "phucngo1707@gmail.com",
    "hau": "2005buinguyenchihau@gmail.com"
}

with open(output_file, 'w', encoding='utf-8', newline='') as f:
    writer = csv.writer(f)
    # Jira Headers
    writer.writerow(["Issue Id", "Issue Type", "Summary", "Description", "Status", "Assignee", "Sprint", "Due Date", "Labels"])
    
    for issue in issues:
        number = issue.get("number", "")
        title = issue.get("title", "")
        body = issue.get("body", "")
        state = issue.get("state", "")
        
        labels = [l.get("name", "").lower() for l in issue.get("labels", [])]
        
        # 1. Issue Type
        issue_type = "Task"
        if "type: bug" in labels or "bug" in title.lower():
            issue_type = "Bug"
        elif "type: feature" in labels or "user story" in title.lower():
            issue_type = "Story"
            
        # 2. Status
        status = "To Do"
        if state == "CLOSED":
            status = "Done"
        elif "status: in-progress" in labels:
            status = "In Progress"
        elif "status: ready-for-review" in labels:
            status = "In Review"
            
        # 3. Assignee
        assignee = ""
        for lbl in labels:
            if lbl.startswith("owner:"):
                name = lbl.split(":")[1].strip()
                assignee = email_map.get(name, "")
                break
        
        # fallback assignee if empty from github assignees
        if not assignee and issue.get("assignees"):
            for a in issue.get("assignees"):
                login = a.get("login", "")
                if login == "plhhoang2005": assignee = email_map["hoang"]
                elif login == "tuminhhien324-svg": assignee = email_map["hien"]
                elif login == "nhanvo134679": assignee = email_map["nhan"]
                elif login == "phucngo1707": assignee = email_map["phuc"]
                elif "hau" in login: assignee = email_map["hau"]
        
        # 4. Sprint (from Milestone)
        sprint = ""
        milestone = issue.get("milestone")
        due_date = ""
        if milestone:
            sprint = milestone.get("title", "")
            # Jira Sprint field just needs the string of the sprint, or we map it during import
            # Extract date from dueOn
            due_on = milestone.get("dueOn")
            if due_on:
                due_date = due_on.split("T")[0] # format YYYY-MM-DD
                
        # 5. Due Date (from Body)
        # Search for "Deadline: dd/mm/yyyy" or "Deadline: dd-mm-yyyy"
        match = re.search(r"Deadline:\s*(\d{1,2}[/-]\d{1,2}[/-]\d{4})", body, re.IGNORECASE)
        if match:
            # Jira supports various date formats, dd/MM/yyyy is common
            raw_date = match.group(1).replace('-', '/')
            # convert dd/mm/yyyy to common Jira format dd/MMM/yy or we just leave it as dd/MM/yyyy and configure Jira CSV import
            due_date = raw_date
            
        # 6. Labels string
        label_str = ",".join(labels)
        
        writer.writerow([number, issue_type, title, body, status, assignee, sprint, due_date, label_str])

print(f"Success! Processed {len(issues)} issues into JIRA_Import_156_Issues.csv")
