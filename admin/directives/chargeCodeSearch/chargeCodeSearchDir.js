admin.directive("chargeCodeSearch", function() {

    return {
        restrict : 'E',
        replace : true,
        scope : {
            chargeCode : '=chargeCode',
            chargeCodeName : '=chargeCodeName',
            isBillingGroup : '@isBillingGroup'
        },
        templateUrl : '../../assets/directives/chargeCodeSearch/chargeCodeSearch.html',
        controller : function($scope, ADChargeCodesSrv) {
            $scope.chargeCodeSearchResults = [];
            $scope.showChargeCodes = false;

            $scope.refreshScroller = function (key){
                setTimeout(function() {
                    if ( !!$scope.$parent && $scope.$parent.myScroll ) {
                        if( key in $scope.$parent.myScroll ){
                            $scope.$parent.myScroll[key].refresh();
                        }
                    };
                }, $scope.timeOutForScrollerRefresh);
            };

            var successCallBackForChargeCodeSearch = function(data) {
                if (data.results && data.results.length) {
                  // change results set to suite our needs
                  $scope.chargeCodeSearchResults = data.results;
                  $scope.showChargeCodes = true;
                  $scope.refreshScroller('chargeCodesList');
                } else {
                   $scope.showChargeCodes = false;
                }
            };

            $scope.chargeCodeEntered = function() {
                var params = {
                    query: $scope.chargeCodeName
                };
                ADChargeCodesSrv.searchChargeCode(params).then(successCallBackForChargeCodeSearch);
            };

            /**
           * Set the charge code to item selected from auto complete list
           * @param {Integer} charge code value
           */
          $scope.selectChargeCode = function(id, name){
            $scope.chargeCode = id;
            $scope.chargeCodeName = name;
            $scope.showChargeCodes = false;
          };

        }
    };

});