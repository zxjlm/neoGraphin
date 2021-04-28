import {QueryResult} from "neo4j-driver/types/result";
import Record from "neo4j-driver/types/record";

interface neoQueryType {
    nodes: any[]
    edges: { source: any; target: any }[]
}

const colorMap: any = {
    'Gene': '#4967b4',
    'Herb': '#26ba5f',
    'Disease': '#24993d',
    'Mol': "#de1515",
    'MM_symptom': "#c7a758",
    'TEC_symptom': "#c7a"
}

// @ts-ignore
const neo_query = async (query: string): Promise<QueryResult> => {
    const neo4j = require("neo4j-driver");

    const driver = neo4j.driver(
        "bolt://localhost:7687",
        neo4j.auth.basic("neo4j", "zxjzxj233")
    );
    const session = driver.session({defaultAccessMode: neo4j.session.READ});

    const result = await session.run(query);
    await session.close();

    // on application exit:
    await driver.close();
    return result
}

function extract_links(result: Record[]) {
    let edges: { source: any; target: any; }[] = []
    let nodes: any = {}
    result.forEach(r => {
        let node_start = r.get(0).start;
        let node_end = r.get(0).end;
        edges.push({source: node_start.properties.id, target: node_end.properties.id})
        nodes[node_start.identity] = {
            ...node_start.properties,
            style: {
                keyshape: {fill: colorMap[node_start.labels[0]]},
                label: {value: short_node(node_start.properties.s_name)}
            },
        }
        nodes[node_end.identity] = {
            ...node_end.properties,
            style: {
                keyshape: {fill: colorMap[node_end.labels[0]]},
                label: {value: short_node(node_end.properties.s_name)}
            },
        }
    })
    let nodes_1 = []
    for (let key in nodes) {
        if (nodes.hasOwnProperty(key))
            nodes_1.push({...nodes[key], queryId: key})
    }
    return {edges, nodes_1}
}

export function extract_nodes(nodes: Record[]) {
    return nodes.map(n => ({
        ...n.get(0).properties,
        style: {keyshape: {fill: colorMap[n.get(0).labels[0]]}, label: {value: n.get(0).properties.s_name}},
        queryId: n.get(0).identity.toString(),
        nodeType: n.get(0).labels[0]
    }))
}

/**
 * 返回一个符合Graphin渲染规则的字典
 * @param query CYPHER语句
 */
export const neoQuery = async (query: string): Promise<neoQueryType> => {
    const result = await neo_query(query)
    let raw_links = result.records.filter(elem => elem.keys[0] === 'p' || elem.keys[0] === 'r')
    let raw_nodes = result.records.filter(elem => elem.keys[0] === 'n')
    let {edges, nodes_1} = extract_links(raw_links)
    let nodes_2 = extract_nodes(raw_nodes)
    return {'nodes': [...nodes_1, ...nodes_2], 'edges': edges}
}


function short_node(name: string) {
    if (name.length > 6) {
        return name.slice(0, 6) + '...'
    }
    return name
}


