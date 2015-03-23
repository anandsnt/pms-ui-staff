sntRover.controller('rvGroupConfigurationSummaryTab', ['$scope', '$rootScope', 'rvGroupSrv', '$filter', '$stateParams', 'rvGroupConfigurationSrv', 'dateFilter',
	function($scope, $rootScope, rvGroupSrv, $filter, $stateParams, rvGroupConfigurationSrv, dateFilter) {
		BaseCtrl.call(this, $scope);


		$scope.fromDateOptions = {
			showOn: 'button',
			dateFormat: $rootScope.dateFormat,
			numberOfMonths: 1,
			yearRange: '-1:',
			minDate: tzIndependentDate($rootScope.businessDate),
			beforeShow: function(input, inst) {
				$('#ui-datepicker-div').addClass('reservation arriving');
				$('<div id="ui-datepicker-overlay" class="transparent" />').insertAfter('#ui-datepicker-div');
			},
			onClose: function(dateText, inst) {
				$('#ui-datepicker-div').removeClass('reservation arriving');
				$('#ui-datepicker-overlay').remove();
			}
		};

		$scope.toDateOptions = {
			showOn: 'button',
			dateFormat: $rootScope.dateFormat,
			numberOfMonths: 1,
			yearRange: '-1:',
			minDate: tzIndependentDate($rootScope.businessDate),
			beforeShow: function(input, inst) {
				$('#ui-datepicker-div').addClass('reservation departing');
				$('<div id="ui-datepicker-overlay" class="transparent" />').insertAfter('#ui-datepicker-div');
			},
			onClose: function(dateText, inst) {
				$('#ui-datepicker-div').removeClass('reservation departing');
				$('#ui-datepicker-overlay').remove();
			}
		};

		$scope.fromDateChanged = function() {
			$scope.groupConfigState.summary.block_from = dateFilter($scope.groupConfigState.summary.block_from, 'yyyy-MM-dd');
		}

		$scope.toDateChanged = function() {
			$scope.groupConfigState.summary.block_to = dateFilter($scope.groupConfigState.summary.to_from, 'yyyy-MM-dd');
		}
	}
]);