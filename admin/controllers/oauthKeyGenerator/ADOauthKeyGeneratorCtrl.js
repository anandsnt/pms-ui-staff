admin.controller('ADOauthKeyGeneratorCtrl', ['$scope',
    'ADOauthKeyGeneratorSrv', '$anchorScroll', '$timeout', '$location',
    function($scope, ADOauthKeyGeneratorSrv, $anchorScroll, $timeout, $location) {

        /**
         * Method to generate a new Api Key
         */
        $scope.onSave = function() {
            var chain_id = $scope.state.new.chain_id;

            $scope.callAPI(ADOauthKeyGeneratorSrv.create, {
                params: {
                    chain_id: chain_id,
                    app_name: $scope.data.app_name,
                    delivery_emails: $scope.data.delivery_emails
                },
                successCallBack: function() {
                    $scope.$emit('hideLoader');
                    $scope.successMessage = 'OAuth Credentials are sent to provided email(s) successfully!';
                }
            });
        };

        /*
         * To fetch hotel chains list
         */
        $scope.fetchHotelChains = function() {
            var fetchChainsSuccessCallback = function(data) {
                $scope.$emit('hideLoader');
                $scope.chainsList = data.chain_list;
                $scope.state.chains = $scope.chainsList;
            };

            $scope.invokeApi(ADOauthKeyGeneratorSrv.chains, {}, fetchChainsSuccessCallback);
        };

        /**
         * Initialization method for the controller
         */
        (function() {
            $scope.state = {
                chains: ""
            };
            $scope.data = {
              app_name: "",
              delivery_emails: "",
              chain_id: ""
            }
            $scope.fetchHotelChains();
        })();
    }
]);
