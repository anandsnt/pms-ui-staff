const {createStore} = Redux;
const {applyMiddleware} = Redux;
const {compose} = Redux;

let finalCreateStore = compose(
    applyMiddleware(reduxLogger())
)(createStore);

const configureStore = (initialState = { 'mode': 'NOT_CONFIGURED' }) => {
	return finalCreateStore(rateManagerRootReducer, initialState);
}