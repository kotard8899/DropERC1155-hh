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


