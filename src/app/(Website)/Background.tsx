import Image from 'next/image'

const Background = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-white min-h-screen overflow-hidden">
      <div className="fixed z-0 inset-0 h-screen w-full top-0 overflow-hidden">
        <Image src="/assets/Images/home-banner.png" alt="hero" fill />
      </div>

      <div className="relative z-10">{children}</div>
    </div>
  )
}

export default Background
