sntRover.controller('RVNewActionCtrl', ['$scope', '$rootScope', 'rvUtilSrv', 'dateFilter', 'rvActionTasksSrv',
    function ($scope, $rootScope, rvUtilSrv, dateFilter, rvActionTasksSrv) {
        BaseCtrl.call(this, $scope);

        var init = function(){
            $scope.newAction = {
                reservation: null,
                dueDate: $rootScope.businessDate,
                dueTime: "00:00",
                note: "",
                department: ""
            };

            $scope.dueDateOptions = {
                minDate: tzIndependentDate($rootScope.businessDate),
                dateFormat: $rootScope.jqDateFormat,
                numberOfMonths: 1,
                onSelect: function (date, datePickerObj) {
                    $scope.newAction.dueDate = new tzIndependentDate(rvUtilSrv.get_date_from_date_picker(datePickerObj));
                }
            };
        };

        $scope.saveNewAction = function () {
            var ref = $scope.newAction,
                payLoad = {
                    description: ref.note,
                    assigned_to: ref.department? parseInt(ref.department, 10) : "",
                    due_at: dateFilter(ref.dueDate, "yyyy-MM-dd") + "T" + ref.dueTime + ":00",
                    reservation_id: ref.reservation.id
                };

            $scope.callAPI(rvActionTasksSrv.postNewAction,{
                params: payLoad,
                successCallBack: function(){
                    $scope.$emit("NEW_ACTION_POSTED");
                }
            });
        };

        $scope.closeDialog = function(){
            $scope.$emit("CLOSE_POPUP");
        };

        var listenerInit = $scope.$on("INIT_NEW_ACTION",function(){
            init();
        });

        init();

        $scope.$on('$destroy', listenerInit);
    }]
);