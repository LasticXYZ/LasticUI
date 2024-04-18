```
docker build -t substrate-node .
```

```
docker run --rm -it --name my-substrate-node -p 30333:30333 -p 9933:9933 -p 9944:9944 substrate-node
```

Issue:
https://github.com/paritytech/polkadot-sdk/issues/2301
