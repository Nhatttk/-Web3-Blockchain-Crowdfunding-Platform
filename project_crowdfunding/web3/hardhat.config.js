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
  defaultNetwork: 'sepolia',
  networks: {
    hardhat: {},
    localhost: {
      url: "http://127.0.0.1:9999",  
      chainId: 12345,               
    },
    sepolia: {
      url: `https://sepolia.infura.io/v3/e0e188cd187c45c5ae1d46b72737c648`,
      accounts: ["c02409562e2b6cf95f015113045f815d1e9fa4e3a7bf14f8b8cc04d828dbebd3"],
      // accounts: privateKey !== undefined ? [privateKey] : [],
      chainId: 11155111,
    },
    aeneid: {
      url: `https://aeneid.storyrpc.io`,
      accounts: ["59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"],
      chainId: 1315,
    },
    storyTestnet: {
      chainId: 1315,
      url: "https://aeneid.storyrpc.io",
      accounts: ["59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d"],
      // ledgerAccounts,
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
