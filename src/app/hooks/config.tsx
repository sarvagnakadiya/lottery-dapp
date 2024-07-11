import { http, createConfig } from "@wagmi/core";
import { holesky, sepolia } from "@wagmi/core/chains";

export const config = createConfig({
  chains: [holesky],
  transports: {
    [holesky.id]: http(),
  },
});
