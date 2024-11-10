# Hostel Buddy Backend

Hostel Buddy is a comprehensive hostel management system designed to streamline common processes in a hostel environment. The backend of this project is developed using Node.js, Express.js, and MongoDB. It provides RESTful APIs for user management, complaint handling, notifications, and much more.

## Project Overview
Hostel Buddy is an API-first backend designed to help hostel admins and users streamline their daily activities. It provides users the ability to file complaints, track them, receive notifications, and admins can manage these processes efficiently.

## Features
- **User Management:** Register, Login, Update, and Delete user details.
- **Admin Management:** Register, Login, Manage user complaints, Admin notifications.
- **Complaint Management:** Create, update, view, and delete complaints. Track complaint history.
- **OTP Verification:** Verify complaint resolutions.
- **Notifications:** Receive user and admin notifications on different events.
- **Analytics:** Analyze common complaints and recurring issues with the help of Gemini API.
- **Announcements:** Admins can create, update, delete, and view announcements.
- **Chat API:** Integrated chat functionality using the Gemini language model.

## Technologies Used
- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web framework for Node.js.
- **MongoDB**: NoSQL database for data persistence.
- **Mongoose**: MongoDB ODM for easier data modeling.
- **JSON Web Token (JWT)**: Authentication.
- **Ngrok**: Secure tunneling to localhost for testing.
- **Render**: Deployment of the backend service.
- **Axios**: Making HTTP requests to external APIs.

## Getting Started
### Prerequisites
- Node.js installed
- MongoDB installed or a MongoDB Atlas instance

### Installation
1. **Clone the Repository**
   ```bash
   git clone https://github.com/ishan0224/Hostel-Buddy.git
   cd Hostel-Buddy/backend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Environment Variables**
   Create a `.env` file in the root directory and add the following:
   ```env
   PORT=5000
   DB_URL=mongodb://localhost:27017/hostel_buddy
   JWT_SECRET=your_jwt_secret
   GEMINI_API_KEY=your_gemini_api_key
   EMAIL_HOST=smtp.example.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@example.com
   EMAIL_PASS=your_email_password
   ```

### Running the Server
```bash
npm start
```
The server will start on `http://localhost:5000`.

## API Endpoints
### User Routes
- **Register User**: `POST /api/user/register`
  - **Body**: `{ username, email, password, phoneNumber, roomNumber, hostelBlock }`
- **Login User**: `POST /api/user/login`
  - **Body**: `{ email, password }`
- **Get User by ID**: `GET /api/user/:id`
- **Update User**: `PUT /api/user/:id`
- **Delete User**: `DELETE /api/user/:id`

### Admin Routes
- **Register Admin**: `POST /api/admin/register`
  - **Body**: `{ username, email, password, role }`
- **Login Admin**: `POST /api/admin/login`
  - **Body**: `{ email, password }`
- **Get Admin by ID**: `GET /api/admin/:id`
- **Get Notifications**: `GET /api/admin/:adminId/notifications`
- **Mark Notification as Read**: `PUT /api/admin/notifications/:notificationId/read`

### Complaint Routes
- **Create Complaint**: `POST /api/complaint/create`
  - **Body**: `{ user, category, description }`
- **Get All Complaints**: `GET /api/complaint`
- **Get Complaint by ID**: `GET /api/complaint/:id`
- **Update Complaint Status**: `PUT /api/complaint/:id`
- **Delete Complaint**: `DELETE /api/complaint/:id`
- **Get User Complaint History**: `GET /api/complaint/user/:userId/history`
- **Generate Analytics**: `GET /api/complaint/gemini-analytics`

### Feedback Routes
- **Submit Feedback**: `POST /api/feedback`
  - **Body**: `{ user, complaint, rating, comments }`
- **Get Feedback by Complaint**: `GET /api/feedback/complaint/:complaintId`
- **Get Feedback by User**: `GET /api/feedback/user/:userId`

### OTP Routes
- **Generate OTP**: `POST /api/otp/generate`
  - **Body**: `{ userId, issueId }`
- **Verify OTP**: `POST /api/otp/verify`
  - **Body**: `{ otpId, userId, issueId, enteredOtp }`

### Chat Routes
- **Chat with Gemini**: `POST /api/chat`
  - **Body**: `{ message }`

### Announcement Routes
- **Create Announcement**: `POST /api/announcement`
  - **Body**: `{ title, content }`
- **Get All Announcements**: `GET /api/announcement`
- **Update Announcement**: `PUT /api/announcement/:id`
- **Delete Announcement**: `DELETE /api/announcement/:id`

## Deployment
The backend is deployed using Render. You can access the live service by visiting your Render app URL.
Ensure that all environment variables are correctly set in Render to make the services functional.

## Contributing
If you wish to contribute, feel free to fork the repository and submit a pull request. Contributions are always welcome, whether they are bug fixes, improvements, or adding new features.


