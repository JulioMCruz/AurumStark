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
  // TODO: FIX
  /**
   *  Error in the called contract (contract address: 0x053600188f3fe9d6b426f45e5bd6f50209ed444d416913369f2776b27d0013f2, class hash: 0x0000000000000000000000000000000000000000000000000000000000000000, selector: 0x03c79e1eb9c3041bf771d2033e3789a9606f91a5548aa0e26dbe0ac11427df19):\n' +
        'Requested contract address 0x053600188f3fe9d6b426f45e5bd6f50209ed444d416913369f2776b27d0013f2 is not deployed.
   */
  // await deployer.execute([{
  //   contractAddress: rewardPointsDeployment.address,
  //   entrypoint: "set_reward_manager",
  //   calldata: [rewardDeployment.address]
  // }]);
};

deployScript()
  .then(async () => {
    executeDeployCalls()
      .then(() => {
        exportDeployments();
        console.log(green("All Setup Done"));
      })
      .catch((e) => {
        console.error(e);
        process.exit(1);
      });
  })
  .catch(console.error);
