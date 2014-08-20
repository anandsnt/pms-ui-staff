
sntRover.controller('companyCardArAccountCtrl', ['$scope','RVCompanyCardSrv',
	function($scope,RVCompanyCardSrv) {
		BaseCtrl.call(this, $scope);
		
		$scope.setScroller('companyCardArAccountCtrl');

		var refreshScroller = function() {
			$scope.refreshScroller('companyCardArAccountCtrl');
		};

		$scope.$on("arAccountTabActive", function() {
			setTimeout(function() {
				refreshScroller();
			}, 500);
		});

		
		$scope.ARData = {};
		$scope.ARData.note = "";

		$scope.saveNote = function(){
			
			var successCallbackOfsaveARNote = function(){
				$scope.arAccountNotes.ar_notes.push($scope.ARData.note);
				$scope.ARData.note = "";
				console.log($scope.arAccountNotes)
			};
			
			var dataToSend = {"account_id":$scope.contactInformation.id,"note":$scope.ARData.note};
			$scope.invokeApi(RVCompanyCardSrv.saveARNote, dataToSend, successCallbackOfsaveARNote);

		}
		var updateArAccount = function(){
			alert("dd");
		};


	  /**
		 * recieving function for save AR accounts with data
		 */
		$scope.$on('saveArAccount', function(event) {
			event.preventDefault();
			//event.stopPropagation();
			updateArAccount();
		});

	}
]);
