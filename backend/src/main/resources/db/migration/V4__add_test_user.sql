-- Insert a test user with USER role: username=user, email=user@example.com, password=Password1!
INSERT INTO users (role_id, username, password_hash, full_name, email, phone) 
VALUES (
    (SELECT role_id FROM roles WHERE role_name = 'USER'), 
    'user', 
    '$2a$10$SL9bVeTqfCi0RWrrzOIEQOzfQK1xe7RYasptYMqbeDRqfwAxtSjd6', 
    'Normal User', 
    'user@example.com', 
    '0987654321'
);
