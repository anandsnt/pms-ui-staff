
sntRover.controller('companyCardArAccountCtrl', ['$scope','RVCompanyCardSrv',
	function($scope,RVCompanyCardSrv) {

		$scope.setScroller('companyCardArAccountCtrl');
		var refreshScroller = function() {
				$scope.refreshScroller('companyCardArAccountCtrl');
			};

		var init = function(){

			BaseCtrl.call(this, $scope);

			$scope.ARData = {};
			$scope.ARData.note = "";
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

		$scope.checkboxModelChanged = function(){
			refreshScroller();
		};


		$scope.saveNote = function(){

			var successCallbackOfsaveARNote = function(data){
				$scope.$emit("hideLoader");
				$scope.arAccountNotes.ar_notes.push(data);
				$scope.ARData.note = "";
				refreshScroller();
			};

			var dataToSend = {"id":$scope.contactInformation.id,"note":$scope.ARData.note};
			$scope.invokeApi(RVCompanyCardSrv.saveARNote, dataToSend, successCallbackOfsaveARNote);

		}


		$scope.deletePost = function(note_id,index){

			var deleteARNoteSuccess = function(){
				$scope.$emit("hideLoader");
				$scope.arAccountNotes.ar_notes.splice(index,1);
				refreshScroller();
			};

			var dataToSend = {"id":$scope.contactInformation.id,"note_id":note_id};
			$scope.invokeApi(RVCompanyCardSrv.deleteARNote, dataToSend, deleteARNoteSuccess);

		}

		var updateArAccount = function(){

			var successCallbackOfsaveARDetails = function(data){
				$scope.$emit("hideLoader");
				$scope.$emit('ARNumberChanged',{'newArNumber':$scope.arAccountDetails.ar_number})	
			};
			var dataToSend = $scope.arAccountDetails;
			dataToSend.id  = $scope.contactInformation.id
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
			updateArAccount();
		});

	}
]);
