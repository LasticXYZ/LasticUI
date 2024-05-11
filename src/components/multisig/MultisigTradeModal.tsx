import SecondaryButton from '@/components/button/SecondaryButton'
import Modal from '@/components/modal/Modal'
import LoadingSpinner from '@/components/multisig/Spinner'
import { CoreListing, useListings } from '@/hooks/useListings'
import { ListingsTracker } from '@/hooks/useListingsTracker'
import { useMultisigTrading } from '@/hooks/useMultisigTrading'
import { ArrowPathIcon } from '@heroicons/react/24/outline'
import { Checkbox } from '@mui/material'
import { useBalance, useInkathon } from '@poppyseed/lastic-sdk'
import { FC } from 'react'

const LASTIC_ADDRESS = process.env.NEXT_PUBLIC_LASTIC_ADDRESS || '' // used for new multisigs and if db has no other address defined

const checkboxStyle = {
  '& .MuiSvgIcon-root': {
    fill: '#E6B3CA',
    fontSize: 16,
  },
  p: 0,
}

export interface MultisigTradeModalProps {
  isOpen: boolean
  onClose: () => void
  core: CoreListing
  listingsState: ListingsTracker
  onUpdateListingDB?: () => Promise<any>
  onUpdateListingState?: () => Promise<void>
  isLoadingStateUpdate: boolean
}

const MultisigTradeModal: FC<MultisigTradeModalProps> = ({
  isOpen,
  onClose,
  core,
  onUpdateListingDB,
  listingsState,
  onUpdateListingState: updateAllStates,
  isLoadingStateUpdate,
}) => {
  const { api, activeAccount } = useInkathon()
  const { markTradeStarted, markTradeCompleted } = useListings(false)

  const signatoriesWithLabel = [
    {
      address: core.sellerAddress,
      label: 'Seller',
    },
    {
      address: core.buyerAddress || activeAccount?.address,
      label: 'Buyer',
    },
    {
      address: core.lasticAddress || LASTIC_ADDRESS,
      label: 'Lastic',
    },
  ]
  const {
    initiateOrExecuteMultisigTradeCall,
    sendFundsToMultisig,
    sendCoreToMultisig,
    multisigAddress,
    isLoading,
    txStatusMessage,
  } = useMultisigTrading({
    core,
    onTradeStarted: (listingID, buyerAddress) =>
      markTradeStarted(listingID, buyerAddress).then(() => onUpdateListingDB?.()),
    onTradeCompleted: (listingID) =>
      markTradeCompleted(listingID).then(() => onUpdateListingDB?.()),
  })

  const updateMethodAndButton = () => {
    let buttonFunction = initiateOrExecuteMultisigTradeCall
    let buttonEnabled = false

    // If you are seller
    if (activeAccount?.address === core.sellerAddress) {
      if (listingsState[core.id].step1 && !listingsState[core.id].step2) {
        buttonFunction = () => sendCoreToMultisig(core)
        buttonEnabled = true
      } else if (listingsState[core.id].step1 && !listingsState[core.id].step3) {
        buttonFunction = initiateOrExecuteMultisigTradeCall
        buttonEnabled = true
      } else buttonEnabled = false
    }

    // If you are buyer
    else if (
      (activeAccount?.address === core.buyerAddress || !core.buyerAddress) &&
      activeAccount?.address !== (core.lasticAddress || LASTIC_ADDRESS)
    ) {
      // step 1 interaction
      if (!listingsState[core.id].step1) {
        buttonFunction = async () => await sendFundsToMultisig(core)
        buttonEnabled = true
      }
      // finisher interaction
      else if (
        listingsState[core.id].step1 &&
        listingsState[core.id].step2 &&
        listingsState[core.id].step3 &&
        !listingsState[core.id].step4
      ) {
        buttonFunction = async () => await initiateOrExecuteMultisigTradeCall()
        buttonEnabled = true
      } else buttonEnabled = false
    }

    // If you are lastic
    else if (activeAccount?.address === (core.lasticAddress || LASTIC_ADDRESS)) {
      console.log('lastic')
      // only finisher interaction possible; if steps 1-3 are finished
      if (
        listingsState[core.id].step1 &&
        listingsState[core.id].step2 &&
        listingsState[core.id].step3 &&
        !listingsState[core.id].step4
      ) {
        buttonFunction = async () => await initiateOrExecuteMultisigTradeCall()
        buttonEnabled = true
      } else {
        buttonEnabled = false
      }
    }

    // If you are someone else. No interaction possible.
    else buttonEnabled = false

    return { buttonFunction, buttonEnabled }
  }
  const { buttonFunction, buttonEnabled } = updateMethodAndButton()
  const { tokenDecimals, tokenSymbol } = useBalance()

  if (!isOpen || !api) {
    return null
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Purchase Listed Core Nb ${core.coreNumber}`}>
      <div className="flex flex-col gap-5 ">
        <p className="text-left font-bold">How it works</p>
        <div className="text-xs border-2 rounded-xl p-2">
          <div className="flex items-center gap-2">
            <p className="text-justify pb-2">
              This trade is realized via a multisig account that requires 2 out of 3 signatories. It
              requires the following steps to be completed:
            </p>
            <ArrowPathIcon className="w-5 h-5 hover:cursor-pointer" onClick={updateAllStates} />
          </div>

          <div className="grid text-xs gap-2 items-start">
            <div className="flex items-center gap-1">
              <Checkbox disableRipple checked={listingsState[core.id].step1} sx={checkboxStyle} />
              <p>Step 1: The buyer sends the price amount to the multisig address</p>
            </div>
            <div className="flex items-center gap-1">
              <Checkbox
                disableRipple
                checked={listingsState[core.id].step2}
                size="small"
                sx={checkboxStyle}
              />
              <p>Step 2: The seller sends the core to the multisig address</p>
            </div>
            <div className="flex items-center gap-1">
              <Checkbox disableRipple checked={listingsState[core.id].step3} sx={checkboxStyle} />
              <p>
                Step 3: The seller opens a batch multisig call that sends the core to the buyer and
                the balance to himself
              </p>
            </div>

            <div className="flex items-center gap-1">
              <Checkbox disableRipple checked={listingsState[core.id].step4} sx={checkboxStyle} />
              <p>
                Step 4: Lastic or the buyer verifies and approves the multisig call and the the
                trade will be executed.
              </p>
            </div>
          </div>
        </div>

        <div>
          <p>
            Price: {Number(core.cost) / 10 ** tokenDecimals} {tokenSymbol}
          </p>
        </div>

        <div
          hidden={signatoriesWithLabel[0].address === signatoriesWithLabel[1].address}
          className="self-center"
        >
          {signatoriesWithLabel.map(({ address, label }) => (
            <div key={address + label} className="flex items-center gap-3 text-xs">
              <p className="w-32 text-end">
                {label} {activeAccount?.address === address && '(You)'}:
              </p>
              <div className="flex items-center gap-1 text-gray-400">
                <p className="flex-1">{address}</p>
              </div>
            </div>
          ))}

          <div className="flex items-center gap-3 text-xs">
            <p className="w-32 text-end">Multisig Address:</p>
            <p className="text-gray-400 flex">{multisigAddress}</p>
          </div>
        </div>

        <div className="flex items-baseline gap-2 self-center">
          <p className="font-bold text-center">{listingsState[core.id].statusMessage}</p>
          <LoadingSpinner isLoading={isLoadingStateUpdate} />
        </div>

        <SecondaryButton
          className="w-40 self-center"
          disabled={isLoading || !buttonEnabled}
          title="Process Trade"
          onClick={buttonFunction}
        />
        {txStatusMessage && <p className="flex flex-wrap self-center text-xs">{txStatusMessage}</p>}
      </div>
    </Modal>
  )
}

export default MultisigTradeModal
