sntRover.controller('stayCardMainCtrl', ['$scope',
	function($scope) {

		// BaseCtrl.call(this, $scope);

		$scope.searchData={
			companyCard : {
				companyName : "s",
				companyCity : "",
				companyCorpId : ""
			}
		}

		
		$scope.reservationDetails={
			companyCard:{
				id:1
			},
			travelAgent:{
				id:18
			}

		};
		
	}
]);