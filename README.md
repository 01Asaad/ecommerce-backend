# E-Commerce Backend API

A robust and scalable Node.js backend service for modern e-commerce applications, built with Express.js and MongoDB Atlas.

## Features

### Core Functionality
- **User Authentication** - Secure signup and login with JWT-based authentication
- **Product Management** - Full CRUD operations for products with advanced filtering
- **Search & Discovery** - Comprehensive product search capabilities  
- **Shopping Cart** - Product cart management system
- **Order Processing** - Seamless order creation and management
- **Testing Support** - Seed routes for development to be used by [e2e-test-suites](https://github.com/01Asaad/ecommerce-e2e-test)

### Security & Reliability
- **CORS Protection** - Cross-origin resource sharing security
- **Rate Limiting** - Intelligent request throttling with strict login protection
- **Input Validation** - Comprehensive data validation middleware
- **Error Handling** - Centralized error handling with proper logging
- **Secure Authentication** - JWT token-based secure access

## Installation

### Prerequisites
- Node.js (v22 or higher)
- MongoDB Atlas cluster

# Installing

- clone the repository
	```shell
	git clone https://github.com/01Asaad/ecommerce-backend
	```
- install the dependencies
	```shell
	npm install
	```
- setup mongodb atlas cluster

- copy .env.example to .env and edit the values with the db configuration

- run the server with
	```shell
	node app.js
	```