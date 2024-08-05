import Border from '@/components/border/Border'
import SecondaryButton from '@/components/button/SecondaryButton'
import RenewModal from '@/components/extrinsics/broker/RenewModal'
import GeneralTable from '@/components/table/GeneralTable'
import WalletStatus from '@/components/walletStatus/WalletStatus'
import { PossibleNetworks, network_list } from '@/config/network'
import { useAllowedRenewalsQuery, usePotentialRenewalsQuery, useSaleInfo } from '@/hooks/substrate'

import { AllowedRenewalAssignmentInfo, AllowedRenewalCoreInfoUnf } from '@/types'
import { parseFormattedNumber, parseNativeTokenToHuman } from '@/utils'
import { getChainFromPath, goToChainRoute } from '@/utils/common/chainPath'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

interface ModalDataType {
  coreInfo: AllowedRenewalCoreInfoUnf
  assignmentInfo: AllowedRenewalAssignmentInfo
}

const RenewalsData = () => {
  const { api } = useInkathon()

  const [isRenewModalOpen, setIsRenewModalOpen] = useState(false)
  const [modalData, setModalData] = useState<ModalDataType | null>(null)
  const pathname = usePathname()
  const network = getChainFromPath(pathname)
  const saleInfo = useSaleInfo(api)
  const begin = saleInfo?.regionBegin
  console.log(saleInfo)

  const { activeAccount, activeChain } = useInkathon()
  let potentialRenewals = usePotentialRenewalsQuery(api)
  const allowedRenewals = useAllowedRenewalsQuery(api)
  if (!potentialRenewals) {
    potentialRenewals = allowedRenewals
  }
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7
  let { tokenSymbol } = useBalance(activeAccount?.address, true)

  const handleNextPage = () => setCurrentPage(currentPage + 1)
  const handlePrevPage = () => setCurrentPage(currentPage - 1)
  // Data filtering based on user selection
  const filteredData = allowedRenewals
    ?.filter((plan) => {
      return !begin || parseFormattedNumber(plan.coreInfo[0].when) === begin
    })
    .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  if (!activeChain) {
    return (
      <Border className="h-full flex flex-row justify-center items-center">
        <WalletStatus />
      </Border>
    )
  }

  return (
    <>
      <Border className="h-full flex flex-row justify-center items-center">
        <div className="h-full w-full flex flex-col justify-start items-start p-10">
          {filteredData && filteredData.length > 0 ? (
            <>
              <h1 className="text-xl font-bold uppercase mb-5">Cores that need to be renewed!</h1>
              {/* <div className="flex flex-row items-center gap-3 mb-5">
                <label htmlFor="task">Task:</label>
                <input
                  id="task"
                  type="number"
                  placeholder="Task Number"
                  value={task || ''}
                  onChange={(e) => setTask(parseFloat(e.target.value) || null)}
                  className="ml-2 p-2 border rounded"
                />
                <label htmlFor="core">Core:</label>
                <input
                  id="core"
                  type="number"
                  placeholder="Core Number"
                  value={core || ''}
                  onChange={(e) => setCore(parseFloat(e.target.value) || null)}
                  className="p-2 border rounded"
                />
              </div> */}

              <div className="w-full overflow-x-auto">
                <GeneralTable
                  tableData={filteredData.map(({ coreInfo, assignmentInfo }) => {
                    let task: number | null = assignmentInfo.completion?.Complete[0]?.assignment
                      .Task
                      ? parseFormattedNumber(
                          assignmentInfo.completion?.Complete[0]?.assignment.Task,
                        )
                      : null
                    if (!task) return { data: [] }
                    return {
                      data: [
                        task?.toString() || 'N/A',
                        task &&
                        network_list[network as PossibleNetworks].paraId.hasOwnProperty(
                          task ? task : '',
                        )
                          ? network_list[network as PossibleNetworks].paraId[task].name
                          : null,
                        coreInfo[0].when,
                        coreInfo[0].core,
                        `${parseNativeTokenToHuman({ paid: assignmentInfo.price?.toString(), decimals: 12, reduceDecimals: 4 })} ${tokenSymbol}`,
                        <SecondaryButton
                          title="Renew"
                          onClick={() => {
                            setModalData({ coreInfo: coreInfo[0], assignmentInfo })
                            setIsRenewModalOpen(true)
                          }}
                          key="data"
                        />,
                      ],
                    }
                  })}
                  tableHeader={[
                    { title: 'Para ID' },
                    { title: 'Network' },
                    { title: 'Begin' },
                    { title: 'Core' },
                    { title: 'Price' },
                    { title: 'Renew' },
                  ]}
                  colClass="grid-cols-6"
                />
              </div>

              {/* Pagination buttons */}
              <div className="flex w-full items-center justify-between space-x-2 mt-4 px-5">
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
                  disabled={filteredData.length < itemsPerPage || filteredData.length === 0}
                  className={`px-4 py-2   border border-gray-21 text-black dark:text-gray-1 font-semibold rounded-2xl ${filteredData.length < itemsPerPage ? 'bg-gray-2 dark:bg-gray-20 dark:text-gray-14 text-gray-14 cursor-not-allowed' : ' hover:bg-green-6'}`}
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="h-full w-full flex justify-center items-center p-10">
              <WalletStatus
                redirectLocationMessage="Go to My Cores"
                redirectLocation={goToChainRoute(pathname, '/my-cores')}
                customEmoji="👍"
                customMessage="All cores have been successfully renewed."
              />
            </div>
          )}
        </div>
      </Border>

      {/* Renew modal */}
      {modalData && (
        <RenewModal
          isOpen={isRenewModalOpen}
          onClose={() => setIsRenewModalOpen(false)}
          price={modalData.assignmentInfo.price}
          tokenSymbol={tokenSymbol}
          task={modalData.assignmentInfo.completion?.Complete[0]?.assignment.Task}
          regionId={{
            begin: modalData.coreInfo.when,
            core: modalData.coreInfo.core,
            mask: modalData.assignmentInfo.completion?.Complete[0]?.mask,
          }}
        />
      )}
    </>
  )
}

export default RenewalsData
