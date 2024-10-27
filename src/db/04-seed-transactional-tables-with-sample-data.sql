-- Switch to the newly created database
USE page_analytics_db;

-- Seed the browsers table
INSERT INTO browsers (browser_id, browser_name)
VALUES
    (1, 'Chrome'),
    (2, 'Firefox'),
    (3, 'Safari'),
    (4, 'Edge'),
    (5, 'Opera');

-- Seed the operating_systems table
INSERT INTO operating_systems (os_id, os_name)
VALUES
    (1, 'Windows'),
    (2, 'macOS'),
    (3, 'Linux'),
    (4, 'iOS'),
    (5, 'Android');

-- Seed the device_types table
INSERT INTO device_types (device_type_id, device_type)
VALUES
    (1, 'Desktop'),
    (2, 'Mobile'),
    (3, 'Tablet');

-- Generate 1000 users
INSERT INTO users (name, first_visit, last_visit)
SELECT
    CONCAT('user', n) AS user_id,  -- Generate user IDs like 'user1', 'user2', etc.
    NOW() - INTERVAL FLOOR(RAND() * 180) DAY - INTERVAL FLOOR(RAND() * 1440) MINUTE AS first_visit,  -- Random first visit in the last 6 months
    NOW() - INTERVAL FLOOR(RAND() * 180) DAY AS last_visit  -- Random last visit, ensuring it happens after first_visit
FROM
    (SELECT @row := @row + 1 as n FROM (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t1,
                                       (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t2,
                                       (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t3,
                                       (SELECT @row := 0) t4
    ) numbers
LIMIT 1000;

-- Seed pages table with URLs from multiple websites
INSERT INTO pages (page_id, page_url)
VALUES
    (1, 'https://example.com/home'),
    (2, 'https://example.com/about'),
    (3, 'https://example.com/products'),
    (4, 'https://example.com/contact'),
    (5, 'https://mysite.com/home'),
    (6, 'https://mysite.com/services'),
    (7, 'https://mysite.com/contact'),
    (8, 'https://yourblog.com/home'),
    (9, 'https://yourblog.com/about'),
    (10, 'https://yourblog.com/contact');

-- Seed the Geolocation Table
INSERT INTO geo_locations (country, region, city)
VALUES
    ('USA', 'California', 'Los Angeles'),
    ('USA', 'New York', 'New York City'),
    ('Canada', 'Ontario', 'Toronto'),
    ('UK', 'England', 'London'),
    ('Germany', 'Bavaria', 'Munich'),
    ('Australia', 'New South Wales', 'Sydney'),
    ('India', 'Maharashtra', 'Mumbai'),
    ('Brazil', 'São Paulo', 'São Paulo'),
    ('France', 'Île-de-France', 'Paris'),
    ('Japan', 'Tokyo', 'Tokyo');

-- Seed Sessions Table (with 200,000 rows of time-series data)
SET @row := 0;
-- Insert 200,000 sessions into the Sessions table
INSERT INTO sessions (user_id, page_id, browser_id, os_id, device_type_id, geo_id, ip_address, start_time)
SELECT
    CONCAT('user', FLOOR(RAND() * 1000 + 1)) AS user_id,   -- Random user_id from users table
    FLOOR(RAND() * 10 + 1) AS page_id,                    -- Random page_id between 1 and 10 (from pages table)
    FLOOR(RAND() * 5 + 1) AS browser_id,                  -- Random browser_id between 1 and 5 (from browser table)
    FLOOR(RAND() * 5 + 1) AS os_id,                       -- Random os_id between 1 and 5 (from operating_systems table)
    FLOOR(RAND() * 3 + 1) AS device_type_id,              -- Random device_type_id between 1 and 3 (from device_types table)
    FLOOR(RAND() * 10 + 1) AS geo_id,                     -- Random geo_id between 1 and 10 (from Geolocation table)
    CONCAT(FLOOR(RAND() * 255), '.', FLOOR(RAND() * 255), '.', FLOOR(RAND() * 255), '.', FLOOR(RAND() * 255)) AS ip_address,  -- Random IP address
    NOW() - INTERVAL FLOOR(RAND() * 180) DAY - INTERVAL FLOOR(RAND() * 1440) MINUTE AS start_time  -- Random start_time in the past 6 months
FROM
    (SELECT @row := @row + 1 AS n FROM
      (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
       UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t1,
      (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
       UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t2,
      (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
       UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t3,
      (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
       UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t4,
      (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
       UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t5,
      (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
       UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t6,
      (SELECT 0 UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5
       UNION ALL SELECT 6 UNION ALL SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9) t7
    ) numbers
LIMIT 200000;