const {createStore, applyMiddleware, compose} = Redux;

const finalCreateStore = compose(
    applyMiddleware(ReduxThunk.default),
  window.devToolsExtension ? window.devToolsExtension() : f => f
)(createStore);

const configureStore = (initialState) => {
    return finalCreateStore(nightlyDiaryRootReducer, initialState);
}