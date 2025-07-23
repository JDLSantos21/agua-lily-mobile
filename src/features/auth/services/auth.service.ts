// import { del, get, save } from "@/shared/utils/secureStore";
// import { loginApi, logoutApi } from "./auth.api";
// import { tokenManager } from "../utils/tokenManager";
// import { authStore } from "@/store/auth.store";
// import { deactivatePushToken } from "@/features/notifications/api/registerToken.api";
// import { refreshApi } from "./refresh.api";

import { authStore } from "@/store/auth.store";
import { loginApi } from "./auth.api";

// export const login = async (username: string, password: string) => {
//   const { data } = await loginApi(username, password);
//   console.log("login: ", data);
//   await save("access", data.access_token);
//   await save("refresh", data.refresh_token);
//   tokenManager.set(data.access_token);

//   authStore.setState({
//     user: {
//       id: data.id,
//       name: data.name,
//       role: data.role,
//     },
//     accessToken: data.access_token,
//     refreshToken: data.refresh_token,
//   });
// };

// export const refresh = async () => {
//   const refreshToken = await get("refresh");
//   if (!refreshToken) throw new Error("No refresh token available");

//   try {
//     const { data } = await refreshApi(refreshToken);
//     await save("access", data.access_token);
//     await save("access", data.refresh_token);
//     tokenManager.set(data.access_token);
//     authStore.setState({
//       accessToken: data.access_token,
//       refreshToken: data.refresh_token,
//     });

//     console.log("refresh: ", data);
//     return data.access_token;
//   } catch (error) {
//     if (error.response.status === 401) {
//       await del("access");
//       await del("refresh");
//       authStore.setState({
//         user: null,
//         accessToken: null,
//         refreshToken: null,
//       });

//       console.log("fallo el token refresh", error);
//     }
//   }
// };

// export const logout = async () => {
//   try {
//     const pushToken = await get("pushToken");
//     const refreshToken = await get("refresh");
//     if (pushToken) await deactivatePushToken(pushToken);
//     await logoutApi(refreshToken);
//   } catch {
//     return false;
//   }

//   tokenManager.clear();
//   await del("access");
//   await del("refresh");
//   await del("pushToken");
//   authStore.setState({
//     user: null,
//     accessToken: null,
//     refreshToken: null,
//   });

//   return true;
// };
