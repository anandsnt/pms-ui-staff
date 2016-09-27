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
				affectsFilter: '='
			},
			controller: function($scope, $element, $attrs) {
				BaseCtrl.call(this, $scope);

				/**/

				$scope.toggleView = function(bool) {
					$scope.closed = typeof bool === typeof true ? bool : ! $scope.closed;
					$timeout($scope.onUpdate, 150);
				};

				$scope.clearSearch = function() {
					$scope.search = '';
					$scope.onSearchChange();
				};

				$scope.onSearchChange = function() {
					updateData( 'filteredOut', function(item, key) {
						var options  = $scope.options || {},
							search   = $scope.search.toLowerCase(),
							keyValue = (item[options.key] || item[options.altKey]).toLowerCase();

						if ( search === '' || keyValue.indexOf(search) >= 0 ) {
							item[key] = false;
						} else {
							item[key] = true;
						}
					});
				};

				$scope.toggleSelectAll = function() {
					var options = $scope.options || {};
					options.selectAll = ! options.selectAll;

					updateData( 'selected', options.selectAll );
					updateSelectedValue();
				};

				$scope.toggleSelection = function(item) {
					var options = $scope.options || {};

					item.selected = ! item.selected;

					// if in this set any one item can be choosen at a time
					var isSingleSelect = function() {
						return item.selected && !! options.singleSelect
					};

					// if in this set if a particular item is selected, that should only be selected
					var isSelectiveSingleSelect = function() {
						return item.selected && (options.selectiveSingleSelectKey === item.id)
					};

					var checkUnselectSelectiveSingleSelect = function() {
						var thatItem;

						if ( !! options.selectiveSingleSelectKey ) {
							thatItem = _.find($scope.data, { id: options.selectiveSingleSelectKey });
							thatItem.selected = false;
						}
					}

					// unselect others
					var unSelectOthers = function() {
						_.each($scope.data, function(each) {
							if(each.id !== item.id) {
								each.selected = false;
							}
						});
					};

					if ( isSingleSelect() || isSelectiveSingleSelect() ) {
						unSelectOthers();
					} else {
						checkUnselectSelectiveSingleSelect();
					}

					updateSelectedValue();
				};

				/**/

				function updateData(key, value) {
					_.each($scope.data, function(each) {
						if ( typeof value === 'function' ) {
							value(each, key);
						} else {
							each[key] = value;
						}
					});

					$timeout($scope.onUpdate, 150);
				};

				function updateSelectedValue() {
					var options = $scope.options || {};
					var selectedItems = _.where($scope.data, { 'selected': true });

					options.selectAll = false;
					if ( selectedItems.length === 0 ) {
						$scope.value = options.defaultValue || 'Select ' + $scope.label;
					} else if ( selectedItems.length === 1 ) {
						$scope.value = selectedItems[0][options.key] || selectedItems[0][options.altKey];
					} else if ( selectedItems.length < $scope.data.length ) {
						$scope.value = selectedItems.length + ' selected';
					} else if ( selectedItems.length === $scope.data.length ) {
						options.selectAll = true;
						$scope.value = options.allValue || 'All Selected';
					};

					if ( typeof $scope.affectsFilter == typeof {} ) {
						$scope.affectsFilter.process( $scope.report[$scope.affectsFilter.name], selectedItems );
					};

					$timeout($scope.onUpdate, 150);
				};

				/**/

				var init = function() {
					$scope.closed = true;
					$scope.value  = '';

					var options = $scope.options || {};
					if ( options.selectAll ) {
						updateData( 'selected', true );
					};

					if ( options.hasSearch ) {
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