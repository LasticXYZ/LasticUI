// Copyright 2017-2024 @polkadot/app-accounts authors & contributors
// SPDX-License-Identifier: Apache-2.0

//import type { ActionStatus } from '@polkadot/react-components/Status/types';
import type { HexString } from '@polkadot/util/types';
import type { ModalProps } from './types.js';

import React, { useCallback, useState } from 'react';

//import { AddressMini, Button, IconLink, Input, InputAddressMulti, InputFile, InputNumber, Labelled, Modal, Toggle } from '@polkadot/react-components';
import IconLink from '@/app/(App)/listings/IconLink.jsx';
import InputComp from '@/app/(App)/listings/InputComp.jsx';
import InputFile from '@/app/(App)/listings/InputFileProps.jsx';
import InputNumber from '@/app/(App)/listings/InputNumber.jsx';
import Labelled from '@/app/(App)/listings/Labelled.jsx';
import ToggleComp from '@/app/(App)/listings/ToggleComp.jsx';
import SecondaryButton from '@/components/button/SecondaryButton.jsx';
import { keyring } from '@polkadot/ui-keyring';
import { BN, u8aToString } from '@polkadot/util';
import { validateAddress } from '@polkadot/util-crypto';
import { useInkathon } from '@poppyseed/lastic-sdk';
import ModalColumns from './Modal-Col';

//import useKnownAddresses from '../Accounts/useKnownAddresses.js';

interface MultisigActionStatus {
    action: string;
    status: 'success' | 'error' | 'pending'; // Or any other status values you need
    message?: string;
    account?: string; // Include other fields as necessary
  }
  
interface Props extends ModalProps {
    className?: string;
    onClose: () => void;
    onStatusChange: (status: MultisigActionStatus) => void; // Updated to use new type
}
  
interface CreateOptions {
  genesisHash?: HexString;
  name: string;
  tags?: string[];
}

interface UploadedFileData {
  isUploadedFileValid: boolean;
  uploadedFileError: string;
  uploadedSignatories: string[];
}

const MAX_SIGNATORIES = 16;
const BN_TWO = new BN(2);

function parseFile (file: Uint8Array): UploadedFileData {
  let uploadError = '';
  let items: string[];

  try {
    items = JSON.parse(u8aToString(file)) as string[];
    if (!Array.isArray(items) || !items.length) {
        throw new Error('JSON file should contain an array of signatories');
      }
  
    //asserArray.isArray(items) && !!items.length, 'JSON file should contain an array of signatories';

    items = items.filter((item) => validateAddress(item));
    items = Array.from(new Set(items))  // remove duplicates

    if (items.length > MAX_SIGNATORIES) {
        throw new Error(`Maximum you can have ${MAX_SIGNATORIES} signatories`);
      }
    } catch (error) {
    items = [];
    uploadError = (error as Error).message ? (error as Error).message : (error as Error).toString();
  }

  return {
    isUploadedFileValid: !uploadError,
    uploadedFileError: uploadError,
    uploadedSignatories: items
  };
}

function createMultisig (signatories: string[], threshold: BN | number, { genesisHash, name, tags = [] }: CreateOptions, success: string): MultisigActionStatus {
  // we will fill in all the details below
  const status: MultisigActionStatus = { action: 'create', status: 'pending' }; 

  try {
    const result = keyring.addMultisig(signatories, threshold, { genesisHash, name, tags });
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

export default function Multisig ({ onClose, onStatusChange }: Props): React.ReactElement<Props> {
  const { api } = useInkathon();
  const isDevelopment = false;
  if (!api) {
    return <div>API not available</div>;
  }
  const availableSignatories = ['5FLRCTbjEwumqTcMYsQ7t6E3DDCoQxCgNJeE4A9LYzUJ4RvB', '5D7wsEFq9rXS4cTAfZ8Uo1Dt8aTD3JTKjnHAEn3Ku4mNL1bJ', '5HNJjkjo3KGA3R1DanS82R47tV7G3avEZ8GzLDW9CQtkNjVW']
  const [{ isNameValid, name }, setName] = useState({ isNameValid: false, name: '' });
  const [{ isUploadedFileValid, uploadedFileError, uploadedSignatories }, setUploadedFile] = useState<UploadedFileData>({
    isUploadedFileValid: true,
    uploadedFileError: '',
    uploadedSignatories: []
  });
  const [signatories, setSignatories] = useState<string[]>(['']);
  const [showSignaturesUpload, setShowSignaturesUpload] = useState(false);
  const [{ isThresholdValid, threshold }, setThreshold] = useState({ isThresholdValid: true, threshold: BN_TWO });

  const _createMultisig = useCallback(
    (): void => {
      const options = { genesisHash: isDevelopment ? undefined : api.genesisHash.toHex(), name: name.trim() };
      const status = createMultisig(signatories, threshold, options, 'created multisig');

      onStatusChange(status);
      onClose();
    },
    [api.genesisHash, isDevelopment, name, onClose, onStatusChange, signatories, threshold]
  );

  const _onChangeName = useCallback(
    (name: string) => setName({ isNameValid: (name.trim().length >= 3), name }),
    []
  );

  const _onChangeThreshold = useCallback(
    (threshold: BN | undefined) =>
      threshold && setThreshold({ isThresholdValid: threshold.gte(BN_TWO) && threshold.lten(signatories.length), threshold }),
    [signatories]
  );

  const _onChangeFile = useCallback(
    (file: Uint8Array) => {
      const fileData = parseFile(file);

      setUploadedFile(fileData);

      if (fileData.isUploadedFileValid || uploadedSignatories.length) {
        setSignatories(fileData.uploadedSignatories.length ? fileData.uploadedSignatories : ['']);
      }
    },
    [uploadedSignatories]
  );

  const resetFileUpload = useCallback(
    () => {
      setUploadedFile({
        isUploadedFileValid,
        uploadedFileError,
        uploadedSignatories: []
      });
    },
    [uploadedFileError, isUploadedFileValid]
  );

  const _onChangeAddressMulti = useCallback(
    (items: string[]) => {
      resetFileUpload();
      setSignatories(items);
    },
    [resetFileUpload]
  );

  const isValid = isNameValid && isThresholdValid;

  return (
    <div
    >
        <div> Add Multisig</div>
      <div>
        <ModalColumns>
          <ToggleComp
            label={'Upload JSON file with signatories'}
            onChange={setShowSignaturesUpload}
            value={showSignaturesUpload}
          />
        </ModalColumns>
        {!showSignaturesUpload && (
          <ModalColumns
            hint={
              <>
                <p>{'The signatories has the ability to create transactions using the multisig and approve transactions sent by others.Once the threshold is reached with approvals, the multisig transaction is enacted on-chain.'}</p>
                <p>{'Since the multisig function like any other account, once created it is available for selection anywhere accounts are used and needs to be funded before use.'}</p>
              </>
            }
          >
            <InputAddressMulti
              available={availableSignatories}
              label='available signatories'
              maxCount={MAX_SIGNATORIES}
              onChange={_onChangeAddressMulti}
              value={signatories}
              help='Select signatories for the multisig wallet' // Example help text

            />
          </ModalColumns>
        )}
        {showSignaturesUpload && (
          <ModalColumns hint={'Supply a JSON file with the list of signatories.'}>
            <InputFile
              className='full'
              clearContent={!uploadedSignatories.length && isUploadedFileValid}
              isError={!isUploadedFileValid}
              label={'upload signatories list'}
              onChange={_onChangeFile}
              withLabel
            />
            {!!uploadedSignatories.length && (
              <Labelled
                label={'found signatories'}
                labelExtra={(
                  <IconLink
                    icon='sync'
                    label={'Reset'}
                    onClick={resetFileUpload}
                  />
                )}
              >
                <div className='ui--Static ui dropdown selection'>
                  {uploadedSignatories.map((address): React.ReactNode => (
                    <div key={address}>
                      <AddressMini
                        value={address}
                        withSidebar={false}
                      />
                    </div>
                  ))}
                </div>
              </Labelled>
            )}
            {uploadedFileError && (
              <div>{uploadedFileError}</div>
            )}
          </ModalColumns>
        )}
        <ModalColumns hint={'The threshold for approval should be less or equal to the number of signatories for this multisig.'}>
          <InputNumber
            isError={!isThresholdValid}
            label={'threshold'}
            onChange={_onChangeThreshold}
            value={threshold}
          />
        </ModalColumns>
        <ModalColumns hint={'The name is for unique identification of the account in your owner lists.'}>
          <InputComp
            autoFocus
            value={name}
            isError={!isNameValid}
            label={'name'}
            onChange={_onChangeName}
            placeholder={'multisig name'}
          />
        </ModalColumns>
      </div>
        <SecondaryButton
          disabled={!isValid}
          title='Create'
          onClick={_createMultisig}
        />
    </div>
  );
}
