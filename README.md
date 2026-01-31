# Simple student health manager
This project is a simple student health manager application that allows users to track and manage the health records of students. It provides functionalities to add, update, view, and delete student health information.

## Development Setup
Setting up for development.
```
npm i
npm run dev
```

## Production Build
### Docker image & run
To build a Docker image for the application, use the following command:
```
docker build -t student-health-manager .
docker run -p 3000:3000 student-health-manager
```
### Local build & run
To build and run the application locally, use the following commands:
```
npm run build
npm start
```
