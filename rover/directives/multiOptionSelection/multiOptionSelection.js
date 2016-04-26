sntRover
	.directive('multiOptionSelection', ['$timeout', function($timeout) {
		return {
			restrict: 'E',
			templateUrl: '/assets/directives/multiOptionSelection/rvMultiOptionSelection.html',
			replace: true,
			scope: {
				label: '@',
				onUpdate: '=',
				data: '=',
				options: '@'
			},
			controller: function($scope, $element, $attrs) {
				BaseCtrl.call(this, $scope);

				var options = $scope.$eval($attrs.options) || {};

				/**/

				$scope.toggleView = function(bool) {
					$scope.closed = typeof bool === typeof true ? bool : ! $scope.closed;
					$timeout($scope.onUpdate, 100);
				};

				$scope.toggleSelectAll = function() {
					$scope.selectAll = ! $scope.selectAll;
					updateData( 'selected', $scope.selectAll );
					updateSelectedValue();
				};

				$scope.clearSearch = function() {
					$scope.search = '';
				};

				$scope.onSearchChange = function() {
					updateData( 'filteredOut', function(item, key) {
						var search    = $scope.search.toLowerCase(),
							keyValue = (item[options.key] || item[options.altKey]).toLowerCase();

						if ( search === '' || keyValue.indexOf(search) >= 0 ) {
							item[key] = false;
						} else {
							item[key] = true;
						}
					});
				};

				$scope.toggleSelection = function(item) {
					item.selected = ! item.selected;
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
					})
				};

				function updateSelectedValue() {
					var items = _.where($scope.data, { 'selected': true });

					if ( items.length === 0 ) {
						$scope.value = options.defaultValue || 'Choose ' + $scope.label;
					} else if ( items.length === 1 ) {
						$scope.value = items[0][options.key] || items[0][options.altKey];
					} else if ( items.length < $scope.data.length ) {
						$scope.value = items.length + ' selected';
					} else if ( items.length === $scope.data.length ) {
						$scope.value = 'All Selected';
					}
				};

				/**/

				var init = function() {
					$scope.closed = true;

					$scope.selectAll = typeof options.selectAll === 'boolean' ? options.selectAll : false;
					$scope.hasSearch = typeof options.hasSearch === 'boolean' ? options.hasSearch : false;

					$scope.key = options.key;
					$scope.altKey = options.altKey;

					if ( $scope.selectAll ) {
						updateData( 'selected', true );
					};

					if ( $scope.hasSearch ) {
						$scope.search = '';
						updateData( 'filteredOut', false );
					};

					updateSelectedValue();
				};

				init();

				var unWatchData = $scope.$watch('data', function () {
					updateSelectedValue();
					$scope.toggleView(true);
				});

				var unWatchOptions = $scope.$watch('options', function () {
					updateSelectedValue();
					$scope.toggleView(true);
				});

				// destroy the $watch when the $scope is destroyed
				$scope.$on('$destroy', unWatchData);
				$scope.$on('$destroy', unWatchOptions);
			}
		}
	}])