angular.module('eventsModule', []).config(function($stateProvider) {
    
          $stateProvider.state('rover.events', {
              url: '/events',
              templateUrl: '/assets/partials/events/rvEvents.html',
              controller: 'eventsController',
              resolve: {
                  eventTypes: function (RVEventsSrv) {
                    return RVEventsSrv.getEventTypes();
                  }
              },
              lazyLoad: function($transition$) {
                return $transition$.injector().get('jsMappings').
                    fetchAssets(['rover.events', 'directives']);
              }              
          });
          
  });
  