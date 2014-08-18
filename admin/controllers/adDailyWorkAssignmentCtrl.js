admin.controller('ADDailyWorkAssignmentCtrl', [
	'$scope',
	'$rootScope',
	'ADDailyWorkAssignmentSrv',
	function($scope, $rootScope, ADDailyWorkAssignmentSrv) {

		BaseCtrl.call(this, $scope);
		

		// clicked element type indicators 
		$scope.taskTypeClickedElement = -1;
		$scope.taskListClickedElement = -1;
		$scope.maidShiftClickedElement = -1;


		// service data
		var taskTypeCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.taskType = data;
		};
		$scope.invokeApi(ADDailyWorkAssignmentSrv.fetchTaskType, {}, taskTypeCallback);

		var taskListCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.taskList = data;
		};
		$scope.invokeApi(ADDailyWorkAssignmentSrv.fetchTaskList, {}, taskListCallback);

		var maidShiftCallback = function(data) {
			$scope.$emit('hideLoader');
			$scope.maidShift = data;
		};
		$scope.invokeApi(ADDailyWorkAssignmentSrv.fetchMaidShift, {}, maidShiftCallback);


		// add new item
		$scope.addNew = function(from) {
			switch (from) {
				case 'taskType':
					$scope.taskTypeClickedElement = 'new';
					$scope.taskListClickedElement = -1;
					$scope.maidShiftClickedElement = -1;
					break;
				case 'taskList':
					$scope.taskTypeClickedElement = -1;
					$scope.taskListClickedElement = 'new';
					$scope.maidShiftClickedElement = -1;
					break;
				case 'maidShift':
					$scope.taskTypeClickedElement = -1;
					$scope.taskListClickedElement = -1;
					$scope.maidShiftClickedElement = 'new';
					break;
				default:
					console.log( 'no idea where to add' );
					break;
			};
		};

		// remove a item
		$scope.deleteItem = function(from) {
			switch (from) {
				case 'taskType':
					// dwadawd
					break;
				case 'taskList':
					// dasdwad
					break;
				case 'maidShift':
					// dwadwa
					break;
				default:
					console.log( 'no idea where to delete' );
					break;
			};
		};





	}
]);