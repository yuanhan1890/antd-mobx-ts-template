import { autorun, IAutorunOptions, IReactionPublic } from "mobx";

const ERROR_MSG = "AUTORUN_ABORT_ERROR";

export function takeLatest(
  fn: (commit: (committer: any) => void, reaction: IReactionPublic) => void,
  opts?: IAutorunOptions | undefined,
) {
  let id = 0;

  const wrapper = (reaction: IReactionPublic) => {
    const currentId = ++id;
    function commit(committer: any) {
      if (currentId !== id) {
        throw new Error(ERROR_MSG);
      } else {
        committer();
      }
    }

    try {
      fn(commit, reaction);
    } catch (ex) {
      if (ex.message === ERROR_MSG) {
        return;
      }
      throw ex;
    }
  };

  return {
    dispose: autorun(wrapper, opts),
  };
}

export interface IDisposable {
  dispose(): void;
}

export abstract class Store {
  disposables: IDisposable[] = [];
  stores: Store[] = [];

  init() {
    this.stores.forEach((store) => {
      store.init();
    });
  }

  autorun = (fn: (r?: IReactionPublic) => any, options?: IAutorunOptions) => {
    this.disposables.push({
      dispose: autorun(fn, options),
    });
  }

  takeLatest = (fn: (committer: any, reaction: IReactionPublic) => void, opts?: IAutorunOptions | undefined) => {
    this.disposables.push(takeLatest(fn, opts));
  }

  disposeFn = (fn: () => void) => {
    this.disposables.push({ dispose: fn });
  }

  registerStore = (store: Store) => {
    this.stores.push(store);
  }

  dispose = () => {
    this.disposables.forEach((disposable) => {
      disposable.dispose();
    });
    this.stores.forEach((store) => {
      store.dispose();
    });
  }
}
