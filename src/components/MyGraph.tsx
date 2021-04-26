import React, {useEffect, useState} from 'react';
import Graphin, {Behaviors} from '@antv/graphin';
import {Row, Col, Card} from 'antd';
import {extract_links, extract_nodes, neo_query} from "../utils/neo-operations";
import {GraphinData} from "@antv/graphin/es";


const {DragCanvas, ZoomCanvas, DragNode, ActivateRelations} = Behaviors;
export default () => {
    const [graphData, setGraphData] = useState<GraphinData>({} as GraphinData);

    useEffect(() => {
        let query = 'MATCH p=()-[r:GeneIndications]->() RETURN p LIMIT 25'
        // let query = 'MATCH (n:Gene) RETURN n LIMIT 25'
        neo_query(query).then(
            result => {
                // @ts-ignore
                let raw_links = result.records.filter(elem => elem.keys[0] === 'p')
                // @ts-ignore
                let raw_nodes = result.records.filter(elem => elem.keys[0] === 'n')
                let {edges, nodes_1} = extract_links(raw_links)
                let nodes_2 = extract_nodes(raw_nodes)
                setGraphData({'nodes': [...nodes_1, ...nodes_2], 'edges': edges})
            }
        )
    }, []);

    return (
        <div>
            <Row gutter={16}>
                <Col span={12}>
                    <Card title="可视化结果">
                        <Graphin data={graphData} layout={{type: 'graphin-force'}}>
                            <ZoomCanvas disabled/>
                        </Graphin>
                    </Card>
                </Col>
            </Row>
        </div>
    );
};
