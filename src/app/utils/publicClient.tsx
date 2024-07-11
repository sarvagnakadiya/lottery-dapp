import { getPublicClient } from "@wagmi/core";
import { config } from "@/app/utils/config";
import { holesky } from "@wagmi/core/chains";

export const initializeClient = () => {
  const client = getPublicClient(config, {
    chainId: holesky.id,
  });
  return client;
};
