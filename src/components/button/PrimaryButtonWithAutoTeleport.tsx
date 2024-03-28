import PrimaryButton, { PrimaryButtonProps } from '@/components/button/PrimaryButton'
import { FormControlLabel, Switch } from '@mui/material'
import { FC, useState } from 'react'

export interface PrimaryButtonWithAutoTeleportProps extends PrimaryButtonProps {
  amountNeeded: number
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
  const [autoTeleportEnabled, setAutoTeleportEnabled] = useState(true)

  return (
    <div className="flex flex-col  items-center gap-3">
      <FormControlLabel
        control={
          <Switch
            checked={autoTeleportEnabled}
            onChange={(e) => setAutoTeleportEnabled(e.target.checked)}
            size="small"
            sx={switchStyle}
          />
        }
        label="Auto Teleport"
      />

      <PrimaryButton title={title} location={location} onClick={onClick} disabled={disabled} />
    </div>
  )
}

const switchStyle = {
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: '#FF6370',
  },

  '& .MuiSwitch-switchBase + .MuiSwitch-track': {
    backgroundColor: '#E6B3CA',
  },
}

export default PrimaryButtonWithAutoTeleport
