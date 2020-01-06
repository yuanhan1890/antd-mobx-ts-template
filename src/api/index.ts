import { stringify } from "@/utils/urlQuery";

export async function getCurrentMenu(): Promise<any> {
  return Promise.resolve(["1", "2"]);
}

export async function getCityInfo(): Promise<any> {
  return Promise.resolve({ data: ["hangzhou", "nanjing"] });
}
