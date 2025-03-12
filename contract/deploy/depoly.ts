import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { Contract } from "ethers";

const deployYourContract: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployer } = await hre.getNamedAccounts();

  console.log("Deploying contract with the account:", deployer);

  const { deploy } = hre.deployments;

  await deploy("CrowdFund", {
    from: deployer,
    // Contract constructor arguments
    log: true,
    // autoMine: can be passed to the deploy function to make the deployment process faster on local networks by
    // automatically mining the contract deployment transaction. There is no effect on live networks.
    autoMine: true,
  });

  // Get the deployed contract to interact with it after deploying.
  const crowdFund = await hre.ethers.getContract<Contract>("CrowdFund", deployer);

  // Initialize the contract
  const protocolWallet = deployer; // Replace with actual protocol wallet address if needed
  const tx = await crowdFund.initialize(protocolWallet);
  await tx.wait();
  console.log("CrowdFund initialized with protocol wallet:", protocolWallet);
};

export default deployYourContract;
