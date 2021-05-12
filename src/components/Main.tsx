import {PageHeader} from "antd";
import {DynamicLayout} from "./DynamicLayout";
import React, {useEffect} from "react";

export default (props: any) => {
    useEffect(() => {
        return () => {
            localStorage.setItem('neo-port','-1')
            localStorage.setItem('neo-pwd','undefined')
        };
    }, []);


    return <div>
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
            <DynamicLayout port={props.match.params.port} pwd={props.match.params.pwd}/>
        </main>
    </div>
}