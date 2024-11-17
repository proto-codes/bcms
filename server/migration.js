require('dotenv').config();
const mysql = require('mysql2');

// Create a MySQL connection using environment variables
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    return console.error('Error connecting to the database: ' + err.stack);
  }
  console.log('Connected to MySQL');

  // Function to run migration queries
  const runMigration = (query, description) => {
    connection.query(query, (err, results) => {
      if (err) {
        console.error(`Error creating ${description}:`, err);
      } else {
        console.log(`${description} created or already exists.`);
      }
    });
  };

  // SQL query to create the users table if it doesn't exist
  const createUsersTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      email_notifications BOOLEAN DEFAULT TRUE,
      sms_notifications BOOLEAN DEFAULT FALSE,
      confirmed TINYINT(1) DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  // SQL query to create the active_tokens table if it doesn't exist
  const createActiveTokensTableQuery = `
    CREATE TABLE IF NOT EXISTS active_tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      token VARCHAR(255) NOT NULL,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  // SQL query to create the profile table if it doesn't exist
  const createProfileTableQuery = `
    CREATE TABLE IF NOT EXISTS profile (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      bio TEXT,
      profile_pics MEDIUMBLOB;
      phone_number VARCHAR(20),
      birthday DATE,
      address VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  // SQL query to create the messages table if it doesn't exist
  const createMessagesTableQuery = `
    CREATE TABLE IF NOT EXISTS messages (
      id INT AUTO_INCREMENT PRIMARY KEY,
      sender_id INT NOT NULL,
      receiver_id INT NOT NULL,
      message TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      read_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      deleted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_read BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (sender_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (receiver_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  // SQL query to create the tasks table if it doesn't exist
  const createTasksTableQuery = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      due_date DATE NOT NULL,
      priority ENUM('High', 'Medium', 'Low') DEFAULT 'Medium',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  // SQL query to create the password_resets table if it doesn't exist
  const createPasswordResetsTableQuery = `
    CREATE TABLE IF NOT EXISTS password_resets (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      reset_token VARCHAR(64) NOT NULL,
      expires_at DATETIME NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  
  // SQL query to create the verification_tokens table if it doesn't exist
  const createVerificationTokensTableQuery = `
    CREATE TABLE IF NOT EXISTS verification_tokens (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL UNIQUE,
      token VARCHAR(64) NOT NULL,
      expires_at DATETIME NOT NULL,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;
  
  // SQL query to create the notifications table if it doesn't exist
  const createNotificationsTableQuery = `
    CREATE TABLE IF NOT EXISTS notifications (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      message VARCHAR(255) NOT NULL,
      type VARCHAR(50) DEFAULT 'general',
      date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      is_read BOOLEAN DEFAULT FALSE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `;

  // SQL query to create the clubs table if it doesn't exist
  const createClubsTableQuery = `
    CREATE TABLE IF NOT EXISTS clubs (
      id INT AUTO_INCREMENT PRIMARY KEY,
      img MEDIUMBLOB;
      name VARCHAR(255) NOT NULL,
      description TEXT,
      goals TEXT,
      membership_criteria TEXT,
      is_private BOOLEAN DEFAULT FALSE,
      created_by INT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );
  `;
  
  // SQL query to create the events table if it doesn't exist
  const createEventsTableQuery = `
    CREATE TABLE IF NOT EXISTS events (
      id INT AUTO_INCREMENT PRIMARY KEY,
      club_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT,
      date DATETIME NOT NULL,
      location VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE
    );
  `;

  // SQL query to create the clubMemberships table if it doesn't exist
  const createClubMembershipsTableQuery = `
    CREATE TABLE IF NOT EXISTS club_memberships (
      id INT AUTO_INCREMENT PRIMARY KEY,
      club_id INT NOT NULL,
      user_id INT NOT NULL,
      status ENUM('pending', 'approved') DEFAULT 'pending',
      role ENUM('member', 'club leader', 'admin') DEFAULT 'member',
      joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;
  
  // SQL query to create the rsvps table if it doesn't exist
  const createRSVPSTableQuery = `
    CREATE TABLE IF NOT EXISTS rsvps (
      id INT AUTO_INCREMENT PRIMARY KEY,
      event_id INT NOT NULL,
      user_id INT NOT NULL,
      rsvp_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
      FOREIGN KEY (user_id) REFERENCES users(id)
    );
  `;

  // SQL query to create the discussions table if it doesn't exist
  const createDiscussionsTableQuery = `
    CREATE TABLE IF NOT EXISTS discussions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      club_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      content TEXT,
      created_by INT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      FOREIGN KEY (club_id) REFERENCES clubs(id) ON DELETE CASCADE,
      FOREIGN KEY (created_by) REFERENCES users(id)
    );
  `;

  // Run migrations
  runMigration(createUsersTableQuery, 'Users table');
  runMigration(createActiveTokensTableQuery, 'Active tokens table');
  runMigration(createProfileTableQuery, 'Profile table');
  runMigration(createMessagesTableQuery, 'Messages table');
  runMigration(createTasksTableQuery, 'Tasks table');
  runMigration(createPasswordResetsTableQuery, 'Password resets table');
  runMigration(createVerificationTokensTableQuery, 'Verification tokens table');
  runMigration(createNotificationsTableQuery, 'Notifications table');
  runMigration(createClubsTableQuery, 'Clubs table');
  runMigration(createEventsTableQuery, 'Events table');
  runMigration(createClubMembershipsTableQuery, 'Club memberships table');
  runMigration(createRSVPSTableQuery, 'RSVPS table');
  runMigration(createDiscussionsTableQuery, 'Discussions table');

  // Close the connection after all migrations
  connection.end((err) => {
    if (err) {
      console.error('Error closing the connection:', err);
      return;
    }
    console.log('Connection closed');
  });
});
