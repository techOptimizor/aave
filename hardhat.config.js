/** @type import('hardhat/config').HardhatUserConfig */

require("@nomiclabs/hardhat-waffle")
require("@nomiclabs/hardhat-ethers")
require("@nomiclabs/hardhat-etherscan")
require("hardhat-deploy")
require("solidity-coverage")
require("hardhat-gas-reporter")
require("dotenv").config()

const PRIVATE_KEY = process.env.PRIVATE_KEY
const RINKEBY_URL = process.env.RINKEBY_RUL
const ETHERSCAN = process.env.ETHERSCAN
const COINMARTCAP = process.env.COINMARTCAP
const MAINNET = process.env.MAINNET_URL

module.exports = {
    defaultNetwork: "hardhat",
    networks: {
        hardhat: {
            chainId: 31337,
            blockCon: 1,
            forking: {
                url: MAINNET,
            },
        },
        rinkeby: {
            chainId: 4,
            blockCon: 6,
            url: RINKEBY_URL,
            accounts: [PRIVATE_KEY],
        },
    },
    solidity: {
        compilers: [{ version: "0.8.9" }, { version: "0.4.19" }, { version: "0.6.12" }],
    },
    namedAccounts: {
        deployer: {
            default: 0,
        },
        player: {
            default: 1,
        },
    },
    etherscan: {
        // yarn hardhat verify --network <NETWORK> <CONTRACT_ADDRESS> <CONSTRUCTOR_PARAMETERS>
        apiKey: {
            rinkeby: ETHERSCAN,
        },
    },
    gasReporter: {
        enabled: true,
        currency: "USD",
        coinmarketcap: COINMARTCAP,
        //token: "MATIC",
    },
    mocha: {
        timeout: 500000, // 500 seconds max for running tests
    },
}
