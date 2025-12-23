import { useEffect } from 'react';
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

  return <Component {...pageProps} />;
}

export default MyApp;