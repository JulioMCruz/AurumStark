import { PluginDescription, createPlugin } from "@elizaos/core";
import { portfolioProvider } from "./providers/portfolioProvider";
import { tokenProvider } from "./providers/token";
import { trustScoreProvider } from "./providers/trustScoreProvider";
import { rewardProvider } from "./providers/rewardProvider";
import { claimRewardAction } from "./actions/claimReward";

export const starknetAurumPlugin: PluginDescription = createPlugin({
    name: "starknet-aurum",
    providers: [
        portfolioProvider,
        tokenProvider, 
        trustScoreProvider,
        rewardProvider
    ],
    actions: [
        claimRewardAction
    ]
});

export default starknetAurumPlugin; 