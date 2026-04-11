# HostLink – Service Management Platform

HostLink is an academic project that implements a web-based platform for managing property-related services.

The platform connects property owners with service provider companies, allowing users to request, manage, and execute services such as cleaning, maintenance, and other operational tasks in an organized and efficient way.

The main goal of the project is to demonstrate the development of a full-stack system that integrates user management, service workflows, and financial processes into a single platform.

This project was developed as part of an academic assignment in Project III , It focuses on the design and implementation of a service-oriented platform, including requirements definition, system architecture, and full-stack development.

---

## System Overview

HostLink provides a centralized environment where different types of users interact with the system according to their roles.

Property owners can manage their properties and request services, while companies can offer services and handle incoming requests. Workers are responsible for executing assigned tasks, and administrators supervise the platform.

The system ensures structured communication, service tracking, and transparency across all interactions.

---

## Main Features

- User authentication and role-based access control  
- Property registration and management  
- Service catalog creation and management  
- Service request creation and tracking  
- Task assignment and execution  
- Real-time notifications and status updates  
- Invoice generation and financial tracking  
- Administrative backoffice for platform management  

---

## System Roles

- **Administrator**  
  Responsible for managing users, validating data, and supervising the platform  

- **Property Owner (Host)**  
  Manages properties and requests services  

- **Service Provider Company**  
  Provides services and manages incoming requests  

- **Worker**  
  Executes assigned services and updates task progress  

---

## Invoicing System

The platform includes an invoicing system that is automatically triggered when a service request is accepted by a service provider company.

Users can:

- View a list of all generated invoices  
- Access detailed information about each invoice  
- Download invoices in PDF format  

Each invoice includes an automatic calculation where **10% of the service price is allocated as a platform commission**, ensuring proper monetization of the system.

This functionality is available for both companies and property owners, ensuring transparency in financial operations.

---

## Technology Stack

### Frontend

- React  
- Vite  

### Backend

- Node.js  
- Express.js  

### Additional Technologies

- Axios (API communication)  
- JSON Web Tokens (JWT) for authentication  

---

## Repository Structure
│── backend/ # Server-side logic and API

│── frontend/ # Main user interface

│── backoffice/ # Administrative interface

## Installation and Setup

### Clone the repository

```bash
git clone https://github.com/AnaMachado123/HostLink.git
cd HostLink


