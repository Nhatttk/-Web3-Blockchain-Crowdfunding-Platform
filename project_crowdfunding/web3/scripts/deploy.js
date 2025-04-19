const { ethers } = require("hardhat");

async function main() {
  // Get the contract factory
  const CrowdFunding = await ethers.getContractFactory("CrowdFunding");
  
  // Deploy the contract
  console.log("Deploying CrowdFunding...");
  const crowdFunding = await CrowdFunding.deploy();
  
  // Wait for deployment to finish
  await crowdFunding.deployed();
  
  console.log("CrowdFunding deployed to:", crowdFunding.address);
}

// Handle errors
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  }); 