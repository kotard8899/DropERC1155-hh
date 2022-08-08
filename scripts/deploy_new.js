/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
const hre = require("hardhat");
const { ethers } = hre;

  // todo: how to set fee info

function delay(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const [
    DropERC1155_NEW,
  ] = await Promise.all([
    ethers.getContractFactory("DropERC1155_NEW"),
  ]);

  const twFeeAddress = "0x671aE36db5A4A107607369C699B3Fdfeafa582f5"
  const _defaultAdmin = deployer.address
  const _name = "HHH testing"
  const _symbol = "HHH"
  const _contractURI = "ipfs://QmcGAreyeaEhMqVgeUwcScp121tUww46cAAuqsYwwk6Mwd/0"
  const _trustedForwarders = []
  const _saleRecipient = deployer.address
  const _royaltyRecipient = deployer.address
  const _royaltyBps = 500
  const _platformFeeBps = 0
  const _platformFeeRecipient = deployer.address

  const dropERC1155_NEW = await DropERC1155_NEW.deploy(
    twFeeAddress, // TWFee
    _defaultAdmin, // _defaultAdmin
    _name, // _name
    _symbol, // /symbol
    _contractURI, // _contractURI
    _trustedForwarders, // _trustedForwarders
    _saleRecipient, // _saleRecipient
    _royaltyRecipient, // _royaltyRecipient
    _royaltyBps, // _royaltyBps
    _platformFeeBps, // _platformFeeBps
    _platformFeeRecipient // _platformFeeRecipient
  );
  await dropERC1155_NEW.deployed();

  console.log(dropERC1155_NEW.address)

  await delay(10000)

  await hre.run("verify:verify", {
    address: dropERC1155_NEW.address,
    constructorArguments: [
      twFeeAddress, // TWFee
      _defaultAdmin, // _defaultAdmin
      _name, // _name
      _symbol, // /symbol
      _contractURI, // _contractURI
      _trustedForwarders, // _trustedForwarders
      _saleRecipient, // _saleRecipient
      _royaltyRecipient, // _royaltyRecipient
      _royaltyBps, // _royaltyBps
      _platformFeeBps, // _platformFeeBps
      _platformFeeRecipient // _platformFeeRecipient
    ],
  });
  
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
