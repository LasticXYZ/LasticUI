import { joinClassNames } from '@/utils/helperFunc'; // This is a custom function to join class names
import Link from 'next/link';
import { FC } from 'react';

type GeneralTableProps = {
  tableData: Array<{ href?: string; data: Array<string | JSX.Element | undefined | null> }>
  tableHeader: Array<{ title: string }>
  colClass?: string
}

const GeneralTable: FC<GeneralTableProps> = ({
  tableData,
  tableHeader,
  colClass = 'grid-cols-4',
}) => {
  return (
    <div className="flex flex-col">
      <div className="relative overflow-x-auto py-5 px-5">
        <div className="relative overflow-x-auto">
          <div className="shadow overflow-hidden sm:rounded-2xl">
            <div
              className={joinClassNames(
                'grid gap-2 bg-[#AFE4DD] px-2 text-sm text-black rounded-full',
                colClass,
              )}
            >
              {tableHeader.map((item, index) => (
                <div
                  key={index}
                  className="bg-gray-100 flex justify-start items-center font-bold p-4"
                >
                  {item.title}
                </div>
              ))}
            </div>

            {tableData.map((item, index) => (
              <div key={index}>
                {item.href && (
                  <Link
                    key={index}
                    className="text-black cursor-pointer hover:text-gray-7"
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
                )}
                {!item.href && (
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
        </div>
      </div>
    </div>
  )
}

export default GeneralTable
