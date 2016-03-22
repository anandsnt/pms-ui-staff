const {createStore} = Redux;
const {applyMiddleware} = Redux;
const {compose} = Redux;

let finalCreateStore = compose(
    applyMiddleware(ReduxThunk.default, reduxLogger()),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const configureStore = (initialState = { 'mode': RM_RX_CONST.NOT_CONFIGURED }) => {
	return finalCreateStore(rateManagerRootReducer, initialState);
}