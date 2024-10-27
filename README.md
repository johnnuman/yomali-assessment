# Project Overview

This project is a **Node.js-based analytics application** that integrates **MySQL** for database management and **Redis** for caching, designed to efficiently handle high-traffic scenarios.
 
 It is fully Dockerized for ease of deployment, performance optimization, and scalability, reflecting careful consideration at every architectural layer.

The following sections outline the **key decisions** I have made, explain the **design choices**, and demonstrate how these decisions contribute to a robust and optimized system architecture.

---

### Launching The Project
You can always launch the project by running:
```shell script
docker compose up
```

You can recreate the container by running:
```shell script
docker compose up --build
``` 

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
- **src/api**: Handles the backend API logic.
- **src/client-interface**: Frontend code for the analytics dashboard (React/Vue/Angular).
- **src/tracker**: Client-side JavaScript tracker for embedding on websites.
- **src/routes**: API routes for the backend.
- **src/controllers**: Controllers for business logic and handling requests.
- **src/db**: Database initialization scripts for MySQL.
- **src/redis**: Folder to hold advanced Redis configuration.
- **src/cron**: Cron job setup for aggregation tasks.
- **src/services**: Shared services, such as Redis and logger configurations.
- **src/config**: Configuration files for MySQL and Redis.
- **public**: Contains frontend assets like HTML, JS, CSS for the tracker.

### Database
#### Schema
Complete database schema can be viewed in [DB_SCHEMA.md](DB_SCHEMA.md).

#### Initialization & Seeding
Database initialization and seeding automatically occurs at the time of creation of new container. If there is no disk volume created, the initialization routine will run and database will be created and seeded automatically. Upon subsequent restarts of the container, the data is not re-initialized until the container is destroyed along with its disk volume.

### Key Components:
- **Node.js Application**: The central processing unit that handles API requests, processes session data, and communicates with MySQL and Redis.
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

## Final Thoughts

This project demonstrates a careful balance between **performance optimization**, **scalability**, and **maintainability**. The decision to use Docker ensures a flexible and isolated development environment, while MySQL and Redis were chosen for their performance characteristics in handling large volumes of analytics data.

Each architectural decision—from using Redis for caching to configuring resource limits on Docker containers—was made with a clear focus on ensuring that the system is capable of handling high traffic loads without sacrificing performance or data integrity.

This setup is both robust and flexible, providing an excellent foundation for further expansion, such as integrating additional analytics features, moving to a microservices architecture, or scaling the database for even larger datasets.

---

## Next Steps and Future Considerations

- **Horizontal Scaling**: As traffic grows, consider introducing load balancers and clustering Redis to handle increased demand.
- **Monitoring Integration**: Adding a monitoring stack (e.g., Prometheus and Grafana) to visualize system performance and detect bottlenecks early.
- **Microservices Migration**: If the modular monolith grows in complexity, consider splitting core functionalities into microservices for greater scalability.


Here's the reformatted content in **Markdown** format for you to copy into your README file:

---

### Descriptive Variable and Function Names

- **`trackingApiUrl`, `trackingData`, `detectBrowser()`, `detectOperatingSystem()`, and `detectDeviceType()`** are all clear and descriptive, making the purpose of each variable and function immediately understandable.
- The code prioritizes readability, which is essential in an assessment context, making it easy to follow and maintain.

### Asynchronous Data Sending

- The **`sendTrackingData()`** function uses the **Fetch API** to send the collected data asynchronously, ensuring that the process does not block the webpage or affect its performance.
- If the **Beacon API** is supported, the data will be sent when the user unloads the page. This approach ensures minimal impact on the user experience, as the data is sent in the background without affecting page load times.

### Data Collection

- The script collects key data such as the **page URL**, **referrer URL**, **user-agent**, **browser type**, **operating system**, and **device type**, which are essential for a web tracker.
- It timestamps the event using **`new Date().toISOString()`** for precise logging of when the event occurred, making the data useful for detailed analytics.

### Error Handling

- If the **Fetch** request fails (e.g., network issues), the script logs the error, ensuring that the failure is noted without affecting the user experience or breaking the website.

### Client-Side Snippet

You can place the following script on the client's website to load the tracker asynchronously:

```html
<!-- Place this small snippet in the client's website -->
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

---

### Step 4: Explanation of How It Works

#### Backend Route (`/tracker.js`):

- This route serves the **minified version** of the JavaScript tracker when the client webpage requests it.
- The script is cached for a long period (**`Cache-Control: public, max-age=31536000`**) to optimize load times after the first request. This means that the client won’t have to re-download the script repeatedly, improving performance.

#### Client-Side Snippet:

- The small embed snippet is **non-blocking** because it loads the script asynchronously using **`async = true`**.
- The script dynamically creates a `<script>` tag, sets the `src` to your hosted **`tracker.js`**, and inserts it into the webpage, ensuring minimal impact on page load times.

#### Minimizing Page Load Impact:

- By serving the script from your backend (or a **CDN**), and ensuring it is loaded asynchronously, the performance impact on the client’s website is minimized.
- The JavaScript file is cached to further reduce the load on your server and speed up subsequent requests.

---

### Step 5: Optional Enhancements

#### Dynamic Parameters:

- If you want to allow clients to pass parameters (e.g., **`siteId`**), you can modify the client-side snippet to include query parameters when requesting the **`tracker.js`** file.

Example:

```html
<script async src="https://yourdomain.com/tracker.js?siteId=12345"></script>
```

This way, you can customize the tracker behavior based on the client's site or other specific parameters.

---

Feel free to copy and paste these sections into your README file. Let me know if you need any further refinements!