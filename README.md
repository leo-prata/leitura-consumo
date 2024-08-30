# Water and Gas Consumption Management

## Description

This project is a back-end service developed to manage individualized water and gas consumption readings. It uses AI to obtain measurements through a photo of a meter. The application is developed in Node.js with TypeScript and uses PostgreSQL as the database.

## Features

- **POST /upload**: Receives a base64 image, queries Google Gemini, and returns the reading measured by the API.
- **PATCH /confirm**: Confirms or corrects the value read by the LLM.
- **GET /<customer_code>/list**: Lists the measurements made by a specific customer.

## Technologies Used

- Node.js
- TypeScript
- Prisma ORM
- PostgreSQL
- Docker
- Docker Compose
- Git

## Models

### Customer
Represents the customers in the system.
- **Fields**: `id`, `customerCode`.
- **Relationships**: A customer can have multiple measures (`measures`).

### Measure
Represents the measurements of water and gas consumption.
- **Fields**: `measureUuid`, `measureDatetime`, `measureType`, `hasConfirmed`, `imageUrl`, `measureValue`, `customerId`.
- **Relationships**: Belongs to a customer (`customer`).

## Endpoints

### POST /upload
Receives a base64 image, queries Google Gemini, and returns the reading measured by the API.

### PATCH /confirm
Confirms or corrects the value read by the LLM.

### GET /:customer_code/list
Lists the measurements made by a specific customer.
