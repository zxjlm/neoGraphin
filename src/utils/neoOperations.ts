import {QueryResult} from "neo4j-driver/types/result";
import Record from "neo4j-driver/types/record";
import {PathSegment} from "neo4j-driver";
import Integer from "neo4j-driver/types/integer";
import {Node, NumberOrInteger, Relationship} from "neo4j-driver/types/graph-types";

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

/**
 * 执行Cypher 返回不经过处理的结果
 * @param query
 */
export const executeCypher = async (query: string): Promise<QueryResult> => {
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

declare class MyNode<T extends NumberOrInteger = Integer> {
    identity: T
    labels: string[]
    properties: { id: string, s_name: string }

    constructor(identity: T, labels: string[], properties: object)

    toString(): string
}


declare class MyPathSegment<T extends NumberOrInteger = Integer> {
    start: MyNode<T>
    relationship: Relationship<T>
    end: MyNode<T>

    constructor(start: Node<T>, rel: Relationship<T>, end: Node<T>)
}


const extract_segments = (result: MyPathSegment[]) => {
    let edges: { source: any; target: any; style: {} }[] = []
    let nodes: any = {}
    result.forEach(r => {
        edges.push({source: r.start.properties.id, target: r.end.properties.id, style: {label: r.relationship.type}})
        nodes[r.start.identity.toString(10)] = {
            ...r.start.properties,
            style: {
                keyshape: {fill: colorMap[r.start.labels[0]], stroke: colorMap[r.start.labels[0]]},
                label: {value: short_node(r.start.properties.s_name)}
            },
            nodeType: r.start.labels[0]
        }
        nodes[r.end.identity.toString(10)] = {
            ...r.end.properties,
            style: {
                keyshape: {fill: colorMap[r.end.labels[0]], stroke: colorMap[r.end.labels[0]]},
                label: {value: short_node(r.end.properties.s_name)}
            },
            nodeType: r.end.labels[0]
        }
    })
    let nodes_1 = []
    for (let key in nodes) {
        if (nodes.hasOwnProperty(key))
            nodes_1.push({...nodes[key], queryId: key})
    }
    return {edges, nodes_1}
}

const extract_links = (result: Record[]) => {
    let segments: MyPathSegment[] = []
    result.forEach(elem => {
        // @ts-ignore
        segments = [...elem._fields[0].segments, ...segments]
    })
    return extract_segments(segments)
}

const extract_nodes = (nodes: Record[]) => {
    return nodes.map(n => ({
        ...n.get(0).properties,
        style: {
            keyshape: {fill: colorMap[n.get(0).labels[0]], stroke: colorMap[n.get(0).labels[0]]},
            label: {value: n.get(0).properties.s_name}
        },
        queryId: n.get(0).identity.toString(),
        nodeType: n.get(0).labels[0]
    }))
}

export const extract_path = (segments: MyPathSegment[]) => {

}

/**
 * 返回一个符合Graphin渲染规则的字典
 * @param query CYPHER语句
 */
export const neoQuery = async (query: string): Promise<neoQueryType> => {
    const result = await executeCypher(query)
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


