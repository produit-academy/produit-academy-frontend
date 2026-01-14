import { useEffect } from 'react';
import Head from 'next/head';
import { App as CapacitorApp } from '@capacitor/app';
import { StatusBar, Style } from '@capacitor/status-bar';
import '../styles/globals.css';
import '../styles/Home.css';
import '../styles/Auth.css';
import '../styles/Dashboard.css';

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const initMobile = async () => {
      try {
        await StatusBar.setStyle({ style: Style.Dark });
      } catch (e) {
      }
    };
    initMobile();

    CapacitorApp.addListener('backButton', ({ canGoBack }) => {
      if (canGoBack) {
        window.history.back();
      } else {
        CapacitorApp.exitApp();
      }
    });
  }, []);

  return (
    <>
      <ul className="floating-elements">
        <li>α</li>
        <li>β</li>
        <li>Σ</li>
        <li>π</li>
        <li>∫</li>
        <li>λ</li>
        <li>ω</li>
        <li>μ</li>
        <li>δ</li>
        <li>ε</li>
      </ul>
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;