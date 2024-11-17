# Cliqly - Simple CRM & Campaign Management Application

Cliqly is a powerful yet simple Customer Relationship Management (CRM) and Campaign Management application built using Node.js, Express, and MongoDB. The application enables businesses to efficiently manage customer interactions, track requests, create targeted campaigns, and engage with their audience effectively. It features secure Google authentication, dynamic dashboards, and robust notification and segmentation tools.

## Features

### **Google Authentication**
- Secure login with Google accounts.
- Eliminates the need for manual account creation.

### **Dashboard**
- A centralized hub to view and manage all customer requests.
- Displays detailed information, such as request ID, type, name, tag, owner, deadline, status, and action buttons (edit/delete).

### **Request Management**
- Create, edit, and delete customer requests seamlessly.
- Add details such as request type, tag, owner, deadline, and status.
- Actionable dashboard for quick updates.

### **Search Functionality**
- Case-insensitive search bar on the dashboard to filter requests dynamically as users type.
- Find specific requests based on any matching attribute.

### **Notifications**
- Get notified when you are assigned as the owner of a new request.
- Notifications include the request's type and name.
- Track unread notifications on a dedicated page.

### **Audience Segmentation**
- Create audience segments based on customer data:
  - Total spending greater than a specified amount.
  - Number of visits within a specific range.
  - Inactivity for a certain number of days.
- Dynamically calculate and display the size of each segment.

### **Campaign Management**
- Design and send personalized campaigns to specific audience segments.
- Use a message template, such as "Hi [Name], here's 10% off on your next order!"
- Track campaign history with details like audience size, sent messages, failed deliveries, and message templates.

## How to Use
**Installation**: Clone the repository and run npm install to install the required dependencies.

**Environment Variables**: Create a .env file and set the following environment variables:

MONGODB_URI=your_mongodb_uri  
GOOGLE_CLIENT_ID=your_google_client_id  
GOOGLE_CLIENT_SECRET=your_google_client_secret  
SESSION_SECRET=your_session_secret  
PORT=3000  

**Run the Application**: Start the server by running npm start. The application will be accessible at http://localhost:3000.

## Future Enhancements
Real-time notifications via WebSockets.
Advanced analytics for campaign performance.
Integration with external email and SMS gateways.
Role-based access control for team collaboration.

Cliqly is your go-to solution for managing customer relationships and launching impactful campaigns, all from a simple yet robust interface. 🚀