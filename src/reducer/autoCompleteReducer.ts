const autoCompleteReducer = (state = [], action: any) => {
    console.log(state,action)
    switch (action.type) {
        case 'INIT':
            return state.concat(action.data)
        case 'FILTER':

            return ''
        default:
            return state
    }
};

export default autoCompleteReducer;
