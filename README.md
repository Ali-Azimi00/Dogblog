# DogBlog
A place to generate and share AI image tranformations of your best-friend 🐶

## Features
- Image upload
- Automatic AI image tranformations
- Video Uploads
- Bookmark your favorite photos
- Follow your friends or favorite dogos

## Tech Stack
- React Native
- Native Wind
- TailWind
- Expo
- Appwrite
- Replicate

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

### System Upload/Download of image/videos
Explore your files and choose videos/images to upload from your mobile device

[Document picker](https://docs.expo.dev/versions/latest/sdk/document-picker/)
```bash
npm install expo-document-picker
```

[Image Picker](https://docs.expo.dev/versions/latest/sdk/imagepicker/)
```bash
npm install expo-image-picker
```

[Expo-file-system](https://docs.expo.dev/versions/latest/sdk/filesystem/)
```bash
npx expo install expo-file-system
```

[Expo-media-library](https://docs.expo.dev/versions/latest/sdk/media-library/)
```bash
npx expo install expo-media-library
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

