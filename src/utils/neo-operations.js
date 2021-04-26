/**
 *
 * @param query
 * @returns {Promise<{summary: string, records: *[]}>}
 */
const colorMap = {
    'Gene': '#4967b4',
    'Herb': '#26ba5f',
    'Disease': '#24993d',
    'Mol': "#de1515",
    'MM_symptom': "#c7a758",
    'TEC_symptom': "#c7a"
}


export async function neo_query(query) {
    const neo4j = require("neo4j-driver");

    const driver = neo4j.driver(
        "bolt://localhost:7687",
        neo4j.auth.basic("neo4j", "zxjzxj233")
    );
    const session = driver.session({defaultAccessMode: neo4j.session.READ});
    let result = {
        records: [],
        summary: "",
    };

    try {
        result = await session.run(query);
    } finally {
        await session.close();
    }

    // on application exit:
    await driver.close();
    return result;
}

export function extract_links(result) {
    let edges = []
    let nodes = {}
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
        nodes_1.push({...nodes[key], queryId: key})
    }
    return {edges, nodes_1}
}

export function extract_nodes(nodes) {
    console.log(nodes)
    return nodes.map(n => ({
        ...n.get(0).properties,
        style: {keyshape: {fill: colorMap[n.get(0).labels[0]]}, label: {value: n.get(0).properties.s_name}},
        queryId: n.get(0).identity.toString()
    }))
}


function short_node(name) {
    if (name.length > 6) {
        return name.slice(0, 6) + '...'
    }
    return name
}

