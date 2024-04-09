import About from '@/app/(Website)/About'
import BlockspaceMarketplace from '@/app/(Website)/BlockspaceMarketplace'
import DeeperDive from '@/app/(Website)/DeeperDive'
import Hero from '@/app/(Website)/Hero'
import LogoSlider from '@/components/logoSlider/LogoSlider'

const Home = () => {
  return (
    <>
      <Hero />
      <LogoSlider />
      <BlockspaceMarketplace />
      <About />
      <DeeperDive />
    </>
  )
}

export default Home
