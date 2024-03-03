import About from '@/app/(Website)/About'
import BlockspaceMarketplace from '@/app/(Website)/BlockspaceMarketplace'
import DeeperDive from '@/app/(Website)/DeeperDive'
import Hero from '@/app/(Website)/Hero'
import HowItWorks from '@/app/(Website)/HowItWorks'
import { redirect } from 'next/navigation'

const Home = () => {
  redirect('/my-cores')
  return (
    <>
      <Hero />
      <BlockspaceMarketplace />
      <HowItWorks />
      <About />
      <DeeperDive />
    </>
  )
}

export default Home
