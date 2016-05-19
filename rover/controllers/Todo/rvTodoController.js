angular.module('sntRover').controller('rvTodoController', ['$scope', function($scope) {
    const {Provider} = ReactRedux;
    const render = () => {
        ReactDOM.render(
        	<Provider store={store}>
            	<TodoApp/>
            </Provider>,
            document.getElementById('todo-starting-point')
        );
    };
    render();


//     console.log('initial state');
// console.log(store.getState());
// console.log('-------------');

// console.log(store.dispatch({
//     type: 'ADD_TODO',
//     id: 1,
//     text: 'Go shopping'
// }));

// console.log('Current state');
// console.log(store.getState());
// console.log('-------------');

// console.log(store.dispatch({
//     type: 'TOGGLE_TODO',
//     id: 1
// }));

// console.log('Current state');
// console.log(store.getState());
// console.log('-------------');

    

    
}]);