import SecondaryButton from '@/components/button/SecondaryButton'
import CuteInfo from '@/components/info/CuteInfo'
import { ConnectButton } from '@/components/web3/ConnectButton'
import {
    BrokerConstantsType,
    ConfigurationType,
    SaleInfoType,
    useInkathon
} from '@poppyseed/lastic-sdk'
import React from 'react'

type BuyWalletStatusType = {
    saleInfo: SaleInfoType,
    configuration: ConfigurationType,
    brokerConstants: BrokerConstantsType
}

const BuyWalletStatus: React.FC<BuyWalletStatusType> = ({saleInfo, configuration}) => {
  const { activeAccount } = useInkathon()

  if (!activeAccount) {
    return (
      <div className="flex justify-center items-center py-20 px-4">
        <div className="flex flex-col items-center justify-center px-2 py-8">
          <CuteInfo
            emoji="👀"
            message="Connect wallet in order to buy instantaneous coretime."
            color="bg-teal-4"
          />
          <ConnectButton />
        </div>
      </div>
    )
  }

  return (
    <div className="flex justify-center items-center py-20 px-4">
      <div className="flex flex-col items-center justify-center px-2 py-8 ">
        <h2>
            <b>Sale Info:</b>
        </h2>
        <div>availableCores: {saleInfo.coresOffered - saleInfo.coresSold}</div>
        <div>How many cores are set to renew by default?</div>
        <div>
            idealCoresSold: {saleInfo.idealCoresSold}
            firstCore: {saleInfo.firstCore}
            selloutPrice: {saleInfo.selloutPrice}
            renewalBump: {configuration.renewalBump}
        </div>

        <div>
        <b>Configuration:</b>
      </div>
      <div>
        idealBulkProportion: {configuration.idealBulkProportion}
        limitCoresOffered: {configuration.limitCoresOffered}
        contributionTimeout: {configuration.contributionTimeout}
      </div>
        <SecondaryButton title="Buy core" />
      </div>
    </div>
  )
}

export default BuyWalletStatus
