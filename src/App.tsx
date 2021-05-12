import React from "react";
import {
    Route,
    BrowserRouter as Router,
} from "react-router-dom";
import Main from './components/Main'

import './App.less'
// const NEO4J_URI = "bolt://localhost:7687";
// const NEO4J_USER = "neo4j";
// const NEO4J_PASSWORD = "zxjzxj233";

const App = () => {

    return (
        <Router>
            <Route path={'/christin-graph/:port/:pwd'} component={Main}>
            </Route>
        </Router>
    );
};

export default App;
