const Subtitle = ({ subtitle }) => {
  return (
    <section className="mx-auto max-w-9xl px-4 sm:px-6 lg:px-8">
        <h2 className="font-syncopate uppercase py-5 px-5 mb-4 text-xl md:text-1xl xl:text-2xl">
        { subtitle } 
        </h2>
    </section>
  );
}

export default Subtitle;