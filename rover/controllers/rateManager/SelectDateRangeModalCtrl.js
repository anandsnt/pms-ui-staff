sntRover.controller('SelectDateRangeModalCtrl',['$scope','ngDialog','$filter','dateFilter', function($scope,  ngDialog, $filter, dateFilter){
	
  $scope.setUpData = function(){

    $scope.isFromDateSelected = true;
    $scope.isToDateSelected   = true;


        if($scope.currentFilterData.begin_date.length > 0){
          $scope.fromDate = $scope.currentFilterData.begin_date;
        }else{
          $scope.fromDate = dateFilter(new Date(), 'yyyy-MM-dd');
        }

        $scope.fromMinDate = dateFilter(new Date(), 'yyyy-MM-dd');

        currentDate   = new Date();
        currentDate.setDate(1);
        currentDate.setMonth(currentDate.getMonth() +1);
        $scope.toMonthDate = currentDate;
        
        if($scope.currentFilterData.end_date.length > 0){
          $scope.toMonthDateFormated = $scope.currentFilterData.end_date;
        }else{
          $scope.toMonthDateFormated = dateFilter(new Date(), 'yyyy-MM-dd');
        }

        
        $scope.toMonthMinDate = dateFilter(currentDate, 'yyyy-MM-dd');
        $scope.errorMessage='';
      };

      $scope.setUpData();
      $scope.okClicked = function(){
        $scope.currentFilterData.begin_date = $scope.fromDate;
        $scope.currentFilterData.end_date = $scope.toMonthDateFormated;
        $scope.currentFilterData.selected_date_range = $scope.currentFilterData.begin_date + ", " + $scope.currentFilterData.end_date;
        ngDialog.close();
      };
      $scope.cancelClicked = function(){
        ngDialog.close();
      };


      $scope.count = 0;

      $scope.$on("fromDateChanged", function(e,value){
       $scope.count++;
       if($scope.count > 2){
        var fromScope = $scope.$$childHead;
        var toScope = $scope.$$childHead.$$nextSibling;
        var fromDays = (12* parseInt(fromScope.yearSelected)) + parseInt(fromScope.monthSelected.value);
        var toDays = (12*parseInt(toScope.yearSelected)) + parseInt(toScope.monthSelected.value);
        if(fromDays != toDays){                
          toScope.changeMonth(parseInt (fromDays - toDays),false);  
        }
      }
    });

    }]);