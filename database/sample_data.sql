-- Sample Data for My Group Application
-- Run this script after creating the schema

-- Insert sample app
INSERT INTO my_group_app (id, name, logo, url) VALUES 
('550e8400-e29b-41d4-a716-446655440000', 'My Group Management System', 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzY2N2VlYSIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5NRzwvdGV4dD4KPHN2Zz4K', 'http://localhost:3000');

-- Insert sample members/groups
INSERT INTO my_group_member (id, name, description) VALUES 
('660e8400-e29b-41d4-a716-446655440001', 'Administrators', 'System administrators with full access'),
('660e8400-e29b-41d4-a716-446655440002', 'Corporate Managers', 'Corporate level managers'),
('660e8400-e29b-41d4-a716-446655440003', 'Branch Managers', 'Branch level managers'),
('660e8400-e29b-41d4-a716-446655440004', 'Finance Team', 'Financial operations team'),
('660e8400-e29b-41d4-a716-446655440005', 'Operations Team', 'Daily operations team');

-- Insert sample users (passwords are hashed using bcrypt)
-- Password for all users: 'password123'
-- Hash: $2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ

INSERT INTO my_group_user (id, username, password, my_group_app_id, role, created_by, is_active) VALUES 
-- Super Admin (no created_by since they're the root user)
('770e8400-e29b-41d4-a716-446655440001', 'superadmin', '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ', '550e8400-e29b-41d4-a716-446655440000', 'SUPER_ADMIN', NULL, true),

-- Corporate users (created by Super Admin)
('770e8400-e29b-41d4-a716-446655440002', 'corporate1', '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ', '550e8400-e29b-41d4-a716-446655440000', 'CORPORATE', '770e8400-e29b-41d4-a716-446655440001', true),
('770e8400-e29b-41d4-a716-446655440003', 'corporate2', '$2b$10$rOzJqQZQZQZQZQZQZQZQZOzJqQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ', '550e8400-e29b-41d4-a716-446655440000', 'CORPORATE', '770e8400-e29b-41d4-a716-446655440001', true),

-- Branch users (created by Corporate users)
('770e8400-e29b-41d4-a716-446655440004', 'branch1', '$2b$10$rOzJqQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ', '550e8400-e29b-41d4-a716-446655440000', 'BRANCH', '770e8400-e29b-41d4-a716-446655440002', true),
('770e8400-e29b-41d4-a716-446655440005', 'branch2', '$2b$10$rOzJqQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ', '550e8400-e29b-41d4-a716-446655440000', 'BRANCH', '770e8400-e29b-41d4-a716-446655440002', true),
('770e8400-e29b-41d4-a716-446655440006', 'branch3', '$2b$10$rOzJqQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQZQ', '550e8400-e29b-41d4-a716-446655440000', 'BRANCH', '770e8400-e29b-41d4-a716-446655440003', true);

-- Insert user details
INSERT INTO my_group_user_details (my_group_user_id, full_name, display_name, email_id, gender, martial_status, country_id, state_id, district_id, nationality, education, profession, date_of_birth) VALUES 
('770e8400-e29b-41d4-a716-446655440001', 'Super Administrator', 'Super Admin', 'superadmin@mygroup.com', 'Male', 'Single', 'IN', 'KA', 'BLR', 'Indian', 'Masters in Computer Science', 'System Administrator', '1985-01-15'),
('770e8400-e29b-41d4-a716-446655440002', 'John Corporate Manager', 'John C.', 'john.corporate@mygroup.com', 'Male', 'Married', 'IN', 'MH', 'MUM', 'Indian', 'MBA', 'Corporate Manager', '1980-05-20'),
('770e8400-e29b-41d4-a716-446655440003', 'Sarah Corporate Lead', 'Sarah L.', 'sarah.corporate@mygroup.com', 'Female', 'Single', 'IN', 'DL', 'DEL', 'Indian', 'Masters in Business', 'Corporate Lead', '1982-08-10'),
('770e8400-e29b-41d4-a716-446655440004', 'Mike Branch Manager', 'Mike B.', 'mike.branch@mygroup.com', 'Male', 'Married', 'IN', 'TN', 'CHE', 'Indian', 'Bachelor in Commerce', 'Branch Manager', '1988-03-25'),
('770e8400-e29b-41d4-a716-446655440005', 'Lisa Branch Supervisor', 'Lisa S.', 'lisa.branch@mygroup.com', 'Female', 'Single', 'IN', 'KA', 'BLR', 'Indian', 'Bachelor in Finance', 'Branch Supervisor', '1990-11-12'),
('770e8400-e29b-41d4-a716-446655440006', 'David Branch Officer', 'David O.', 'david.branch@mygroup.com', 'Male', 'Divorced', 'IN', 'GJ', 'AMD', 'Indian', 'Bachelor in Banking', 'Branch Officer', '1987-07-08');

-- Insert user-group relationships
INSERT INTO my_group_user_group (user_id, my_group_member_id) VALUES 
-- Super Admin in Administrators group
('770e8400-e29b-41d4-a716-446655440001', '660e8400-e29b-41d4-a716-446655440001'),

-- Corporate users in Corporate Managers group
('770e8400-e29b-41d4-a716-446655440002', '660e8400-e29b-41d4-a716-446655440002'),
('770e8400-e29b-41d4-a716-446655440003', '660e8400-e29b-41d4-a716-446655440002'),

-- Branch users in Branch Managers group
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440003'),
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440003'),
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440003'),

-- Some users also in operational teams
('770e8400-e29b-41d4-a716-446655440004', '660e8400-e29b-41d4-a716-446655440004'), -- Finance
('770e8400-e29b-41d4-a716-446655440005', '660e8400-e29b-41d4-a716-446655440005'), -- Operations
('770e8400-e29b-41d4-a716-446655440006', '660e8400-e29b-41d4-a716-446655440005'); -- Operations
