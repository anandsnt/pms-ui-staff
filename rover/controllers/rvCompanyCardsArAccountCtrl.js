
sntRover.controller('companyCardArAccountCtrl', ['$scope', '$state', '$stateParams',
	function($scope, $state, $stateParams) {
		BaseCtrl.call(this, $scope);
		
		$scope.setScroller('companyCardArAccountCtrl');

		$scope.$on("arAccountTabActive", function() {
			setTimeout(function() {
				refreshScroller();
			}, 500);
		});

		var refreshScroller = function() {
			$scope.refreshScroller('companyCardArAccountCtrl');
		};


		$scope.useMainContact = true;
		$scope.useMainAdrress = true;
		$scope.notes = [];
		$scope.data = {};
		$scope.data.note = "";

		$scope.saveNote = function(){
			alert("save");
			console.log($scope.data.note);
			$scope.notes.push($scope.data.note);
			console.log($scope.notes);
			$scope.data.note = "";
		}

	}
]);
