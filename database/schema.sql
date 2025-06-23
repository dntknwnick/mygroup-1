-- PostgreSQL Database Schema for My Group Application
-- Run this script after creating the my_group_db database

-- Enable UUID extension for generating unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create continents table
CREATE TABLE continents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create countries table
CREATE TABLE countries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    continent_id UUID NOT NULL REFERENCES continents(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL UNIQUE,
    currency VARCHAR(10),
    flag_image TEXT, -- Base64 encoded flag image or file path
    iso_code VARCHAR(10),
    nationality VARCHAR(100),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(continent_id, name)
);

-- Create states table
CREATE TABLE states (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    country_id UUID NOT NULL REFERENCES countries(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(country_id, name)
);

-- Create districts table
CREATE TABLE districts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    state_id UUID NOT NULL REFERENCES states(id) ON DELETE CASCADE,
    name VARCHAR(100) NOT NULL,
    code VARCHAR(10) NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(state_id, name)
);

-- Create my_group_app table
CREATE TABLE my_group_app (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo TEXT,
    url VARCHAR(500),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create my_group_member table
CREATE TABLE my_group_member (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create my_group_user table
CREATE TABLE my_group_user (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    username VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, -- Will store hashed passwords
    my_group_app_id UUID REFERENCES my_group_app(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('SUPER_ADMIN', 'CORPORATE', 'BRANCH', 'USER')),
    created_by UUID REFERENCES my_group_user(id) ON DELETE SET NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create my_group_user_group table (junction table for user-member relationships)
CREATE TABLE my_group_user_group (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES my_group_user(id) ON DELETE CASCADE,
    my_group_member_id UUID NOT NULL REFERENCES my_group_member(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, my_group_member_id)
);

-- Create my_group_user_details table
CREATE TABLE my_group_user_details (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    my_group_user_id UUID UNIQUE NOT NULL REFERENCES my_group_user(id) ON DELETE CASCADE,
    full_name VARCHAR(255),
    display_name VARCHAR(100),
    email_id VARCHAR(255) UNIQUE,
    gender VARCHAR(20) CHECK (gender IN ('Male', 'Female', 'Other', 'Prefer not to say')),
    martial_status VARCHAR(20) CHECK (martial_status IN ('Single', 'Married', 'Divorced', 'Widowed')),
    country_id VARCHAR(10),
    state_id VARCHAR(10),
    district_id VARCHAR(10),
    nationality VARCHAR(100),
    education VARCHAR(255),
    profession VARCHAR(255),
    photo TEXT, -- Base64 encoded image or file path
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX idx_my_group_user_username ON my_group_user(username);
CREATE INDEX idx_my_group_user_role ON my_group_user(role);
CREATE INDEX idx_my_group_user_app_id ON my_group_user(my_group_app_id);
CREATE INDEX idx_my_group_user_created_by ON my_group_user(created_by);
CREATE INDEX idx_my_group_user_details_email ON my_group_user_details(email_id);
CREATE INDEX idx_my_group_user_group_user_id ON my_group_user_group(user_id);
CREATE INDEX idx_my_group_user_group_member_id ON my_group_user_group(my_group_member_id);

-- Create indexes for location tables
CREATE INDEX idx_countries_continent_id ON countries(continent_id);
CREATE INDEX idx_countries_code ON countries(code);
CREATE INDEX idx_states_country_id ON states(country_id);
CREATE INDEX idx_states_code ON states(code);
CREATE INDEX idx_districts_state_id ON districts(state_id);
CREATE INDEX idx_districts_code ON districts(code);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at
CREATE TRIGGER update_my_group_app_updated_at BEFORE UPDATE ON my_group_app FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_my_group_member_updated_at BEFORE UPDATE ON my_group_member FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_my_group_user_updated_at BEFORE UPDATE ON my_group_user FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_my_group_user_details_updated_at BEFORE UPDATE ON my_group_user_details FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create triggers for location tables
CREATE TRIGGER update_continents_updated_at BEFORE UPDATE ON continents FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_countries_updated_at BEFORE UPDATE ON countries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_states_updated_at BEFORE UPDATE ON states FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_districts_updated_at BEFORE UPDATE ON districts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert sample data for testing
INSERT INTO my_group_app (name, logo, url) VALUES
('My Group Main App', 'logo.png', 'https://mygroup.com');

-- Insert sample super admin user
INSERT INTO my_group_user (username, password, role, my_group_app_id)
SELECT 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'SUPER_ADMIN', id
FROM my_group_app WHERE name = 'My Group Main App';

-- Insert sample member
INSERT INTO my_group_member (name, description) VALUES
('Default Group', 'Default member group for the application');

-- Insert sample continents
INSERT INTO continents (name, code, display_order) VALUES
('Asia', 'AS', 1),
('Europe', 'EU', 2),
('North America', 'NA', 3),
('South America', 'SA', 4),
('Africa', 'AF', 5),
('Australia', 'AU', 6),
('Antarctica', 'AN', 7);

-- Insert sample countries
INSERT INTO countries (continent_id, name, code, currency, iso_code, nationality, display_order)
SELECT
    c.id,
    'India',
    'IND',
    'INR',
    '+91',
    'Indian',
    1
FROM continents c WHERE c.code = 'AS';

INSERT INTO countries (continent_id, name, code, currency, iso_code, nationality, display_order)
SELECT
    c.id,
    'Nepal',
    'NPL',
    'NPR',
    '+977',
    'Nepalian',
    2
FROM continents c WHERE c.code = 'AS';

INSERT INTO countries (continent_id, name, code, currency, iso_code, nationality, display_order)
SELECT
    c.id,
    'Sri Lanka',
    'LKA',
    'LKR',
    '+94',
    'Srilankan',
    3
FROM continents c WHERE c.code = 'AS';
