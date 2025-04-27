import React, { useContext, createContext, useState, useEffect } from 'react';
import { useAddress, useMetamask } from '@thirdweb-dev/react';
import { ethers } from 'ethers';

const StateContext = createContext();

// Contract ABI
const contractABI = [{ "inputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "name": "campaigns", "outputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "uint256", "name": "target", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint256", "name": "amountCollected", "type": "uint256" }, { "internalType": "string", "name": "image", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "_owner", "type": "address" }, { "internalType": "string", "name": "_title", "type": "string" }, { "internalType": "string", "name": "_description", "type": "string" }, { "internalType": "uint256", "name": "_target", "type": "uint256" }, { "internalType": "uint256", "name": "_deadline", "type": "uint256" }, { "internalType": "string", "name": "_image", "type": "string" }], "name": "createCampaign", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "donateToCampaign", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "getCampaigns", "outputs": [{ "components": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "string", "name": "title", "type": "string" }, { "internalType": "string", "name": "description", "type": "string" }, { "internalType": "uint256", "name": "target", "type": "uint256" }, { "internalType": "uint256", "name": "deadline", "type": "uint256" }, { "internalType": "uint256", "name": "amountCollected", "type": "uint256" }, { "internalType": "string", "name": "image", "type": "string" }, { "internalType": "address[]", "name": "donators", "type": "address[]" }, { "internalType": "uint256[]", "name": "donations", "type": "uint256[]" }], "internalType": "struct CrowdFunding.Campaign[]", "name": "", "type": "tuple[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_id", "type": "uint256" }], "name": "getDonators", "outputs": [{ "internalType": "address[]", "name": "", "type": "address[]" }, { "internalType": "uint256[]", "name": "", "type": "uint256[]" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "numberOfCampaigns", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }];

export const StateContextProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [contract, setContract] = useState(null);
  
  const address = useAddress();
  const connect = useMetamask();

  useEffect(() => {
    const initializeContract = async () => {
      try {
        console.log('Initializing contract...');
        
        // Create an ethers provider using environment variables
        const provider = new ethers.providers.JsonRpcProvider(
          `https://${import.meta.env.VITE_NETWORK}.infura.io/v3/${import.meta.env.VITE_INFURA_API_KEY}`
        );
        
        // Create contract instance using environment variable
        const contract = new ethers.Contract(
          import.meta.env.VITE_CONTRACT_ADDRESS,
          contractABI,
          provider
        );
        
        console.log('Contract initialized:', contract);
        setContract(contract);
        setIsLoading(false);
      } catch (err) {
        console.error('Error initializing contract:', err);
        setError('Failed to initialize contract: ' + err.message);
        setIsLoading(false);
      }
    };

    initializeContract();
  }, []);

  const publishCampaign = async (form) => {
    try {
      if (!contract) {
        throw new Error('Contract is not initialized. Please make sure you are connected to the correct network.');
      }

      if (!address) {
        throw new Error('Please connect your wallet first');
      }

      // Get signer from MetaMask
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contractWithSigner = contract.connect(signer);

      const data = await contractWithSigner.createCampaign(
        address, // owner
        form.title, // title
        form.description, // description
        form.target, // target
        new Date(form.deadline).getTime(), // deadline
        form.image // image
      );

      console.log("contract call success", data);
      return data;
    } catch (error) {
      console.error("contract call failure", error);
      throw error;
    }
  }

  const getCampaigns = async () => {
    if (!contract) return [];
    
    const campaigns = await contract.getCampaigns();

    const parsedCampaings = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollected: ethers.utils.formatEther(campaign.amountCollected.toString()),
      image: campaign.image,
      pId: i
    }));

    return parsedCampaings;
  }

  const getUserCampaigns = async () => {
    const allCampaigns = await getCampaigns();

    const filteredCampaigns = allCampaigns.filter((campaign) => campaign.owner === address);

    return filteredCampaigns;
  }

  const donate = async (pId, amount) => {
    if (!contract) throw new Error('Contract not initialized');
    
    // Get signer from MetaMask
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const contractWithSigner = contract.connect(signer);

    const data = await contractWithSigner.donateToCampaign(pId, { 
      value: ethers.utils.parseEther(amount)
    });

    return data;
  }

  const getDonations = async (pId) => {
    if (!contract) return [];
    
    const donations = await contract.getDonators(pId);
    const numberOfDonations = donations[0].length;

    const parsedDonations = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonations.push({
        donator: donations[0][i],
        donation: ethers.utils.formatEther(donations[1][i].toString())
      })
    }

    return parsedDonations;
  }

  return (
    <StateContext.Provider
      value={{ 
        address,
        contract,
        connect,
        createCampaign: publishCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonations,
        isLoading,
        error
      }}
    >
      {children}
    </StateContext.Provider>
  )
}

export const useStateContext = () => useContext(StateContext);