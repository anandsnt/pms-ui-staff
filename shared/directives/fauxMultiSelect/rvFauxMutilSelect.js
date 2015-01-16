angular.module('fauxMultiSelectModule', [])
  .directive('fauxMultiSelect', ['$document', function($document) {
      return {
        restrict : 'EA',
        templateUrl : '../../assets/directives/fauxMultiSelect/fauxMultiSelect.html',
        require: 'clickedOutsideElement',
        scope : {
        	model: '=ngModel',
        	source: '=fauxSource'
        },
        link: function(scope, element, attrs, ctrl) {
        	ctrl.addEl(element);
        	console.log( ctrl.elAry );
        },
        controller : function($scope, $element) {
        	var itemName = $element.attr( 'faux-item-name' );

        	var updateSelection = function() {
        		if ($scope.model.length == $scope.source.length) {
        			$scope.fauxTitle = 'All Selected';
        		} else if ($scope.model.length > 1) {
        			$scope.fauxTitle = $scope.model.length + ' Selected';
        		} else if ( $scope.model.length == 0 ) {
        			$scope.fauxTitle = 'Select';
        		};
        	};

        	$scope.fauxTitle = 'Select';
        	$scope.hidden = true;

			// add a new key selected and set it true if its part of ng-model
			_.each($scope.source, function(item) {
				var match = _.find($scope.model, function(id) {
					return id == item.id;
				});

				item.selected = !!match ? true : false;
				item.itemName = item[itemName];
			});

			updateSelection();

        	$scope.fauxToggle = function() {
        		$scope.hidden = $scope.hidden ? false : true;
        	};

        	$scope.fauxOptionChosen = function() {
        		$scope.model = [];

        		_.each($scope.source, function(item) {
        			if ( item.selected ) {
        				$scope.model.push( item.id );
        				$scope.fauxTitle = item.itemName;
        			};
        		});

        		updateSelection();
        	};

        	$scope.$on('CLICKED_OUTSIDE_ELEMENT', function(e, target) {
        		$scope.hidden = true;
        	});
        }

      }
    }]);