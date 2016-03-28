sntRover
	.directive('multiOptionSelection', ['$timeout', function($timeout) {
		return {
			restrict: 'E',
			templateUrl: '/assets/directives/multiOptionSelection/rvMultiOptionSelection.html',
			replace: true,
			scope: {
				label: '@',
				data: '=',
				options: '@'
			},
			controller: function($scope, $element, $attrs) {
				BaseCtrl.call(this, $scope);

				var options = $scope.$eval($attrs.options);

				/**/

				$scope.toggleView = function(bool) {
					$scope.closed = typeof bool === 'boolean' ? bool : ! $scope.closed;
					$scope.refreshScroller( $scope.scrollKey );
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
							nameEmail = (item[options.key] || item[options.altKey]).toLowerCase();

						if ( search === '' || nameEmail.indexOf(search) >= 0 ) {
							item[key] = false;
						} else {
							item[key] = true;
						}
					});

					$scope.refreshScroller( $scope.scrollKey );
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
						$scope.value = 'Choose ' + $scope.label;
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

					if ( $scope.selectAll ) {
						updateData( 'selected', true );
					} else {
						updateData( 'selected', false );
					};

					if ( $scope.hasSearch ) {
						$scope.search = '';
						updateData( 'filteredOut', false );
					};

					updateSelectedValue();

					$scope.scrollKey = 'key-' + Date.now();

					$scope.setScroller($scope.scrollKey, {
					    preventDefault: false
					});
				};

				init();
			}
		}
	}])