// Copyright 2017-2024 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

import { SubmittableExtrinsic } from '@polkadot/api-base/types'
import { GenericCall } from '@polkadot/types'
import type { Balance, Conviction } from '@polkadot/types/interfaces'
import { Weight } from '@polkadot/types/interfaces'
import { ISubmittableResult } from '@polkadot/types/types'
import type { KeyringAddress } from '@polkadot/ui-keyring/types'
import type { BN } from '@polkadot/util'

export interface MultisigStorageInfo {
  approvals: string[]
  deposit: number
  depositor: string
  when: { height: number; index: number }
}

export type MultisigStorageInfoResponse = MultisigStorageInfo & {
  deposit: string // e.g. "671,733,276"
  when: { height: string; index: string } // e.g. height: '1,222,551', index: '2'
}

export function parseMultisigStorageInfo(
  response: MultisigStorageInfoResponse,
): MultisigStorageInfo {
  return {
    approvals: response.approvals,
    deposit: parseInt((response.deposit as string).replace(/,/g, ''), 10),
    depositor: response.depositor,
    when: {
      height: parseInt((response.when.height as string).replace(/,/g, ''), 10),
      index: parseInt(response.when.index, 10), // Assuming 'index' is a string and doesn't contain commas
    },
  }
}

export interface NewMultisigEvent {
  blocknumber: number
  approving: string
  callHash: string
  id: string
  multisig: string
  timestamp: string
}

export interface ExecutedMultisigEvent {
  id: string
  approving: string
  blockNumber: number
  callHash: string
  multisig: string
  timepoint: {
    height: number
    index: number
  }
  timestamp: string
}

export interface CancelledMultisigEvent {
  id: string
  cancelling: string
  blockNumber: number
  callHash: string
  multisig: string
  timepoint: {
    height: number
    index: number
  }
  timestamp: string
}

export interface AsMultiParams {
  tx?: SubmittableExtrinsic<'promise', ISubmittableResult>
  when?: MultisigStorageInfo['when']
}

export type IconSizeVariant = 'small' | 'medium' | 'large'

export enum AccountBadge {
  PURE = 'pure',
  MULTI = 'multi',
}

export type HexString = `0x${string}`

export interface SubmittingCall {
  call?: GenericCall
  method?: string
  section?: string
  weight?: Weight
}

export interface MultisigActionStatus {
  action: string
  status: 'success' | 'error' | 'pending' // Or any other status values you need
  message?: string
  account?: string // Include other fields as necessary
}

export interface MultisigModalProps extends ModalProps {
  isOpen: boolean
  className?: string
  onClose: () => void
  onStatusChange: (status: MultisigActionStatus) => void // Updated to use new type
}

export interface CreateOptions {
  genesisHash?: HexString
  name: string
  tags?: string[]
}

export interface BareProps {
  className?: string
}

export interface ModalProps {
  onClose: () => void
  onStatusChange: (status: MultisigActionStatus) => void
}

export interface Delegation {
  accountDelegated: string
  amount: Balance
  conviction: Conviction
}

export interface SortedAccount {
  account: KeyringAddress
  address: string
  delegation?: Delegation
  isFavorite: boolean
}

export interface AccountBalance {
  total: BN
  locked: BN
  transferrable: BN
  bonded: BN
  redeemable: BN
  unbonding: BN
}

export type PairType = 'ecdsa' | 'ed25519' | 'ed25519-ledger' | 'ethereum' | 'sr25519'

export interface CreateProps extends ModalProps {
  className?: string
  onClose: () => void
  onStatusChange: (status: MultisigActionStatus) => void
  seed?: string
  type?: PairType
}

export type SeedType = 'bip' | 'raw' | 'dev'

export interface AddressState {
  address: string | null
  derivePath: string
  deriveValidation?: DeriveValidationOutput
  isSeedValid: boolean
  pairType: PairType
  seed: string
  seedType: SeedType
}

export interface CreateOptions {
  genesisHash?: HexString
  name: string
  tags?: string[]
}

export interface DeriveValidationOutput {
  error?: string
  warning?: string
}
