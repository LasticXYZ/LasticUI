import Navbar from './Navbar'
import Footer from './Footer'
import Background from './Background'

const navigation_app = [
    { name: 'Insta-core', href: '/instacore', current: false },
    { name: '1. Bulk-core', href: '/bulkcore1', current: false },
    { name: '2. Bulk-core', href: '/bulkcore2', current: false },
  ]

export default function Layout({ children }) {
  return (
    <Background>
      <Navbar navigation={navigation_app}/>
      <div className="py-10">
        <main>{children}</main>
      </div>
      <Footer />
    </Background>
  )
}