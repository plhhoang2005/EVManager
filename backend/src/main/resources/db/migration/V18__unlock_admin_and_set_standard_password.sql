-- V18: Unlock admin account and synchronize standard demo credentials
UPDATE users 
SET status = 'ACTIVE', 
    password_hash = '$2a$10$3oHAPBUUjWL/kkoO5sxodOSnwWlgqxl5MSNIfE6yE6Z5EOCkbT6tW' 
WHERE username IN ('admin', 'admin_demo');
