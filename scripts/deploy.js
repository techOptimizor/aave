const { ethers, getNamedAccounts } = require("hardhat")
const { getWeth, AMOUNT } = require("../scripts/getweth")

async function main() {
    await getWeth()
    const { deployer } = await getNamedAccounts()
    //lendingPool = 0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5
    const lendingPool = await getAddress(deployer)
    console.log(`lendingpool adress ${lendingPool.address}`)
    //deposit
    const wethTokenAdd = "0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2"
    await Approve(wethTokenAdd, lendingPool.address, AMOUNT, deployer)
    console.log("depositing...")
    lendingPool.deposit(wethTokenAdd, AMOUNT, deployer, 0)
    console.log("Deposited!")
    let data = await getBorrowUserData(lendingPool, deployer)
    const DaiETH = await getDaiprice()
    const amountDaiToborrow =
        (await data.availableBorrowsETH.toString()) * 0.95 * (1 / DaiETH.toNumber())
    console.log(`you can borrow ${amountDaiToborrow} DAI`)
    const DAI = ethers.utils.parseEther(amountDaiToborrow.toString())

    //borrow
    const daiAddress = "0x6B175474E89094C44Da98b954EedeAC495271d0F"
    await borrow(daiAddress, lendingPool, DAI, deployer)
    await getBorrowUserData(lendingPool, deployer)
    await repay(DAI, daiAddress, lendingPool, deployer)
    await getBorrowUserData(lendingPool, deployer)
}
async function borrow(daiAdd, lendingPool, amountDaiToborrow, account) {
    const borrowtx = await lendingPool.borrow(daiAdd, amountDaiToborrow, 1, 0, account)
    await borrowtx.wait(1)
    console.log("you have borrowed token")
    console.log("______________________________________________________________")
}
async function repay(amount, daiAddress, lendingPool, account) {
    await Approve(daiAddress, lendingPool.address, amount, account)
    const repaytx = await lendingPool.repay(daiAddress, amount, 1, account)
    repaytx.wait(1)
    console.log(`Repaid!`)
    console.log("______________________________________________________________")
}
async function getAddress(account) {
    const lendingPoolAddProvider = await ethers.getContractAt(
        "ILendingPoolAddressesProvider",
        "0xB53C1a33016B2DC2fF3653530bfF1848a515c8c5",
        account
    )
    const lendingPoolAdd = await lendingPoolAddProvider.getLendingPool()
    const lendingPool = await ethers.getContractAt("ILendingPool", lendingPoolAdd, account)
    return lendingPool
}

async function Approve(ercContractAdd, spenderAdd, amount, account) {
    const erc20Token = await ethers.getContractAt("IWeth", ercContractAdd, account)
    const tx = await erc20Token.approve(spenderAdd, amount)
    await tx.wait(1)
    console.log("Approved!")
}

async function getBorrowUserData(lendingPool, account) {
    const data = await lendingPool.getUserAccountData(account)
    console.log(`you have ${data.totalCollateralETH} worth of ETH deposited`)
    console.log(`you have ${data.totalDebtETH} worth of ETH borrowed`)
    console.log(`you can borrow ${data.availableBorrowsETH} worth of ETH`)
    //console.log(`your health factor is ${data.healthFactor} worth of ETH`)
    return data
}
async function getDaiprice() {
    const daiETHPrice = await ethers.getContractAt(
        "AggregatorV3Interface",
        "0x773616E4d11A78F511299002da57A0a94577F1f4"
    )
    const price = (await daiETHPrice.latestRoundData())[1]
    console.log(`the price daiETH is ${price.toString()}`)
    return price
}

main().catch((error) => {
    console.error(error)
    process.exitCode = 1
})
