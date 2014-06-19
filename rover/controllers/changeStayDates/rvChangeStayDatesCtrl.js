sntRover.controller('RVchangeStayDatesController',['$scope', 'stayDateDetails', function($scope, stayDateDetails){
	
	$scope.stayDetails = stayDateDetails;
	
	//calender options used by full calender, related settings are done here
	$scope.fullCalendarOptions =  {
		height: 450,
        editable: true,
        header:{
          left        : 'prev',
          center      : 'title',
          right       : 'next'
        },
        dayClick: $scope.alertEventOnClick,
        eventDrop: $scope.alertOnDrop,
        eventResize: $scope.alertOnResize
      };
	$scope.alertEventOnClick = function(){
		alert('day clicked');
	};
	$scope.alertOnDrop = function(){
		alert('event droped');
	};	
	$scope.alertOnResize = function(){
		alert('event resize');
	};	
}]);