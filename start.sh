#!/bin/bash

# Check if the polkadot-sdk directory exists
if [ -d "polkadot-sdk" ]; then
    # If it exists, go into it
    cd polkadot-sdk
else
    # If it doesn't exist, clone it
    git clone git@github.com:paritytech/polkadot-sdk.git
    cd polkadot-sdk
fi

# Navigate to the substrate directory
cd substrate

# Reset to the specified commit
git reset --hard 9e1447042b648149d515d53ccdef3bd3e4e37ef6

# Run the node-cli package in release mode with --dev
cargo run -p node-cli -r -- --dev
