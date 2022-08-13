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
npx hardhat run scripts/deploy_new.js --network rinkeby
npx hardhat run scripts/deploy_new.js --network matic
```

# Verify
```shell
npx hardhat verify --network mainnet DEPLOYED_CONTRACT_ADDRESS "Constructor argument 1"
```


npx hardhat verify --network rinkeby --constructor-args arguments.js 0x1430b4f15B31E9E83C61206F8BA72Fd83586E425