# Facebook-like app

## Purpose
Creation of a Facebook like application was the goal, with registering, logging in, posting, following. Users visiting the first time has to register in order to use the functionalities of the application. Already registered users can log into the app. 

## Functionalities

### Registration
First time visitors must register in order to use all the functionalities of the app. THe registration will craete a user object in a mongoDB database with user_id, username, email address and (hashed) password. No email confirmation is required for the registration.

### Checking username, email and password values
During the registration the app check if the username the user typed in is between 3 and 30 characters, only contains letters and numbers and unique.

It check if the email address is a valid email address or not.

Furthermore, the app checks if the password is strong enough, by making sure it is at least 12 characters.

### Hashing passwords
In order to safe user passwords from hackers - who might breach into the database and access the data stored there - the application hashes the passwords and stores the hashed values in the database. During login the application compares the stored hashed value with the hashed value of the password input field the user typed in. If its matching the app lets the user in.

### Login
Users can log into the app to access further functionalities, if they are registered users already. The application will check the typed in username and passwords values during login if its matching something in the database. If it does then the app lets them in.

## Sessions
The application is using sessions in order to make logged in users kepp logged in, thus accessing all functionalities when they go to separate pages.

## Posting
Users can post, edit and delete content.

## Search function
Users can search all user generated content inside the application by searching for a string in the search bar.

## Chat function
Users who follow each other are able to chat inside the app.

## Following each other
User can follow and unfollow each other. Users who follow other users will see posts from those who they follow in their dashboard.

## Dynamic user profiles
By clicking on the profile picture or icon users can go to their user profile page. Here they can see all of their own posts, followers and other users who follow them. This is automatically refreshed by changes in these values.

## Stack used
- HTML
- EJS
- Bootstrap
- Javascript
- Node.js
- Express.js
- MongodDB
- Webpack
