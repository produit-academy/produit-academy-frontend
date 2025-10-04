// pages/_app.js

import '../styles/globals.css';
import '../styles/Home.css';
import '../styles/Auth.css';
import '../styles/Dashboard.css';

function MyApp({ Component, pageProps }) {
  return <Component {...pageProps} />;
}

export default MyApp;