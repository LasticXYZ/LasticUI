// Dependencies
import Image from 'next/image'

const WorldMap = () => {
  return (
    <section className="flex flex-col md:flex-row h-auto md:h-screen bg-black py-10 px-4 sm:px-6 md:px-10 text-white">
      {/* Dashboard image or component goes here */}
      <div className="m-auto w-full md:w-2/5 px-4 py-8">
        <Image
          src="/assets/Images/world-img.png"
          alt="Deeper Dive Image"
          layout="responsive"
          width={640}
          height={480}
        />
      </div>

      <div className="m-auto w-full md:w-2/5 max-w-xl px-4">
        {/* Text section */}
        <div className="flex flex-col space-y-4">
          <h6 className="uppercase text-sm sm:text-md text-pink-4 font-bold font-inter">Join us</h6>
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight font-syne">
            Join traders and builders around the world
          </h1>
          <p className="text-sm sm:text-md md:text-lg font-dm_sans text-gray-4">
            Start harnessing the full potential of blockspace technology with the most advanced
            platform in the world.
          </p>
          <div className="pt-8 font-dm_sans flex flex-col sm:flex-row justify-normal items-center">
            <div className="pt-8 font-dm_sans flex flex-row justify-normal items-center">
              <div className="flex flex-col justify-center items-center">
                <div className="text-pink-5 text-4xl sm:text-5xl md:text-6xl">38K</div>
                <div className="text-lg sm:text-xl p-2">Users joined</div>
              </div>
              <div className="flex flex-col sm:ml-8 md:ml-16 justify-center items-center">
                <div className="text-pink-5 text-4xl sm:text-5xl md:text-6xl">60+</div>
                <div className="text-lg sm:text-xl p-2">Companies</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WorldMap
