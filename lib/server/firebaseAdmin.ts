import { App, applicationDefault, cert, getApp, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

type ServiceAccount = {
  project_id?: string;
  client_email?: string;
  private_key?: string;
};

function normalizePrivateKey(value: string) {
  return value.replace(/\\n/g, '\n');
}

function buildCertFromJson(raw: string) {
  // Strip surrounding single or double quotes (dotenv may leave them in some environments)
  const cleaned = raw.trim().replace(/^['"]|['"]$/g, '');
  const parsed = JSON.parse(cleaned) as ServiceAccount;
  if (!parsed.client_email || !parsed.private_key) {
    throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_KEY: missing client_email/private_key');
  }

  return cert({
    projectId: parsed.project_id,
    clientEmail: parsed.client_email,
    privateKey: normalizePrivateKey(parsed.private_key),
  });
}

function buildCertFromEnv() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;

  if (!projectId || !clientEmail || !privateKey) {
    return null;
  }

  return cert({
    projectId,
    clientEmail,
    privateKey: normalizePrivateKey(privateKey),
  });
}

function resolveCredential() {
  const serviceAccountJson = process.env.FIREBASE_SERVICE_ACCOUNT_KEY;
  if (serviceAccountJson) {
    return buildCertFromJson(serviceAccountJson);
  }

  const certFromEnv = buildCertFromEnv();
  if (certFromEnv) {
    return certFromEnv;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
    return applicationDefault();
  }

  throw new Error(
    'Firebase Admin credentials are missing. Set FIREBASE_SERVICE_ACCOUNT_KEY or FIREBASE_PROJECT_ID/FIREBASE_CLIENT_EMAIL/FIREBASE_PRIVATE_KEY in .env.local.',
  );
}

let adminApp: App | null = null;

function getAdminApp() {
  if (adminApp) {
    return adminApp;
  }

  adminApp = getApps().length
    ? getApp()
    : initializeApp({
        credential: resolveCredential(),
        projectId: process.env.FIREBASE_PROJECT_ID ?? 'amda-cf25f',
      });

  return adminApp;
}

export function getAdminAuth() {
  return getAuth(getAdminApp());
}

export function getAdminDb() {
  return getFirestore(getAdminApp());
}
