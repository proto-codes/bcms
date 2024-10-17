# The Forum - Client Side

This is the client-side of **The Forum**, a club management system built with React, Vite, and Axios. The client allows users to interact with the platform, including registering, joining clubs, participating in events, discussions, and more.

## Tech Stack
- **Framework**: [React](https://reactjs.org/)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Styling**: Bootstrap 5, CSS

## Features
- **User Authentication**: Signup and login via email, with JWT-based authentication.
- **Club Management**: View, join, and manage clubs, including club details and discussions.
- **Event Management**: RSVP to club events, view event details.
- **Discussions**: Participate in club discussions, comment, and like posts.
- **Messaging**: Private messaging between users with real-time updates.
- **Responsive Design**: Optimized for mobile and desktop views.

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/proto-codes/the-forum.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd the-forum-client
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

4. **Run the development server**:

   ```bash
   npm run dev
   ```

5. **API**:
   - Navigate to src/api folder.
   - Add the following line to configure your API base URL:
     ```bash
     baseURL: 'http://localhost:5000/api'
     ```

## Usage

- After setting up and running the client, you can interact with the various features like user authentication, club and event management, and more.
- Ensure your server-side API is running as well to handle the data and requests.

## Building for Production

To create a production-ready build, run:

```bash
npm run build
```

The build will be located in the `dist` folder, which you can deploy to a static hosting service.

## License

This project is licensed under the MIT License.
