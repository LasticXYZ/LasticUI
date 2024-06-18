import { toShortAddress } from '@/utils'
import { CheckIcon, ClipboardIcon } from '@heroicons/react/24/outline'
import { FC, useState } from 'react'
import { CopyToClipboard } from 'react-copy-to-clipboard'

type Props = {
  text: string
}

const AddressCopyClipboard: FC<Props> = ({ text }) => {
  const [isCopied, setCopied] = useState(false)

  const onCopy = () => {
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 500)
  }

  return (
    <CopyToClipboard onCopy={onCopy} text={text}>
      <div className="cursor-pointer flex items-center gap-0.5">
        <span> {toShortAddress(text as string, 5)}</span>
        {isCopied ? (
          <CheckIcon width={16} height={16} className="text-green-500" />
        ) : (
          <ClipboardIcon width={16} height={16} />
        )}
      </div>
    </CopyToClipboard>
  )
}

export default AddressCopyClipboard
