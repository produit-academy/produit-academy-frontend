import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.produitacademy.app',
  appName: 'Produit Academy',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
    StatusBar: {
      style: 'DARK',
      overlaysWebView: false,
      backgroundColor: '#00000000'
    },
  },
  android: {
    buildOptions: {
      keystorePath: null,
      keystoreAlias: null,
    }
  }
};

export default config;
