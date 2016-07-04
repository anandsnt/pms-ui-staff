/**
 * Created by rahul on 4/7/16.
 */
angular.module('EndOfDayModule', [])
    .config(function($stateProvider, $urlRouterProvider, $translateProvider){

        $stateProvider.state('rover.endOfDay', {
            abstract: true,
            url: '/endofDay',
            templateUrl: '/assets/partials/endOfDay/rvEndofDay.html',
            //controller: '',
            resolve: {
                jsAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['endofday']);
                }
            }
        });
        $stateProvider.state('rover.endOfDay.starteod', {
            url: '/endofDay',
            templateUrl: '/assets/partials/endOfDay/rvEndOfDayStart.html'
            //controller: '',
        });

    });
