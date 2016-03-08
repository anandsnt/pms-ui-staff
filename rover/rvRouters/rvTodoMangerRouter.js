angular.module('todoModule', [])
    .config(function($stateProvider, $urlRouterProvider, $translateProvider){
        $stateProvider.state('rover.todo', {
            url: '/todo/',
            templateUrl: '/assets/partials/todo/todoRoot.html',
            controller: 'rvTodoController',
            resolve: {
                todoAssets: function (jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['react.files', 'rover.todo'], ['react']);
                }
            }
        });

    });