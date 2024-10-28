## Database Schema Overview

| **Table Name**           | **Column Name**       | **Data Type**      | **Constraints/Description**                                      |
|--------------------------|-----------------------|--------------------|------------------------------------------------------------------|
| **pages**                | `page_id`             | INT                | PRIMARY KEY, AUTO_INCREMENT                                      |
|                          | `page_url`            | VARCHAR(255)       | UNIQUE, NOT NULL                                                 |
|                          | `created_at`          | TIMESTAMP          | DEFAULT CURRENT_TIMESTAMP                                        |
|                          |                       |                    |                                                                  |
| **users**                | `user_id`             | VARCHAR(255)       | PRIMARY KEY                                                      |
|                          | `name`         | VARCHAR(255)          | NOT NULL                                                         |
|                          | `first_visit`         | TIMESTAMP          | NOT NULL                                                         |
|                          | `last_visit`          | TIMESTAMP          | NOT NULL                                                         |
|                          |                       |                    |                                                                  |
| **browsers**             | `browser_id`          | INT                | PRIMARY KEY, AUTO_INCREMENT                                      |
|                          | `browser_name`        | VARCHAR(100)       | NOT NULL                                                         |
|                          |                       |                    |                                                                  |
| **operating_systems**    | `os_id`               | INT                | PRIMARY KEY, AUTO_INCREMENT                                      |
|                          | `os_name`             | VARCHAR(100)       | NOT NULL                                                         |
|                          |                       |                    |                                                                  |
| **device_types**         | `device_type_id`      | INT                | PRIMARY KEY, AUTO_INCREMENT                                      |
|                          | `device_type`         | VARCHAR(100)       | NOT NULL                                                         |
|                          |                       |                    |                                                                  |
| **geo_locations**        | `geo_id`              | INT                | PRIMARY KEY, AUTO_INCREMENT                                      |
|                          | `country`             | VARCHAR(100)       | NOT NULL                                                         |
|                          | `region`              | VARCHAR(100)       |                                                                  |
|                          | `city`                | VARCHAR(100)       |                                                                  |
|                          |                       |                    |                                                                  |
| **sessions**             | `session_id`          | INT                | PRIMARY KEY, AUTO_INCREMENT                                      |
|                          | `user_id`             | VARCHAR(255)       | FOREIGN KEY REFERENCES `users(user_id)`                          |
|                          | `page_id`             | INT                | FOREIGN KEY REFERENCES `pages(page_id)`                          |
|                          | `browser_id`          | INT                | FOREIGN KEY REFERENCES `browsers(browser_id)`                    |
|                          | `os_id`               | INT                | FOREIGN KEY REFERENCES `operating_systems(os_id)`                |
|                          | `device_type_id`      | INT                | FOREIGN KEY REFERENCES `device_types(device_type_id)`            |
|                          | `geo_id`              | INT                | FOREIGN KEY REFERENCES `geo_locations(geo_id)`                   |
|                          | `ip_address`          | VARCHAR(45)        |                                                                  |
|                          | `start_time`          | TIMESTAMP          | NOT NULL                                                         |
|                          |                       |                    |                                                                  |
| **page_views_aggregate** | `page_id`             | INT                | FOREIGN KEY REFERENCES `pages(page_id)`                          |
|                          | `date`                | DATE               |                                                                  |
|                          | `hour`                | INT                |                                                                  |
|                          | `views`               | INT                | DEFAULT 0                                                        |
|                          |                       |                    |                                                                  |
| **active_users_by_device**| `date`               | DATE               |                                                                  |
|                          | `hour`                | INT                |                                                                  |
|                          | `device_type_id`      | INT                | FOREIGN KEY REFERENCES `device_types(device_type_id)`            |
|                          | `active_users`        | INT                | DEFAULT 0                                                        |
|                          |                       |                    |                                                                  |
| **active_users_by_browser_os**| `date`           | DATE               |                                                                  |
|                          | `hour`                | INT                |                                                                  |
|                          | `browser_id`          | INT                | FOREIGN KEY REFERENCES `browsers(browser_id)`                    |
|                          | `os_id`               | INT                | FOREIGN KEY REFERENCES `operating_systems(os_id)`                |
|                          | `active_users`        | INT                | DEFAULT 0                                                        |
|                          |                       |                    |                                                                  |
| **session_duration_aggregate**| `date`           | DATE               |                                                                  |
|                          | `hour`                | INT                |                                                                  |
|                          | `page_id`             | INT                | FOREIGN KEY REFERENCES `pages(page_id)`                          |
|                          | `total_sessions`      | INT                | DEFAULT 0                                                        |
|                          | `avg_session_duration`| DECIMAL(10,2)      | DEFAULT 0.0                                                      |
|                          |                       |                    |                                                                  |
| **retention_aggregate**   | `date`               | DATE               |                                                                  |
|                          | `new_users`           | INT                | DEFAULT 0                                                        |
|                          | `returning_users`     | INT                | DEFAULT 0                                                        |
|                          |                       |                    |                                                                  |
| **traffic_by_geolocation**| `date`               | DATE               |                                                                  |
|                          | `country`             | VARCHAR(100)       |                                                                  |
|                          | `region`              | VARCHAR(100)       |                                                                  |
|                          | `city`                | VARCHAR(100)       |                                                                  |
|                          | `total_visits`        | INT                | DEFAULT 0                                                        |
|                          |                       |                    |                                                                  |
| **new_returning_users_aggregate**| `date`        | DATE               |                                                                  |
|                          | `new_users`           | INT                | DEFAULT 0                                                        |
|                          | `returning_users`     | INT                | DEFAULT 0                                                        |