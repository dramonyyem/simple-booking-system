# installation pakage

npx create-next-app@latest project-name

npm install jsonwebtoken
npm install byscryptjs
npm install jose
npm install mongoose
npm install nodemailer

# Environment variable configuration

MONGODB_URI=mongodb+srv://yemdaramony_db_user:xHpFdOwCKEncmI96@cluster0.19e9yoq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_TOKEN=c3c3ca78a5d9d66ff6bec49e38718dbe
MAILTRAP_USER=e7937a4f666aea
MAILTRAP_PASS=7fee49956fe91f

# API END POINT LIST 

method : POST - API: /api/auth/login
method : POST - API: /api/auth/logout
method : GET - API: /api/auth/profile
method : PATCH - API: /api/auth/profile
method : POST - API: /api/auth/signup
method : POST - API: /api/auth/reset-token

method: GET - API: /api/booking_histories
method: GET - API: /api/bookings
method: GET - API: /api/bookings/[id]
method: POST - API: /api/bookings
method: DELETE - API: /api/bookings

method: POST - API: /api/check_available
method: GET - API: /api/users
method: GET - API: /api/users/[id]

# Admin User for login

username: daramony
password: Mony2001