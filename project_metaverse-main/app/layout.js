import '../styles/globals.css';
import {
  ClerkProvider,
  
} from '@clerk/nextjs'
import GradientCursor from "../components/GradientCursor";


const DashboardLayout = ({ children }) => (
  <ClerkProvider>
  <html lang="en">
    <head>
      <link rel="preconnect" href="https://stijndv.com" />
      <link rel="stylesheet" href="https://stijndv.com/fonts/Eudoxus-Sans.css" />
    </head>
    <body>
    <GradientCursor />
      {children}</body>
  </html>
  </ClerkProvider>
);

export default DashboardLayout;
