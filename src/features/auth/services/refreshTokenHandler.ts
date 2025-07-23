import { refreshApi } from "./refresh.api";
import { save } from "@/shared/utils/secureStore";
import { tokenManager } from "@/features/auth/utils/tokenManager";

export const handleTokenRefresh = async (refreshToken: string) => {
  const { data } = await refreshApi(refreshToken);
  await save("access", data.access_token);
  await save("refresh", data.refresh_token);
  tokenManager.set(data.access_token);

  console.log("Token refreshed: ", data);
  return data.access_token;
};
