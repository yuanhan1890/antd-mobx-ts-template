import { action, observable } from "mobx";
import { Store } from "./storeMeta";

import { getCityInfo } from "@/api";
import get from "@/utils/get";

class State {
  @observable.shallow cityInfo = null as null | string[];
}

export class HomeStore extends Store {
  @observable state: null | State = null;
  @observable showText = false;
  @observable text = "123";

  @action
  init = async () => {
    super.init();
    this.state = new State();

    // 取城市信息
    try {
      const cityInfo = await getCityInfo();
      this.state.cityInfo = get(cityInfo, (it) => it.data, null);
    } catch (e) {
      // ignore
    }

    // this.autorun(flow(gen));
    this.takeLatest(async (commit) => {
      if (this.showText) {
        this.text = await new Promise((r) => {
          setTimeout(() => {
            r("true" + Date.now());
          }, 2000);
        });
      } else {
        this.text = await new Promise((r) => {
          setTimeout(() => {
            r("false" + Date.now());
          }, 4000);
        });
      }
    });
  }
}
