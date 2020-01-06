import Button from "antd/es/button";
import DatePicker from "antd/es/date-picker";
import { inject, observer } from "mobx-react";
import React from "react";

import { HomeStore } from "@/stores/home";
import get from "@/utils/get";

interface IProps {
  homeStore?: HomeStore;
}

@inject("homeStore")
@observer
export default class Home extends React.Component<IProps> {
  componentDidMount() {
    this.props.homeStore?.init();
  }

  componentWillUnmount() {
    this.props.homeStore?.dispose();
  }

  render() {
    const cities = get(this.props.homeStore, (it) => it.state.cityInfo, []);
    return (
      <div>
        <div>
          <Button icon="home" type="primary">hehe</Button>
        </div>
        <div>
          <DatePicker></DatePicker>
        </div>
        <div>
          {
            cities.map((city) => {
              return (
                <div key={city}>{`Hello, ${city}`}</div>
              );
            })
          }
        </div>
        <div>{this.props.homeStore!.text}</div>
      </div>
    );
  }
}
