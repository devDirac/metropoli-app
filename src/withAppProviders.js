import React from "react";
import {Provider} from "react-redux";
import store from "./store";

const withAppProviders = (Component) => (props) => {


    return () => (

        <Provider store={store}> <Component {...props} /> </Provider>

    );
};

export default withAppProviders;
