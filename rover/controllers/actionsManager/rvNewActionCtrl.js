sntRover.controller('RVNewActionCtrl', ['$scope', '$rootScope', 'rvUtilSrv', 'dateFilter', 'rvActionTasksSrv',
    function ($scope, $rootScope, rvUtilSrv, dateFilter, rvActionTasksSrv) {
        BaseCtrl.call(this, $scope);

        var init = function(){

            $scope.__maxLengthOfNotes = 255;

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
                },
                beforeShow:function(){
                    angular.element("#ui-datepicker-div").after(angular.element('<div></div>',{
                        id :"ui-datepicker-overlay",
                        class: $scope.ngDialogId ? "transparent" : "" //If a dialog is already open then make overlay transparent
                    }));
                },
                onClose:function(){
                    angular.element("#ui-datepicker-overlay").remove();
                }
            };

            $scope.callAPI(rvActionTasksSrv.fetchCurrentTime,{
                successCallBack:function(response){
                    $scope.newAction.dueTime = response;
                }
            });
        };

        $scope.saveNewAction = function () {
            var ref = $scope.newAction,
                payLoad = {
                    description: ref.note,
                    assigned_to: ref.department? parseInt(ref.department, 10) : "",
                    due_at: dateFilter(ref.dueDate, $rootScope.dateFormatForAPI) + "T" + ref.dueTime + ":00",
                    reservation_id: ref.reservation.id
                };

            $scope.callAPI(rvActionTasksSrv.postNewAction,{
                params: payLoad,
                successCallBack: function(){
                    $scope.$emit("NEW_ACTION_POSTED");
                }
            });
        };

        /**
         * http://stackoverflow.com/questions/10030921/chrome-counts-characters-wrong-in-textarea-with-maxlength-attribute
         * This method mitigates the discrepancy in the character count calculation by
         * A. The browser for text area max-length
         * B. String length JavaScript
         */
        $scope.adjustedLength = function(str){
            return str.replace(/\r(?!\n)|\n(?!\r)/g, "\r\n").length;
        };

        var listenerInit = $scope.$on("INIT_NEW_ACTION",function(){
            init();
        });

        init();

        $scope.$on('$destroy', listenerInit);
    }]
);