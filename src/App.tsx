import React from "react";
import {PageHeader} from "antd";
import {DynamicLayout} from "./components/DynamicLayout";

// const NEO4J_URI = "bolt://localhost:7687";
// const NEO4J_USER = "neo4j";
// const NEO4J_PASSWORD = "zxjzxj233";

const App = () => {

    return (
        <div>
            <PageHeader title={'Christin Graph'}/>
            <main>
                {/*<NeoGraph*/}
                {/*    width={"100%"}*/}
                {/*    height={window.outerHeight * 0.75 + "px"}*/}
                {/*    containerId={"id1"}*/}
                {/*    neo4jUri={NEO4J_URI}*/}
                {/*    neo4jUser={NEO4J_USER}*/}
                {/*    neo4jPassword={NEO4J_PASSWORD}*/}
                {/*    backgroundColor={"#b2beb5"}*/}
                {/*/>*/}
                <DynamicLayout/>
            </main>
        </div>
    );
};

export default App;
