# FileVault App

FileVault is a secure file management application built with Node.js and Express.js. It allows users to register, login, upload files, and manage their uploaded files securely.

## Features

- User registration and authentication
- File uploading with unique 6-digit access codes
- File storage on the server
- View list of uploaded files
- Download files with correct access code
- Permanently delete files

## Prerequisites

- Node.js (v14 or higher)
- MongoDB | Mongoose
- Express.js
- Multer
- Passport.js | passport-local
- EJS View engine

## Usage

1. Start the server - npm start.
2. Open your web browser and navigate to http://localhost:8000.
3. Register a new user account or log in if you already have one.
4. Once logged in, you can upload files using the "Upload File" section in your profile.
5. Uploaded files will be listed in your profile. To download a file, enter the correct 6-digit access code.
6. To delete a file, click the "Delete" button next to the file.
   
## Folder Structure

- `assets`: Contains static assets like stylesheets and client-side scripts.
- `config`: Contains app configuration files.
- `controllers`: Defines the app's route controllers.
- `models`: Defines the data models (Mongoose schemas) for MongoDB.
- `routes`: Defines the app's express routes.
- `uploads`: The folder where uploaded files are stored.
- `views`: Contains EJS templates for rendering HTML views.
- `index.js`: The main entry point of the app.

## Credits

This app was created by Piyush jadhav as a demonstration of building file upload and data display functionality using Node.js, Express, and MongoDB.

## License

This project is licensed under the [MIT License](LICENSE).

