import About from '@/app/(Website)/About'
import DeeperDive from '@/app/(Website)/DeeperDive'
import FirstInfo from '@/app/(Website)/FirstInfo'
import Hero from '@/app/(Website)/Hero'
import LogoSlider from '@/components/logoSlider/LogoSlider'

const Home = () => {
  return (
    <>
      <Hero />
      <LogoSlider />
      <FirstInfo />
      <About />
      <DeeperDive />
    </>
  )
}

export default Home
