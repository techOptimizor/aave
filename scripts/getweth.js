const { getNamedAccounts, ethers } = require("hardhat")
const AMOUNT = ethers.utils.parseEther("0.5")
async function getWeth() {
    const { deployer } = await getNamedAccounts()
    //0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2
    const iweth = await ethers.getContractAt(
        "IWeth",
        "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2",
        deployer
    )
    const tx = await iweth.deposit({ value: AMOUNT })
    await tx.wait(1)

    const wethbal = await iweth.balanceOf(deployer)
    console.log(`got ${wethbal.toString()} WETH`)
}
module.exports = { getWeth, AMOUNT }
