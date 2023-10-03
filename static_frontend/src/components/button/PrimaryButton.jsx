import Link from "next/link";

const PrimaryButton = ({ title="title", location="/" }) => (
    <Link
        href={ location } 
        className="rounded-full bg-purple-7 hover:bg-purple-8 inline-flex items-center justify-center px-8 py-4 mr-3 font-medium text-center text-white bg-primary-700 hover:bg-primary-800 focus:ring-4 focus:ring-primary-300 dark:focus:ring-primary-900"
    >
        { title }
    </Link>
)

export default PrimaryButton;