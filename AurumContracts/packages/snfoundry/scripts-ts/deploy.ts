import {
  deployContract,
  executeDeployCalls,
  exportDeployments,
  deployer,
} from "./deploy-contract";
import { green } from "./helpers/colorize-log";

const deployScript = async (): Promise<void> => {
  // 1. Deploy USDC token first
  const initialSupply = BigInt(1000000) * BigInt(10 ** 6); // 1M USDC with 6 decimals
  const usdcDeployment = await deployContract({
    contract: "AurumUsdc",
    constructorArgs: {
      initial_supply: initialSupply,
      recipient: deployer.address,
    },
  });

  // 2. Deploy AurumRewardPoints (will be managed by AurumReward)
  const rewardPointsDeployment = await deployContract({
    contract: "AurumRewardPoints",
    constructorArgs: {
      reward_manager: deployer.address, // Temporarily set to deployer, will update after AurumReward deployment
    },
  });

  // 3. Deploy AurumReward
  const rewardDeployment = await deployContract({
    contract: "AurumReward",
    constructorArgs: {
      usdc_address: usdcDeployment.address,
      reward_points_address: rewardPointsDeployment.address,
    },
  });

  // 4. Update reward_manager in AurumRewardPoints
  await executeDeployCalls();

  // TODO: 
  // await deployer.execute([{
  //   contractAddress: rewardPointsDeployment.address,
  //   entrypoint: "set_reward_manager",
  //   calldata: [rewardDeployment.address]
  // }], {
  //   maxFee: "100000000000000"
  // });
};

deployScript()
  .then(async () => {
    exportDeployments();
    console.log(green("All Setup Done"));
  })
  .catch(console.error);
