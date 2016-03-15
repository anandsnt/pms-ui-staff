/**
 * Created by shahulhameed on 3/8/16.
 */

let finalCreateStore = Redux.compose(
    Redux.applyMiddleware(reduxLogger())
)(Redux.createStore);

var configureStore = function(initialState = {todos: []}) {
    return finalCreateStore(todoApp, initialState);
};