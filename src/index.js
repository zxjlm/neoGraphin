import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./typography.css";
import {Provider} from "react-redux";
import {combineReducers, createStore} from "redux";
import neoReducer from "./reducer/neo4jReducer";


const reducer = combineReducers({
    neo4j: neoReducer
})
const store = createStore(reducer)

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>,
    document.getElementById("root")
);
