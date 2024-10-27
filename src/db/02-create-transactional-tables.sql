-- Switch to the newly created database
USE page_analytics_db;

-- Pages Table
CREATE TABLE pages (
	page_id INT AUTO_INCREMENT PRIMARY KEY,
	page_url VARCHAR(255) UNIQUE NOT NULL,
	created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
-- Index for fast lookup by page_url (for URL to page_id mappings)
CREATE INDEX idx_page_url ON pages(page_url);

-- Users Table
CREATE TABLE users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
	name VARCHAR(255) PRIMARY KEY,
	first_visit TIMESTAMP NOT NULL,
	last_visit TIMESTAMP NOT NULL
);
-- Index for fast lookups based on last_visit for retention reporting
CREATE INDEX idx_users_last_visit ON users(last_visit);

-- Browser Table
CREATE TABLE browsers (
	browser_id INT AUTO_INCREMENT PRIMARY KEY,
	browser_name VARCHAR(100) NOT NULL
);
-- Index for browser_name to speed up lookups based on browser
CREATE INDEX idx_browser_name ON browsers (browser_name);

-- Operating System Table
CREATE TABLE operating_systems (
	os_id INT AUTO_INCREMENT PRIMARY KEY,
	os_name VARCHAR(100) NOT NULL
);
-- Index for os_name for efficient OS-based lookups
CREATE INDEX idx_os_name ON operating_systems (os_name);

-- Device Type Table
CREATE TABLE device_types (
	device_type_id INT AUTO_INCREMENT PRIMARY KEY,
	device_type VARCHAR(100) NOT NULL
);
-- Index for device_type for efficient device type lookups
CREATE INDEX idx_device_type ON device_types (device_type);

-- geo_locations Table
CREATE TABLE geo_locations (
    geo_id INT AUTO_INCREMENT PRIMARY KEY,
    country VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    city VARCHAR(100)
);
-- Indexes for Geolocation Table
CREATE INDEX idx_geo_location ON geo_locations(country, region, city);

-- sessions Table (Revised Indexing)
CREATE TABLE sessions (
    session_id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(255),
    page_id INT,
    browser_id INT,
    os_id INT,
    device_type_id INT,
    geo_id INT,
    ip_address VARCHAR(45),
    start_time TIMESTAMP NOT NULL,

    -- Foreign Key Constraints
    FOREIGN KEY (user_id) REFERENCES users(user_id),
    FOREIGN KEY (page_id) REFERENCES pages(page_id),
    FOREIGN KEY (browser_id) REFERENCES browsers(browser_id),
    FOREIGN KEY (os_id) REFERENCES operating_systems(os_id),
    FOREIGN KEY (device_type_id) REFERENCES device_types(device_type_id),
    FOREIGN KEY (geo_id) REFERENCES geo_locations(geo_id)
);
-- Indexes for Sessions Table (fewer, optimized for high inserts)
CREATE INDEX idx_sessions_start_time ON sessions(start_time);