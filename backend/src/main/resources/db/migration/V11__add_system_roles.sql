INSERT INTO roles (role_name, description) VALUES ('SALES', 'Sales Representative') ON CONFLICT (role_name) DO NOTHING;
INSERT INTO roles (role_name, description) VALUES ('COORDINATOR', 'Event Coordinator') ON CONFLICT (role_name) DO NOTHING;
INSERT INTO roles (role_name, description) VALUES ('CUSTOMER', 'Customer Role') ON CONFLICT (role_name) DO NOTHING;
