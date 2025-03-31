import Head from 'next/head';

import '../styles/globals.css';
import GradientCursor from "../components/GradientCursor";


const MyApp = ({ Component, pageProps }) => (
  <>
    <Head>
      <title>Metaversus</title>
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
      <link rel="preconnect" href="https://stijndv.com" />
      <link rel="stylesheet" href="https://stijndv.com/fonts/Eudoxus-Sans.css" />
    </Head>
    <GradientCursor />
    <Component {...pageProps} />
  </>
);

export default MyApp;
