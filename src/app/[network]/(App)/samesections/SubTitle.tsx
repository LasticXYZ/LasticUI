import React from 'react'

type SubtitleProps = {
  subtitle: string
}

const Subtitle: React.FC<SubtitleProps> = ({ subtitle }) => {
  return (
    <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
      <h2 className="font-unbounded uppercase font-bold py-2 px-5 text-xl md:text-1xl xl:text-2xl">
        {subtitle}
      </h2>
    </section>
  )
}

export default Subtitle
