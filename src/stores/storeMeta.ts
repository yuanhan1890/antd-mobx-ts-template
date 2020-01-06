import { autorun, flow, IAutorunOptions, IReactionPublic, reaction } from "mobx";
import { CancellablePromise } from "mobx/lib/api/flow";

export function takeLatest<T, R>(
  context: T,
  expression: (r: IReactionPublic) => R,
  generator: (context: T, args: R) => Generator<any, any, any> | AsyncGenerator<any, any, any>,
) {
  const gen = flow(generator);
  let canceled = null as CancellablePromise<any> | null;
  const dispose = reaction(expression, (args) => {
    if (canceled !== null) {
      canceled.cancel();
      canceled = null;
    }
    canceled = gen(context, args);

    canceled.catch((ex) => {
      if (ex.message !== "FLOW_CANCELLED") {
        throw ex;
      }
    });
  }, { fireImmediately: true});

  return {
    dispose() {
      if (canceled) {
          canceled.cancel();
          canceled = null;
      }
      dispose();
    },
  };
}

export interface IDisposable {
  dispose(): void;
}

export abstract class Store {
  disposables: IDisposable[] = [];
  stores: Array<Store> = [];

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

  takeLatest = <T, R>(
    context: T,
    expression: (r: IReactionPublic) => R,
    generator: (context: T, args: R) => Generator<any, any, any>,
  ) => {
    this.disposables.push(takeLatest(context, expression, generator));
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
