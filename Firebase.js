import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";

const firebaseConfig = {
  apiKey: "AIzaSyAajNIMXu66yodaMm8BxTT36BNs_Tj72aY",
  authDomain: "ai-finance-analyzer-d6fda.firebaseapp.com",
  projectId: "ai-finance-analyzer-d6fda",
  storageBucket: "ai-finance-analyzer-d6fda.appspot.com",
  messagingSenderId: "523829536268",
  appId: "1:523829536268:web:e3b088cf5dd3a54b33f029",
};

const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export default app;
