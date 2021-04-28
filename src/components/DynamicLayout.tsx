/* eslint-disable no-undef */
import React, {createRef, useEffect, useState} from 'react';

import Graphin from '@antv/graphin';

import {FishEye, MiniMap, Toolbar, Tooltip} from '@antv/graphin-components';

import {GraphinData} from "@antv/graphin/es";
import {neoQuery} from "../utils/neoOperations";
import {AntdTooltip} from "./AntdTooltip";
import {edgesUnique, dictUnique} from "../utils/useful";
import {CustomContent} from "./ToolbarCustom";
import LayoutSelectorPanel from "./LayoutSelectorPanel";
import CypherFunctionalPanel from "./CypherFunctionalPanel";

const nodeSize = 40;

interface autoComplete {
    label: string,
    options: { value: string, label?: string }[]
}

const defaultLayout = {
    type: 'grid',
    preset: {
        type: 'concentric',
    },
    animation: true,
};

export const DynamicLayout = () => {
    const graphinRef = createRef<Graphin>();

    const [layout, setLayout] = React.useState({...defaultLayout, animation: false});
    const [graphData, setGraphData] = useState<GraphinData>({'nodes': [], 'edges': []} as GraphinData);
    const [visible, setVisible] = React.useState(false);
    const [layoutPanelVisible, setLayoutPanelVisible] = useState(true);
    const [funcPanelVisible, setFuncPanelVisible] = useState(false);

    useEffect(() => {
        // @ts-ignore
        const {graph} = graphinRef.current;

        // let query = 'MATCH p=()-[r:GeneIndications]->() RETURN p LIMIT 25'
        let query = 'MATCH (n:Herb) RETURN n LIMIT 25'
        neoQuery(query).then(
            result => {
                setGraphData(result)
                sessionStorage.setItem('graph', JSON.stringify(result))
                console.log(result)
            }
        )

        graph.on('node:dblclick', (evt: { item: any; target: any; }) => {
            const item = evt.item; // 被操作的节点 item
            let sub_query = "MATCH r=(s)-->() WHERE ID(s) = " + item.getModel()["queryId"] + " RETURN r"
            neoQuery(sub_query).then(result => {
                let tmp_graph = JSON.parse(sessionStorage.getItem('graph') as string)
                let res_node = [...tmp_graph.nodes, ...result.nodes]
                let res_edge = [...tmp_graph.edges, ...result.edges]
                let ret = {'nodes': dictUnique(res_node, 'queryId'), 'edges': edgesUnique(res_edge)}
                setGraphData(ret)
                console.log('graph data', graphData)
                sessionStorage.setItem('graph', JSON.stringify(result))
            })
        });
    }, []);

    const updateLayout = (previousType: any, type: any, defaultLayoutConfigs: any) => {
        console.log(previousType, type, defaultLayoutConfigs);
        setLayout({...defaultLayoutConfigs, type})
    };

    const handleClose = () => {
        setVisible(false);
    };

    const renderOptions = () => {
        let options: autoComplete[] = []
        // debugger
        graphData.nodes.forEach(node => {
            let type_id = options.findIndex(r => node.nodeType === r.label)
            if (type_id === -1) {
                options.push({label: node.nodeType, options: [{value: node.s_name}]})
            } else {
                options[type_id]['options'].push({value: node.s_name})
            }
        })
        return options
    }

    // const layout = layouts.find(item => item.type === type);
    return (
        <div>
            <Graphin data={graphData}
                     layout={layout}
                     ref={graphinRef}
            >
                {/*<LayoutSelector>*/}
                <LayoutSelectorPanel isVisible={layoutPanelVisible} setVisible={setLayoutPanelVisible}
                                     updateLayout={updateLayout}/>
                <CypherFunctionalPanel isVisible={funcPanelVisible} setVisible={setFuncPanelVisible}
                                       nodeOptions={renderOptions()} setGraphData={setGraphData}/>
                {/*</LayoutSelector>*/}
                <Tooltip
                    bindType="node"
                    style={{
                        transform: `translate(-${nodeSize / 2}px,-${nodeSize / 2}px)`,
                    }}
                >
                    <AntdTooltip/>
                </Tooltip>
                <Toolbar direction="horizontal" style={{position: 'absolute', right: '250px'}}>
                    <CustomContent layoutPanelVisible={layoutPanelVisible} setLayoutPanelVisible={setLayoutPanelVisible}
                                   visible={visible} setVisible={setVisible} funcPanelVisible={funcPanelVisible}
                                   setFuncPanelVisible={setFuncPanelVisible}/>
                </Toolbar>
                <MiniMap visible={true}/>
                {/*<ContextMenu bindType="canvas">*/}
                {/*    <Menu>*/}
                {/*        <Menu.Item onClick={handleClick}>开启 FishEye</Menu.Item>*/}
                {/*    </Menu>*/}
                {/*</ContextMenu>*/}
                <FishEye options={{}} visible={visible} handleEscListener={handleClose}/>
            </Graphin>
        </div>
    );
};
