admin.controller('adComtrolRevenueCenterCtrl', ['$scope', 'revCenters',
    function($scope, revCenters) {

        //private
        var resetNew = function() {
            $scope.state.new = {
                name: "",
                code: ""
            }
        };

        //scope
        $scope.state = {
            selected: null,
            mode: "",
            new: {
                name: "",
                code: ""
            }
        };

        $scope.onClickAdd = function() {
            $scope.state.mode = "ADD";
            resetNew();
        };

        $scope.onCancelAdd = function() {
            $scope.state.mode = "";
        };

        $scope.onSelect = function(idx) {
            $scope.state.selected = idx;
        };

        $scope.onCancelEdit = function() {

        };

        $scope.onUpdate = function() {
            $scope.state.mode = "";
            $scope.state.selected = null;
        };

        $scope.onSave = function() {
            $scope.state.mode = "";
            $scope.revCenters.push(angular.copy($scope.state.new));
        };

        (function() {
            $scope.revCenters = revCenters;
        })();
    }
]);