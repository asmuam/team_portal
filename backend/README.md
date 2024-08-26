npm i
npx prisma generate
npx prisma migrate dev --name init

# API Documentation
## Overview
This API provides endpoints to manage teams, activities, sub-activities, and tasks. It allows you to perform CRUD (Create, Read, Update, Delete) operations and other actions on these entities.

## Base URL
```
http://<your-server-address>/api
```

## Endpoints
### Teams
#### Get All Teams
- **Endpoint:** `GET /teams`
- **- **Description:**** Fetch all teams with their related activities, sub-activities, and tasks.

Response:
  ```json
  [
    {
      "id": 1,
      "name": "Team Name",
      "activities": [
        {
          "id": 1,
          "name": "Activity Name",
          "tanggal_pelaksanaan": "2024-08-26T03:49:57.116Z",
          "subActivities": [
            {
              "id": 1,
              "name": "Sub-Activity Name",
              "tasks": [
                {
                  "id": 1,
                  "name": "Task Name",
                  "dateCreated": "2024-08-26",
                  "dueDate": "2024-11-11",
                  "dateUpload": "",
                  "link": "#",
                  "completed": true
                }
              ]
            }
          ]
        }
      ],
      "links": []
    }
  ]
  ```
#### Add a Team
- **Endpoint:** `POST /teams`
- **- **Description:**** Create a new team.

Request Body:
```json
{
  "name": "New Team Name"
}
```

Response:
```json
{
  "id": 2,
  "name": "New Team Name",
  "links": null,
  "leader_id": null
}
```
#### Update a Team
- **Endpoint:** `PUT /teams/:id`
- **- **Description:**** Update an existing team.
- **Request Body:**
```json
{
  "name": "Updated Team Name"
}
```
Response:
```json
{
  "id": 2,
  "name": "Updated Team Name",
  "links": null,
  "leader_id": null
}
```
#### Delete a Team
- **Endpoint:** `DELETE /teams/:id`
- **Description:** Delete a team.
Response:
```json
{
  "id": 2,
  "name": "Deleted Team Name",
  "links": null,
  "leader_id": null
}
```
### Activities
#### Get Activities by Team ID
- **Endpoint:** `GET /teams/:teamId/activities`
- **Description:** Fetch all activities for a specific team.
Response:
```json
[
  {
    "id": 1,
    "tanggal_pelaksanaan": "2024-08-26T03:49:57.116Z",
    "timkerja_id": 1,
    "name": "Activity Name"
  }
]
```
#### Add an Activity
- **Endpoint:** `POST /teams/:teamId/activities`
- **Description:** Add a new activity to a specific team.
Request Body:
```json
{
  "name": "New Activity Name"
}
```
Response:
```json
{
  "id": 2,
  "tanggal_pelaksanaan": "2024-08-26T03:49:57.116Z",
  "timkerja_id": 1,
  "name": "New Activity Name"
}
```
#### Add an Activity with Date
- **Endpoint:** `POST /teams/:teamId/activities/v2`
- **Description:** Add a new activity with a specified date.
Request Body:
```json
{
  "name": "New Activity Name",
  "tanggal_pelaksanaan": "2024-08-09"
}
```
Response:
```json
{
  "id": 2,
  "tanggal_pelaksanaan": "2024-08-09T00:00:00.000Z",
  "timkerja_id": 1,
  "name": "New Activity Name"
}
```
#### Rename an Activity
- **Endpoint:** `PATCH /teams/:teamId/activities/:activityId`
- **Description:** Rename an existing activity.
Request Body:
```json
{
  "name": "Updated Activity Name"
}
```
Response:
```json
{
  "id": 2,
  "tanggal_pelaksanaan": "2024-08-26T03:49:57.116Z",
  "timkerja_id": 1,
  "name": "Updated Activity Name"
}
```
#### Delete an Activity
- **Endpoint:** `DELETE /teams/:teamId/activities/:activityId`
- **Description:** Delete an activity.
Response:
```json
{
  "id": 2,
  "tanggal_pelaksanaan": "2024-08-26T03:49:57.116Z",
  "timkerja_id": 1,
  "name": "Deleted Activity Name"
}
```
### Sub-Activities
#### Get Sub-Activities by Activity ID
- **Endpoint:** `GET /teams/:teamId/activities/:activityId/sub-activities`
- **Description:** Fetch all sub-activities for a specific activity.
Response:
```json
[
  {
    "id": 2,
    "tanggal_pelaksanaan": "2024-08-26T05:04:32.718Z",
    "kegiatan_id": 1,
    "name": "Sub-Activity Name"
  }
]
```
#### Add a Sub-Activity
- **Endpoint:** `POST /teams/:teamId/activities/:activityId/sub-activities`
- **Description:** Add a new sub-activity to a specific activity.
Request Body:
```json
{
  "name": "New Sub-Activity Name"
}
```
Response:
```json
{
  "id": 2,
  "tanggal_pelaksanaan": "2024-08-26T05:04:32.718Z",
  "kegiatan_id": 1,
  "name": "New Sub-Activity Name"
}
```
#### Rename a Sub-Activity
- **Endpoint:** `PATCH /teams/:teamId/activities/:activityId/sub-activities/:subActivityId`
- **Description:** Rename an existing sub-activity.
Request Body:
```json
{
  "name": "Updated Sub-Activity Name"
}
```
Response:
```json
{
  "id": 2,
  "tanggal_pelaksanaan": "2024-08-26T05:04:32.718Z",
  "kegiatan_id": 1,
  "name": "Updated Sub-Activity Name"
}
```
#### Delete a Sub-Activity
- **Endpoint:** `DELETE /teams/:teamId/activities/:activityId/sub-activities/:subActivityId`
- **Description:** Delete a sub-activity.
Response:
```json
{
  "id": 2,
  "tanggal_pelaksanaan": "2024-08-26T05:04:32.718Z",
  "kegiatan_id": 1,
  "name": "Deleted Sub-Activity Name"
}
```
### Tasks
#### Get All Tasks for a Specific Sub-Activity
- **Endpoint:** `GET /teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks`
- **Description:** Fetch all tasks for a specific sub-activity.
Response:
```json
[
  {
    "id": 1,
    "subkegiatan_id": 2,
    "name": "Task Name",
    "dateCreated": "2024-08-26T05:12:22.357Z",
    "dueDate": "2024-09-01T00:00:00.000Z",
    "dateUpload": null,
    "link": "",
    "completed": false
  }
]
```
#### Add a Task
- **Endpoint:** `POST /teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks`
- **Description:** Add a new task to a specific sub-activity.
Request Body:
```json
{
  "name": "New Task Name",
  "dueDate": "2024-09-01",
  "dateCreated": "2024-08-26",
  "link": ""
}
```
Response:
```json
{
  "id": 3,
  "subkegiatan_id": 2,
  "name": "New Task Name",
  "dateCreated": "2024-08-26T05:12:22.357Z",
  "dueDate": "2024-09-01T00:00:00.000Z",
  "dateUpload": null,
  "link": "",
  "completed": false
}
```
#### Update a Task
- **Endpoint:** `PATCH /teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId`
- **Description:** Update an existing task.
Request Body:
```json
{
  "name": "Updated Task Name",
  "dueDate": "2024-09-15"
}
```
Response:
```json
{
  "id": 1,
  "subkegiatan_id": 2,
  "name": "Updated Task Name",
  "dateCreated": "2024-08-26T05:12:22.357Z",
  "dueDate": "2024-09-15T00:00:00.000Z",
  "dateUpload": null,
  "link": "",
  "completed": false
}
```
#### Delete a Task
- **Endpoint:** `DELETE /teams/:teamId/activities/:activityId/sub-activities/:subActivityId/tasks/:taskId`
- **Description:** Delete a task.
Response:
```json
{
  "id": 1,
  "subkegiatan_id": 2,
  "name": "Deleted Task Name",
  "dateCreated": "2024-08-26T05:12:22.357Z",
  "dueDate": "2024-09-01T00:00:00.000Z",
  "dateUpload": null,
  "link": "",
  "completed": false
}
```
### Links
#### Get all links from a team
- **Endpoint:** `GET /teams/:teamId/links`
- **Description:** Retrieve all links associated with a specific team.

Response:
```json
{
  "links": [
    {
      "id": "id",
      "url": "newURL 1",
      "description": "URL Description"
    },
    {
      "id": "id",
      "url": "newURL 2",
      "description": "URL Description"
    }
  ]
}
```

#### Add link from a team
- **Endpoint:** `POST /teams/:teamId/links`
- **Description:** Add a new link to a specific team.

Request Body:
```json
{
  "url": "newURL",
  "description": "URL Description"
}
```
Response:
```json
{
  "id": 3,
  "name": "Team Name",
  "links": [
    {
      "id": "id",
      "url": "newURL 1",
      "description": "URL Description 1"
    },
    {
      "id": "id",
      "url": "newURL 2",
      "description": "URL Description 2"
    }
  ],
  "leader_id": null
}
```
#### Delete a Link from a Team
- **Endpoint:** `DELETE /teams/:teamId/links/:linkId`
- **Description:**Remove a specific link from a team.

Response:
```json
{
  "id": 3,
  "name": "Team Name",
  "links": [
    {
      "id": "id",
      "url": "newURL",
      "description": "URL Description"
    }
  ],
  "leader_id": null
}

```
#### Edit a Link in a Team
- **Endpoint:** `PATCH /teams/:teamId/links/:linkId`
- **Description:**Update an existing link in a team.

Request Body:
```json
{
  "url": "newURL",
  "description": "newDescription"
}
```
Response:
```json
{
  "id": 3,
  "name": "Team Name",
  "links": [
    {
      "id": "id",
      "url": "newURL",
      "description": "newDescription"
    }
  ],
  "leader_id": null
}

```

## Error Handling
All endpoints return appropriate HTTP status codes and error messages. Common error codes include:

#### 400 Bad Request: Invalid request data.
#### 404 Not Found: Resource not found.
#### 500 Internal Server Error: Server-side error.
## Authentication
Some endpoints might require authentication. Make sure to include an authorization token in the request headers.