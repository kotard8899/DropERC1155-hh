/* eslint-disable prettier/prettier */
const hre = require("hardhat");
const { ethers } = hre;
const DropERC1155ABI = require("../ABI/DropERC1155.json")

  // todo: how to set fee info

async function main() {
  const [deployer] = await ethers.getSigners();
  const [
    TWFactory,
    BasicERC1155,
    DropERC1155,
    BasicERC721,
    BasicERC721LimitedEdition,
    DropERC721,
    SignatureDrop,
    TWRegistry,
    Forwarder,
    TWFee,
  ] = await Promise.all([
    ethers.getContractFactory("TWFactory"),
    ethers.getContractFactory("BasicERC1155"),
    ethers.getContractFactory("DropERC1155"),
    ethers.getContractFactory("BasicERC721"),
    ethers.getContractFactory("BasicERC721LimitedEdition"),
    ethers.getContractFactory("DropERC721"),
    ethers.getContractFactory("SignatureDrop"),
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
  const basicERC721 = await BasicERC721.deploy();
  await basicERC721.deployed();
  const basicERC721LimitedEdition = await BasicERC721LimitedEdition.deploy();
  await basicERC721LimitedEdition.deployed();
  const basicERC1155 = await BasicERC1155.deploy();
  await basicERC1155.deployed();
  // const tWFee = await TWFee.deploy(forwarder.address, tWFactory.address);
  // await tWFee.deployed();
  // const dropERC1155 = await DropERC1155.deploy(tWFee.address);
  // await dropERC1155.deployed();
  // const dropERC721 = await DropERC721.deploy();
  // await dropERC721.deployed();
  const signatureDrop = await SignatureDrop.deploy();
  await signatureDrop.deployed();
  console.log("forwarder deployed to:", forwarder.address);
  console.log("tWRegistry deployed to:", tWRegistry.address);
  console.log("tWFactory deployed to:", tWFactory.address);
  console.log("basicERC721 deployed to:", basicERC721.address);
  console.log("BasicERC721LimitedEdition deployed to:", basicERC721LimitedEdition.address);
  console.log("basicERC1155 deployed to:", basicERC1155.address);
  // console.log("tWFee deployed to:", tWFee.address);
  // console.log("dropERC1155 deployed to:", dropERC1155.address);
  // console.log("dropERC721 deployed to:", dropERC721.address);
  console.log("signatureDrop deployed to:", signatureDrop.address);

  // 2. add DropERC1155 implementation to run EIP1167
  // const addImplementation = await tWFactory.addImplementation(dropERC1155.address);
  // const addImplementation2 = await tWFactory.addImplementation(dropERC721.address);
  const addImplementation3 = await tWFactory.addImplementation(signatureDrop.address);
  const addImplementation4 = await tWFactory.addImplementation(basicERC721.address);
  const addImplementation5 = await tWFactory.addImplementation(basicERC721LimitedEdition.address);
  const addImplementation6 = await tWFactory.addImplementation(basicERC1155.address);
  // await addImplementation.wait()
  // await addImplementation2.wait()
  await addImplementation3.wait()
  await addImplementation4.wait()
  await addImplementation5.wait()
  await addImplementation6.wait()
  console.log("implementation added")

  // add tWFactory as role to tWRegistry
  const grantRole = await tWRegistry.grantRole(
    "0x97667070c54ef182b0f5858b034beac1b6f3089aa2d3188bb1e8929f4fa9b929",
    tWFactory.address
  )
  await grantRole.wait()
  console.log("role added to tWRegistry")
  
  // 3. deploy DropERC1155 by tWFactory

  // const defaultAdmin = "0x64568ace195d79423a4836e84babe4470c2c2067"
  // const defaultAdmin = deployer.address
  // const name = "sig"
  // const symbol = "ss"
  // const contractURI = "ipfs://QmQ5er355Li72tfC98RFRMh466qWkHB9SGEQDQERjNrWdu/0"
  // const trustedForwarders = [forwarder.address]
  // // const trustedForwarders = ["0xc82bbe41f2cf04e3a8efa18f7032bdd7f6d98a81"]
  // const saleRecipient = "0x64568ace195d79423a4836e84babe4470c2c2067"
  // const royaltyRecipient = "0x64568ace195d79423a4836e84babe4470c2c2067"
  // const royaltyBps = "500" // 5%
  // const platformFeeBps = "1000" // 10%
  // const platformFeeRecipient = "0x64568ace195d79423a4836e84babe4470c2c2067"
  // const extraParam = {
  //   baseURI_: "baseuri",
  //   _price: 100,
  //   _SALE_TIME_START: 0,
  //   _SALE_TIME_END: 0,
  // }
  // const initializeSelector = "0xe1591634"

  // const _dataForDeployProxy = initializeSelector.concat(
  //   ethers.utils.defaultAbiCoder.encode(
  //     ["address", "string", "string", "string", "address[]", "address", "address", "uint128", "uint128", "address"],
  //     [
  //       defaultAdmin,
  //       name,
  //       symbol,
  //       contractURI,
  //       trustedForwarders,
  //       saleRecipient,
  //       royaltyRecipient,
  //       royaltyBps,
  //       platformFeeBps,
  //       platformFeeRecipient
  //     ]
  //   ).replace("0x", "")
  // )
  // const deployProxy = await tWFactory.deployProxy(
  //   // "0x44726f7045524337323100000000000000000000000000000000000000000000" // DropERC721 type
  //   // "0x44726F7045524331313535000000000000000000000000000000000000000000", // DropERC1155 type
  //   // "0x4261736963455243373231000000000000000000000000000000000000000000", // BasicERC721 type
  //   "0x5369676e617475726544726f7000000000000000000000000000000000000000", // SignatureDrop type
  //   _dataForDeployProxy
  // );
  // await deployProxy.wait()

  // const deployedDropERC1155ContractAddress = (await tWRegistry.getAll(deployer.address))[0]
  // console.log("DropERC1155 deployed by tWFactory: ", deployedDropERC1155ContractAddress)

  // 4. lazy mint
  // const dp = new ethers.Contract(deployedDropERC1155ContractAddress, DropERC1155ABI, deployer)
  // const mint = await dp.mint(
  //   "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE",{
  //     value: 100
  //   }
  // )
  // await mint.wait()
  // console.log("minted")

  // 5. multicall (setContractURI & setClaimConditions)

  // const setContractURISelector = "0x938e3d7b"
  // const setClaimConditionsSelector = "0xab073c22" // 1155

  // const tokenId = 0

  // const _dataForSetClaimConditions = setClaimConditionsSelector.concat(
  //   ethers.utils.defaultAbiCoder.encode(
  //     [
  //       "uint256", 
  //       "tuple(uint256 startTimestamp, uint256 maxClaimableSupply, uint256 supplyClaimed, uint256 quantityLimitPerTransaction, uint256 waitTimeInSecondsBetweenClaims, bytes32 merkleRoot, uint256 pricePerToken, address currency)[]",
  //       "bool"
  //     ],
  //     [
  //       tokenId,
  //       [
  //         {
  //           startTimestamp: Math.floor(Date.now() / 1000),
  //           maxClaimableSupply: 100,
  //           supplyClaimed: 0,
  //           quantityLimitPerTransaction: ethers.BigNumber.from("0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff"),
  //           waitTimeInSecondsBetweenClaims: 100, // 100 seconds
  //           merkleRoot: "0x0000000000000000000000000000000000000000000000000000000000000000",
  //           pricePerToken: ethers.utils.parseEther("0.1"),
  //           currency: "0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee", // NATIVE
  //         }
  //       ],
  //       false
  //     ]
  //   ).replace("0x", "")
  // )
  // const multicall = await dp.multicall(
  //   [_dataForSetClaimConditions]
  // );
  // await multicall.wait()
  // const getClaimConditionById = await dp.getClaimConditionById(0, 0)
  // console.log(getClaimConditionById)

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
