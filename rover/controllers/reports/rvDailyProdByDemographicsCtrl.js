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

  var renderReport = function() {
    var props = {
      data 				: $scope.results,
      startedRendering 	: startedRendering,
      completedRendering: completedRendering
    };
    startedRendering();
    React.renderComponent(
    DailyProductionByDemographics(props),
    document.getElementById('daily-prod-demographics')
    );
  };

  // re-render must be initiated before for taks like printing.
  var reportSubmited    = $scope.$on(reportMsgs['REPORT_SUBMITED'], renderReport);
  var reportPrinting    = $scope.$on(reportMsgs['REPORT_PRINTING'], renderReport);
  var reportUpdated     = $scope.$on(reportMsgs['REPORT_UPDATED'], renderReport);
  var reportPageChanged = $scope.$on(reportMsgs['REPORT_PAGE_CHANGED'], renderReport);

  $scope.$on('destroy', reportSubmited);
  $scope.$on('destroy', reportUpdated);
  $scope.$on('destroy', reportPrinting);
  $scope.$on('destroy', reportPageChanged);

  var initializeMe = function() {
    renderReport();
  }();
}]);
