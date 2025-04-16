/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: {
    version: '0.8.9',
    defaultNetwork: 'localhost',
    networks: {
      hardhat: {},
      goerli: {
        url: 'https://rpc.ankr.com/eth_goerli',
        accounts: [`0x${process.env.PRIVATE_KEY}`]
      },
      sepolia: {
        url: "https://sepolia.infura.io/v3/<key>",
        accounts: [privateKey1, privateKey2, ...]
      }
  
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainID: 1337,
    },
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
};
