import {
  deployContract,
  executeDeployCalls,
  exportDeployments,
  deployer,
} from "./deploy-contract";
import { green } from "./helpers/colorize-log";
import fs from "fs";
import path from "path";

const findContractFile = (
  contract: string,
  fileType: "compiled_contract_class" | "contract_class"
): string => {
  const contractsPath = path.join(process.cwd(), "target", "dev");
  const filePath = path.join(contractsPath, `${contract}_${fileType}.json`);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Could not find ${fileType} file for contract ${contract}`);
  }
  return filePath;
};

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

  // // 2. Deploy AurumRewardPoints (will be managed by AurumReward)
  // const rewardPointsDeployment = await deployContract({
  //   contract: "AurumRewardPoints",
  //   constructorArgs: {
  //     reward_manager: deployer.address, // Temporarily set to deployer, will update after AurumReward deployment
  //   },
  // });

  // // 3. Deploy AurumReward
  // const rewardDeployment = await deployContract({
  //   contract: "AurumReward",
  //   constructorArgs: {
  //     usdc_address: usdcDeployment.address,
  //     reward_points_address: rewardPointsDeployment.address,
  //   },
  // });

  // Primero declaramos el contrato de la wallet
  let compiledContractCasm = JSON.parse(
    fs.readFileSync(findContractFile("UDCWallet", "compiled_contract_class")).toString("ascii")
  );
  let compiledContractSierra = JSON.parse(
    fs.readFileSync(findContractFile("UDCWallet", "contract_class")).toString("ascii")
  );

  // Declaramos el contrato de la wallet
  const walletDeployment = await deployContract({
    contract: "UDCWallet"
  });

  console.log("Wallet Class Hash:", walletDeployment.classHash);

  // Deploy UDCWalletFactory
  const udcWalletFactoryDeployment = await deployContract({
    contract: "UDCWalletFactory",
    constructorArgs: {
      owner: deployer.address,
      wallet_class_hash: walletDeployment.classHash,
      usdc_address: usdcDeployment.address,
      udc_address: "0x041a78e741e5af2fec34b695679bc6891742439f7afb8484ecd7766661ad02bf" // Mainnet UDC address
    },
  });

  // TODO: 
  // await deployer.execute([{
  //   contractAddress: rewardPointsDeployment.address,
  //   entrypoint: "set_reward_manager",
  //   calldata: [rewardDeployment.address]
  // }], {
  //   maxFee: "100000000000000"
  // });

  await executeDeployCalls();
};

deployScript()
  .then(async () => {
    exportDeployments();
    console.log(green("All Setup Done"));
  })
  .catch(console.error);
