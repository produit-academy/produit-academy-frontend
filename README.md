# Produit Academy Frontend

This is the frontend application for Produit Academy, a GATE preparation platform. It is built with Next.js and wrapped with Capacitor for mobile deployment (Android).

## Tech Stack

- **Framework**: Next.js (React)
- **State Management**: React Hooks
- **Styling**: CSS Modules, Global CSS
- **Animations**: Framer Motion
- **Mobile**: Capacitor (Android)
- **Icons**: Custom SVGs

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm or yarn

### Installation

1. Clone the repository.
2. Navigate to the frontend directory:
   ```bash
   cd produit-academy-frontend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

### Running Locally

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Mobile Development (Android)

This project uses Capacitor to run as a native Android app.

1. Sync the web code to the native project:
   ```bash
   npx cap sync
   ```
2. Open the Android project in Android Studio:
   ```bash
   npx cap open android
   ```
3. Run the app on an emulator or connected device from Android Studio.

## Project Structure

- `pages/`: Application routes (Home, Dashboard, Legal Pages, etc.)
- `components/`: Reusable UI components (Header, Footer, Cards, etc.)
- `styles/`: CSS modules and global styles.
- `public/`: Static assets (images, icons).
- `android/`: Native Android project files.

## Legal Pages

The following legal and support pages have been implemented:
- Help Center: `/help-center`
- FAQs: `/faqs`
- Privacy Policy: `/privacy-policy`
- Terms & Conditions: `/terms-and-conditions`
