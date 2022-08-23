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
    maxNum: 10,
    price: ethers.utils.parseEther("0.75"),
  }
  
  const infoEpic = {
    maxNum: 30,
    price: ethers.utils.parseEther("0.5"),
  }

  const infoRare = {
    maxNum: 2,
    price: ethers.utils.parseEther("0.1"),
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

  // 測試用
  // approve deployer to zeeverseTicket
  const wethContract = new ethers.Contract(weth, IERC20ABI, deployer)
  const MAX_APPROVAL = ethers.BigNumber.from(2).pow(118);

  const approveTx = await wethContract.approve(zeeverseTicket.address, MAX_APPROVAL)
  await approveTx.wait()
  console.log("weth approved")

  // mint
  await zeeverseTicket.mint({ levelType: 2, attrType: 0})
  console.log("token minted")
  await zeeverseTicket.mint({ levelType: 2, attrType: 0})
  console.log("token minted")
  await zeeverseTicket.mint({ levelType: 1, attrType: 0})
  console.log("token minted")
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
