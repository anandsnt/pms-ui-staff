angular.module('SocialLobbyModule', [])
    .config(function($stateProvider, $urlRouterProvider, $translateProvider){

        $stateProvider.state('rover.socialLobby', {
            abstract: false,
            url: '/socialLobby',
            templateUrl: '/assets/partials/socialLobby/rvSLPosts.html',
            controller: 'RVSocialLobbyCrl',
            resolve: {
                jsAssets: function(jsMappings, mappingList) {
                    return jsMappings.fetchAssets(['sociallobby']);
                }
            }
        });

    });