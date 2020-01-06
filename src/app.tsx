import { inject, observer } from "mobx-react";
import React from "react";
import {
  Redirect, Route, Switch,
} from "react-router-dom";

import { GlobalStore, NO_AUTH, NOT_LOGIN } from "@/stores/global";
import get from "@/utils/get";

import cls from "./app.less";

interface IProp {
  globalStore?: GlobalStore;
}

function App(props: IProp) {
  const authState = get(props, (it) => it.globalStore.state.authState, NOT_LOGIN);

  if (authState === NOT_LOGIN) {
    return null;
  }

  if (authState === NO_AUTH) {
    return (
      <div className={cls.noAuth}>您没有访问权限</div>
    );
  }

  return (
    <Switch>
      <Redirect exact from="/" to="/home" />
      <Route exact path="/home" component={require("./pages/home").default} />
    </Switch>
  );
}

export default inject("globalStore")(observer(App));
