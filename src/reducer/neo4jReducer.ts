const neoReducer = (state = [], action:any) => {
    switch (action.type) {
        case 'INIT':
            return state.concat(action.data)
        case 'UPDATE':
            return ''
        default:
            return state
    }
};

export default neoReducer;
