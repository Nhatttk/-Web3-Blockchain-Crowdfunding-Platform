require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.9',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  defaultNetwork: 'localhost',
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
    },
    // goerli: {
    //   url: 'https://rpc.ankr.com/eth_goerli',
    //   accounts: [`0x${process.env.PRIVATE_KEY}`]
    // },
    // sepolia: {
    //   url: "https://sepolia.infura.io/v3/<key>",
    //   accounts: [`0x${process.env.PRIVATE_KEY}`]
    // }
  }
};
