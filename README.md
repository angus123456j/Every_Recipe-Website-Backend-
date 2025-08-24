# Recipe Platform - Backend

Robust REST API for storing, retrieving, and managing recipes. Built with Node.js, Express.js, MongoDB, and AWS services for reliability and scalability.

---

## Features 
- **CRUD on recipes**: Create, read, update, and delete recipes
- **Database integration**: MongoDB via Mongoose models
- **User authentication**: AWS Cognito for secure user management
- **Image uploads**: AWS S3 bucket for storing recipe images
- **Environment-based config**: Managed with `dotenv`
- **Error handling**: Consistent responses and status codes

---

## Tech Stack 
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose), AWS Cognito
- **File Storage**: AWS S3
- **Config**: dotenv

---

## Getting Started 

1) Clone the repository
```bash
git clone https://github.com/your-org/your-repo.git
cd your-repo
```

2) Install dependencies
```bash
npm install
```

3) Configure environment variables (`.env`)
```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/recipes_db
```

4) Start the server (with hot reload in development)
```bash
npm run dev
```

The API will be available at `http://localhost:<PORT>`.

## API Endpoints 📡

| Method | Endpoint         | Description            |
|--------|------------------|------------------------|
| GET    | `/recipes`       | Fetch all recipes      |
| GET    | `/recipes/:id`   | Fetch a recipe by ID   |
| POST   | `/recipes`       | Add a new recipe       |
| PUT    | `/recipes/:id`   | Update a recipe by ID  |
| DELETE | `/recipes/:id`   | Delete a recipe by ID  |

Note: Some routes may require authentication depending on your environment and middleware configuration.

## Example Request/Response 🍽️

### Create a recipe

Request
```http
POST /recipes
Content-Type: application/json

{
  "title": "Classic Pancakes",
  "ingredients": [
    "1 1/2 cups all-purpose flour",
    "3 1/2 tsp baking powder",
    "1 tbsp sugar",
    "1 1/4 cups milk",
    "1 egg",
    "3 tbsp butter, melted"
  ],
  "instructions": "Whisk dry, add wet, mix until combined. Cook on griddle until golden."
}
```

Successful Response
```json
{
  "id": "6650f0b9c2a5f1e7d9b12345",
  "title": "Classic Pancakes",
  "ingredients": [
    "1 1/2 cups all-purpose flour",
    "3 1/2 tsp baking powder",
    "1 tbsp sugar",
    "1 1/4 cups milk",
    "1 egg",
    "3 tbsp butter, melted"
  ],
  "instructions": "Whisk dry, add wet, mix until combined. Cook on griddle until golden.",
  "createdAt": "2025-01-01T12:00:00.000Z",
  "updatedAt": "2025-01-01T12:00:00.000Z"
}
```

Error Response (example)
```json
{
  "message": "Validation failed: title is required"
}
```

## Testing 🧪

- Run the test suite:
```bash
npm test
```
- Recommended: use `jest` and `supertest` for unit/integration tests of controllers and routes.
