# School Management API

A simple Node.js + Express + MySQL API to manage schools.

## Features

- Add new schools
- List schools sorted by proximity to user location

## Endpoints

### POST /addSchool


Add a new school with name, address, latitude and longitude.

**Example Request:** `POST http://localhost:3306/addSchool`

**Payload:**
```json
{
  "name": "ABC School",
  "address": "123 Main St",
  "latitude": 28.7041,
  "longitude": 77.1025
}
```

**Response:** `{"message": "School added successfully"}`

### GET /listSchools?lat=XXX&lng=XXX

List all the schools in a given radius of latitude and longitude.
The default radius is set to 10 km, but can be changed using query parameter `radius`.

**Query Parameters:**

`lat`: Latitude of the user's location (required)  
`lng`: Longitude of the user's location (required)

**Example Request:** `GET http://localhost:3306/listSchools?lat=28.7041&lng=77.1025`

** Response: **
```json
[
    {
        "id": 1,
        "name": "ABC School",
        "address": "123 Main St",
        "latitude": 28.7041,
        "longitude": 77.1025,
		"distance_km": 9.8765
    },
    ...
]
```

# Technologies Used
- Node.js
- Express.js
- MySQL

# Installation
Clone this repository and run `npm install` to install dependencies. Then create a `.env` file with your database credentials:
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=school_management_api
```
Finally, start the server with `node app.js`. The API will be available at `http://localhost:3306`.


