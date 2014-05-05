admin.controller('ADAddnewRate', 
    ['$scope','ADRatesRangeSrv', 'ADRatesSrv', '$state', '$stateParams',
    function($scope, ADRatesRangeSrv, ADRatesSrv, $state, $stateParams) {
        $scope.init = function(){
            BaseCtrl.call(this, $scope);
            ADRatesRangeSrv.emptyDateRangeData();
            // edit_mode by default false indicate Add New Rate
            $scope.edit_mode = false
            var initialContent = {
                                    'title': 'Rate',
                                    'subtitle':'Details',
                                    'type' : 'Details',
                                    'id'   : 'Details'
                                };
            $scope.currentStepIndexList = [initialContent];
            $scope.currentRateStepIndex = 0;
            $scope.errorMessage = '';
            $scope.newRateId = $stateParams.rateId;
            $scope.showAddNewDateRangeOptions =false;
            // setting rateId and values for Rate Edit
            if ($stateParams.rateId){
                $scope.edit_mode = true
                $scope.rateId = $stateParams.rateId
                $scope.invokeApi(ADRatesSrv.fetchDetails, {rateId:$scope.rateId}, $scope.fetchDetailsSuccess);
            }
        };
        /*
        * click action to switch between steps
        */
        $scope.clickedStep =  function(index,id){
            $scope.currentRateStepIndex = index;
        };

        $scope.$on("errorReceived", function(e,value){
            
            $scope.errorMessage = value;
        });
        /*
            * to be updated from child classes 
        */
        $scope.$on("updateIndex", function(e,value){
            var nextContent = {}
            if(value.id == 1){
            $scope.newRateId= value.rateId;
            if($scope.currentStepIndexList.length< 2){  

                nextContent = {
                                    'title': 'Room',
                                    'subtitle':'Types',
                                    'type' : 'Type',
                                    'id'   : 'Type'
                                };
                $scope.currentStepIndexList.push(nextContent);
                 }
                 $scope.clickedStep(parseInt(value.id));
            }
            else if(value ==2){
            if($scope.currentStepIndexList.length< 3){

                nextContent = {
                                    'title': 'Date',
                                    'subtitle': 'Range',
                                    'type' : 'Range',
                                    'id'   : 'Range'
                                };
                $scope.currentStepIndexList.push(nextContent);
            }
            $scope.clickedStep(parseInt(value));  
            }
            else if(value ==3){
                var getDateRangeData = [];
                if (!$scope.edit_mode){
                    if($scope.currentStepIndexList[2].title === 'Date'){
                        $scope.currentStepIndexList.splice(2,1);
                    }getDateRangeData = $scope.date_range;
                    getDateRangeData = ADRatesRangeSrv.getDateRangeData();
                }
                else{
                    getDateRangeData = $scope.date_range;
                }
                $scope.showAddNewDateRangeOptions = false;

                angular.forEach(getDateRangeData, function(value, key){
                    var nextContent = {
                                    'title': 'Configure',
                                    'type' : 'Configure',
                                    'id'   : value.id,
                                    'begin_date' : value.begin_date,
                                    'end_date':value.end_date
                                    };
                    $scope.isAlreadyIncurrentStepIndexList = false;
                    angular.forEach($scope.currentStepIndexList, function(stepValue, key){

                    if(stepValue.id == nextContent.id){
                        $scope.isAlreadyIncurrentStepIndexList = true;
                    }
                    });
                    if(!$scope.isAlreadyIncurrentStepIndexList)
                       $scope.currentStepIndexList.push(nextContent);

                });   
                $scope.clickedStep($scope.currentStepIndexList.length-1);   
            }

            
        });

        $scope.hideAddNewDateRange = function(){

            if($scope.currentStepIndexList.length >= 3){
                if(parseInt($scope.currentStepIndexList[2].id))
                    return false;
                else
                return true;
            }
            else
                return true;
        }
        $scope.$watch('currentRateStepIndex', function () {
            $scope.currentRateStepIndex =$scope.currentRateStepIndex;
        });
      
        /*
         * to include template
        */

        $scope.includeTemplate = function(index){

            switch (index){
                case 0:
                  return "/assets/partials/rates/adRatesAddDetails.html";
                  break;
                case 1:
                    return "/assets/partials/rates/adRatesAddRoomTypes.html";
                  break;
                 default:
                    if($scope.currentStepIndexList[2].title === "Configure")
                      return "/assets/partials/rates/adRatesAddConfigure.html";
                    else
                      return "/assets/partials/rates/adRatesAddRange.html"; 
                  break;
            };
        };

        $scope.addNewDateRange =  function(){
             $scope.showAddNewDateRangeOptions = true;
             $scope.$broadcast ('resetCalendar');
             $scope.currentRateStepIndex =-1;
        }

        // Fetch details success callback for rate edit
        $scope.fetchDetailsSuccess = function(data){
            // set rate edit field values for all steps
            $scope.hotel_business_date = data.business_date;
            $scope.rate_name = data.name;
            $scope.rate_description = data.description;
            $scope.rateTypeselected = (data.rate_type != null) ? data.rate_type.id : ''
            $scope.basedOnRateTypeSelected = (data.based_on != null) ? data.based_on.id : '';
            $scope.based_on_type = (data.based_on != null) ? data.based_on.type : '';
            $scope.based_on_plus_minus = (data.based_on != null) ? (data.based_on.value > 0 ? '+' : '-') : '';            
            $scope.based_on_value = (data.based_on != null) ? Math.abs(data.based_on.value) : '';
            $scope.room_type_ids = data.room_type_ids;
            $scope.date_ranges = data.date_ranges;
            $scope.setupEdit();
            $scope.$emit('hideLoader');
        };

        $scope.setupEdit = function(){
            nextContent = {
                            'title': 'Room',
                            'subtitle':'Types',
                            'type' : 'Type',
                            'id'   : 'Type'
                        };
            $scope.currentStepIndexList.push(nextContent);
            getDateRangeData = $scope.date_ranges;

            angular.forEach(getDateRangeData, function(value, key){
                past_date_range = Date.parse(value.end_date) < Date.parse($scope.hotel_business_date);
                var nextContent = {
                                    'title': 'Configure',
                                    'type' : 'Configure',
                                    'id'   : value.id,
                                    'begin_date' : value.begin_date,
                                    'end_date' : value.end_date,
                                    'is_editable' : past_date_range
                                  };
                console.log(nextContent)
                $scope.currentStepIndexList.push(nextContent);

            });   
            $scope.clickedStep($scope.currentStepIndexList.length-1);
        }

        /*
        * init function
        */
        $scope.init();

    
}]);
