import {
  createTRPCProxyClient,
  httpBatchLink,
} from "@trpc/client";
import { AppRouter } from "game-trpc-types";

import GameConfig from "../../configs/GameConfig";
const { apiServer } = GameConfig;

//# 只能使用https 連線
//# WebSocket 需使用原始的 cocos 連線
export const client = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: apiServer.apiUrl,
      headers: {
        Platform: apiServer.Platform,
        Secret: apiServer.Secret,
      },
    }),
  ],
});
