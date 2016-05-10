admin.controller('adIdeasSetupCtrl', ['$scope', '$rootScope', 'ideaSetup', 'adIdeasSetupSrv', 'dateFilter',
	function($scope, $rootScope, ideaSetup, adIdeasSetupSrv, dateFilter) {
		BaseCtrl.call(this, $scope);

		//-------------------------------------------------------------------------------------------------------------- SCOPE VARIABLES
		// Date Picker Settings
		$scope.datepicker = {
			options:{
				dateFormat: getJqDateFormat(),
                numberOfMonths: 1,
                changeYear: true,
                changeMonth: true,
                beforeShow: function(input, inst) {
                    $('<div id="ui-datepicker-overlay">').insertAfter('#ui-datepicker-div');
                },
                onClose: function(value) {
                    $('#ui-datepicker-overlay').remove();
                },
                yearRange: "-1:+5"
			}
		}

		//-------------------------------------------------------------------------------------------------------------- SCOPE METHODS
		/**
		 * Method to save setup
		 * @return {[type]} [description]
		 */
		$scope.saveSetup = function(){
			var params = angular.copy($scope.ideaSetup);
			// Convert date object to API format
			params.start_date = dateFilter(params.start_date, $rootScope.dateFormatForAPI);
			$scope.callAPI(adIdeasSetupSrv.postIdeasSetup,{
				params : params,
				onSuccess: function(){
					// Navigate back to interfaces list on successful save
					$scope.goBackToPreviousState();
				}
			})
		}

		//-------------------------------------------------------------------------------------------------------------- INIT
		var init = function() {
			$scope.ideaSetup = ideaSetup;
		}();
	}
])