import os

# CustomerController
path = 'backend/src/main/java/com/evmanager/customers/controller/CustomerController.java'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace("hasAnyRole('ADMIN', 'MANAGER', 'STAFF')", "hasAnyRole('ADMIN', 'SALES', 'COORDINATOR')")
content = content.replace("hasAnyRole('ADMIN', 'MANAGER')", "hasRole('ADMIN')")
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# VenueController
path = 'backend/src/main/java/com/evmanager/venues/controller/VenueController.java'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace(
    'public ResponseEntity<Page<VenueResponse>> getVenues',
    '@PreAuthorize("hasAnyRole(\'ADMIN\', \'SALES\', \'COORDINATOR\', \'CUSTOMER\')")\n    public ResponseEntity<Page<VenueResponse>> getVenues'
)
content = content.replace(
    'public ResponseEntity<VenueResponse> getVenueById',
    '@PreAuthorize("hasAnyRole(\'ADMIN\', \'SALES\', \'COORDINATOR\', \'CUSTOMER\')")\n    public ResponseEntity<VenueResponse> getVenueById'
)
content = content.replace(
    'public ResponseEntity<java.util.List<VenueResponse>> getAvailableVenues',
    '@PreAuthorize("hasAnyRole(\'ADMIN\', \'SALES\', \'COORDINATOR\', \'CUSTOMER\')")\n    public ResponseEntity<java.util.List<VenueResponse>> getAvailableVenues'
)
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

# EventController
path = 'backend/src/main/java/com/evmanager/events/controller/EventController.java'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace(
    'public ResponseEntity<List<CalendarEventResponse>> getEventsForCalendar',
    '@org.springframework.security.access.prepost.PreAuthorize("hasAnyRole(\'ADMIN\', \'SALES\', \'COORDINATOR\')")\n    public ResponseEntity<List<CalendarEventResponse>> getEventsForCalendar'
)
with open(path, 'w', encoding='utf-8') as f:
    f.write(content)

