import '@/styles/globals.css'
import { Layout } from '@/components'
  
export const metadata = {
    title: 'Home',
    description: 'Welcome to Next.js',
  }

export default function RootLayout({
    children,
  }) {
    return (
      <html lang="en">
        <body>
            <Layout>{children}</Layout>
        </body>
      </html>
    )
  }

