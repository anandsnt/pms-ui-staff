admin.controller('ADExtApiKeyGeneratorCtrl', ['$scope',
    'ADExtApiKeyGeneratorSrv', 'ngTableParams', '$anchorScroll', '$timeout', '$location',
    function($scope, ADExtApiKeyGeneratorSrv, ngTableParams, $anchorScroll, $timeout, $location) {


        $scope.$emit("changedSelectedMenu", 7);
        $scope.currentClickedElement = -1;
        $scope.previousItem = "";

        ADBaseTableCtrl.call(this, $scope, ngTableParams);

        var resetNew = function() {
            $scope.state.new = {
                chain_id: ""
            };
        };

        $scope.fetchTableData = function($defer, params) {
            var getParams = $scope.calculateGetParams(params);
            var fetchSuccessOfItemList = function(data) {
                $scope.$emit('hideLoader');
                $scope.currentClickedElement = -1;
                $scope.totalCount = parseInt(data.total_count);
                $scope.totalPage = Math.ceil(data.total_count / $scope.displyCount);
                $scope.data = data.results;

                $scope.currentPage = params.page();
                params.total($scope.totalCount);
                $defer.resolve($scope.data);

            };

            $scope.invokeApi(ADExtApiKeyGeneratorSrv.fetch, getParams, fetchSuccessOfItemList);
        };

        $scope.loadTable = function() {
            $scope.data = [];
            $scope.tableParams = new ngTableParams({
                page: 1, // show first page
                count: $scope.displyCount, // count per page
                sorting: {
                    name: 'asc' // initial sorting
                }
            }, {
                total: 0, // length of data
                getData: $scope.fetchTableData
            });
        };

        /*
         * To handle cancel click
         */
        $scope.clickedCancel = function() {
            if ($scope.currentClickedElement !== 'new') {
                $scope.data.results[$scope.currentClickedElement].token_email = $scope.previousItem;
            }
            $scope.data.token_email = "";
            $scope.state.mode = "";
            $scope.currentClickedElement = -1;
        };

        /*
         * To handle add new button click
         */
        $scope.addNewClicked = function() {
            $scope.currentClickedElement = 'new';
            $scope.state.mode = "ADD";
            resetNew();
            $timeout(function() {
                $location.hash('add-new');
                $anchorScroll();
            });
        };

        /**
         * Method to generate a new Api Key
         */
        $scope.onSave = function() {
            var chain_id = $scope.state.new.chain_id;

            $scope.state.mode = "ADD";
            $scope.callAPI(ADExtApiKeyGeneratorSrv.create, {
                params: {
                    chain_id: chain_id,
                    token_email: $scope.data.token_email,
                    user: $scope.data.user
                },
                successCallBack: function() {
                    $scope.tableParams.reload();
                    $scope.state.mode = '';
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

            $scope.invokeApi(ADExtApiKeyGeneratorSrv.chains, {}, fetchChainsSuccessCallback);
        };

        /**
         * Initialization method for the controller
         */
        (function() {
            $scope.state = {
                mode: "",
                chains: ""
            };
            $scope.loadTable();
            $scope.fetchHotelChains();
        })();
    }
]);
