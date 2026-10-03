import os

path = 'backend/src/test/java/com/evmanager/contracts/service/ContractServiceTest.java'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# remove the last }
content = content.rstrip()[:-1]

new_tests = """
    @Test
    void createContract_DuplicateServiceInRequest() {
        ContractServiceRequest dupService = new ContractServiceRequest();
        dupService.setServiceId(4L);
        dupService.setQuantity(1);
        
        validRequest.setServices(List.of(validRequest.getServices().get(0), dupService));

        when(customerRepository.findById(1L)).thenReturn(Optional.of(mockCustomer));
        when(venueRepository.findById(3L)).thenReturn(Optional.of(mockVenue));
        
        assertThatThrownBy(() -> contractService.createContract(validRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Duplicate service");
    }

    @Test
    void createContract_DuplicateMenuInRequest() {
        ContractMenuRequest dupMenu = new ContractMenuRequest();
        dupMenu.setMenuId(2L);
        dupMenu.setTableCount(5);
        
        validRequest.setMenus(List.of(validRequest.getMenus().get(0), dupMenu));

        when(customerRepository.findById(1L)).thenReturn(Optional.of(mockCustomer));
        when(venueRepository.findById(3L)).thenReturn(Optional.of(mockVenue));
        
        assertThatThrownBy(() -> contractService.createContract(validRequest))
                .isInstanceOf(IllegalArgumentException.class)
                .hasMessageContaining("Duplicate menu");
    }
}
"""

with open(path, 'w', encoding='utf-8') as f:
    f.write(content + new_tests)
