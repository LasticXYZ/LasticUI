import Image from 'next/image';
import Link from 'next/link';
import { FaMedium, FaTelegram } from 'react-icons/fa';

const Footer = () => (

<footer className=" text-black">
    <div className="mx-auto w-full px-5 md:px-20 xl:px-40 py-10 lg:py-20">
        <div className="md:flex md:justify-between">
          <div className="mb-6 md:mb-0">
              <Link href="/" className="flex items-center" legacyBehavior>
                  <Image 
                    src="/assets/Images/Logos/lastic-logo.png" 
                    alt="lastic Logo"
                    width={150}
                    height={50}
                   />
              </Link>
              <p className="mt-2 text-sm text-gray-8">Lastic the First Blockspace Marketplace.</p>
          </div>
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-4">
            <div>
              <h2 className="mb-6 text-sm font-semibold font-syncopate text-pink-4 uppercase ">HOME</h2>
              <ul className="text-montserrat  font-medium">
                  <li className="mb-4">
                      <Link href="/bulkcore1" className="hover:underline">Launch App</Link>
                  </li>
                  <li className="mb-4">
                      <Link href="/faq" className="hover:underline">FAQ</Link>
                  </li>
                  <li className="mb-4">
                      <Link href="/articles" className="hover:underline">Articles</Link>
                  </li>
              </ul>
            </div>
            <div>
                <h2 className="mb-6 text-sm font-semibold font-syncopate text-pink-4 uppercase ">LEARN MORE</h2>
                <ul className="text-montserrat font-medium">
                    <li className="mb-4">
                        <a href="https://github.com/lasticXYZ" className="hover:underline">Github</a>
                    </li>
                    <li className="mb-4">
                        <a href="https://github.com/LasticXYZ/LasticUI/blob/main/W3FGrant_Lastic_Whitepaper.pdf" className="hover:underline">Whitepaper</a>
                    </li>
                </ul>
            </div>
            <div>
                <h2 className="mb-6 text-sm font-semibold font-syncopate text-pink-4 uppercase ">RESOURCES</h2>
                <ul className="text-montserrat  font-medium">
                    <li className="mb-4">
                        <a href="https://docs.lastic.xyz/" className="hover:underline ">Docs</a>
                    </li>
                    <li className="mb-4">
                        <a href="https://blog.lastic.xyz/" className="hover:underline">Medium</a>
                    </li>
                </ul>
            </div>
            <div>
                <h2 className="mb-6 text-sm font-semibold font-syncopate text-pink-4 uppercase ">CONTACT</h2>
                <ul className="text-montserrat  font-medium">
                    <li className=" text-montserrat mb-4">
                        <a href="https://twitter.com/lastic_xyz" className="hover:underline">Twitter</a>
                    </li>
                    <li className="mb-4">
                        <a href="https://t.me/+khw2i6GGYFw3NDNi" className="hover:underline">Telegram</a>
                    </li>
                </ul>
            </div>
          </div>
      </div>
      <hr className="my-6 border-gray-200 sm:mx-auto  lg:my-8" />
      <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <span className="text-sm text-gray-13 sm:text-center ">
              <Link href="/" className="px-2 hover:underline">
              Lastic 
              </Link>
              |  © 2023 Lastic. All rights reserved.
            </span>
          </div>
          <div className="flex mt-4 space-x-6 sm:justify-center sm:mt-0">
              <a href="https://twitter.com/lastic_xyz" className=" p-2 bg-gray-2 rounded-full hover:bg-gray-4">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" /></svg>
                  <span className="sr-only">Twitter page</span>
              </a>
              <a href="https://github.com/LasticXYZ/Lastic" className=" p-2 bg-gray-2 rounded-full hover:bg-gray-4">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" /></svg>
                  <span className="sr-only">GitHub account</span>
              </a>
              <a href="https://medium.com/lastic-marketplace" className="p-2 bg-gray-2 rounded-full hover:bg-gray-4">
                <FaMedium />
                <span className="sr-only">MEDIUM</span>
              </a>
              <a href="https://t.me/+khw2i6GGYFw3NDNi" className="p-2 bg-gray-2 rounded-full hover:bg-gray-4">
                <FaTelegram />
                <span className="sr-only">TELEGRAM</span>
              </a>
          </div>
      </div>
    </div>
</footer>

);

export default Footer;