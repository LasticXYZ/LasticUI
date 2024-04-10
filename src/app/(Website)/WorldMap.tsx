// Dependencies
import Image from 'next/image'

const WorldMap = () => {
  return (
    <section className="flex h-screen bg-black px-10 text-white">
      {/* Dashboard image or component goes here */}
      <div className="m-auto w-2/5">
        <Image
          src="/assets/Images/world-img.png"
          alt="Deeper Dive Image"
          width={640}
          height={480}
        />
      </div>

      <div className="m-auto w-2/5 max-w-xl">
        {/* Text section */}
        <div className="flex flex-col space-y-4">
          <h6 className="uppercase text-md text-pink-4 font-bold font-inter">Join us</h6>
          <h1 className="text-5xl font-bold leading-tight font-syne">
            Join traders and builders around the world
          </h1>
          <p className="text-lg font-dm_sans text-gray-4">
            Start harnessing the full potential of blockspace technology with the most advanced
            platform in the world.
          </p>
          <div className="pt-8 font-dm_sans flex flex-row justify-normal items-center">
            <div className="flex flex-col justify-center items-center">
              <div className="text-pink-5 text-6xl">38K</div>
              <div className="text-xl p-2">Users joined</div>
            </div>
            <div className="flex flex-col ml-16 justify-center items-center">
              <div className="text-pink-5 text-6xl">60+</div>
              <div className="text-xl p-2">Companies</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WorldMap
