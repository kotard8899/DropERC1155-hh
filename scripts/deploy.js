/* eslint-disable prettier/prettier */
const hre = require("hardhat");
const { ethers } = hre;
const DropERC1155ABI = require("../ABI/DropERC1155.json")

async function main() {
  const [deployer] = await ethers.getSigners();
  const [
    TWFactory,
    DropERC1155,
    TWRegistry,
    Forwarder,
    TWFee,
  ] = await Promise.all([
    ethers.getContractFactory("TWFactory"),
    ethers.getContractFactory("DropERC1155"),
    ethers.getContractFactory("contracts/TWRegistry.sol:TWRegistry"),
    ethers.getContractFactory("Forwarder"),
    ethers.getContractFactory("TWFee"),
  ]);

  // 1. deploy
  const forwarder = await Forwarder.deploy();
  await forwarder.deployed();
  const tWRegistry = await TWRegistry.deploy(forwarder.address);
  await tWRegistry.deployed();
  const tWFactory = await TWFactory.deploy(forwarder.address, tWRegistry.address);
  await tWFactory.deployed();
  const tWFee = await TWFee.deploy(forwarder.address, tWFactory.address);
  await tWFee.deployed();
  const dropERC1155 = await DropERC1155.deploy(tWFee.address);
  await dropERC1155.deployed();
  console.log("forwarder deployed to:", forwarder.address);
  console.log("tWRegistry deployed to:", tWRegistry.address);
  console.log("tWFactory deployed to:", tWFactory.address);
  console.log("tWFee deployed to:", tWFee.address);
  console.log("dropERC1155 deployed to:", dropERC1155.address);

  // 2. add DropERC1155 implementation to run EIP1167
  const addImplementation = await tWFactory.addImplementation(dropERC1155.address);
  await addImplementation.wait()
  console.log("DropERC1155 implementation added")

  // add tWFactory as role to tWRegistry
  const grantRole = await tWRegistry.grantRole(
    "0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929",
    tWFactory.address
    )
  await grantRole.wait()
  console.log("role added to tWRegistry")
  
  // 3. deploy DropERC1155 by tWFactory

  // const defaultAdmin = "0x64568ace195d79423a4836e84babe4470c2c2067"
  const defaultAdmin = deployer.address
  const name = "kaonashi"
  const symbol = "kk"
  const contractURI = "ipfs://QmQ5er355Li72tfC98RFRMh466qWkHB9SGEQDQERjNrWdu/0"
  const trustedForwarders = [forwarder.address]
  // const trustedForwarders = ["0xc82bbe41f2cf04e3a8efa18f7032bdd7f6d98a81"]
  const saleRecipient = "0x64568ace195d79423a4836e84babe4470c2c2067"
  const royaltyRecipient = "0x64568ace195d79423a4836e84babe4470c2c2067"
  const royaltyBps = "500" // 5%
  const platformFeeBps = "1000" // 10%
  const platformFeeRecipient = "0x64568ace195d79423a4836e84babe4470c2c2067"

  const initializeSelector = "0xe1591634"

  const _dataForDeployProxy = initializeSelector.concat(
    ethers.utils.defaultAbiCoder.encode(
      ["address", "string", "string", "string", "address[]", "address", "address", "uint128", "uint128", "address"],
      [
        defaultAdmin,
        name,
        symbol,
        contractURI,
        trustedForwarders,
        saleRecipient,
        royaltyRecipient,
        royaltyBps,
        platformFeeBps,
        platformFeeRecipient
      ]
    ).replace("0x", ""))
  const deployProxy = await tWFactory.deployProxy(
    "0x44726F7045524331313535000000000000000000000000000000000000000000", // DropERC1155 type
    _dataForDeployProxy
  );
  await deployProxy.wait()

  const deployedDropERC1155ContractAddress = (await tWRegistry.getAll(deployer.address))[0]
  console.log("DropERC1155 deployed by tWFactory: ", deployedDropERC1155ContractAddress)

  // todo: how to set fee info
  // todo: add change uri function

  // 4. lazy mint
  const dp = new ethers.Contract(deployedDropERC1155ContractAddress, DropERC1155ABI, deployer)
  const lazyMint = await dp.lazyMint(
    1,
    "ipfs://QmZxVQ9xi9URduwZJ2UjWBfkv15r1un293phJgAocRDjrK/"
  )
  await lazyMint.wait()
  console.log("lazy minted")

  // 5. multicall (setContractURI & setClaimConditions)

  // const setContractURISelector = "0x938e3d7b"
  const setClaimConditionsSelector = "0xab073c22"

  const tokenId = 0


  const _dataForSetClaimConditions = setClaimConditionsSelector.concat(
    ethers.utils.defaultAbiCoder.encode(
      [
        "uint256", 
        "tuple(uint256 startTimestamp, uint256 maxClaimableSupply, uint256 supplyClaimed, uint256 quantityLimitPerTransaction, uint256 waitTimeInSecondsBetweenClaims, bytes32 merkleRoot, uint256 pricePerToken, address currency)[]",
        "bool"
      ],
      [
        tokenId,
        [
          {
            startTimestamp: Math.floor(Date.now() / 1000),
            maxClaimableSupply: 100,
            supplyClaimed: 0,
            quantityLimitPerTransaction: ethers.BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
            waitTimeInSecondsBetweenClaims: 100, // 100 seconds
            merkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
            pricePerToken: ethers.utils.parseEther("0.1"),
            currency: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // NATIVE
          }
        ],
        false
      ]
    ).replace("0x", ""))
  const multicall = await dp.multicall(
    [_dataForSetClaimConditions]
  );
  await multicall.wait()
  const getClaimConditionById = await dp.getClaimConditionById(0, 0)
  console.log(getClaimConditionById)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
