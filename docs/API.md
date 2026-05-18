# GigFlow API Documentation

Base URL: `/api`

All protected endpoints require:

```http
Authorization: Bearer <jwt-token>
```

## Response Format

Success:

```json
{
  "success": true,
  "message": "Operation completed",
  "data": {}
}
```

Error:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email address"
    }
  ]
}
```

## Auth

### Register

`POST /auth/register`

```json
{
  "name": "Asha Sharma",
  "email": "asha@example.com",
  "password": "Password@123",
  "role": "sales"
}
```

Roles: `admin`, `sales`

### Login

`POST /auth/login`

```json
{
  "email": "admin@gigflow.test",
  "password": "Admin@12345"
}
```

### Current User

`GET /auth/me`

## Leads

Lead statuses: `New`, `Contacted`, `Qualified`, `Lost`  
Lead sources: `Website`, `Instagram`, `Referral`

### List Leads

`GET /leads?page=1&status=Qualified&source=Instagram&search=rahul&sort=latest`

Pagination is always backend-driven with `limit: 10`.

```json
{
  "success": true,
  "data": {
    "items": [],
    "pagination": {
      "page": 1,
      "limit": 10,
      "total": 0,
      "totalPages": 0,
      "hasNextPage": false,
      "hasPreviousPage": false
    }
  }
}
```

### Create Lead

`POST /leads`

```json
{
  "name": "Rahul Verma",
  "email": "rahul@example.com",
  "status": "New",
  "source": "Instagram"
}
```

### Get Lead Details

`GET /leads/:id`

### Update Lead

`PATCH /leads/:id`

```json
{
  "status": "Qualified",
  "source": "Referral"
}
```

### Delete Lead

`DELETE /leads/:id`

### Export CSV

`GET /leads/export/csv?status=Qualified&source=Instagram&search=rahul&sort=latest`

Exports the currently filtered result set as `gigflow-leads.csv`.
