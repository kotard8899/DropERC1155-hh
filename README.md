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
npx hardhat run scripts/deploy_zee.js --network rinkeby
npx hardhat run scripts/deploy_zee.js --network matic
```

# Verify
```shell
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
```


npx hardhat verify --network matic --constructor-args arguments.js <contractAddress>