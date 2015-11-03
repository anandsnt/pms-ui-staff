sntZestStation.controller('zsFindReservationCtrl', [
	'$scope',
	'$state',
	'zsTabletSrv',
	'zsUtilitySrv',
	'zsModeConstants',
	'zsEventConstants',
	function($scope, $state, zsTabletSrv, zsUtilitySrv, zsModeConstants, zsEventConstants) {

            BaseCtrl.call(this, $scope);
            /**
             * when the back button clicked
             * @param  {[type]} event
             * @return {[type]} 
             */
            $scope.$on (zsEventConstants.CLICKED_ON_BACK_BUTTON, function(event) {
                // navigate to home screen if not in the detailed search page
                if($scope.at  === "input-last" || $scope.at === "find-reservation"){
                    $state.go ('zest_station.home');
                }
                else{
                    $state.go ('zest_station.find_reservation');
                }
            });

            $scope.datePickerMin;
            $scope.fetchBizDateComplete = function(data){
                if (data){
                    if (data.business_date){
                        var d = data.business_date;
                        var a = d.split('-');
                        var yr = a[0], day = a[2], mo = a[1];
                        $scope.business_date = new Date(yr, mo, day);
                        $scope.resetDatePicker();
                    }
                }
            };
                
            $scope.dateOptions = {
                    dateFormat: 'MM-dd-yy',
                    yearRange: "0:+10",
                    onSelect: function(value) {
                        var d = value;
                        var text = d.split('/');
                        if (value){
                            $('#datepicker').val(text[2]+'-'+text[0]+'-'+text[1]);
                            $('#datepicker').val(value);
                            $state.setDate = value;
                            $scope.input.lastDateValue = value;
                            setTimeout(function(){
                                $scope.showDatePick = false;  
                                $scope.$apply();
                            },150);
                        }

                    }
            };
            $scope.showDatePicker = function(){
                    $scope.showDatePick = true;
                    $("#picker").datepicker( "option", "minDate", $scope.datePickerMin);
                   
                    setTimeout(function(){
                           if ($state.setDate === $scope.datePickerMin){
                               var d = $scope.datePickerMin.split('-');
                               var year, month, day;
                               year = parseInt(d[2]);
                               month = parseInt(zsUtilitySrv.getMonthN(d[0]));
                               day = parseInt(d[1]);
                                    $('#picker').datepicker('setDate', new Date(year, month, day));
                           } else {
                                if ($state.setDate){
                                    var d = $state.setDate.split('-');
                                    var day = parseInt(d[1]), month = parseInt(new Date($state.setDate).getMonth()), year  = parseInt(d[2]);


                                    $('#picker').datepicker('setDate', new Date(year, month, day));
                                }
                        }
                    },5);
            };
            $scope.resetDatePicker = function(){
                        $scope.showDatePick = false;
                        var defaultDate = $scope.business_date+'';//for datepicker
                        var d = defaultDate.split(' ');
                        //day of wk = d[0]
                        var year = d[3]+'',
                                month = zsUtilitySrv.getMonthN(d[1])-1,//this method is 1 based, adjust for 0-based date obj
                                day = d[2]+'';
                        if (parseInt(day) < 10){
                            day = '0'+day;
                        }
                        if (parseInt(month) < 10){
                            month = '0'+month;
                        }
                        defaultDate = zsUtilitySrv.getMonthName(month)+'-'+day+'-'+year;
                        
                        $state.setDate = defaultDate;
                        $scope.datePickerMin = defaultDate;
                        $scope.input.lastDateValue = defaultDate;
            };
            
	/**
	 * when we clicked on pickup key from home screen
	 */
	$scope.clickedOnPickUpKey = function() {
            $state.go('zest_station.reservation_search', {
                mode: zsModeConstants.PICKUP_KEY_MODE
            });
	};

	/**
	 * when we clicked on checkin from home screen
	$scope.clickedOnCheckinButton = function() {
            $state.go('zest_station.reservation_search', {
                mode: zsModeConstants.CHECKIN_MODE
            });
	};

	 * when we clicked on checkout from home screen
	 */
	$scope.clickedOnCheckoutButton = function() {
            $state.go('zest_station.reservation_search', {
                mode: zsModeConstants.CHECKOUT_MODE
            });
	};

        $scope.findByDate = function(){
            $state.go('zest_station.find_by_date');
        };
        $scope.findByEmail = function(){
            $state.go('zest_station.find_by_email');
        };
        $scope.findByConfirmation = function(){
            $state.go('zest_station.find_by_confirmation');
        };
        
        
        $scope.goToNext = function(){
            $state.lastInput = $scope.input.inputTextValue; 
            $state.lastAt = $scope.at;
            if ($scope.at === 'find-by-email'){
                $state.search = true; 
                $state.go('zest_station.reservation_search');
                
            } else if ($scope.at === 'input-last'){
                if (!$state.input){
                    $state.input = {};
                }
                $state.input.last = $scope.input.inputTextValue;
                $state.go('zest_station.find_reservation');
            }
        };
        

        $scope.init = function(){  
            if (!$scope.input){
                $scope.input = {};
            }
          var current = $state.current.name;
          if (current === 'zest_station.find_by_date'){
                $scope.at = 'find-by-date';
                           $scope.input.date = '';
                            $scope.datepicker_heading = 'Find By Date';
                            $scope.hideNavBtns = false;
                            setTimeout(function(){
                                
                            $scope.callAPI(zsTabletSrv.fetchHotelBusinessDate, {}, $scope.fetchBizDateComplete);
                            
                            },500);
          } else if (current === 'zest_station.find_by_email'){
                $scope.at = 'find-by-email';
                            $scope.headingText = 'Type Your Email Address';
                            $scope.subHeadingText = '';
                            $scope.inputTextPlaceholder = '';
                            $scope.hideNavBtns = false;
                            
          } else if (current === 'zest_station.find_by_confirmation'){
                $scope.at = 'find-by-confirmation';
                
                            $scope.headingText = 'Type Your Confirmation Number';
                            $scope.subHeadingText = '';
                            $scope.inputTextPlaceholder = '';
                            $scope.input.inputTextValue = '';
                            
          } else if (current === 'zest_station.find_reservation_input_last'){
                $scope.at = 'input-last';
                            $scope.headingText = 'Type Your Last Name';
                            $scope.subHeadingText = '';
                            $scope.inputTextPlaceholder = '';
                            
          } else if (current === 'zest_station.find_reservation'){
                            $scope.at = 'find-reservation';
          }
          
          
        };

	/**
	 * [initializeMe description]
	 */
	var initializeMe = function() {
		//show back button
        $scope.$emit (zsEventConstants.SHOW_BACK_BUTTON);

        //show close button
        $scope.$emit (zsEventConstants.SHOW_CLOSE_BUTTON);
                
        $scope.init();
	}();
}]);