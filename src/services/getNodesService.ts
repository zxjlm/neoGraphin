import {extract_links, extract_nodes, neo_query} from "../utils/neo-operations";

export const initGraphService = async () => {
// let query = 'MATCH p=()-[r:GeneIndications]->() RETURN p LIMIT 25'
    let query = 'MATCH (n:Herb) RETURN n LIMIT 25'
    neo_query(query).then(
        result => {
            console.log('111')
            let raw_links = result.records.filter(elem => elem.keys[0] === 'p')
            let raw_nodes = result.records.filter(elem => elem.keys[0] === 'n')
            let {edges, nodes_1} = extract_links(raw_links)
            let nodes_2 = extract_nodes(raw_nodes)
            let ret = {'nodes': [...nodes_1, ...nodes_2], 'edges': edges}
            sessionStorage.setItem('graph', JSON.stringify(ret))
            return ret
        }
    )
}
