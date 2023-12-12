# Notes React Native App

A mobile application for managing and organizing notes. This React Native app allows users to create, edit, and delete notes, as well as attach images and audio recordings.

## Built With

* [React Native](https://reactnative.dev/)

## Features

- **Create Notes**: Easily create new notes with a title and content
- **Edit and Delete**: Modify existing notes or delete them when necessary
- **Image Attachments**: Attach images to your notes
- **Audio Recordings**: Record and attach audio to your notes

## Installation

Follow these steps to set up the Notes React Native app on your local machine.

### Prerequisites

- Node.js and npm installed

### Clone Repository

```
git clone https://github.com/bgx160/notes-react-native.git
cd notes-react-native
```

### Install NPM packages

```
npm install
```

### Set up your Firebase

Set up authentication

Get the firebase config

Add `firebase.js` to root of your project

Add your firebase configs and initialize the app. For example:

```
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOU_AUTH_DOMAIN",
  databaseURL: "YOUR_DATABASE_URL",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);


export {app, auth};
```

### Start the app

```
npx expo start
```

Open in Expo Go app by scanning the QR-code with your mobile device.
