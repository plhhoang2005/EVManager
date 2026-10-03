import os

path = 'backend/src/test/java/com/evmanager/contracts/service/ContractServiceTest.java'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace('when(menuRepository.findById(2L)).thenReturn(Optional.of(mockMenu));', '')

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
