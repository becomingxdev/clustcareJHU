# ClustCare 🏥 | Resource Optimization for Underserved Clinics

**International HealthHackathon Finalist** (VIT Bhopal × Johns Hopkins University)
*Ranked in the top 25 out of 600+ international teams.*

## 🌟 Overview
ClustCare is a "Visibility Layer" designed to bridge the gap between isolated medical clinics. By clustering local health centers, the platform enables real-time resource sharing, inventory tracking, and rule-based patient triaging to ensure equitable healthcare distribution.

## 🛠️ Tech Stack
* **Backend:** Java 17, Spring Boot 3.x, Spring Security
* **Database:** MySQL 8.0
* **ORM:** Spring Data JPA / Hibernate
* **Security:** JWT (JSON Web Tokens)
* **Frontend:** React.js, Vite, Tailwind CSS
* **Tools:** Maven, Git, Postman



## 🚀 Key Features (Backend Implementation)
- **Multi-Tier RBAC:** Implemented Role-Based Access Control for `SUPER_ADMIN`, `ADMIN` (Clinic Manager), and `USER` (Doctors) using Spring Security.
- **Dynamic Resource Visibility:** Engineered RESTful endpoints to aggregate equipment and medicine data across specific geographic clusters.
- **Inventory Intelligence:** Built logic to track stock levels, providing "Smart Indicators" for medicine surpluses and shortages to prevent expiration and stockouts.
- **Rule-Based Triage:** A structured backend system to categorize patient urgency and streamline appointment flows.
- **Automated Data Seeding:** A custom `DataInitializer` component to populate the system with realistic Indian healthcare data for high-fidelity demos.

## 🏗️ System Architecture
The backend follows a clean, layered architecture to ensure maintainability and scalability:

1.  **Controller Layer:** Handles REST requests and manages CORS configurations.
2.  **Service Layer:** Contains business logic for resource optimization and triage rules.
3.  **Repository Layer:** Interfaces with MySQL using JPA for efficient data persistence.
4.  **Security Layer:** Intercepts requests for JWT validation and authorization.



## 🔧 Installation & Setup

### Prerequisites
* JDK 17 or higher
* Maven 4.0.2
* MySQL Server 8.0

### Backend Setup
1.  Clone the repository.
2.  Update `src/main/resources/application.properties` with your MySQL credentials:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/clustcare
    spring.datasource.username=root
    spring.datasource.password=your_password
    spring.jpa.hibernate.ddl-auto=update
    ```
3.  Run the application:
    ```bash
    mvn spring-boot:run
    ```

### Frontend Setup
1.  Navigate to the `clustcare-frontend` directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 📈 Hackathon Success
Developed in just 36 hours, ClustCare successfully navigated the high-pressure final round. Key technical challenges overcome included resolving complex JPA data truncation issues and implementing a secure JWT-based auth flow from scratch to ensure data privacy between clinic clusters.

---
**Developed by Team nullBytes**
