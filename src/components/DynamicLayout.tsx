/* eslint-disable no-undef */
import React, {createRef, useEffect, useState} from 'react';

import Graphin from '@antv/graphin';

import {Select, Card, Menu} from 'antd';
import {ContextMenu, FishEye, LayoutSelector, MiniMap, Toolbar, Tooltip} from '@antv/graphin-components';

import 'antd/dist/antd.css'; //避免与全局样式污染
// 引入Graphin CSS

import {
    TrademarkCircleFilled,
    ChromeFilled,
    BranchesOutlined,
    ApartmentOutlined,
    AppstoreFilled,
    CopyrightCircleFilled,
    CustomerServiceFilled,
    ShareAltOutlined,
} from '@ant-design/icons';
import {GraphinData} from "@antv/graphin/es";
import {extract_links, extract_nodes, neo_query} from "../utils/neo-operations";
import {AntdTooltip} from "./AntdTooltip";
import {edgesUnique, dictUnique} from "../utils/useful";
import {CustomContent} from "./ToolbarCustom";
import LayoutSelectorPanel from "./LayoutSelectorPanel";

const iconMap = {
    'graphin-force': <ShareAltOutlined/>,
    random: <TrademarkCircleFilled/>,
    concentric: <ChromeFilled/>,
    circle: <BranchesOutlined/>,
    force: <AppstoreFilled/>,
    dagre: <ApartmentOutlined/>,
    grid: <CopyrightCircleFilled/>,
    radial: <ShareAltOutlined/>,
};
const nodeSize = 40;

const SelectOption = Select.Option;
const LayoutSelectorDIY = (props: { value: any; onChange: any; options: any; }) => {
    const {value, onChange, options} = props;
    // 包裹在graphin内部的组件，将获得graphin提供的额外props

    return (
        <div
            // style={{ position: 'absolute', top: 10, left: 10 }}
        >
            <Select style={{width: '120px'}} value={value} onChange={onChange}>
                {options.map((item: { type: any; }) => {
                    const {type} = item;
                    // @ts-ignore
                    const iconComponent = iconMap[type] || <CustomerServiceFilled/>;
                    return (
                        <SelectOption key={type} value={type}>
                            {iconComponent} &nbsp;
                            {type}
                        </SelectOption>
                    );
                })}
            </Select>
        </div>
    );
};

const layouts = [
    {
        type: 'grid',
        // begin: [0, 0], // 可选，
        // preventOverlap: true, // 可选，必须配合 nodeSize
        // preventOverlapPdding: 20, // 可选
        // nodeSize: 30, // 可选
        // condense: false, // 可选
        // rows: 5, // 可选
        // cols: 5, // 可选
        // sortBy: 'degree', // 可选
        // workerEnabled: false, // 可选，开启 web-worker
    },
    {type: 'graphin-force'},
    {
        type: 'circular',
        // center: [200, 200], // 可选，默认为图的中心
        // radius: null, // 可选
        // startRadius: 10, // 可选
        // endRadius: 100, // 可选
        // clockwise: false, // 可选
        // divisions: 5, // 可选
        // ordering: 'degree', // 可选
        // angleRatio: 1, // 可选
    },
    {
        type: 'radial',
        // center: [200, 200], // 可选，默认为图的中心
        // linkDistance: 50, // 可选，边长
        // maxIteration: 1000, // 可选
        // focusNode: 'node11', // 可选
        // unitRadius: 100, // 可选
        // preventOverlap: true, // 可选，必须配合 nodeSize
        // nodeSize: 30, // 可选
        // strictRadial: false, // 可选
        // workerEnabled: false, // 可选，开启 web-worker
    },
    {
        type: 'force',
        preventOverlap: true,
        // center: [200, 200], // 可选，默认为图的中心
        linkDistance: 50, // 可选，边长
        nodeStrength: 30, // 可选
        edgeStrength: 0.8, // 可选
        collideStrength: 0.8, // 可选
        nodeSize: 30, // 可选
        alpha: 0.9, // 可选
        alphaDecay: 0.3, // 可选
        alphaMin: 0.01, // 可选
        forceSimulation: null, // 可选
        onTick: () => {
            // 可选
            console.log('ticking');
        },
        onLayoutEnd: () => {
            // 可选
            console.log('force layout done');
        },
    },
    {
        type: 'gForce',
        linkDistance: 150, // 可选，边长
        nodeStrength: 300, // 可选
        edgeStrength: 0.6, // 可选
        nodeSize: 30, // 可选
        onTick: () => {
            // 可选
            console.log('ticking');
        },
        onLayoutEnd: () => {
            // 可选
            console.log('force layout done');
        },
        workerEnabled: false, // 可选，开启 web-worker
        gpuEnabled: false, // 可选，开启 GPU 并行计算，G6 4.0 支持
    },
    {
        type: 'concentric',
        maxLevelDiff: 0.5,
        sortBy: 'degree',
        // center: [200, 200], // 可选，

        // linkDistance: 50, // 可选，边长
        // preventOverlap: true, // 可选，必须配合 nodeSize
        // nodeSize: 30, // 可选
        // sweep: 10, // 可选
        // equidistant: false, // 可选
        // startAngle: 0, // 可选
        // clockwise: false, // 可选
        // maxLevelDiff: 10, // 可选
        // sortBy: 'degree', // 可选
        // workerEnabled: false, // 可选，开启 web-worker
    },
    {
        type: 'dagre',
        rankdir: 'LR', // 可选，默认为图的中心
        // align: 'DL', // 可选
        // nodesep: 20, // 可选
        // ranksep: 50, // 可选
        // controlPoints: true, // 可选
    },
    {
        type: 'fruchterman',
        // center: [200, 200], // 可选，默认为图的中心
        // gravity: 20, // 可选
        // speed: 2, // 可选
        // clustering: true, // 可选
        // clusterGravity: 30, // 可选
        // maxIteration: 2000, // 可选，迭代次数
        // workerEnabled: false, // 可选，开启 web-worker
        // gpuEnabled: false, // 可选，开启 GPU 并行计算，G6 4.0 支持
    },
    {
        type: 'mds',
        workerEnabled: false, // 可选，开启 web-worker
    },
    {
        type: 'comboForce',
        // // center: [200, 200], // 可选，默认为图的中心
        // linkDistance: 50, // 可选，边长
        // nodeStrength: 30, // 可选
        // edgeStrength: 0.1, // 可选
        // onTick: () => {
        //   // 可选
        //   console.log('ticking');
        // },
        // onLayoutEnd: () => {
        //   // 可选
        //   console.log('combo force layout done');
        // },
    },
];

const defaultLayout = {
    type: 'graphin-force',
    preset: {
        type: 'concentric',
    },
    animation: true,
};

export const DynamicLayout = () => {
    const graphinRef = createRef<Graphin>();

    const [type, setLayout] = React.useState('graphin-force');
    const [graphData, setGraphData] = useState<GraphinData>({'nodes': [], 'edges': []} as GraphinData);
    const [visible, setVisible] = React.useState(false);

    const updateLayout = (previousType: any, type: any, defaultLayoutConfigs: any) => {
        console.log(previousType, type, defaultLayoutConfigs);
    };


    const handleClick = () => {
        setVisible(true);
    };
    const handleClose = () => {
        setVisible(false);
    };

    const handleChange = (value: React.SetStateAction<string>) => {
        setLayout(value);
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

    const layout = layouts.find(item => item.type === type);
    return (
        <div>
            <Card
                title="布局切换"
                // extra={<LayoutSelectorDIY options={layouts} value={type} onChange={handleChange}/>}
            >
                <Graphin data={graphData}
                         layout={layout}
                         ref={graphinRef}>
                    <LayoutSelector>
                        <LayoutSelectorPanel updateLayout={updateLayout} />
                    </LayoutSelector>
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
