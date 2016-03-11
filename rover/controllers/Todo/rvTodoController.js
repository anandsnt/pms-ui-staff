angular.module('sntRover').controller('rvTodoController', ['$scope', function($scope) {
    var initialState = {
        todos: [{
            id: 0,
            completed: false,
            text: 'Initial todo for demo purpose'
        }]
    };

    let store = configureStore(initialState);
    const {render} = ReactDOM; 
    render(
        <ReactRedux.Provider store={store}>
            <App />
        </ReactRedux.Provider>,
        document.getElementById('todo-starting-point')
    );
}]);