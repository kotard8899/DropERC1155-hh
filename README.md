# Installation

```shell
npm install
```

# Compile
```shell
npx hardhat compile
```

# Deploy
```shell
npx hardhat run scripts/deploy.js --network ftmt
npx hardhat run scripts/deploy_zee.js --network matic
```

# Verify
```shell 
npx hardhat verify --network eth --contract contracts/TWRegistry.sol:TWRegistry 0x01186573bb6d22f192a444de4f4611cfa73e9699 "0xb7cd670aaa45eba95e53df7800bddc7709ee6261" 
```


npx hardhat verify --network goerli --constructor-args arguments.js "0x4d12cBefD886f4DFC08b85C78FFE0f0043bBDB85"