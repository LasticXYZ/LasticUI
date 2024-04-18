import MiniBarGraph from '@/components/graph/MiniBarGraph'

const MiniGraphSection = () => (
  <section className="mx-auto max-w-9xl p-10">
    <div className="grid grid-cols-2 gap-10 ">
      <MiniBarGraph />
      <MiniBarGraph />
    </div>
  </section>
)

export default MiniGraphSection
