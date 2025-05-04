# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.


## CLI setup
```bash
npx create-expo-app ./
npx expo install expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar
```

### Native Wind
For step-by-step insructions:
- [Step-by-step instructions](https://www.nativewind.dev/getting-started/react-native#7-typescript-optional)


```bash
npm install nativewind tailwindcss react-native-reanimated react-native-safe-area-context
npx tailwindcss init

npm install --save-dev @babel/core @babel/cli @babel/preset-env
npm install --save-dev @babel/preset-react
```

### AppWrite
This project uses Appwrite for database management and API services
- [AppWrite documents](https://github.com/appwrite/sdk-for-react-native)

```bash
npx expo install react-native-appwrite react-native-url-polyfill
```

```javascript
import { Client } from 'react-native-appwrite';
// Init your React Native SDK
const client = new Client();

client
    .setEndpoint('http://localhost/v1') // Your Appwrite Endpoint
    .setProject('455x34dfkj') // Your project ID
    .setPlatform('com.example.myappwriteapp') // Your application ID or bundle ID.
;
```

### ReactNative Animatable
Expo-av allows you to play audio/video
```bash
npm install react-native-animatable expo-av
```

### System Upload image/videos
Choosing videos/images to upload from your mobile device

[Document picker](https://docs.expo.dev/versions/latest/sdk/document-picker/)
```bash
npm install expo-document-picker
```

[Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
```bash
npm install expo-image-picker
```


### AI APIS
API to check confirm the picture being uploaded is a dog
[Replicate - Llava13b] (https://replicate.com/docs/guides/llava#run-llava-with-javascript)

API to cartoonize a given image
[Replicate - catacolabs/cartoonify] (https://replicate.com/catacolabs/cartoonify/api)

```bash
npm install replicate
```


### Modal
Used native expo modals
[Expo Modal Docs] (https://docs.expo.dev/router/advanced/modals/)

