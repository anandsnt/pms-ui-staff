angular.module('sntRover').controller('rvDailyProdByDemographicsCtrl',
	['$scope', 'RVReportParserFac', '$timeout', 'RVReportMsgsConst', function($scope, reportParser, $timeout, reportMsgs) {

  BaseCtrl.call(this, $scope);

  var startedRendering = function() {
    $timeout(function() {
      $scope.$emit('showLoader');
    }, 0);
  };

  var completedRendering = function() {
    $timeout(function() {
      $scope.$emit('hideLoader');
    }, 0);
  };

  var completedUpdating = function() {
    $timeout(function() {
      $scope.$emit('hideLoader');
    }, 2 * $scope.results.dates.length);
  };

  var renderReport = function() {
    var props = {
      data 				: $scope.results,
      startedRendering 	: startedRendering,
      completedRendering: completedRendering,
      completedUpdating	: completedUpdating
    };
    startedRendering();
    ReactDOM.render(
	    React.createElement(DailyProductionByDemographics, props),
	    document.getElementById('daily-prod-demographics')
    );
  };

  var reRenderReport = function(){
  	$timeout(function(){
  		startedRendering();
  	}, 50);
  	
  	$timeout(function(){
  		renderReport();
  	}, 100);
  };

  var reportSubmited    = $scope.$on(reportMsgs['REPORT_SUBMITED'], function(){ 
  	$timeout(function(){
  		renderReport();
  	}, 50);
  });
  var reportPrinting    = $scope.$on(reportMsgs['REPORT_PRINTING'], renderReport);
  var reportUpdated     = $scope.$on(reportMsgs['REPORT_UPDATED'], reRenderReport);
  var reportPageChanged = $scope.$on(reportMsgs['REPORT_PAGE_CHANGED'], reRenderReport);

  $scope.$on('$destroy', reportSubmited);
  $scope.$on('$destroy', reportUpdated);
  $scope.$on('$destroy', reportPrinting);
  $scope.$on('$destroy', reportPageChanged);

  var initializeMe = function() {
  	$timeout(function(){
  		startedRendering();
  	}, 0);
  	
  	$timeout(function(){
  		renderReport();
  	}, 10);
  }();
}]);
