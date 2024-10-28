# Project Overview

This project is a **Node.js-based analytics application** that integrates **MySQL** for database management and **Redis** for caching, designed to efficiently handle high-traffic scenarios.
 
 It is fully Dockerized for ease of deployment, performance optimization, and scalability, reflecting careful consideration at every architectural layer.

The following sections outline the **key decisions** I have made, explain the **design choices**, and demonstrate how these decisions contribute to a robust and optimized system architecture.

---

### Launching The Project

#### Backend Server
You can always launch the project by running:
```shell script
docker compose up
```

You can recreate the container by running:
```shell script
docker compose up --build
``` 

#### Frontend Dashboard
to Launch front-end:
```shell script
cd /src/client-interface

npm run dev
```

#### A Client Proxy Script to Simulate Multiple Websites Sending Data
In a separate terminal, launch on the root of project:
```shell script
node proxy-client/client.js
```
This will launch a demo script which will keep adding new data every second.

#### Demo HTML Page with Tracker Snippet Integration
A demo html page can be accessed [here](http://localhost:8080/tracker-demo.html). Make sure the docker containers are up and running before visiting this page.

#### Tracker JS File
Actual JS file containing tracking code can be found [here](./src/tracker/tracker.js)

---

## Architecture Overview

The overall architecture is based on a **modular monolithic** design, with each component having clear separation of concerns:
- **Node.js** serves as the primary application layer.
- **MySQL** provides structured storage for all analytics and session data.
- **Redis** is used to cache frequently accessed data, reducing the load on MySQL in high-traffic scenarios.
- Each component is containerized using **Docker**, ensuring that the entire system can be deployed consistently across environments, enhancing portability and reducing the risk of "it works on my machine" issues.

> **Important:** 
>
> **Redis** is not a requirement for the sake of this assessment. But I chose to use it in this project for two main reasons:
> - To demonstrate my skills with a caching layer since this topic was discussed during my interview session.
> - To demonstrate my proficiency with **Docker** in a **CD** setup where whole deployment and configuration is being managed from the same codebase.

### Project Structure
- **src/client-interface**: Frontend code for the analytics dashboard (Nuxt3).
- **src/config**: Configuration file for `Sequelize` ORM.
- **src/controllers**: Controllers for business logic and handling requests.
- **src/cron**:  Cron job setup for aggregation tasks. I have not implemented it considering the scope of current assessment but it can be implemented to update aggregate tables.
- **src/db**: Database initialization scripts for MySQL.
- **src/middleware**: Contains different middleware for rate-limiting global error handling etc.
- **src/models**: Contains all the `Sequelize` ORM models.
- **src/redis**: Folder to hold advanced Redis configuration and all the cache layer implementation code.
- **src/routes**: API routes for the backend.
- **src/tracker**: Client-side JavaScript tracker for embedding on websites.
- **/proxy-client**: A client script to simulate multiple websites sending data to server.

### Database
#### Schema
Complete database schema can be viewed in [DB_SCHEMA.md](DB_SCHEMA.md).

#### Initialization & Seeding
Database initialization and seeding automatically occurs at the time of creation of new container. If there is no disk volume created, the initialization routine will run and database will be created and seeded automatically. Upon subsequent restarts of the container, the data is not re-initialized until the container is destroyed along with its disk volume.

### Key Components:
- **Node.js Application**: The central processing unit that handles API requests, processes session data, and communicates with MySQL and Redis.
- **Nuxt 3 Frontend Application**: The frontend dashboard to show different analytics.
- **Tracker JS File**: A javascript file to contain the code that will run in client websites, collect metrics and send back to server.
- **MySQL Database**: The primary storage for structured data, including user sessions, page views, and other analytics data.
- **Redis Cache**: Provides a caching layer to store frequently queried data, reducing the load on MySQL.
- **Docker Compose**: Used to orchestrate the multi-container architecture, ensuring smooth communication between the services.

---

## Thought Process Behind Architectural Decisions

The decisions for this project were driven by assuming a need for **scalability**, **performance optimization**, and **maintainability** as if this was a production-ready project.

Here’s a breakdown of the architectural decisions and their justifications:

### 1. **Choice of Database: MySQL**

- **Why MySQL?**  
  Mainly because it was required by the assessment criteria itself, but I would have chosen it as the relational database for its structured data handling, ACID compliance, and extensive community support. This aligns well with the analytics use case, where data integrity and relational querying are critical. Additionally, MySQL supports complex queries and indexing, making it a reliable option for aggregating large volumes of analytics data.
  
- **Performance Considerations**:  
  I took into account that MySQL’s performance can degrade under high load if not properly configured. To mitigate this, we have optimized the database configuration (`my.cnf`) to:
  - Increase connection limits (`max_connections`).
  - Adjust the buffer pool size (`innodb_buffer_pool_size`) to efficiently handle high read/write operations.
  - Enable query caching to optimize repeated queries for analytics dashboards.
> **Disclaimer**
>
> Custom configuration is only introduced in this project to demonstrate my abilities to understand advanced level configuration parameters that might need to be addressed in a live production setup to achieve optimal performance. Such configurations might not have any immediate impact in this limited setup. 

### 2. **Introduction of Redis for Caching**

- **Why Redis?**  
  Redis was added as a caching layer to offload frequently accessed data from MySQL. The reasoning here is simple: in a high-traffic analytics environment, querying the database for `page_id`, `browser_types`, `demographics` etc. would require costly joins and extra database calls for each incoming data-point for page analytics.
  
  By storing such information in cache layer, I removed many of the **indexes** that otherwise would have been needed for such read operations. Hence, I was able to create highly **write-optimized** transactional tables. Redis, being an in-memory store, dramatically reduces the response times for such requests.

- **Design Consideration**:  
  Redis has been configured to persist data using AOF (Append-Only File), ensuring that the cached data is not lost on container restarts. Additionally, we’ve optimized Redis memory usage by setting limits (`maxmemory`) and using the **LRU (Least Recently Used)** eviction policy to maintain memory efficiency.
  
- **How it works**:  
  I have implemented as a self-contained cache layer as single source of truth for lookup data tables. `SessionController` will use helper methods on `cache` object to check the cache if a record exists for that particular value, if not, the cache layer will automatically check the database, if a record is found, it will update the cache and return the record. If it is not even found in the database, for the sake of this assessment, no further validation is performed and it is assumed that the data needs to be persisted in database. So a new record is inserted in database, cache is updated and record is returned back to `SessionController`. 

> **Disclaimer**
>
> Custom configuration is only introduced in this project to demonstrate my abilities to understand advanced level configuration parameters that might need to be addressed in a live production setup to achieve optimal performance. Such configurations might not have any immediate impact in this limited setup.

### 3. **Modular Monolithic Design**

- **Why Modular Monolith?**  
  A monolithic architecture was chosen for this project given the very limited scope of this assessment, yet each component (API, database interactions, session handling, etc.) is well-modularized within the monolith. This design allows for better maintainability and a potential future transition to microservices if the project needs to be scaled.

- **Benefits**:
  - **Simplicity**: Easier and much quicker to develop and manage at this stage compared to microservices.
  - **Performance**: Since everything runs in a single process, there is minimal inter-service communication overhead.
  - **Potential for Future Scaling**: The modular design ensures that any of these modules can be extracted into its own service if required.

### 4. **Dockerization and Containerization Strategy**

- **Why Docker?**  
  Docker was chosen to containerize the entire application for consistency across development, demo and possible re-running of code on your end, should you choose to see it in live action :)
  
  Docker ensures that the same versions of Node.js, MySQL, and Redis are used across environments, removing platform-specific issues.

### 5. **Configuration Centralization Using `.env`**

- **Why Centralize Configuration?**  
  Centralizing the configuration in a `.env` file ensures that sensitive credentials (e.g., database passwords) and environment-specific settings (e.g., ports, caching policies) are not hardcoded in the codebase or Docker files. This approach also makes it easy to switch configurations between development, staging, and production environments without changing the underlying code.

- **Examples of Centralized Configurations**:
  - **MySQL**: Even though I could convert the `sql` files into templates and leverage database name, user credentials, and connection details defined in `.env` but that would have introduced some extra steps at container initialization to process those templates before running at database initialization. That goes way beyond the scope of this assessment so I did not take that route. But it can be implemented for sure.
  - **Redis**: Port and caching policies are defined centrally for easier adjustment.
  - **Application Ports**: Easily adjustable via the `.env` file, ensuring flexibility during deployment.

### 6. **Handling Database Initialization and Persistence**

- **Database Initialization**:  
  The MySQL initialization scripts were made part of the codebase and the whole process is automated via docker to initialize database upon container construction and also some sample data is seeded into the database for proper visualization in the dashboard.

- **Persistence Strategy**:  
  Both MySQL and Redis can be set up with persistent volumes to ensure that data is not lost when containers are restarted. But that is beyond the scope of current assessment so assume any data will be lost in case the containers are restarted.

---
### Tracker Javascript File
This file will be minified and all the assessment related code will be stripped to achieve maximum speed without affecting performance of the host websites.

##### Descriptive Variable and Function Names

- **`trackingApiUrl`, `trackingData`, `detectBrowser()`, `detectOperatingSystem()`, and `detectDeviceType()`** are all clear and descriptive, making the purpose of each variable and function immediately understandable.
- The code prioritizes readability, which is essential in an assessment context, making it easy to follow and maintain.

##### Asynchronous Data Sending

- The **`sendTrackingData()`** function uses the **Fetch API** to send the collected data asynchronously, ensuring that the process does not block the webpage or affect its performance.

##### Error Handling
- There is built-in fault-tolerance. The script will keep retrying until a `200` status code acknowledgement is received from the backend server.

##### Data Collection
- The script collects key data such as the **page URL**, **referrer URL**, **user-agent**, **browser type**, **operating system**, and **device type**, which are essential for a web tracker.
- It timestamps the event using **`new Date().toISOString()`** for precise logging of when the event occurred, making the data useful for detailed analytics.

##### Client-Side Snippet
Following script will be put in the client's website to load the tracker asynchronously:
```html
<!-- Place this small snippet at the bottom of the HTML near <body> closing tag. -->
<script>
  (function() {
    var script = document.createElement('script');
    script.src = 'https://yourdomain.com/tracker.js'; // Backend URL serving the tracker
    script.async = true; // Non-blocking loading
    var firstScript = document.getElementsByTagName('script')[0];
    firstScript.parentNode.insertBefore(script, firstScript); // Insert script dynamically
  })();
</script>
```

##### How It Works
###### Backend Route (`/tracker.js`):
- This route serves the **minified version** of the JavaScript tracker when the client webpage requests it.
- The script is cached for a long period (**`Cache-Control: public, max-age=31536000`**) to optimize load times after the first request. This means that the client won’t have to re-download the script repeatedly, improving performance.

###### Client-Side Snippet:
- The small embed snippet is **non-blocking** because it loads the script asynchronously using **`async = true`**.
- The script dynamically creates a `<script>` tag, sets the `src` to your hosted **`tracker.js`**, and inserts it into the webpage, ensuring minimal impact on page load times.

##### Optional Enhancements

###### Dynamic Parameters:

- We can allow clients to pass parameters (e.g., **`siteId`**) and the backend endpoint can send out custom JS that is tailored to a specific `website` or `client`.

Example:

```html
<script async src="https://yourdomain.com/tracker.js?siteId=12345"></script>
```
---
### Frontend Dashboard
Frontend dashboard is a `Nuxt 3` based application. It is a `SPA` and self-explanatory. All the websites are loaded in a dropdown on page load and there is a date-range selector. You can switch between different websites and date ranges to get different analytics.

> Clicking on a `Date` point in the line graph drills down to show page view counts of individual pages within that website.

To run the frontend application, on the terminal, move to `/src/client-interface` folder and run:
```shell script
npm run dev
``` 

---

## Final Thoughts

This project demonstrates a careful balance between **performance optimization**, **scalability**, and **maintainability**. The decision to use Docker ensures a flexible and isolated development environment, while MySQL and Redis were chosen for their performance characteristics in handling large volumes of analytics data.

Each architectural decision—from using Redis for caching to configuring resource limits on Docker containers—was made with a clear focus on demonstrating my ability to tackle advanced concepts and integrate different complex layers into a working system.

This setup is both robust and flexible, providing an excellent foundation for further expansion, such as integrating additional analytics features, moving to a microservices architecture, or scaling the database for even larger datasets.

---

## Next Steps and Future Considerations

- **Horizontal Scaling**: As traffic grows, we may consider introducing load balancers and clustering Redis to handle increased demand.
- **Monitoring Integration**: Adding a monitoring stack (e.g., Prometheus and Grafana) to visualize system performance and detect bottlenecks early.
- **Microservices Migration**: If the modular monolith grows in complexity, consider splitting core functionalities into microservices for greater scalability.