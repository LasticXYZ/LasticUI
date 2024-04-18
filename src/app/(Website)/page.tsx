import About from '@/app/(Website)/About'
import Ending from '@/app/(Website)/Ending'
import FirstInfo from '@/app/(Website)/FirstInfo'
import FuturePlatform from '@/app/(Website)/FuturePlatform'
import Hero from '@/app/(Website)/Hero'
import LogoSlider from '@/components/logoSlider/LogoSlider'

const Home = () => {
  return (
    <>
      <Hero />
      <LogoSlider />
      <FirstInfo />
      <About />
      <FuturePlatform />
      <Ending />
    </>
  )
}

export default Home
