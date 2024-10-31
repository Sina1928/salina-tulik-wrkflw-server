-- Create database
CREATE DATABASE IF NOT EXISTS wrkflw;
USE wrkflw;

-- Users table
CREATE TABLE users (
    id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    googleId VARCHAR(255),
    password VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY email (email),
    UNIQUE KEY googleId (googleId)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Industries table
CREATE TABLE industries (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Companies table
CREATE TABLE companies (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    logo_url VARCHAR(255),
    theme_color VARCHAR(50),
    website_url VARCHAR(255),
    industry_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    selected_components JSON,
    company_address VARCHAR(255),
    PRIMARY KEY (id),
    KEY industry_id (industry_id),
    CONSTRAINT companies_ibfk_1 FOREIGN KEY (industry_id) REFERENCES industries (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Components table
CREATE TABLE components (
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- User-Company junction table
CREATE TABLE user_company (
    id INT NOT NULL AUTO_INCREMENT,
    user_id INT,
    company_id INT,
    role VARCHAR(100),
    PRIMARY KEY (id),
    KEY user_id (user_id),
    KEY company_id (company_id),
    CONSTRAINT user_company_ibfk_1 FOREIGN KEY (user_id) REFERENCES users (id),
    CONSTRAINT user_company_ibfk_2 FOREIGN KEY (company_id) REFERENCES companies (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Business Requirements table
CREATE TABLE business_requirements (
    id INT NOT NULL AUTO_INCREMENT,
    industry_id INT,
    PRIMARY KEY (id),
    KEY industry_id (industry_id),
    CONSTRAINT business_requirements_ibfk_1 FOREIGN KEY (industry_id) REFERENCES industries (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Business Requirements Components junction table
CREATE TABLE business_requirements_components (
    id INT NOT NULL AUTO_INCREMENT,
    business_requirement_id INT,
    component_id INT,
    company_id INT,
    PRIMARY KEY (id),
    KEY business_requirement_id (business_requirement_id),
    KEY component_id (component_id),
    CONSTRAINT business_requirements_components_ibfk_1 FOREIGN KEY (business_requirement_id) REFERENCES business_requirements (id),
    CONSTRAINT business_requirements_components_ibfk_2 FOREIGN KEY (component_id) REFERENCES components (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Company Components table
CREATE TABLE company_components (
    id INT NOT NULL AUTO_INCREMENT,
    company_id INT NOT NULL,
    component_id INT NOT NULL,
    status VARCHAR(50) DEFAULT 'active',
    activated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY unique_company_component (company_id,component_id),
    KEY component_id (component_id),
    CONSTRAINT company_components_ibfk_1 FOREIGN KEY (company_id) REFERENCES companies (id),
    CONSTRAINT company_components_ibfk_2 FOREIGN KEY (component_id) REFERENCES components (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Appointments table
CREATE TABLE appointments (
    id INT NOT NULL AUTO_INCREMENT,
    company_id INT NOT NULL,
    client_name VARCHAR(255) NOT NULL,
    service_type VARCHAR(255) NOT NULL,
    appointment_date DATETIME NOT NULL,
    status VARCHAR(50) DEFAULT 'scheduled',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY company_id (company_id),
    CONSTRAINT appointments_ibfk_1 FOREIGN KEY (company_id) REFERENCES companies (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Project Tasks table
CREATE TABLE project_tasks (
    id INT NOT NULL AUTO_INCREMENT,
    company_id INT NOT NULL,
    project_name VARCHAR(255) NOT NULL,
    task_name VARCHAR(255) NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    due_date DATE,
    assigned_to INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY company_id (company_id),
    KEY assigned_to (assigned_to),
    CONSTRAINT project_tasks_ibfk_1 FOREIGN KEY (company_id) REFERENCES companies (id),
    CONSTRAINT project_tasks_ibfk_2 FOREIGN KEY (assigned_to) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

-- Safety Incidents table
CREATE TABLE safety_incidents (
    id INT NOT NULL AUTO_INCREMENT,
    company_id INT NOT NULL,
    incident_type VARCHAR(255) NOT NULL,
    description TEXT,
    severity VARCHAR(50),
    reported_by INT,
    report_date DATE,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY company_id (company_id),
    KEY reported_by (reported_by),
    CONSTRAINT safety_incidents_ibfk_1 FOREIGN KEY (company_id) REFERENCES companies (id),
    CONSTRAINT safety_incidents_ibfk_2 FOREIGN KEY (reported_by) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;