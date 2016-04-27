sntRover
	.directive('multiOptionSelection', ['$timeout', function($timeout) {
		return {
			restrict: 'E',
			templateUrl: '/assets/directives/multiOptionSelection/rvMultiOptionSelection.html',
			replace: true,
			scope: {
				label: '@',
				onUpdate: '=',
				report: '=',
				data: '=',
				options: '=',
				affectsFilter: '=',
				updateData: '='
			},
			controller: function($scope, $element, $attrs) {
				BaseCtrl.call(this, $scope);

				/**/

				$scope.toggleView = function(bool) {
					$scope.closed = typeof bool === typeof true ? bool : ! $scope.closed;
					$timeout($scope.onUpdate, 100);
				};

				$scope.toggleSelectAll = function() {
					var ownOptions = $scope.ownOptions = createOptions();

					ownOptions.selectAll = ! ownOptions.selectAll;
					updateData( 'selected', ownOptions.selectAll );
					updateSelectedValue();
				};

				$scope.clearSearch = function() {
					$scope.search = '';
				};

				$scope.onSearchChange = function() {
					updateData( 'filteredOut', function(item, key) {
						var ownOptions = $scope.ownOptions = createOptions();

						var search     = $scope.search.toLowerCase(),
							keyValue   = (item[ownOptions.key] || item[ownOptions.altKey]).toLowerCase();

						if ( search === '' || keyValue.indexOf(search) >= 0 ) {
							item[key] = false;
						} else {
							item[key] = true;
						}
					});
				};

				$scope.toggleSelection = function(item) {
					item.selected = ! item.selected;

					// if item got selected and only single select is set
					// unselect others
					var ownOptions = $scope.ownOptions = createOptions($scope.options);
					if ( item.selected && ownOptions.singleSelect ) {
						_.each($scope.data, function(each) {
							if(each.id !== item.id) {
								each.selected = false;
							}
						});
					}

					updateSelectedValue();
				};

				/**/

				function createOptions() {
					if ( ! $scope.ownOptions ) {
						return $.extend(
							{
								selectAll: false,
								hasSearch: false
							},
							$scope.options
						);
					} else {
						return $.extend(
							$scope.options,
							{
								selectAll: $scope.ownOptions.selectAll
							}
						);
					}
				};

				function updateData(key, value) {
					_.each($scope.data, function(each) {
						if ( typeof value === 'function' ) {
							value(each, key);
						} else {
							each[key] = value;
						}
					})
				};

				function updateSelectedValue() {
					var ownOptions = $scope.ownOptions = createOptions();
					var selectedItems = _.where($scope.data, { 'selected': true });

					ownOptions.selectAll = false;
					if ( selectedItems.length === 0 ) {
						$scope.value = ownOptions.defaultValue || 'Select ' + $scope.label;
					} else if ( selectedItems.length === 1 ) {
						$scope.value = selectedItems[0][ownOptions.key] || selectedItems[0][ownOptions.altKey];
					} else if ( selectedItems.length < $scope.data.length ) {
						$scope.value = selectedItems.length + ' selected';
					} else if ( selectedItems.length === $scope.data.length ) {
						ownOptions.selectAll = true;
						$scope.value = ownOptions.allValue || 'All Selected';
					};

					if ( typeof $scope.affectsFilter == typeof {} ) {
						$scope.affectsFilter.process( $scope.report[$scope.affectsFilter.name], selectedItems );
					};
				};

				/**/

				var init = function() {
					$scope.closed = true;
					$scope.value  = '';

					$scope.ownOptions = createOptions();

					if ( $scope.ownOptions.selectAll ) {
						updateData( 'selected', true );
					};

					if ( $scope.ownOptions.hasSearch ) {
						$scope.search = '';
						updateData( 'filteredOut', false );
					};

					updateSelectedValue();
				};

				init();

				var unWatchData = $scope.$watch('data', init);
				var unWatchOptions = $scope.$watch('options', init);

				// destroy the $watch when the $scope is destroyed
				$scope.$on('$destroy', unWatchData);
				$scope.$on('$destroy', unWatchOptions);
			}
		}
	}])