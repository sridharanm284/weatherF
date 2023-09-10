const initialState = {

}

export const appReducer =(state=initialState, action:any) => {
    switch(action.type){
        case 'TOGGLE_MENU':
        return {
            ...state,
            toggle:action.payload
        }
        default:
            return {...state}
    }
}

export default appReducer;