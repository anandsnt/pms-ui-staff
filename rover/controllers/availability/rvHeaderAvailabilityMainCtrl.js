sntRover.controller('rvHeaderAvailabilityMainController', [
	'$scope', 
	'$timeout', 
	'ngDialog', 
	'$rootScope',
	'$filter',
	'rvAvailabilitySrv',
	function($scope, $timeout, ngDialog, $rootScope, $filter, rvAvailabilitySrv){

		/**
		* Controller class for availability in header section
		*/

		BaseCtrl.call(this, $scope);

		//variable used to determine whether we need to show availability section or not (we will add/remove section based on this)
		$scope.showAvailability = false;
		
		//When closing we need to add a class to container div
		$scope.isClosing = false;

		//variable to get/set value availabilty or house
		$scope.isAvailabilitySet = true;

		//default number of selected days is 14
		$scope.numberOfDaysSelected = 14;


		$scope.data = {};

		//default date value
		$scope.data.selectedDate = $rootScope.businessDate;


		/**
		* function to handle click on availability in the header section.
		* will call the API to fetch data with default values (from business date to 14 days)
		* and will show the availability section if successful
		*/
		$scope.clickedOnAvailabilityLink = function($event){
			
			/*
				in order to compromise with stjepan's animation class we need write like this
				because we are removing the availability details section when not wanted,
				we need to wait some time to complete the animation and execute the removing section after that
			*/

			if($scope.showAvailability){
				//adding the class for closing animation
				$scope.isClosing = true;	
				//after some time we are removing the section and resetiing values to older 
				 $timeout(function(){
				 	$scope.isClosing = false;
					//hiding/removing the availability section
					$scope.showAvailability = false;
				 }, 1000);			
			}
			else{
				$scope.showAvailability = true;	
			}
				
		};

		/**
		* function to execute when switching between availability and house keeping
		*/
		$scope.setAvailability = function(){
			$scope.$emit("showLoader");
			$scope.isAvailabilitySet = !$scope.isAvailabilitySet;
		};

		/**
		* function to get the template url for availability, it will supply only if 
		* 'showAvailability' is true
		*/
		$scope.getAvailabilityTemplateUrl = function(){
			if($scope.showAvailability){
				return '/assets/partials/availability/headerAvailability.html';
			}
			return "";
		};

		// To popup contract start date
		$scope.clickedOnDatePicker = function() {
			ngDialog.open({
				template: '/assets/partials/common/rvDatePicker.html',
				controller: 'rvAvailabilityDatePickerController',
				className: 'ngdialog-theme-default calendar-single1',
				scope: $scope,
				closeByDocument: true
			});
		};	

		/**
		* success call of availability data fetch
		*/
		var successCallbackOfAvailabilityFetch = function(data){
			$scope.isAvailabilitySet = true;

			// for this successcallback we are not hiding the activty indicator
			// we will hide it only after template loading.

		}

		/**
		* error call of availability data fetch
		*/
		var failureCallbackOfAvailabilityFetch = function(errorMessage){
			$scope.$emit("hideLoader");

		};


		/**
		* When there is any change of for availability data params we need to call the api
		*/	
		$scope.changedAvailabilityDataParams = function(){
			//calculating date after number of dates selected in the select box
			var dateAfter = tzIndependentDate (($scope.data.selectedDate));
			
			//dateAfter.setDate(new Date($scope.data.selectedDate) + $scope.numberOfDaysSelected);
			console.log(dateAfter);
			var dataForWebservice = {
				'from_date': tzIndependentDate($scope.data.selectedDate),
				'to_date'  : tzIndependentDate(dateAfter)
			}
			$scope.invokeApi(rvAvailabilitySrv.fetchAvailabilityDetails, dataForWebservice, successCallbackOfAvailabilityFetch, failureCallbackOfAvailabilityFetch);						
		};

	}
]);