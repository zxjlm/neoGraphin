const initList: string[] = []

const neoReducer = (state = initList, action: any) => {
    console.log(state, action)
    switch (action.type) {
        case 'INIT':
            console.log('init', initList, state)
            return [...state, 23]
        case 'QUERY':
            console.log('query', initList, state)
            return [...state, 12]
        case 'UPDATE':
            return ''
        default:
            return state
    }
};

export const initGraph = (query: string) => {
    return {
        type: 'INIT',
        data: {
            query,
        }
    }
}

export const queryGraph = (query: string) => {
    return {
        type: 'QUERY',
        data: {
            query,
        }
    }
}

export default neoReducer;
