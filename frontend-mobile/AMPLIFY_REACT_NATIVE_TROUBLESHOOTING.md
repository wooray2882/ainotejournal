# Amplify React Native Troubleshooting Guide

## 1. Install Required Dependencies

```sh
npm install --legacy-peer-deps @aws-amplify/react-native aws-amplify @react-native-community/netinfo @react-native-async-storage/async-storage react-native-get-random-values
```

- For iOS:
  ```sh
  npx pod-install
  ```

## 2. Common Errors & Fixes

### a. Missing `@aws-amplify/react-native`
**Error:**
```
Unable to resolve module @aws-amplify/react-native ...
```
**Fix:** Install all required dependencies as above.

---

### b. NPM Dependency Conflict (ERESOLVE)
**Error:**
```
npm error code ERESOLVE
npm error ERESOLVE could not resolve
...
```
**Fix:**
```sh
npm install --legacy-peer-deps
```
Or, if that fails:
```sh
npm install --force
```

---

### c. Asset Not Found
**Error:**
```
Unable to resolve asset "./assets/images/icon.png" from "icon" in your app.json or app.config.js
```
**Fix:**
- Ensure the file exists at the specified path.
- Update `app.json` to point to a valid image file.

---

### d. runtimeVersion Policy Error
**Error:**
```
You're currently using the bare workflow, where runtime version policies are not supported. You must set your runtime version manually.
```
**Fix:**
In `app.json`:
```json
"runtimeVersion": "1.0.0"
```

---

### e. Auth is undefined
**Error:**
```
[AuthService] getCurrentUser error: [TypeError: Cannot read property 'currentAuthenticatedUser' of undefined]
[AuthService] signUp error: [TypeError: Cannot read property 'signUp' of undefined]
```
**Fix:**
- Ensure you import and configure Amplify correctly:
  ```js
  import { Amplify } from 'aws-amplify';
  import awsconfig from './src/amplifyconfiguration.json';
  Amplify.configure(awsconfig);
  ```
- Import Auth from `aws-amplify`:
  ```js
  import { Auth } from 'aws-amplify';
  ```
- Call `Amplify.configure` before using `Auth`.

---

## 3. General Steps After Fixes

- Clear Expo/Metro cache:
  ```sh
  npx expo start -c
  ```
- Rebuild and run your app:
  ```sh
  npx expo run:ios   # or npx expo run:android
  ```

---

**Keep this file handy for quick reference when working with Amplify and React Native!** 