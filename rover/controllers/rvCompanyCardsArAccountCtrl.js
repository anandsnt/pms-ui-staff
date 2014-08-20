
sntRover.controller('companyCardArAccountCtrl', ['$scope','RVCompanyCardSrv',
	function($scope,RVCompanyCardSrv) {
		

		var init = function(){
			
			BaseCtrl.call(this, $scope);

			$scope.ARData = {};
			$scope.ARData.note = "";
			$scope.setScroller('companyCardArAccountCtrl');

			var refreshScroller = function() {
				$scope.refreshScroller('companyCardArAccountCtrl');
			};

			$scope.$on("arAccountTabActive", function() {
				setTimeout(function() {
					refreshScroller();
				}, 500);
			});
			
		};
		init();
		var presentArDetails = {};
		
		// to set data to be compared from time to time 
		//to check if data has been edited or not
		$scope.$on('ARDetailsRecieved',function(){
			presentArDetails = JSON.parse(JSON.stringify($scope.arAccountDetails));
		});
		

		$scope.saveNote = function(){
			
			var successCallbackOfsaveARNote = function(){
				$scope.$emit("hideLoader");
				$scope.arAccountNotes.ar_notes.push($scope.ARData.note);
				$scope.ARData.note = "";
				console.log($scope.arAccountNotes)
			};
			
			var dataToSend = {"account_id":$scope.contactInformation.id,"note":$scope.ARData.note};
			$scope.invokeApi(RVCompanyCardSrv.saveARNote, dataToSend, successCallbackOfsaveARNote);

		}
		var updateArAccount = function(){
			
			var successCallbackOfsaveARDetails = function(data){
				$scope.$emit("hideLoader");
				console.log(data);
			};
			var dataToSend = {"account_id":$scope.contactInformation.id,"details":$scope.arAccountDetails};
			
			var presentArDetailsAfterEdit = JSON.parse(JSON.stringify($scope.arAccountDetails));
		    var dataNotUpdated = false;
		    //check if data was edited
		    if(!angular.equals(presentArDetailsAfterEdit, presentArDetails)) {
				dataNotUpdated = true;
				presentArDetails = presentArDetailsAfterEdit;
			}
			if(dataNotUpdated)
				$scope.invokeApi(RVCompanyCardSrv.saveARDetails, dataToSend, successCallbackOfsaveARDetails);
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
