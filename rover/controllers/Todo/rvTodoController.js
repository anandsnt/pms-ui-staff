angular.module('sntRover').controller('rvTodoController', ['$scope', function($scope) {
    ReactDOM.render(
        <TodoInput/>,
        document.getElementById('todo-starting-point')
    );
}]);