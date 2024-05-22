import { joinClassNames } from '@/utils/helperFunc' // This is a custom function to join class names
import Link from 'next/link'
import { FC, useState } from 'react'

type GeneralTableProps = {
  tableData: Array<{ href?: string; data: Array<string | JSX.Element | undefined | null> }>
  tableHeader: Array<{ title: string }>
  colClass?: string
}

const GeneralTableWithButtons: FC<GeneralTableProps> = ({
  tableData,
  tableHeader,
  colClass = 'grid-cols-4',
}) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  // Pagination functions
  const handleNextPage = () => setCurrentPage(currentPage + 1)
  const handlePrevPage = () => setCurrentPage(currentPage - 1)

  const currentTableData = tableData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  )

  return (
    <div className="flex flex-col">
      <div className="relative overflow-x-auto py-5 px-5">
        <div className="relative  overflow-x-auto ">
          <div className=" overflow-hidden sm:rounded-2xl">
            <div
              className={joinClassNames(
                'grid gap-2 bg-pink-200 dark:bg-pink-400 dark:bg-opacity-95 px-2 text-sm text-black dark:text-white rounded-full',
                colClass,
              )}
            >
              {tableHeader.map((item, index) => (
                <div key={index} className="flex justify-start items-center font-bold p-4">
                  {item.title}
                </div>
              ))}
            </div>

            {currentTableData.map((item, index) => (
              <div
                key={index}
                className="transition duration-300 ease-in-out transform hover:scale-105"
              >
                {item.href ? (
                  <Link
                    key={index}
                    className="text-black dark:text-gray-1 cursor-pointer hover:text-gray-7"
                    href={item.href}
                  >
                    <div
                      className={joinClassNames('grid gap-4 px-2 border-b border-gray-9', colClass)}
                    >
                      {item.data?.map((item2, innerIndex) => (
                        <div key={innerIndex} className="flex justify-start items-center p-4">
                          {item2}
                        </div>
                      ))}
                    </div>
                  </Link>
                ) : (
                  <div key={index}>
                    <div
                      className={joinClassNames('grid gap-4 px-2 border-b border-gray-9', colClass)}
                    >
                      {item.data.map((item2, innerIndex) => (
                        <div key={innerIndex} className="flex justify-start items-center p-4">
                          {item2}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {/* Pagination buttons */}
          <div className="flex w-full items-center justify-between space-x-2 mt-10 px-5">
            <button
              onClick={handlePrevPage}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded-2xl text-black dark:text-gray-1 border border-gray-21 font-semibold ${currentPage === 1 ? 'bg-gray-2 dark:bg-gray-20 dark:text-gray-14 text-gray-14 cursor-not-allowed' : ' hover:bg-green-6'}`}
            >
              Previous
            </button>
            <p className="text-black dark:text-gray-1 font-semibold">{currentPage}</p>
            <button
              onClick={handleNextPage}
              disabled={tableData.length <= currentPage * itemsPerPage}
              className={`px-4 py-2 border border-gray-21 text-black dark:text-gray-1 font-semibold rounded-2xl ${tableData.length <= currentPage * itemsPerPage ? 'bg-gray-2 dark:bg-gray-20 dark:text-gray-14 text-gray-14 cursor-not-allowed' : ' hover:bg-green-6'}`}
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default GeneralTableWithButtons
