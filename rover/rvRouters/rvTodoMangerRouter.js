angular.module('todoModule', [])
    .config(function($stateProvider, $urlRouterProvider, $translateProvider){
        $stateProvider.state('rover.todo', {
            url: '/todo/',
            templateUrl: '/assets/partials/todo/todoRoot.html',
            controller: 'rvTodoController',
            resolve: {
                reactAssets: function (jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['react.files'], ['react']);
                },
                reduxAssets: function (jsMappings, reactAssets) {
                    return jsMappings.fetchAssets(['redux.files']);
                },
                todoAssets: function (jsMappings, reduxAssets) {
                    return jsMappings.fetchAssets(['rover.todo']);
                }
            }
        });

    });