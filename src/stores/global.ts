import debounce from "lodash/debounce";
import { action, observable } from "mobx";

import { getCurrentMenu } from "@/api";

function getFontSize() {
  return Math.max(12, Math.ceil((window.innerWidth / 1920) * 20));
}

export const NOT_LOGIN = 0;
export const NO_AUTH = 1;
export const HAS_AUTH = 2;

export interface IMenu {
  id: number;
  code: string;
  name: string;
  url: string;
}

class State {
  @observable fontSize = getFontSize();
  @observable authState = NOT_LOGIN;
  @observable.shallow menu = null as null | IMenu[];
}

export class GlobalStore {
  @observable state: null | State = null;

  constructor() {
    this.state = new State();
  }

  injectStyle() {
    const style = document.createElement("style");

    const setStyle = () => {
      style.innerHTML = `
        html { font-size: ${this.state!.fontSize}px !important; }
      `;
    };
    style.type = "text/css";

    setStyle();
    document.head.appendChild(style);

    window.addEventListener("resize", debounce(() => {
      this.state!.fontSize = getFontSize();
      setStyle();
    }, 400));
  }

  @action
  init = async () => {
    this.state = new State();
    this.injectStyle();

    // 取menu
    try {
      const menuData = await getCurrentMenu();
      this.state.menu = menuData;
      this.state.authState = menuData && menuData.length > 0 ? HAS_AUTH : NO_AUTH;
    } catch (e) {
      this.state.menu = null;
      this.state.authState = NOT_LOGIN;
    }
  }

  @action
  getRem = (rem: number) => {
    return Math.max(12, Math.floor(this.state!.fontSize * rem));
  }
}
