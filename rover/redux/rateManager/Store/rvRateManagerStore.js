const {createStore} = Redux;
const {applyMiddleware} = Redux;
const {compose} = Redux;

let finalCreateStore = compose(
    applyMiddleware(reduxLogger())
)(createStore);

const configureStore = (initialState = { 'mode': RM_RX_CONST.NOT_CONFIGURED }) => {
	return finalCreateStore(rateManagerRootReducer, initialState);
}