import Link from "next/link";

const SecondaryButton = ({ title="title", location="/" }) => (
    <Link
        href={ location }
        className=" font-syncopate font-black rounded-2xl hover:bg-pink-3 border border-gray-8 text-xs inline-flex items-center justify-center px-12 py-3 mr-3 text-center text-black hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
        >
        { title }
    </Link>
)

export default SecondaryButton;