#!/bin/bash

# Check if the polkadot-sdk directory exists
if [ -d "polkadot-sdk" ]; then
    # If it exists, go into it
    cd polkadot-sdk
    # git pull origin master
else
    # If it doesn't exist, clone it
    git clone git@github.com:paritytech/polkadot-sdk.git
    cd polkadot-sdk
fi

# build cargo
cargo build --release

# run it
./target/release/substrate-node --dev --pruning=archive