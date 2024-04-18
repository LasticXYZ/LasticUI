import Image from 'next/image'

const polkadot = '/assets/asset-logos/polkadot.svg'
const moonbeam = '/assets/asset-logos/moonbeam.svg'
const tanssi = '/assets/asset-logos/tanssi.svg'
const celestia = '/assets/asset-logos/celestia.svg'
const eigenlayer = '/assets/asset-logos/eigenlayer.svg'
const near = '/assets/asset-logos/near.svg'
const polygonAvail = '/assets/asset-logos/polygon.svg'

import './styles/Animations.css'

function LogoSlider() {
  const logos = [moonbeam, near, polkadot, celestia, eigenlayer, tanssi, polygonAvail]

  const duplicatedLogos = [
    ...logos,
    ...logos,
    ...logos,
    ...logos,
    ...logos,
    ...logos,
    ...logos,
    ...logos,
  ]

  return (
    <div className=" w-screen overflow-hidden py-14 border-t border-gray-16 ">
      {/* Use flex and items-center to vertically center the logos */}
      <div className="flex items-center whitespace-nowrap gap-12 justify-center logo-slider hover:logo-slider">
        {duplicatedLogos.map((logoSrc, index) => (
          <div key={index} className="inline-flex justify-center" style={{ minWidth: '150px' }}>
            <Image
              src={logoSrc}
              alt={`Logo ${index}`}
              width={250}
              height={50}
              className="mx-auto"
            />
          </div>
        ))}
      </div>
    </div>
  )
}

export default LogoSlider
