import qs from "qs";

export function parse() {
  return qs.parse(window.location.search, { ignoreQueryPrefix: true });
}

export function stringify(params: any) {
  return qs.stringify(params, { addQueryPrefix: true });
}
