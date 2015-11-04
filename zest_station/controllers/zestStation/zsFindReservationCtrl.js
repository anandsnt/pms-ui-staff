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
            $scope.business_date;
             var fetchBizDateComplete = function(data){

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
            
            
            $scope.reEnter = function(value){
                $state.lastSearchWith = $state.lastAt;
                $state.lastAt = 'no-match';
                $state.reEntered = value;
                switch($state.reEntered){
                    case "email":
                        $state.go('zest_station.find_by_email');
                        break;
                    case "last":
                        $state.go('zest_station.find_reservation_input_last');
                        break;
                    case "confirmation":
                        $state.go('zest_station.find_by_confirmation');
                        break;
                    case "date":
                        $state.go('zest_station.find_by_date');
                        break;
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
            

        $scope.findByDate = function(){
            $state.go('zest_station.find_by_date');
        };
        $scope.findByEmail = function(){
            $state.go('zest_station.find_by_email');
        };
        $scope.findByConfirmation = function(){
            $state.go('zest_station.find_by_confirmation');
        };
        
        $scope.searchWithEmail = function(){
            $state.search = true; 
            $state.lastAt = 'find-by-email';
            if (!$state.input){
                $state.input = {};
            }
            $state.input.email = $scope.input.inputTextValue;
            $state.go('zest_station.reservation_search');
        };
        $scope.searchWithDate = function(){
            $state.search = true; 
            $state.lastAt = 'find-by-date';
            if (!$state.input){
                $state.input = {};
            }
            $state.input.date = $scope.input.date;
            $state.go('zest_station.reservation_search');
        };
        $scope.searchWithConfirmation = function(){
            $state.search = true; 
            $state.lastAt = 'find-by-confirmation';
            if (!$state.input){
                $state.input = {};
            }
            $state.input.confirmation = $scope.input.inputTextValue;
            $state.go('zest_station.reservation_search');
        };
        $scope.goToFindReservation = function(){
            if (!$state.input){
                $state.input = {};
            }
            $state.lastAt = 'input-last';
            $state.input.last = $scope.input.inputTextValue;
            $state.go('zest_station.find_reservation');
        };
        $scope.searchWithUpdated = function(){
            //this method is to re-run search using the 'updated' text from the user
            //determine which search was run from $state.lastSearchWith
            $state.lastAt = $state.lastSearchWith;
            $state.search = true;
            var updated = $state.reEntered;
            console.info('updated: '+updated)
            switch(updated){
                case "email":
                    $state.input.email = $state.lastInput;
                    break;
                case "last":
                    $state.input.last = $state.lastInput;
                    break;
                case "confirmation":
                    $state.input.confirmation = $state.lastInput;
                    break;
                case "date":
                    $state.input.date = $scope.input.date;
                    break;
            }
            $state.go('zest_station.reservation_search');
        };
        
        $scope.talkToStaff = function(){
            $state.go('zest_station.talk_to_staff');
        };
        
        $scope.goToNext = function(){
            $state.lastInput = $scope.input.inputTextValue; 
            if ($state.lastAt !== 'no-match'){
                $state.lastAt = $scope.at;
            }
            var at = $state.lastAt;
            console.log(at);
            switch(at){
                case "find-by-email":
                    $scope.searchWithEmail();
                    break;
                    
                case "find-by-confirmation":
                    $scope.searchWithConfirmation();
                    break;
                    
                case "find-by-date":
                    $scope.searchWithDate();
                    break;
                    
                case "input-last":
                    $scope.goToFindReservation();
                    break;
                    
                case "no-match":
                    $scope.searchWithUpdated();
                    break;
            }
        };
        
        $scope.setFindByDate = function(){
            $scope.at = 'find-by-date';
            $scope.input.date = '';
            $scope.datepicker_heading = 'Find By Date';
            $scope.hideNavBtns = false;
            
            if ($state.lastAt === 'no-match'){
                $scope.input.date = $state.input.date;
            }
            $scope.callAPI(zsTabletSrv.fetchHotelBusinessDate, {
                'successCallBack':fetchBizDateComplete
            });
        };
        $scope.setFindByEmail = function(){
            $scope.at = 'find-by-email';
            $scope.headingText = 'Type Your Email Address';
            $scope.subHeadingText = '';
            $scope.inputTextPlaceholder = '';
            $scope.hideNavBtns = false;
            
            if ($state.lastAt === 'no-match'){
                $scope.input.inputTextValue = $state.input.email;
            }
        };
        $scope.setFindByConfirmation = function(){
            $scope.at = 'find-by-confirmation';
            $scope.headingText = 'Type Your Confirmation Number';
            $scope.subHeadingText = '';
            $scope.inputTextPlaceholder = '';
            $scope.input.inputTextValue = '';
            
            if ($state.lastAt === 'no-match'){
                $scope.input.inputTextValue = $state.input.confirmation;
            }
        };
        $scope.setInputLast = function(){
            $scope.at = 'input-last';
            $scope.headingText = 'Type Your Last Name';
            $scope.subHeadingText = '';
            $scope.inputTextPlaceholder = '';
            if ($state.lastAt === 'no-match'){
                $scope.input.inputTextValue = $state.input.last;
            }
        };
        $scope.setNoMatch = function(){
            $scope.at = 'no-match';
            if (!$scope.input){
                $scope.input = {};
            }
            $scope.input.last = $state.input.last;
            $scope.input.date = $state.input.date;
            $scope.input.email = $state.input.email;
            $scope.input.confirmation = $state.input.confirmation;
            $scope.lastAt = $state.lastAt;
        };


        $scope.init = function(){  
            if (!$scope.input){
                $scope.input = {};
            }
            var current = $state.current.name;
          
            switch(current){
                case "zest_station.find_by_date":
                    $scope.setFindByDate();
                    break;
                case "zest_station.find_by_email":
                    $scope.setFindByEmail();
                    break;
                case "zest_station.find_by_confirmation":
                    $scope.setFindByConfirmation();
                    break;
                case "zest_station.find_reservation_input_last":
                    $scope.setInputLast();
                    break;
                case "zest_station.find_reservation":
                    $scope.at = 'find-reservation';
                    break;
                case "zest_station.find_reservation_no_match":
                    $scope.setNoMatch();
                    break;
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