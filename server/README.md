# CubPro - Server Side

This is the server-side of **CubPro**, a club management system built with Node.js, Express, and MySQL. The server handles user authentication, club management, event management, and more.

## Tech Stack
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express](https://expressjs.com/)
- **Database**: [MySQL](https://www.mysql.com/)
- **Authentication**: JWT (JSON Web Tokens)
- **CORS**: [cors](https://www.npmjs.com/package/cors)

## Features
- **User Authentication**: Registration and login using JWT.
- **Club Management**: Create, read, update, and delete clubs.
- **Event Management**: Create and manage events for clubs.
- **Discussion Forum**: Create and moderate discussions.
- **Resource Management**: Upload and share resources with members.
- **Reporting and Analytics**: Generate reports on user engagement and activities.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/proto-codes/clubpro.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd server
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Set up the database**:
   - Create a MySQL database named `clubpro_db`.
   - Import the SQL schema from the provided SQL file (if available) or run the command:
   ```bash
   npm run migrate
   ```

5. **Environment variables**:
   - Create a `.env` file in the root of the project.
   - Add the following lines to configure your database and JWT secret:
     ```bash
     DB_HOST=localhost
     DB_USER=your_db_user
     DB_PASSWORD=your_db_password
     DB_NAME=clubpro_db
     JWT_SECRET=your_jwt_secret

     PORT=5000
     ```

## Running the Server

1. **Start the server**:

   ```bash
   npm run server
   ```

2. **API Endpoints**:
   - Authentication: `/public/login`, `/public/register`
   - Clubs: `/api/clubs`
   - Events: `/api/events`

## Testing

You can test the API endpoints using tools like [Postman](https://www.postman.com/) or [cURL](https://curl.se/).

## Structure

   server/
   ├── config/
   │   └── db.js
   ├── controllers/
   ├── middleware/
   ├── routes/
   ├── server.js
   ├── package.json
   ├── .env
   └── ...

## License

This project is licensed under the MIT License.
