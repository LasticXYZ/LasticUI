import Link from 'next/link'

const PrimaryButton = ({ title = 'title', location = '/' }) => (
  <Link
    href={location}
    className="rounded-ful font-syncopate font-black rounded-2xl bg-pink-3 hover:bg-pink-4 border border-gray-8 text-xs inline-flex items-center justify-center px-12 py-3 mr-3 text-center text-black hover:bg-primary-800 focus:ring-4 focus:ring-primary-300"
  >
    {title}
  </Link>
)

export default PrimaryButton
