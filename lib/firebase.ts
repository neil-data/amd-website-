'use client';

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyDFdpSzVKCokMj2947QtRmF3Odnl9_4RaY',
  authDomain: 'amda-cf25f.firebaseapp.com',
  projectId: 'amda-cf25f',
  storageBucket: 'amda-cf25f.firebasestorage.app',
  messagingSenderId: '702996432262',
  appId: '1:702996432262:web:5e79cd16f472478aab1807',
  measurementId: 'G-D12LTWK3YL',
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
