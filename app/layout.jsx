// app/layout.jsx
import React from 'react'
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import AuthProvider from '@/components/AuthProvider';
import '@/assets/styles/globals.css';

export const metadata = {
    title: 'PropertyPulse | Find The Perfect Rental',
    description: 'Find your dream rental property',
    keywords: 'rental, find rentals, find properties'
}

const MainLayout = ({ children }) => {
  return (
    <html lang="en">
        <body>
          <AuthProvider>
            <Navbar />
            <main>
              {children}
            </main> 
            <Footer />
          </AuthProvider>
        </body>
    </html>
  )
}

export default MainLayout