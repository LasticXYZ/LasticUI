const Background = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="bg-[#F9f9fc] overflow-hidden min-h-screen">
      {/* Radial Gradient Background */}
      <div className="fixed z-0 inset-0 h-screen w-full overflow-hidden">
        {/* Ellipse4 */}
        <div className="absolute top-[-36px] left-[-9.35px] w-[513.08px] h-[513.08px] bg-[#00E3BA] opacity-80 rounded-full"></div>

        {/* Ellipse3 */}
        <div className="absolute top-[259.38px] left-[-273px] w-[513.08px] h-[513.08px] bg-[#37FCFB] opacity-50 rounded-full"></div>

        {/* Ellipse2 */}
        <div className="absolute top-[148.88px] left-[909.61px] w-[612.64px] h-[612.64px] bg-[#CB2600] opacity-90 rounded-full"></div>

        {/* Ellipse1 */}
        <div className="absolute top-[-36px] left-[292.59px] w-[971.46px] h-[485.73px] bg-[#37FCFB] opacity-70 rounded-full"></div>
      </div>

      {/* Gray Background */}
      <div className="fixed z-0 inset-0 h-screen w-full bg-[#F3F3F3] bg-opacity-80 backdrop-blur-3xl"></div>

      {/* Content */}
      <div className="relative z-10 min-h-screen">{children}</div>
    </div>
  )
}

export default Background
