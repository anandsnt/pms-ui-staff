const {createStore, applyMiddleware, compose} = Redux;

const finalCreateStore = compose(
    applyMiddleware(ReduxThunk.default),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const configureStore = (initialState = { 'mode': RM_RX_CONST.NOT_CONFIGURED }) => {
	return finalCreateStore(rateManagerRootReducer, initialState);
}