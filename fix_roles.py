import os

dir_path = 'backend/src/main/java/com/evmanager'
for root, dirs, files in os.walk(dir_path):
    for file in files:
        if file.endswith('Controller.java'):
            filepath = os.path.join(root, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
                
            original = content
            content = content.replace("hasAuthority('ADMIN')", "hasRole('ADMIN')")
            content = content.replace("hasAnyAuthority('ADMIN', 'USER')", "hasAnyRole('ADMIN', 'SALES', 'COORDINATOR', 'CUSTOMER')")
            content = content.replace("hasAnyRole('ADMIN', 'USER')", "hasAnyRole('ADMIN', 'SALES', 'COORDINATOR', 'CUSTOMER')")
            content = content.replace("hasRole('USER')", "hasAnyRole('SALES', 'COORDINATOR', 'CUSTOMER')")
            
            # Special case for ContractController POST
            if 'ContractController.java' in filepath:
                content = content.replace("hasRole('ADMIN')", "hasAnyRole('ADMIN', 'SALES')")
            
            if content != original:
                with open(filepath, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f'Updated {filepath}')
