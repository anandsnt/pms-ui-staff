sntRover.controller('rvTabletCtrl', [
        '$scope',
        '$document',
        '$state',
        '$timeout',
        'rvTabletSrv',
        'ngDialog',
    function($scope, 
        $document, 
        $state, 
        $timeout, 
        rvTabletSrv, 
        ngDialog) {
                
            BaseCtrl.call(this, $scope);
            $scope.hotel = {
                "title": "Zoku"
            };
            $scope.title = $scope.hotel.title;
            $scope.showHeader = true;
            $scope.reservationsPerPage = 3;//in select
            $scope.hoursNights = 'Nights';
            
            $scope.$watch('at',function(to, from, evt){
                
                if (to !== 'home' && from === 'home'){
                    $scope.resetTime();
                } else if (to === 'home' && from !== 'home'){
                    $scope.resetCounter();
                }
            });
            
            $scope.hasPrev = false;
            $scope.hasNext = false;
            
            $scope.setPrev = function(){
                /*
                 * 
                    $rootScope.setPrevState = {
                            title: 'AR Transactions',
                            name: 'station.companycarddetails',
                            param: {}
                    };
                 */
                
                
                
            };
            $scope.setNext = function(){
                
                
            };
            
            
            $scope.arrivalDateOptions = {
                showOn: 'button',
                dateFormat: 'MM-dd-yyyy',
                numberOfMonths: 2,
                yearRange: '-0:',
                minDate: tzIndependentDate(new Date()),
                beforeShow: function(input, inst) {
                    $('#ui-datepicker-div').addClass('reservation arriving');
                },
                onClose: function(dateText, inst) {
                    //in order to remove the that flickering effect while closing
                    $timeout(function() {
                        $('#ui-datepicker-div').removeClass('reservation arriving');
                    }, 200);

                }
            };
            
            
            var setTitle = function() {
                var title = $scope.hotel.title;
                //yes, we are setting the heading and title
                 $scope.title = $document[0].title = title;
                 $scope.windowTitle = angular.element(window.document)[0].title = title;
            };
            
            $scope.hotelLogo = 'assets/css/zestStation/themes/'+$scope.hotel.title.toLowerCase()+'/logo.svg';
            $scope.at = 'home';
            $scope.hideNavBtns = true;
            $scope.inRover = true;
            
            $scope.headingText = 'Header Text Here';
            $scope.subHeadingText = 'Subheader Text Here';
            $scope.inputTextPlaceholder = 'Input Text Here';
            
            var initTabletConfig = function(){
//                $('head').append('<link rel="stylesheet" type="text/css" href="../assets/css/zestStation/zoku.css">');
                //$scope.settings = $rootScope.kiosk;
                var fetchCompleted = function(data){
                    $scope.settings = data;
                    //fetch the idle timer settings
                    $scope.setupIdleTimer();
                    $scope.$emit('hideLoader');
                };
                var fetchHotelCompleted = function(data){
                    $scope.hotel_settings = data;
                    $scope.hotel_terms_and_conditions = $scope.hotel_settings.terms_and_conditions;
                    //fetch the idle timer settings
                    $scope.$emit('hideLoader');
                };
                $scope.invokeApi(rvTabletSrv.fetchHotelSettings, {}, fetchHotelCompleted);
                //$scope.invokeApi(rvTabletSrv.fetchSettings, {}, fetchCompleted);
                setTitle();
                
                $('.root-view').addClass('kiosk');
            };
            
            
            $scope.fetchAdminSettings = function(){
                var fetchCompleted = function(data){
                    //fetch the idle timer settings
                    
                    $scope.setupIdleTimer();
                    
                    $scope.adminIdleTimeEnabled = data.idle_timer_enabled;
                    $scope.adminIdleTimePrompt = data.idle_prompt;
                    $scope.adminIdleTimeMax = data.idle_max;
                    
                    $scope.settings.adminIdleTimeEnabled = data.idle_timer_enabled;
                    $scope.settings.adminIdleTimePrompt = data.idle_prompt;
                    $scope.settings.adminIdleTimeMax = data.idle_max;
                    
                    $scope.idleSettingsPopup.max = $scope.adminIdleTimeMax;
                    $scope.idleSettingsPopup.prompt = $scope.adminIdleTimePrompt;
                    $scope.idleSettingsPopup.enabled = $scope.adminIdleTimeEnabled;
                    
                    $scope.$emit('hideLoader');
                };
                
                $scope.invokeApi(rvTabletSrv.fetchSettings, {}, fetchCompleted);
            };
            $scope.idleSettingsPopup = {
                max: '',
                prompt: '',
                enabled: false
            };
            $scope.updateSettings = function(i, e){
                $scope.idleSettingsPopup[i] = e;
            };
            
            $scope.cancelAdminSettings = function(){
                if ($scope.settings){
                    $scope.settings.adminIdleTimeEnabled = $scope.adminIdleTimeEnabled;
                    $scope.settings.adminIdleTimePrompt = $scope.adminIdleTimePrompt;
                    $scope.settings.adminIdleTimeMax = $scope.adminIdleTimeMax;  
                }
                if ($scope.idleSettingsPopup && $scope.settings){
                    $scope.idleSettingsPopup.max = $scope.settings.adminIdleTimeMax;
                    $scope.idleSettingsPopup.prompt = $scope.settings.adminIdleTimePrompt;
                    $scope.idleSettingsPopup.enabled = $scope.settings.adminIdleTimeEnabled;
                }
            };
            
            $scope.saveAdminSettings = function(){
                $scope.adminIdleTimeEnabled = $scope.idleSettingsPopup.enabled;
                $scope.adminIdleTimePrompt = $scope.idleSettingsPopup.prompt;
                $scope.adminIdleTimeMax = $scope.idleSettingsPopup.max;  
                
                $scope.settings.adminIdleTimeEnabled = $scope.idleSettingsPopup.enabled;
                
                var saveCompleted = function(data){
                    //fetch the idle timer settings
                    var saved = {
                        'idle_timer':{
                            'enabled':$scope.settings.adminIdleTimeEnabled,
                            'max':$scope.settings.adminIdleTimeMax,
                            'prompt':$scope.settings.adminIdleTimePrompt
                        }
                    };
                    
                    $scope.settings = saved;
                    $scope.setupIdleTimer();
                    
                    
                    $scope.$emit('hideLoader');
                };
                
                var params = {
                        'kiosk': {
                            'idle_timer':{
                                'enabled': $scope.settings.adminIdleTimeEnabled,
                                'prompt': $scope.settings.adminIdleTimePrompt,
                                'max': $scope.settings.adminIdleTimeMax
                            },
                            'colors': {
                                'background': "454545",
                                'header_icons': "123456",
                                'header_icons_pressed': "123456",
                                'hotel': "123456",
                                'input_field_background': "123456",
                                'text': "123456",
                                'transparent': "123456"
                            }
                        }
                };
                
                $scope.invokeApi(rvTabletSrv.saveSettings, params, saveCompleted);
            };
            
            $scope.getLogo = function(){
                return $scope.hotelLogo;
            };
            
            

            $scope.openAdminPopup = function() {
                $scope.idle_timer_enabled = false;
                ngDialog.open({
                    template: '/assets/partials/zestStation/rvTabletAdminPopup.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: false
                });
            };
            
            $scope.idlePopup = function() {
                    
                if ($scope.at === 'cc-sign'){
                    $scope.goToScreen(null, 'cc-sign-time-out', true, 'cc-sign');
                } else {
                ngDialog.open({
                        template: '/assets/partials/zestStation/rvTabletIdlePopup.html',
                        className: 'ngdialog-theme-default',
                        scope: $scope,
                        closeByDocument: false,
                        closeByEscape: false
                    });
                }
                    
            };

            $scope.settingsTimerToggle = function(){
                if ($scope.settings){
                    if ($scope.settings.idle_timer.enabled){
                        $scope.settings.idle_timer.enabled = !$scope.settings.idle_timer.enabled;
                    }
                }
                
                
            };
            $scope.setupIdleTimer = function(){
                if ($scope.settings){
                    var settings = $scope.settings.idle_timer;
                    if (settings){
                        if (typeof settings.prompt !== typeof undefined && typeof settings.enabled !== typeof undefined) {
                            if (settings.prompt !== null && settings.enabled !== null){
      //                          console.info('%c settings available to set for kiosk','color: green');
                                $scope.idle_prompt = settings.prompt;
                                $scope.idle_timer_enabled = settings.enabled;
                                $scope.idle_max = settings.max;
                                

                                $scope.adminIdleTimeEnabled = settings.enabled;
                                $scope.adminIdleTimePrompt = settings.prompt;
                                $scope.adminIdleTimeMax = settings.max;

                                $scope.settings.adminIdleTimeEnabled = settings.enabled;
                                $scope.settings.adminIdleTimePrompt = settings.prompt;
                                $scope.settings.adminIdleTimeMax = settings.max;
                                
                                
                            } else {
                                $scope.idle_timer_enabled = false;
                            }
                        } else {
                            $scope.idle_timer_enabled = false;
                        }
                    }
                }
                    if ($scope.at !== 'home'){
                        $scope.resetTime();
                    }
            };
            
            $scope.resetCounter = function(){
               clearInterval($scope.idleTimer);
            };
            $scope.resetTime = function(){
                $scope.closePopup();
               clearInterval($scope.idleTimer);
               $scope.startCounter();
            };
            
            $scope.startCounter = function(){
                var time = $scope.idle_max, promptTime = $scope.idle_prompt;
                
                    var timer = time, minutes, seconds;
                    var timerInt = setInterval(function () {
                        if ($scope.idle_timer_enabled){
                                
                                minutes = parseInt(timer / 60, 10);
                                seconds = parseInt(timer % 60, 10);

                                minutes = minutes < 10 ? "0" + minutes : minutes;
                                seconds = seconds < 10 ? "0" + seconds : seconds;

                                console.log(minutes + ":" + seconds);
                                
                                if (timer === promptTime){
                                    $scope.idlePopup();
                                }
                                
                                if (--timer < 0) {
                                    setTimeout(function(){
                                        $scope.goToScreen({},'home',true, 'idle');
                                    },1000);
                                    
                                    clearInterval(timerInt);
                                    return;
                                    //timer = duration;
                                }
                        }
                    }, 1000);
                    $scope.idleTimer = timerInt;
            };
            
            $scope.closePopup = function(){
                ngDialog.close();
            };
            $scope.reservationShowing = 0;
            $scope.reservationTotal = 0;
            
                
            $scope.reservationList = [];
            $scope.reservationPage = {};
            $scope.reservationPageNum = 1;
            
            $scope.reservationPages = 0;
            
            $scope.reservationNextPage = function(){
                $scope.reservationPageNum++;
                $scope.resList = $scope.reservationPage[$scope.reservationPageNum];
            };
            $scope.reservationPreviousPage = function(){
                $scope.reservationPageNum--;
                $scope.resList = $scope.reservationPage[$scope.reservationPageNum];
            };
            
            $scope.selectedReservation = {};
            $scope.selectReservation = function(r, fromSelect){
                $scope.selectedReservation = r;
                console.log('reservation selected',r);
              
                  $scope.selectedReservation.reservation_details = {};
                  
                  
                  
                  
                
                $scope.$emit('showLoader');
                $scope.invokeApi(rvTabletSrv.fetchReservationDetails, {
                    'id': r.confirmation_number
                }, $scope.onSuccessFetchReservationDetails);
                
                var fromScreen;
                if (!fromSelect){
                    fromScreen = 'select-reservation';
                } else {
                    fromScreen = $scope.from;
                }
                console.info('fromScreen: '+fromScreen);
              
              $scope.goToScreen(null, 'reservation-details', true, fromScreen);
            };
            
            $scope.onSuccessFetchReservationDetails = function(data){
                $scope.$emit('hideLoader');
                    $scope.selectedReservation.reservation_details = data;
                    
                    var info = data.data.reservation_card;
                    var nites, avgDailyRate, packageRate, taxes, subtotal, deposits, balanceDue;
                    //console.log(info)
                    nites = parseInt(info.total_nights);
                    avgDailyRate = parseFloat(info.avg_daily_rate).toFixed(2);
                    deposits = parseFloat(info.deposit_amount).toFixed(2);
                    if (info.package_price){
                        packageRate = parseFloat(info.package_price).toFixed(2);
                    } else {
                        packageRate = 0;
                    }
                    
                    subtotal = nites * avgDailyRate;
                    balanceDue = parseFloat(info.balance_amount).toFixed(2);
                    //console.info('balanceDue',balanceDue, 'subtotal',subtotal, 'deposits',deposits)
                    taxes = parseFloat(balanceDue - subtotal - deposits).toFixed(2);
                    
                    
                    console.info(nites, avgDailyRate, packageRate, taxes, subtotal, deposits, balanceDue);
                  
                  $scope.selectedReservation.reservation_details.daily_rate  = avgDailyRate;
                  
                  $scope.selectedReservation.reservation_details.package_price = packageRate;
                  
                  $scope.selectedReservation.reservation_details.taxes = taxes;
                  
                  $scope.selectedReservation.reservation_details.sub_total = subtotal;
                  
                  $scope.selectedReservation.reservation_details.deposits = deposits;
                  
                  $scope.selectedReservation.reservation_details.balance = balanceDue;
            };
            
            
            $scope.goToSelectReservation = function(){
                var total = $scope.reservationPages;
                    $scope.resList = [];
                    
                    var x = 1, n = $scope.reservationsPerPage, p = 1;
                    var pushedCount=0;
                    $scope.reservationShowing = 0;
                    $scope.reservationTotal = Math.ceil(total / n);
                    $scope.reservationPage = {};
                    for (var i in $scope.reservationList){
                            if (x > n){//update page and reset count
                                p++;
                                x = 1;
                            } 
                            if (typeof $scope.reservationPage[p] === typeof undefined){//create page if not already there
                                   $scope.reservationPage[p] = [];
                            }
                            if (typeof $scope.reservationList[i] !== typeof undefined){
                                $scope.reservationPage[p].push($scope.reservationList[i]);
                                pushedCount++;
                                x++;
                            }    
                    }
                    $scope.reservationPages = Object.keys($scope.reservationPage).length;

                    $scope.resList = $scope.reservationPage[$scope.reservationPageNum];

                    $scope.goToScreen(null, 'select-reservation', true);
            };
            
            
            $scope.resList = [];
            $scope.prevStateNav = [];
            
            
            $scope.navToPrev = function(){
                var from = $scope.from, toScreen = $scope.prevStateNav.pop();
                
                $scope.goToScreen(null, toScreen, true);
            };
            
            $scope.navToHome = function(){
                $scope.prevStateNav = [];
                $scope.goToScreen(null, 'home', true);
            };
            
            $scope.lastTextInput = '';
            
            $scope.inputTextHandler = function(at, textValue){
                console.info('at: '+at)
                if (!$scope.from){
                    $scope.from = 'home';
                }
                console.log('from: '+$scope.from);
                
                
                var fetchCompleted = function(data){
                    
                    
                    if (data.results.length > 1){//debuggin
                    //if (data.results.length > 0){
                        $scope.reservationList = [];
                        $scope.resList = [];
                        $scope.reservationList = data.results;
                        $scope.reservationPages = Math.ceil(data.results.length/$scope.reservationsPerPage);
                        $scope.goToSelectReservation();
                        $scope.reservationPageNum = 1;
                    } else if (data.results.length === 1){
                        $scope.selectReservation(data.results[0], true);
                    } else {
                        $scope.goToScreen(null, 'no-match', true, at);
                    }
                    //fetch the idle timer settings
                    $scope.$emit('hideLoader');
                };
                
                
                var findBy;
                switch(at){
                    case 'admin-login-username':{
                            //fetch reservation list using email as the param
                            //onsuccess push results to window
                        $scope.input.admin.username = textValue;
                        $scope.clearInputText();
                        
                        $scope.goToScreen(null, 'admin-login-password', true);
                        break;
                    };
                    case 'admin-login-password':{
                            //fetch reservation list using email as the param
                            //onsuccess push results to window
                        $scope.input.admin.password = textValue;
                        $scope.clearInputText();
                        $scope.goToScreen(null, $scope.from, true);
                        $scope.goToScreen(null, 'admin', true);
                        break;
                    };
                    case 'input-last':{
                            //fetch reservation list using email as the param
                            //onsuccess push results to window
                        findBy = 'email';
                        $scope.input.last_name = textValue;
                        $scope.clearInputText();
                        
                        if ($scope.from === 'no-match'){
                            $scope.invokeApi(rvTabletSrv.fetchReservations, {
                            'find_by':findBy,
                            'last_name':$scope.input.last_name,
                            'value': $scope.input.lastEmailValue
                        }, fetchCompleted);
                        } else {
                            $scope.goToScreen(null, 'find-reservation', true);
                        }
                        
                        break;
                    };
                    case 'input-email':{
                        if ($scope.from === 'reservation-details'){
                             //fetch reservation list using email as the param
                                //onsuccess push results to window
                            $scope.input.email = textValue;
                            $scope.clearInputText();
                            $scope.goToScreen(null, 'terms-conditions', true);
                        }
                        break;
                    };
                                
                    case 'find-by-email':{
                            //fetch reservation list using email as the param
                            //onsuccess push results to window
                        $scope.input.lastEmailValue = textValue;
                        $scope.from = 'find-by-email';
                        $scope.prevStateNav.push($scope.from);
                        $scope.clearInputText();
                        findBy = 'email';
                        
                        $scope.invokeApi(rvTabletSrv.fetchReservations, {
                            'find_by':findBy,
                            'last_name':$scope.input.last_name,
                            'value': textValue
                        }, fetchCompleted);
                        break;
                    };
                    case 'find-by-date':{
                            //fetch reservation by last name + departure date
                       
                        findBy = 'date';
                        $scope.from = at;
                        $scope.prevStateNav.push($scope.from);
                        $scope.clearInputText();
                        
                        $scope.invokeApi(rvTabletSrv.fetchReservations, {
                            'find_by':findBy,
                            'last_name':$scope.input.last_name,
                            'value': $scope.input.date
                        }, fetchCompleted);
                        break;
                    };
                case 'find-by-confirmation':
                        findBy = 'confirmation_number';
                        $scope.input.lastConfirmationValue = textValue;
                        $scope.from = 'find-by-confirmation';
                        $scope.prevStateNav.push($scope.from);
                        $scope.clearInputText();
                        
                        $scope.invokeApi(rvTabletSrv.fetchReservations, {
                            'find_by':findBy,
                            'last_name':$scope.input.last_name,
                            'value': textValue
                        }, fetchCompleted);
                    break;
                }
                
                
                
            };
            $scope.input = {
                "lastEmailValue": '',
                "lastConfirmationValue": '',
                "inputTextValue": '',
                "admin":{
                    "username":'',
                    "password":''
                }
            };
            $scope.clearInputText = function(){
                $scope.input.inputTextValue = '';
            };

            $scope.submitSignature = function(){
                //detect if coming from email input
                for (var i in $scope.prevStateNav){
                    if ($scope.prevStateNav[i] === 'find-by-email' || $scope.prevStateNav[i] === 'input-email'){
                        $scope.goToScreen(null, 'select-keys-after-checkin', true, $scope.from);
                        return;
                    }
                }
                $scope.goToScreen(null, 'input-email', true, $scope.from);
                
            };
            $scope.goToLast = function(){
                if (!$scope.from){
                    $scope.goToScreen(null, 'home', true);
                } else {
                    $scope.goToScreen(null, $scope.from, true);
                }
            };

            $scope.goToScreen = function(event, screen, override, from){
                console.info($scope.prevStateNav);
                //screen = check-in, check-out, pickup-key;
                var stateToGoTo, cancel = false;
                if (typeof screen === null || typeof screen === typeof undefined){
                      screen = 'home';
                }
                if (typeof from !== null && typeof from !== typeof undefined){
                    if (from !== $scope.from){
                        $scope.from = from;
                        $scope.prevStateNav.push($scope.from);
                    }
                }
                if (screen !== 'home'){
                    $scope.hideNavBtns = false;
                }
                
                switch(screen){
                    case "home":
                        $scope.at = 'home';
                        //stateToGoTo = 'station';
                        $scope.hideNavBtns = true;
                        break;
                        
                    case "input-last":
                        $scope.at = 'input-last';
                        //stateToGoTo = 'station.tab-kiosk-input-last';
                        $scope.headingText = 'Type Your Last Name';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        if (from === 'no-match'){
                            $scope.input.inputTextValue = $scope.input.last_name;
                        }
                        
                        $scope.hideNavBtns = false;
                    break;
                        
                    case "find-reservation":
                        $scope.at = 'find-reservation';
                        //stateToGoTo = 'station.tab-kiosk-find-reservation';
                        //stateToGoTo = 'station.tab-kiosk-input-last';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "find-by-date":
                        $scope.at = 'find-by-date';
                        //stateToGoTo = 'station.tab-kiosk-find-reservation-by-date';
                        $scope.datepicker_heading = 'Find By Date';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "find-by-confirmation":
                        $scope.at = 'find-by-confirmation';
                        //stateToGoTo = 'station.tab-kiosk-find-reservation-by-confirmation';
                        $scope.headingText = 'Type Your Confirmation Number';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        $scope.input.inputTextValue = '';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "find-by-email":
                        $scope.at = 'find-by-email';
                        //stateToGoTo = 'station.tab-kiosk-find-by-email';
                        $scope.headingText = 'Type Your Email Address';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        $scope.hideNavBtns = false;
                        break;
                        
                        
                    case "input-email":
                        $scope.at = 'input-email';
                       // stateToGoTo = 'station.tab-kiosk-input-email';
                        $scope.headingText = 'Type Your Email Address';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "re-enter-email":
                        $scope.at = 'find-by-email';
                        //stateToGoTo = 'station.tab-kiosk-find-by-email';
                        $scope.headingText = 'Type Your Email Address';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        $scope.input.inputTextValue = $scope.input.lastEmailValue;
                        $scope.hideNavBtns = false;
//                "lastConfirmationValue": ''
                        break;
                        
                    case "select-reservation":
                        $scope.at = 'select-reservation';
                       // stateToGoTo = 'station.tab-kiosk-select-reservation';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "reservation-details":
                        $scope.at = 'reservation-details';
                        //stateToGoTo = 'station.tab-kiosk-reservation-details';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "cc-sign":
                        $scope.at = 'cc-sign';
                       // stateToGoTo = 'station.tab-kiosk-reservation-sign';
                        $scope.hideNavBtns = false;
                        break;
                        
                        
                    case "make-keys":
                        $scope.greenKey = false;
                        $scope.at = 'make-keys';
                       // stateToGoTo = 'station.tab-kiosk-make-key';
                        setTimeout(function(){
                            console.log('skipping in 3 seconds...');
                            $scope.greenKey = true;
                            setTimeout(function(){
                                $scope.subHeadingText = "Lorem ipsum dolor sit amet, consectetuer adipiscing elit.";
                                $scope.headingText = "Terms & Conditions";
                                $scope.agreeButtonText = "I Agree";
                                $scope.cancelButtonText = "Cancel";
                                
                                $scope.goToScreen(null, 'terms-conditions', true, $scope.from);
                            },3000);
                            
                        },5000);
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "cc-sign-time-out":
                        $scope.at = 'cc-sign-time-out';
                       // stateToGoTo = 'station.tab-kiosk-reservation-signature-time-out';
                        $scope.hideNavBtns = true;
                        break;
                        
                    case "terms-conditions":
                        $scope.at = 'terms-conditions';
                       // stateToGoTo = 'station.tab-kiosk-terms-conditions';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "no-match":
                        $scope.at = 'no-match';
                       // stateToGoTo = 'station.tab-kiosk-no-match';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "select-keys-after-checkin":
                        $scope.at = 'select-keys';
                       // stateToGoTo = 'station.tab-kiosk-select-keys-after-checkin';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "pickupkey":
                        $scope.at = 'pickup-key';
                       // stateToGoTo = 'station.tab-kiosk-pickup-key';
                        $scope.hideNavBtns = false;
                        break;
                        /*
                    case "admin-login":
                        stateToGoTo = 'station.tab-kiosk-admin-login';
                        break;
                        
                        
                        
                    case "email":
                        stateToGoTo = 'station.tab-kiosk-checkin-email';
                        break;
                        
                    case "confirmation":
                        stateToGoTo = 'station.tab-kiosk-checkin-confirmation';
                        break;
                        
                        
                    case "checkin":
                        $scope.at = 'reservation';
                        $scope.setTitle("Find Reservation");
                        stateToGoTo = 'station.reservation';
                        break;
                        
                    case "checkout":
                        break;
                        */
                        
                    case "admin":
                        //stateToGoTo = 'station.tab-kiosk-admin';
                        $scope.openAdminPopup();
                        cancel = true;
                        break;
                        
                    case "admin-login-screen":
                        //stateToGoTo = 'station.tab-kiosk-admin';
                        //$scope.openAdminPopup();
                        
                        $scope.at = 'admin-login-screen';
                       // stateToGoTo = 'station.tab-kiosk-admin-login-screen';
                        $scope.headingText = 'Administrator';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        
                        $scope.hideNavBtns = true;
                        cancel = true;
                        break;
                    case "admin-login-username":
                        //stateToGoTo = 'station.tab-kiosk-admin';
                        //$scope.openAdminPopup();
                        
                        $scope.at = 'admin-login-username';
                       // stateToGoTo = 'station.tab-kiosk-admin-login-username';
                        $scope.headingText = 'Admin Username';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        
                        $scope.hideNavBtns = false;
                        cancel = true;
                        break;
                    case "admin-login-password":
                        //stateToGoTo = 'station.tab-kiosk-admin';
                        //$scope.openAdminPopup();
                        
                        $scope.at = 'admin-login-password';
                       // stateToGoTo = 'station.tab-kiosk-admin-login-password';
                        $scope.headingText = 'Admin Password';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        
                        $scope.hideNavBtns = false;
                        cancel = true;
                        break;
                        
                    default:
                        stateToGoTo = 'station';
                        $scope.hideNavBtns = true;
                        break;    
                }
                
                var stateParams ={};
                if (override){
                    $scope.closePopup();
                    $scope.resetCounter();
                  //  $state.go(stateToGoTo, stateParams);
                } else {
                    if (!cancel){
                        if (event){
                            event.preventDefault();
                            event.stopImmediatePropagation();
                            event.stopPropagation();
                        }
                      //  $state.go(stateToGoTo, stateParams);
                    } else {
                        $scope.$emit('hideLoader');
                        $scope.$parent.$emit('hideLoader');
                    }
                }
                /*
                setTimeout(function(){
                    //take focus to the designated input field, to auto-prompt the popup keyboard on mobile devices
                    $('.start-focused').focus();
                },1750);
                */
            };
            $scope.agreeTerms = function(){
                
                
            };
            
            $scope.dateOptions = {
                changeYear: true,
                changeMonth: true,
                minDate: tzIndependentDate(new Date()),
                yearRange: "0:+10",
                onSelect: function(value) {
                    console.log(arguments);
                    $scope.input.date = value;
                    console.log($scope.input.date);
                    var d = $scope.input.date;
                    var text = d.split('/');
                    
                    $('#datepicker').val(text[2]+'-'+text[0]+'-'+text[1]);
                    ngDialog.close();
                }
        };
	$scope.showDatePicker = function(){
            ngDialog.open({
                    template: '/assets/partials/zestStation/datePicker.html',
                    //controller: 'ADcampaignDatepicker',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    closeByDocument: true
                });
                setTimeout(function(){
                        $('.ui-datepicker-inline').removeClass('ui-datepicker-inline');
                },5);
                $scope.openDialog = ngDialog;
	};
            
            
            
            
            $scope.loginAdmin = function(){
                $scope.headingText = 'Admin Username';
                $scope.subHeadingText = '';
                $scope.inputTextPlaceholder = '';
                $scope.goToScreen(null, 'admin-login-username', true);
            };

            initTabletConfig();
	}
]);