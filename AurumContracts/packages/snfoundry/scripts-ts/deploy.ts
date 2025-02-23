import {
  deployContract,
  executeDeployCalls,
  exportDeployments,
  deployer,
} from "./deploy-contract";
import { green } from "./helpers/colorize-log";

const deployScript = async (): Promise<void> => {
  // Deploy AurumUsdc with initial supply of 1 million USDC (6 decimals)
  const initialSupply = BigInt(1000000) * BigInt(10 ** 6); // 1M USDC with 6 decimals
  
  await deployContract({
    contract: "AurumUsdc",
    constructorArgs: {
      initial_supply: initialSupply,
      recipient: deployer.address,
    },
  });
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
