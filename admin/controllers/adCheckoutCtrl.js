            admin.controller('ADCheckoutCtrl',['$scope','adCheckoutSrv','$state', function($scope,adCheckoutSrv,$state){

            	  $scope.errorMessage = '';
           
                BaseCtrl.call(this, $scope);

                $scope.init = function(){
            	  $scope.checkoutData = {};
            	
              	$scope.hours = ["01","02","03","04","05","06","07","08","09","10","11","12"];
                $scope.minutes = ["00","15","30","45"];
                $scope.primeTimes = ["AM","PM"];
             }

                $scope.init();
            	
                /*
                * To fetch checkin details
                */
            	$scope.fetchCheckoutDetails = function(){
            		var fetchCheckoutDetailsSuccessCallback = function(data) {
            			
            			$scope.$emit('hideLoader');
            			$scope.checkoutData = data;

            			 $scope.is_send_checkout_staff_alert_flag = ($scope.checkoutData.is_send_checkout_staff_alert === 'true') ? true:false;
            			 $scope.require_cc_for_checkout_email_flag = ($scope.checkoutData.require_cc_for_checkout_email === 'true') ? true:false;
            			 $scope.include_cash_reservationsy_flag = ($scope.checkoutData.include_cash_reservations === 'true') ? true:false;
            			
            		
            		};
            		$scope.invokeApi(adCheckoutSrv.fetch, {},fetchCheckoutDetailsSuccessCallback);
            	};

            	$scope.fetchCheckoutDetails();


                 /*
                * To save checkout details
                * @param {data} 
                *
                */

                $scope.saveCheckout = function(){

                	    $scope.checkoutData.is_send_checkout_staff_alert = ($scope.is_send_checkout_staff_alert_flag) ? 'true':'false';
            			$scope.checkoutData.require_cc_for_checkout_email = ($scope.require_cc_for_checkout_email_flag) ? 'true':'false';
            			$scope.checkoutData.include_cash_reservations = ($scope.include_cash_reservationsy_flag) ?'true':'false';


            			var uploadData = {

            				'checkout_email_alert_time':$scope.checkoutData.checkout_email_alert_time_hour+":"+$scope.checkoutData.checkout_email_alert_time_minute,
            				'checkout_staff_alert_option':$scope.checkoutData.checkout_staff_alert_option,
            				'emails':$scope.checkoutData.emails,
            				'include_cash_reservations':$scope.checkoutData.include_cash_reservations,
            				 'is_send_checkout_staff_alert':$scope.checkoutData.is_send_checkout_staff_alert,
            				'require_cc_for_checkout_email':$scope.checkoutData.include_cash_reservations

            			}

                	var saveCheckinDetailsSuccessCallback = function(data) {
                		$scope.$emit('hideLoader');
                	}
                	$scope.invokeApi(adCheckoutSrv.save, uploadData,saveCheckinDetailsSuccessCallback);

                }

               
                $scope.gotToDashboard = function(){

                		$state.go('admin.dashboard', {
            			menu : 1
            		});
                }


            }]);