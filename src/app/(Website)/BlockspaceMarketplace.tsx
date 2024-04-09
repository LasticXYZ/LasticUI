import Image from 'next/image'

const BlockspaceMarketplace = () => {
  return (
    <div className=" pt-10 ">
      <section className="mx-auto max-w-9xl flex flex-col py-12 px-4 sm:px-6 lg:px-8">
        <div className="py-5">
          {/* Title */}
          <h1 className="text-2xl sm:text-6xl font-syne font-bold text-center mb-4">
            A Blockspace Marketplace?
          </h1>

          {/* Subtitle */}
          <h2 className="text-lg sm:text-xl font-syne  text-center mb-5">What you can do</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 items-center justify-between gap-4 md:py-12">
          <div className="md:flex-1">
            <div className="relative h-[20vh] md:h-[40vh] xl:h-[500px] w-full">
              <Image
                src="/assets/Images/deeper_dive.png"
                alt="Abstract Art"
                className="rounded-2xl border border-gray-9 object-cover"
                fill
              />
            </div>
          </div>

          <div className="text-sm px-4 md:text-base md:flex-1">
            <p className="my-4 text-base py-4 sm:text-lg font-bold text-gray-600">
              Lastic is a user-friendly marketplace for buying and selling blockspace tailored to
              your needs, built on Polkadot Coretime.
            </p>

            <ul className="list-disc pl-5 sm:pl-8">
              <li className="py-3">
                <strong className="font-semibold">Buy or Sell Blockspace: </strong>
                One place for your blockspace.
              </li>
              <li className="py-3">
                <strong className="font-semibold">Use your blockspace: </strong>
                Connect your Polkadot parachain, Wasm smart contract, ZK Prover, or any other
                computation.
              </li>
              <li className="py-3">
                <strong className="font-semibold">Automation and renewals: </strong>
                Allow parachains to automate their coretime allocation based on current market
                conditions.
              </li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  )
}

export default BlockspaceMarketplace
