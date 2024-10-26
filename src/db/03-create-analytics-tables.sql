-- Switch to the newly created database
USE page_analytics_db;

-- Page Views Aggregate Table
CREATE TABLE page_views_aggregate (
	page_id INT,
	date DATE,
	hour INT,
	views INT DEFAULT 0,

	-- Foreign Key Constraints
	FOREIGN KEY (page_id) REFERENCES pages(page_id)
);
-- Indexes for Page Views Aggregate Table
CREATE INDEX idx_page_views_date ON page_views_aggregate(date);
CREATE INDEX idx_page_views_page ON page_views_aggregate(page_id, date, hour);

-- Active Users by Device Type Aggregate Table
CREATE TABLE active_users_by_device (
	date DATE,
	hour INT,
	device_type_id INT,
	active_users INT DEFAULT 0,

	-- Foreign Key Constraints
	FOREIGN KEY (device_type_id) REFERENCES device_types(device_type_id)
);
-- Indexes for Active Users by Device Type Aggregate Table
CREATE INDEX idx_active_users_device ON active_users_by_device(device_type_id, date, hour);

-- Active Users by Browser and OS Aggregate Table
CREATE TABLE active_users_by_browser_os (
	date DATE,
	hour INT,
	browser_id INT,
	os_id INT,
	active_users INT DEFAULT 0,

	-- Foreign Key Constraints
	FOREIGN KEY (browser_id) REFERENCES browsers(browser_id),
	FOREIGN KEY (os_id) REFERENCES operating_systems(os_id)
);
-- Indexes for Active Users by Browser and OS Aggregate Table
CREATE INDEX idx_active_users_browser_os ON active_users_by_browser_os(browser_id, os_id, date, hour);

-- Session Duration Aggregate Table
CREATE TABLE session_duration_aggregate (
	date DATE,
	hour INT,
	page_id INT,
	total_sessions INT DEFAULT 0,
	avg_session_duration DECIMAL(10, 2) DEFAULT 0.0,

	-- Foreign Key Constraints
	FOREIGN KEY (page_id) REFERENCES pages(page_id)
);
-- Indexes for Session Duration Aggregate Table
CREATE INDEX idx_session_duration_page ON session_duration_aggregate(page_id, date, hour);

-- Retention and Returning Users Aggregate Table
CREATE TABLE retention_aggregate (
	date DATE,
	new_users INT DEFAULT 0,
	returning_users INT DEFAULT 0
);
-- Indexes for Retention Aggregate Table
CREATE INDEX idx_retention_date ON retention_aggregate(date);

-- Traffic by Geolocation Aggregate Table (Optional)
CREATE TABLE traffic_by_geolocation (
	date DATE,
	country VARCHAR(100),
	region VARCHAR(100),
	city VARCHAR(100),
	total_visits INT DEFAULT 0
);
-- Indexes for Traffic by Geolocation Table
CREATE INDEX idx_geo_traffic_date ON traffic_by_geolocation(date);
CREATE INDEX idx_geo_traffic_location ON traffic_by_geolocation(country, region, city);

-- New vs. Returning Users Aggregate Table
CREATE TABLE new_returning_users_aggregate (
	date DATE,
	new_users INT DEFAULT 0,
	returning_users INT DEFAULT 0
);
-- Indexes for New vs Returning Users Aggregate Table
CREATE INDEX idx_new_returning_users_date ON new_returning_users_aggregate(date);