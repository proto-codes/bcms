# ClubPro (Club Management System)

**ClubPro** is a comprehensive club management system that streamlines the process of managing clubs, events, discussions, and resources for admins, club leaders, and members. It provides user authentication, communication tools, and reporting capabilities to enhance engagement and collaboration within clubs.

## Tech Stack
- **Client**: React + Vite + Axios
- **Server**: Node.js + Express
- **Database**: MySQL

## Key Features

### 1. User Roles
- **Admin**
  - Manage users (members, leaders), events, discussions, and reports.
- **Club Leader**
  - Manage club activities, approve member requests, and communicate with members.
- **Member**
  - Join clubs, participate in discussions, RSVP for events, and access resources.

### 2. User Authentication
- **Login/Signup**: Email/password and social media integration.
- **Profile Setup**: Personalize profiles with information, interests, and club preferences.

### 3. Dashboards
- **Admin Dashboard**: Overview of clubs, members, and events with management tools.
- **Club Leader Dashboard**: Track club activities, events, and member engagement.
- **Member Dashboard**: Access joined clubs, events, and discussions.

### 4. Club Management
- **Create a Club**: Set club details, privacy settings, and membership criteria (Admin/Leader).
- **Join a Club**: Search and browse clubs to join (Member).
- **Club Overview**: View club details, members, events, and discussions.

### 5. Event Management
- **Create Events**: Organize events with title, date, location, RSVP options (Admin/Leader).
- **RSVP**: Members can RSVP to events and receive reminders.
- **Event Notifications**: Reminders and updates via email or app notifications.

### 6. Discussion Forum
- **Create Topics**: Start discussions (Admin/Leader).
- **Participate in Discussions**: Comment and engage in discussions (Member).
- **Moderation Tools**: Edit or remove content (Admin/Leader).

### 7. Resources and Materials
- **Upload Resources**: Share documents and materials (Admin/Leader).
- **Access Resources**: Members can browse and download resources.

### 8. Communication
- **Internal Messaging**: Private communication between members.
- **Announcements**: Admins/Leaders can post club-wide announcements.

### 9. Reporting and Analytics
- **Reports**: Admins can generate reports on member engagement and event participation.
- **Feedback Collection**: Gather feedback on events and activities.

### 10. Settings and Support
- **User Settings**: Update personal information, privacy, and notifications.
- **Support**: FAQs and contact support options for users.

### 11. Rights and Privileges
Manage roles and permissions for different users.

### 12. Dues and Payments
Facilitate the collection of dues and manage payments.

## Flow Diagram
A flowchart representing user roles and system features can visualize the user journey and interactions across the platform.

---

## Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/proto-codes/clubpro.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd clubpro
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

### Conclusion
"ClubPro" ensures seamless club management with diverse features for admins, leaders, and members, making club engagement efficient and engaging. Built with modern web technologies, it provides a powerful, responsive system for clubs of all sizes.
"""

## License

This project is licensed under the MIT License.
