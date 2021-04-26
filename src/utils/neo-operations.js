/**
 *
 * @param query
 * @returns {Promise<{summary: string, records: *[]}>}
 */
const colorMap = {
    'Gene': '#4967b4',
    'Herb': '#26ba5f'
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
        edges.push({source: r.get(0).start.properties.id, target: r.get(0).end.properties.id})
        nodes[r.get(0).start.identity] = r.get(0).start.properties
        nodes[r.get(0).end.identity] = r.get(0).end.properties
    })
    let nodes_1 = []
    for (let key in nodes) {
        nodes_1.push({...nodes[key], queryId: key})
    }
    return {edges, nodes_1}
}

export function extract_nodes(nodes) {
    console.log(nodes)
    return nodes.map(n => ({...n.get(0).properties,color:colorMap[''],queryId:nodes[10].get(0).identity.toString()}))
}

