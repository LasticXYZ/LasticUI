# Build stage for Substrate
FROM rust:latest as builder

# Install necessary build dependencies including cryptography package
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    cmake \
    pkg-config \
    libssl-dev \
    clang \
    libclang-dev \
    protobuf-compiler \
    git \
    ca-certificates \
    llvm \
    libudev-dev \
    make \
    && rm -rf /var/lib/apt/lists/*

# Clone the GitHub repository
RUN git clone https://github.com/paritytech/polkadot-sdk.git

# Set the working directory to the cloned repository
WORKDIR /polkadot-sdk

# Checkout a specific release
RUN git config --global user.email "you@example.com"
RUN git config --global user.name "Your Name"
RUN git checkout release-polkadot-v1.3.0

# Install Rust toolchain and configure it
RUN rustup update && \
    rustup default stable && \
    rustup target add wasm32-unknown-unknown && \
    rustup update nightly && \
    rustup target add wasm32-unknown-unknown --toolchain nightly

# Build the project
RUN cargo build --release

# Use a smaller base image for the runtime environment
FROM debian:bookworm-slim as runtime

# Copy the built binary from the builder stage
COPY --from=builder /polkadot-sdk/target/release/substrate-node /usr/local/bin

# Expose necessary ports
EXPOSE 30333 9933 9944 9615

# Command to run the binary
CMD ["/usr/local/bin/substrate-node", "--dev", "--unsafe-rpc-external", "--rpc-cors", "all"]
