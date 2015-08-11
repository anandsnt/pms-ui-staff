admin.controller('ADReservationSegmentsCtrl', ['$scope', '$state', 'ADSegmentsSrv', 'ngTableParams', '$filter',
	function($scope, $state, ADSegmentsSrv, ngTableParams, $filter) {

		$scope.errorMessage = '';
		BaseCtrl.call(this, $scope);

		$scope.segmentData = {
			currentSegment: false,
			newSegmentData: {
				name: '',
				los: ''
			},
			baseData: {
				segments: []
			}
		};

		var fetchSegments = function() {
			// Step1 : fetch existing segments
			var onFetchSuccess = function(data) {
				$scope.$emit('hideLoader');
				$scope.segmentData.baseData = data;
			};
			$scope.invokeApi(ADSegmentsSrv.fetch, {}, onFetchSuccess);
		};

		var initSegments = function() {
			$scope.itemList = new ngTableParams({
				page: 1, // show first page
				count: $scope.segmentData.baseData.segments.length, // count per page - Need to change when on pagination implemntation
				sorting: {
					name: 'asc' // initial sorting
				}
			}, {
				total: 0, // length of data
				getData: fetchSegments
			});
		};

		$scope.addNewSegment = function() {
			$scope.segmentData.newSegmentData = {
				name: '',
				los: ''
			};
			$scope.segmentData.currentSegment = 'NEW';
		};

		$scope.cancelAddSegment = function() {
			$scope.segmentData.currentSegment = false;
		};

		// SAVE SEGMENT
		$scope.saveNewSegment = function() {
			// Make API call for saving new Segment

			var onSaveSuccess = function(data) {
				$scope.$emit('hideLoader');
				$scope.segmentData.currentSegment = false;
				fetchSegments();
			};
			$scope.invokeApi(ADSegmentsSrv.save, $scope.segmentData.newSegmentData, onSaveSuccess);
		};

		// UPDATE SEGMENT
		$scope.updateSegment = function(segment) {
			var onUpdateSuccess = function(data) {
				$scope.$emit('hideLoader');
				$scope.segmentData.currentSegment = false;
			};
			$scope.invokeApi(ADSegmentsSrv.update, segment, onUpdateSuccess);
		};

		// DELETE SEGMENT
		$scope.deleteSegment = function(segment) {
			var onDeleteSuccess = function(data) {
				$scope.$emit('hideLoader');
				$scope.segmentData.currentSegment = false;
				fetchSegments();
			};
			$scope.invokeApi(ADSegmentsSrv.delete, segment, onDeleteSuccess);
		};


		// on change activation
		$scope.onToggleActivation = function(segment) {
			segment.is_active = !segment.is_active;
			$scope.updateSegment(segment);

		};

		$scope.onEditSegment = function(segment, index) {
			$scope.segmentData.editStore = angular.copy(segment);
			$scope.segmentData.currentSegment = index;
		};

		$scope.onCancelEdit = function(index) {
			$scope.segmentData.baseData.segments[index] = angular.copy($scope.segmentData.editStore);
			$scope.segmentData.currentSegment = false;
		};

		$scope.toggleSegmentsUse = function() {
			var onToggleSuccess = function(data) {
				$scope.$emit('hideLoader');
				$scope.segmentData.currentSegment = false;
			};
			$scope.invokeApi(ADSegmentsSrv.toggleSegmentsUse, {
				is_use_segments: $scope.segmentData.baseData.is_use_segments
			}, onToggleSuccess);

		};

		initSegments();
	}
]);