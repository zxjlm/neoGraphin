import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./typography.css";


// const reducer = combineReducers({
//     neo4j: neoReducer
// })
// const store = createStore(reducer)

ReactDOM.render(
    // <Provider store={store}>
    <App/>,
    // </Provider>,
    document.getElementById("root")
);
