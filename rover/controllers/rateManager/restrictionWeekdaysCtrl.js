sntRover.controller('RestrictionWeekdaysCtrl', ['$scope', 'ngDialog',
    function ($scope, ngDialog) {


    $scope.$parent.myScrollOptions = {
        'restictionWeekDays' : {            
            scrollbars : true,
            interactiveScrollbars : true,
            click : true            
        },

    };

        $scope.init = function(){
            console.log("init week days controller");
        };
        $scope.init();





    }
]);