        admin.controller('ADCheckoutCtrl',['$scope','adCheckoutSrv','$state', 'ngTableParams','$filter', function($scope,adCheckoutSrv,$state,ngTableParams,$filter){

        	BaseCtrl.call(this, $scope);

            $scope.init = function(){
        	$scope.checkoutData = {};
        	$scope.showingEmailOptions = false;
        	$scope.emailDatas = {};
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

            /*
            * To show email list
            *
            */


            $scope.showSendEmailOptions = function(){

            	$scope.showingEmailOptions = true;
            	$scope.emailTitle = 'Guests Checking Out';
            	$scope.selectAllOption = false;
            	$scope.disableSave = true;


            	 var fetchEmailListSuccessCallback = function(data) {
            		$scope.$emit('hideLoader');
            		$scope.emailDatas  = data.due_out_guests;


            	angular.forEach($scope.emailDatas,function(item, index) {
         			   item.is_selected = false;
         		});

                  // REMEMBER - ADDED A hidden class in ng-table angular module js. Search for hidde or pull-right
                    $scope.tableParams = new ngTableParams({
                        page: 1,            // show first page
                        count: $scope.emailDatas.length,    // count per page - Need to change when on pagination implemntation
                        sorting: {
                            name: 'asc'     // initial sorting
                        }
                    }, {
                        total: $scope.emailDatas.length, // length of data
                        getData: function($defer, params) {
                            // use build-in angular filter
                            var orderedData = params.sorting() ?
                                                $filter('orderBy')($scope.emailDatas, params.orderBy()) :
                                                $scope.emailDatas;
                            $defer.resolve(orderedData.slice((params.page() - 1) * params.count(), params.page() * params.count()));
                        }
                    });

            	}
            	$scope.invokeApi(adCheckoutSrv.fetchEmailList, {},fetchEmailListSuccessCallback);
            	
            }
            /*
            * To watch if any checkbox is selected so as to enable submit button
            *
            */

             $scope.$watch('emailDatas',function(){

            	$scope.disableSave = true;

            	angular.forEach($scope.emailDatas,function(item, index) {
         			  if(item.is_selected){
         			  
         			  	$scope.disableSave = false;
         			  }
         		});


            }, true);


            $scope.backActionFromEmail = function(){
            	$scope.showingEmailOptions = false;
            }

            /*
            * To toggle options
            *
            */

            $scope.toggleAllOptions = function(){

            	$scope.selectAllOption = $scope.selectAllOption ? false:true;

            	if($scope.selectAllOption){

            			angular.forEach($scope.emailDatas,function(item, index) {
         			   item.is_selected = true;
         			});


            	}
            	else{

            			angular.forEach($scope.emailDatas,function(item, index) {
         			   item.is_selected = false;
         			});


            	}
            }
            /*
            * To send mail
            *
            */
           

            $scope.sendMailClicked = function(){

         
            	reservations = [];

            	angular.forEach($scope.emailDatas,function(item, index) {
         			   if(item.is_selected)
         			   	 reservations.push(item.reservation_id)
         		});
         		
            	var emailSendingData = {'reservations' : reservations}

            	 var sendMailClikedSuccessCallback = function(data) {
            		$scope.$emit('hideLoader');
           
            	}
            	$scope.invokeApi(adCheckoutSrv.sendMail, emailSendingData,sendMailClikedSuccessCallback);
            	
            }


            $scope.gotToDashboard = function(){

            		$state.go('admin.dashboard', {
        			menu : 1
        		});
            }


        }]);