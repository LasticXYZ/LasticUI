// Copyright 2017-2024 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

//import type { ActionStatus } from '@polkadot/react-components/Status/types';

import { FC, useCallback } from 'react';

import SecondaryButton from '@/components/button/SecondaryButton';
import Modal from '@/components/modal/Modal';
import { keyring } from '@polkadot/ui-keyring';
import { BN } from '@polkadot/util';
import { useInkathon } from '@poppyseed/lastic-sdk';
import AddressMini from './AddressMini';
import ModalColumns from './Modal-Col';
import { MultisigActionStatus, MultisigProps } from './types';
//import useKnownAddresses from '../Accounts/useKnownAddresses.js';

function createMultisig (signatories: string[], threshold: BN | number, { genesisHash, name, tags = [] }: CreateOptions, success: string): MultisigActionStatus {
  // we will fill in all the details below
  const status: MultisigActionStatus = { action: 'create', status: 'pending' }; 

  try {
    const result = keyring.addMultisig(signatories, threshold, { genesisHash, name, tags });
    remarkCall
      .signAndSend(selectedAccount.address, { signer: selectedSigner }, signCallBack)
      .catch((error: Error) => {
        setIsSubmitted(false)

        addToast({
          title: error.message,
          type: 'error',
          link: getSubscanExtrinsicLink(remarkCall.hash.toHex())
        })
      })

    const { address } = result.pair;

    status.account = address;
    status.status = 'success';
    status.message = success;
  } catch (error) {
    status.status = 'error';
    status.message = (error as Error).message;

    console.error(error);
  }

  return status;
}

const Multisig: FC<MultisigProps> = ({ isOpen, onClose, onStatusChange }) => {
  const { api } = useInkathon();
  const isDevelopment = false;
  if (!api) {
    return <div>API not available</div>;
  }
  
  const signatories = ['5FLRCTbjEwumqTcMYsQ7t6E3DDCoQxCgNJeE4A9LYzUJ4RvB', '5D7wsEFq9rXS4cTAfZ8Uo1Dt8aTD3JTKjnHAEn3Ku4mNL1bJ', '5HNJjkjo3KGA3R1DanS82R47tV7G3avEZ8GzLDW9CQtkNjVW']
  const threshold = new BN(2);
  const name = 'lastic-multisig-1';

  const _createMultisig = useCallback(
    (): void => {
      const options = { genesisHash: isDevelopment ? undefined : api.genesisHash.toHex(), name: name.trim() };
      const status = createMultisig(signatories, threshold, options, 'created multisig');

      onStatusChange(status);
      onClose();
    },
    [api.genesisHash, isDevelopment, name, onClose, onStatusChange, signatories, threshold]
  );

  if (!isOpen) return null

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Create Multisig`}
    >
      <div>
          <ModalColumns
            hint={
              <>
                <p>{'The signatories has the ability to create transactions using the multisig and approve transactions sent by others.Once the threshold is reached with approvals, the multisig transaction is enacted on-chain.'}</p>
                <p>{'Since the multisig function like any other account, once created it is available for selection anywhere accounts are used and needs to be funded before use.'}</p>
              </>
            }
          >
            <div>
                {
                    signatories.map((address) => (
                        <AddressMini
                            key={address}
                            value={address}
                            withSidebar={false}
                        />
                    ))
                }
            </div>
          </ModalColumns>
        <ModalColumns hint={'The threshold for approval should be less or equal to the number of signatories for this multisig.'}>
            <p>
                Threshold: {threshold.toString()}
            </p>
            <p>
                Name: {name}
            </p>
        </ModalColumns>
      </div>
        <SecondaryButton
          disabled={false}
          title='Create'
          onClick={_createMultisig}
        />
    </Modal>
  );
}


export default Multisig;