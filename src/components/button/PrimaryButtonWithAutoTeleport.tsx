import PrimaryButton, { PrimaryButtonProps } from '@/components/button/PrimaryButton'
import ModalNotification from '@/components/modal/ModalNotification'
import ModalTranasaction from '@/components/modal/ModalTransaction'
import { useTeleport } from '@/hooks/useTeleport'
import { BN } from '@polkadot/util'
import { FC } from 'react'

export interface PrimaryButtonWithAutoTeleportProps extends PrimaryButtonProps {
  /** Amount needed for the action. Determines if teleport will happen or not. */
  amountNeeded: BN
  /** Which chain needs the amount. Determines the teleport direction. */
  teleportTo: 'relay' | 'coretime'
}

const PrimaryButtonWithAutoTeleport: FC<PrimaryButtonWithAutoTeleportProps> = ({
  title = 'Click me',
  location = '/',
  onClick,
  disabled,
  amountNeeded,
  teleportTo,
}) => {
  const autoTeleportEnabled = true
  const { autoTeleport, notification, setNotification, isTeleporting, teleportMessage } =
    useTeleport(onClick)

  const handleClick = async () => {
    if (!onClick) return

    if (autoTeleportEnabled) {
      autoTeleport(amountNeeded, teleportTo)
    } else onClick()
  }

  return (
    <div className="flex flex-col  items-center gap-3">
      <PrimaryButton title={title} location={location} onClick={handleClick} disabled={disabled} />

      <ModalNotification
        type={notification.type}
        isVisible={notification.isVisible}
        message={notification.message}
        onClose={() => setNotification({ ...notification, isVisible: false })}
      />

      <ModalTranasaction isVisible={isTeleporting} message={teleportMessage} />
    </div>
  )
}

export default PrimaryButtonWithAutoTeleport
