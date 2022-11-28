/* eslint-disable camelcase */
/* eslint-disable prettier/prettier */
const hre = require("hardhat");
const { ethers } = hre;
const IERC20ABI = require("../ABI/IERC20.json")

  // todo: how to set fee info

function delay(milliseconds){
  return new Promise(resolve => {
      setTimeout(resolve, milliseconds);
  });
}

async function main() {
  const [deployer] = await ethers.getSigners();
  const ZeeverseTicket = await ethers.getContractFactory("ZeeverseTicket")

  // constructor params
  const fundReceiver = "0x64568ACE195D79423a4836e84BabE4470c2C2067"
  const _uri = "ipfs://QmdRgYQSMPyjpuZgLTAqSWzqhxyoRPw6HWB2Xx8HJM5scE/"
  const weth = "0xc778417e063141139fce010982780140aa0cd5ab"

  const infoLegend = {
    maxNum: 9,
    price: ethers.utils.parseEther("0.9"),
  }
  
  const infoEpic = {
    maxNum: 30,
    price: ethers.utils.parseEther("0.5"),
  }

  const infoRare = {
    maxNum: 60,
    price: ethers.utils.parseEther("0.125"),
  }

  const zeeverseTicket = await ZeeverseTicket.deploy(
    fundReceiver,
    _uri,
    weth,
    infoLegend,
    infoEpic,
    infoRare
  );
  await zeeverseTicket.deployed();

  console.log(zeeverseTicket.address)

  await delay(25000)
  await hre.run("verify:verify", {
    address: zeeverseTicket.address,
    constructorArguments: [
      fundReceiver,
      _uri,
      weth,
      infoLegend,
      infoEpic,
      infoRare
    ]
  });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
