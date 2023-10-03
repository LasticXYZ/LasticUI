import Link from "next/link"
import { joinClassNames } from "@/utils/helperFunc" // This is a custom function to join class names

const GeneralTable = ({ tableData, tableHeader, colClass="grid-cols-4" }) => {
    return (
    <div className="flex flex-col">
      <div className="relative overflow-x-auto border rounded-2xl border-gray-20 py-5 px-5">
        <div className="relative overflow-x-auto shadow-md rounded-2xl">
          <div className="shadow overflow-hidden sm:rounded-lg">
            <div className={joinClassNames("grid gap-4 bg-gray-21 p-2 text-white rounded-2xl", colClass)}>
              {tableHeader.map((item, index) => (
                    <div key={index} className="bg-gray-100 flex justify-start items-center font-bold p-4">{item.title}</div>
              ))}
            </div>

            {tableData.map((item, index) => (
                <Link
                  key={index}
                  className="text-white cursor-pointer hover:text-gray-7"
                  href={item.href}
                  alt="link"
                  >
                    <div className={joinClassNames("grid gap-4 px-2 border-b border-gray-20", colClass)}>
                    { item.data.map((item2) => (
                      <div key={item2} className="flex justify-start items-center p-4">{item2}</div>
                    ))}
                    </div>
                </Link>
            ))}

          </div>
        </div>
      </div>
    </div>
    )
}

export default GeneralTable


