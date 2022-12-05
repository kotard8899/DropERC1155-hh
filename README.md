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
npx hardhat verify --network ftmt 0x2af1DC50665a92599423Fdd511Cd383ecb3dA763
```


npx hardhat verify --network goerli --constructor-args arguments.js "0x4d12cBefD886f4DFC08b85C78FFE0f0043bBDB85"