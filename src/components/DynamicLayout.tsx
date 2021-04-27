/* eslint-disable no-undef */
import React, {createRef, useEffect, useState} from 'react';

import Graphin from '@antv/graphin';

import {Card, Menu} from 'antd';
import {ContextMenu, FishEye, LayoutSelector, MiniMap, Toolbar, Tooltip} from '@antv/graphin-components';

// import 'antd/dist/antd.css'; //避免与全局样式污染
// 引入Graphin CSS

import {GraphinData} from "@antv/graphin/es";
import {extract_links, extract_nodes, neo_query} from "../utils/neo-operations";
import {AntdTooltip} from "./AntdTooltip";
import {edgesUnique, dictUnique} from "../utils/useful";
import {CustomContent} from "./ToolbarCustom";
import LayoutSelectorPanel from "./LayoutSelectorPanel";

const nodeSize = 40;


const defaultLayout = {
    type: 'grid',
    preset: {
        type: 'concentric',
    },
    animation: true,
};

export const DynamicLayout = () => {
    const graphinRef = createRef<Graphin>();

    const [layout, setLayout] = React.useState({ ...defaultLayout, animation: false });
    const [graphData, setGraphData] = useState<GraphinData>({'nodes': [], 'edges': []} as GraphinData);
    const [visible, setVisible] = React.useState(false);
    const [isPanelVisible, setIsPanelVisible] = useState(true);

    const updateLayout = (previousType: any, type: any, defaultLayoutConfigs: any) => {
        console.log(previousType, type, defaultLayoutConfigs);
        setLayout({...defaultLayout, type})
    };


    const handleClick = () => {
        setVisible(true);
    };
    const handleClose = () => {
        setVisible(false);
    };


    useEffect(() => {
        // @ts-ignore
        const {graph} = graphinRef.current;

        // let query = 'MATCH p=()-[r:GeneIndications]->() RETURN p LIMIT 25'
        let query = 'MATCH (n:Herb) RETURN n LIMIT 25'
        neo_query(query).then(
            result => {
                console.log(result)
                // @ts-ignore
                let raw_links = result.records.filter(elem => elem.keys[0] === 'p')
                // @ts-ignore
                let raw_nodes = result.records.filter(elem => elem.keys[0] === 'n')
                let {edges, nodes_1} = extract_links(raw_links)
                let nodes_2 = extract_nodes(raw_nodes)
                let ret = {'nodes': [...nodes_1, ...nodes_2], 'edges': edges}
                setGraphData(ret)
                sessionStorage.setItem('graph', JSON.stringify(ret))
                console.log(ret)
            }
        )

        graph.on('node:dblclick', (evt: { item: any; target: any; }) => {
            const item = evt.item; // 被操作的节点 item
            debugger
            let sub_query = "MATCH r=(s)-->() WHERE ID(s) = " + item.getModel()["queryId"] + " RETURN r"
            neo_query(sub_query).then(
                result => {
                    let tmp_graph = JSON.parse(sessionStorage.getItem('graph') as string)
                    let {edges, nodes_1} = extract_links(result.records)
                    let res_node = [...tmp_graph.nodes, ...nodes_1]
                    let res_edge = [...tmp_graph.edges, ...edges]
                    // @ts-ignore
                    let ret = {'nodes': dictUnique(res_node, 'queryId'), 'edges': edgesUnique(res_edge)}
                    setGraphData(ret)
                    sessionStorage.setItem('graph', JSON.stringify(ret))
                }
            )
        });
    }, []);

    // const layout = layouts.find(item => item.type === type);
    return (
        <div>
            <Card
                title="布局切换"
                // extra={<LayoutSelectorDIY options={layouts} value={type} onChange={handleChange}/>}
            >
                <Graphin data={graphData}
                         layout={layout}
                         ref={graphinRef}>
                    {/*<LayoutSelector>*/}
                        <LayoutSelectorPanel isVisible={isPanelVisible} setVisible={setIsPanelVisible} updateLayout={updateLayout}/>
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
                        <CustomContent/>
                    </Toolbar>
                    <MiniMap visible={true}/>
                    <ContextMenu bindType="canvas">
                        <Menu>
                            <Menu.Item onClick={handleClick}>开启 FishEye</Menu.Item>
                        </Menu>
                    </ContextMenu>
                    <FishEye options={{}} visible={visible} handleEscListener={handleClose}/>
                </Graphin>
            </Card>
        </div>
    );
};
