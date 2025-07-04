import * as SecureStore from "expo-secure-store";
export const save = (k: string, v: string) => SecureStore.setItemAsync(k, v);
export const get = (k: string) => SecureStore.getItemAsync(k);
export const del = (k: string) => SecureStore.deleteItemAsync(k);
