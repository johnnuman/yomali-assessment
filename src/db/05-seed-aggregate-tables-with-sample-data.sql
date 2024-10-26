-- Switch to the newly created database
USE page_analytics_db;

-- Seed the Page_Views_Aggregate Table
-- This table tracks the number of views for each page by date and hour.
TRUNCATE TABLE page_views_aggregate;
INSERT INTO page_views_aggregate (page_id, date, hour, views)
SELECT
    page_id,
    DATE(start_time) AS date,
    HOUR(start_time) AS hour,
    COUNT(*) AS views
FROM
    sessions
GROUP BY
    page_id, date, hour;


-- Seed the Active_Users_By_Device Table
-- This table tracks the number of active users by device type, date, and hour.
TRUNCATE TABLE active_users_by_device;
INSERT INTO active_users_by_device (date, hour, device_type_id, active_users)
SELECT
    DATE(start_time) AS date,
    HOUR(start_time) AS hour,
    device_type_id,
    COUNT(DISTINCT user_id) AS active_users
FROM
    sessions
GROUP BY
    date, hour, device_type_id;


-- Seed the Active_Users_By_Browser_OS Table
-- This table tracks the number of active users by browser and operating system, date, and hour.
TRUNCATE TABLE active_users_by_browser_os;
INSERT INTO active_users_by_browser_os (date, hour, browser_id, os_id, active_users)
SELECT
    DATE(start_time) AS date,
    HOUR(start_time) AS hour,
    browser_id,
    os_id,
    COUNT(DISTINCT user_id) AS active_users
FROM
    sessions
GROUP BY
    date, hour, browser_id, os_id;


-- Seed the Session_Duration_Aggregate Table
-- This table tracks the total number of sessions and the average session duration for each page by date and hour.
-- Assuming a session duration column is available. If not, replace this with session counts only.
TRUNCATE TABLE session_duration_aggregate;
INSERT INTO session_duration_aggregate (date, hour, page_id, total_sessions, avg_session_duration)
SELECT
    DATE(start_time) AS date,
    HOUR(start_time) AS hour,
    page_id,
    COUNT(*) AS total_sessions,
    AVG(TIMESTAMPDIFF(SECOND, start_time, NOW())) AS avg_session_duration  -- Example: Duration between start_time and now
FROM
    sessions
GROUP BY
    date, hour, page_id;


-- Seed the Retention_Aggregate Table
-- This table tracks new and returning users per day.
TRUNCATE TABLE retention_aggregate;
INSERT INTO retention_aggregate (date, new_users, returning_users)
SELECT
    DATE(first_visit) AS date,
    COUNT(DISTINCT CASE WHEN first_visit = last_visit THEN user_id ELSE NULL END) AS new_users,
    COUNT(DISTINCT CASE WHEN first_visit <> last_visit THEN user_id ELSE NULL END) AS returning_users
FROM
    users
GROUP BY
    date;


-- Seed the Traffic_By_Geolocation Table
-- Assuming there is location data available (if so, add the fields in sessions or user tracking)
-- This table tracks traffic by geolocation, including country, region, and city.
TRUNCATE TABLE traffic_by_geolocation;
INSERT INTO traffic_by_geolocation (date, country, region, city, total_visits)
SELECT
    DATE(s.start_time) AS date,         -- Extract the date from session start time
    g.country,                          -- Country from Geolocation table
    g.region,                           -- Region from Geolocation table
    g.city,                             -- City from Geolocation table
    COUNT(*) AS total_visits            -- Total visits for each geolocation
FROM
    sessions s
        JOIN
    geo_locations g ON s.geo_id = g.geo_id  -- Join sessions with geolocation
GROUP BY
    date, g.country, g.region, g.city;   -- Group by date, country, region, and city


-- Seed the New_Returning_Users_Aggregate Table
-- This table tracks new and returning users per day.
TRUNCATE TABLE new_returning_users_aggregate;
INSERT INTO new_returning_users_aggregate (date, new_users, returning_users)
SELECT
    DATE(first_visit) AS date,
    COUNT(DISTINCT CASE WHEN first_visit = last_visit THEN user_id ELSE NULL END) AS new_users,
    COUNT(DISTINCT CASE WHEN first_visit <> last_visit THEN user_id ELSE NULL END) AS returning_users
FROM
    users
GROUP BY
    date;
