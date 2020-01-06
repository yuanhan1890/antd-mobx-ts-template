import { GlobalStore } from "./global";
import { HomeStore } from "./home";

const globalStore = new GlobalStore();
globalStore.init();
const homeStore = new HomeStore();

export const stores = {
  globalStore,
  homeStore,
};

(window as any).stores = stores;

export type IStores = typeof stores;
