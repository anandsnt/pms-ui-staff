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
				options: '='
			},
			controller: function($scope, $element, $attrs) {
				BaseCtrl.call(this, $scope);

				/**/

				$scope.toggleView = function(bool) {
					$scope.closed = typeof bool === typeof true ? bool : ! $scope.closed;
					$timeout($scope.onUpdate, 100);
				};

				$scope.toggleSelectAll = function() {
					$scope.options.selectAll = ! $scope.options.selectAll;
					updateData( 'selected', $scope.options.selectAll );
					updateSelectedValue();
				};

				$scope.clearSearch = function() {
					$scope.search = '';
				};

				$scope.onSearchChange = function() {
					updateData( 'filteredOut', function(item, key) {
						var options  = (typeof $scope.options == typeof {}) ? $scope.options : {},
							search   = $scope.search.toLowerCase(),
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
					var options = (typeof $scope.options == typeof {}) ? $scope.options : {},
						items   = _.where($scope.data, { 'selected': true });

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
					$scope.value  = '';

					var options   = (typeof $scope.options == typeof {}) ? $scope.options : {},
						selectAll = (typeof options.selectAll == typeof true) ? options.selectAll : false,
						hasSearch = (typeof options.hasSearch == typeof true) ? options.selectAll : false;

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