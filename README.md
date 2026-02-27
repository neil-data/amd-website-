# SkillRank AI

**Performance-Verified. Integrity-Protected.**

SkillRank AI is a high-performance frontend for professional skill ranking, built with Next.js 14 and advanced animation libraries.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: TailwindCSS
- **Animation**: Framer Motion
- **3D**: React Three Fiber, @react-three/drei
- **Charts**: Recharts

## Project Structure

- `app/`: Next.js App Router (pages and layouts)
- `components/`: Modular UI components
- `lib/`: Utility functions (e.g., custom `cn` helper)
- `hooks/`: Custom React hooks
- `context/`: Application context

## Design System

- **Colors**: Strict Black & White (Grayscale)
- **Fonts**: Space Grotesk (Headings), Inter (Body)
- **Features**: Lazy loading, mobile-first responsiveness

## Setup

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to view the application.

## Firebase Admin Credentials (Required for API routes)

The backend API routes use `firebase-admin` and require server credentials.

Create a `.env.local` file with **one** of these options:

### Option A: Full service account JSON (recommended)

```env
FIREBASE_SERVICE_ACCOUNT_KEY={"type":"service_account","project_id":"...","private_key":"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n","client_email":"..."}
FIREBASE_PROJECT_ID=amda-cf25f
```

### Option B: Split environment variables

```env
FIREBASE_PROJECT_ID=amda-cf25f
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

If you use Google Application Default Credentials instead, set:

```env
GOOGLE_APPLICATION_CREDENTIALS=/absolute/path/to/service-account.json
```
