sntRover.controller('rvTabletCtrl', [
	'$scope',
        '$document',
	'$rootScope',
	'$filter',
	'$stateParams',
	'$state',
	'$timeout',
        'rvTabletSrv',
        'ngDialog',
	function($scope, $document, $rootScope, $filter, $stateParams, $state, $timeout, rvTabletSrv, ngDialog) {
            BaseCtrl.call(this, $scope);
            $scope.hotel = {
                "title": "Zoku"
            };
            $scope.title = $scope.hotel.title;
            $scope.showHeader = true;
            $scope.kioskModeEnabled = true;
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
                            name: 'rover.companycarddetails',
                            param: {}
                    };
                 */
                
                
                
            };
            $scope.setNext = function(){
                
                
            };
            
            
            var setTitle = function() {
                var title = $scope.hotel.title;
                //yes, we are setting the heading and title
                 $scope.title = $document[0].title = title;
                 $scope.windowTitle = angular.element(window.document)[0].title = title;
            };
            
            $scope.hotelLogo = 'assets/css/kiosk/assets/'+$scope.hotel.title.toLowerCase()+'/logo.svg';
            $scope.at = 'home';
            $scope.hideNavBtns = true;
            $scope.inRover = true;
            
            $scope.headingText = 'Header Text Here';
            $scope.subHeadingText = 'Subheader Text Here';
            $scope.inputTextPlaceholder = 'Input Text Here';
            
            var initTabletConfig = function(){
                //$scope.settings = $rootScope.kiosk;
                var fetchCompleted = function(data){
                    $scope.settings = data;
                    //fetch the idle timer settings
                    $scope.setupIdleTimer();
                    $scope.$emit('hideLoader');
                };
                //$scope.invokeApi(rvTabletSrv.fetchSettings, {}, fetchCompleted);
                setTitle();
                
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
                    $scope.settings.adminIdleTimeEnabled = $scope.adminIdleTimeEnabled;
                    $scope.settings.adminIdleTimePrompt = $scope.adminIdleTimePrompt;
                    $scope.settings.adminIdleTimeMax = $scope.adminIdleTimeMax;  
                    
                    $scope.idleSettingsPopup.max = $scope.settings.adminIdleTimeMax;
                    $scope.idleSettingsPopup.prompt = $scope.settings.adminIdleTimePrompt;
                    $scope.idleSettingsPopup.enabled = $scope.settings.adminIdleTimeEnabled;
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
                    template: '/assets/partials/tablet/rvTabletAdminPopup.html',
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
                        template: '/assets/partials/tablet/rvTabletIdlePopup.html',
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
            $scope.selectReservation = function(r){
                $scope.selectedReservation=r;
                console.log('reservation selected',r);
              
                  $scope.selectedReservation.reservation_details = {};
                  $scope.selectedReservation.reservation_details.daily_rate  = 119.00;
                  $scope.selectedReservation.reservation_details.package_price = 80.00;
                  $scope.selectedReservation.reservation_details.taxes = 18.00;
                  
                  var nights = $scope.selectedReservation.stay_dates.length;
                  
                  $scope.selectedReservation.reservation_details.sub_total = nights*$scope.selectedReservation.reservation_details.daily_rate;
                  $scope.selectedReservation.reservation_details.deposits = 100.00;
                  $scope.selectedReservation.reservation_details.balance = $scope.selectedReservation.reservation_details.sub_total - $scope.selectedReservation.reservation_details.deposits;
                  
              
                var fetchCompleted = function(data){
                    console.log('fetch completed');
                    $scope.selectedReservation.reservation_details = data;
                    $scope.selectedReservation.reservation_details.daily_rate  = 119.00;
                    $scope.selectedReservation.reservation_details.package_price = 80.00;
                    $scope.selectedReservation.reservation_details.taxes = 18.00;

                    var nights = $scope.selectedReservation.stay_dates.length;

                    $scope.selectedReservation.reservation_details.sub_total = nights*$scope.selectedReservation.reservation_details.daily_rate;
                    $scope.selectedReservation.reservation_details.deposits = 100.00;
                    $scope.selectedReservation.reservation_details.balance = $scope.selectedReservation.reservation_details.sub_total - $scope.selectedReservation.reservation_details.deposits+'.00';

                };
                $scope.invokeApi(rvTabletSrv.fetchReservationDetails, {
                    'id': r.id
                }, fetchCompleted);
                
              
              $scope.goToScreen(null, 'reservation-details', true, 'select-reservation');
              
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
                if (!$scope.from){
                    $scope.from = 'home';
                }
                var fetchCompleted = function(data){
                    if (data.results.length > 0){//debuggin
                    //if (data.results.length > 0){
                        $scope.reservationList = [];
                        $scope.resList = [];
                        $scope.reservationList = data.results;
                        $scope.reservationPages = Math.ceil(data.results.length/$scope.reservationsPerPage);
                        $scope.goToSelectReservation();
                        $scope.reservationPageNum = 1;
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
                        $scope.input.last_name = textValue;
                        $scope.clearInputText();
                        $scope.goToScreen(null, 'find-reservation', true);
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
                            'value': textValue
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
                    if ($scope.prevStateNav[i] === 'find-by-email'){
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
                        stateToGoTo = 'rover.kiosk';
                        $scope.hideNavBtns = true;
                        break;
                        
                    case "input-last":
                        $scope.at = 'input-last';
                        stateToGoTo = 'rover.tab-kiosk-input-last';
                        $scope.headingText = 'Type Your Last Name';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        $scope.hideNavBtns = false;
                    break;
                        
                    case "find-reservation":
                        $scope.at = 'find-reservation';
                        //stateToGoTo = 'rover.tab-kiosk-find-reservation';
                        stateToGoTo = 'rover.tab-kiosk-input-last';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "find-by-date":
                        $scope.at = 'find-by-date';
                        stateToGoTo = 'rover.tab-kiosk-find-reservation-by-date';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "find-by-confirmation":
                        $scope.at = 'find-by-confirmation';
                        stateToGoTo = 'rover.tab-kiosk-find-reservation-by-confirmation';
                        $scope.headingText = 'Type Your Confirmation Number';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        $scope.input.inputTextValue = '';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "find-by-email":
                        $scope.at = 'find-by-email';
                        stateToGoTo = 'rover.tab-kiosk-find-by-email';
                        $scope.headingText = 'Type Your Email Address';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        $scope.hideNavBtns = false;
                        break;
                        
                        
                    case "input-email":
                        $scope.at = 'input-email';
                        stateToGoTo = 'rover.tab-kiosk-input-email';
                        $scope.headingText = 'Type Your Email Address';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "re-enter-email":
                        $scope.at = 'find-by-email';
                        stateToGoTo = 'rover.tab-kiosk-find-by-email';
                        $scope.headingText = 'Type Your Email Address';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        $scope.input.inputTextValue = $scope.input.lastEmailValue;
                        $scope.hideNavBtns = false;
//                "lastConfirmationValue": ''
                        break;
                        
                    case "select-reservation":
                        $scope.at = 'select-reservation';
                        stateToGoTo = 'rover.tab-kiosk-select-reservation';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "reservation-details":
                        $scope.at = 'reservation-details';
                        stateToGoTo = 'rover.tab-kiosk-reservation-details';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "cc-sign":
                        $scope.at = 'cc-sign';
                        stateToGoTo = 'rover.tab-kiosk-reservation-sign';
                        $scope.hideNavBtns = false;
                        break;
                        
                        
                    case "make-keys":
                        $scope.greenKey = false;
                        $scope.at = 'make-keys';
                        stateToGoTo = 'rover.tab-kiosk-make-key';
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
                        stateToGoTo = 'rover.tab-kiosk-reservation-signature-time-out';
                        $scope.hideNavBtns = true;
                        break;
                        
                    case "terms-conditions":
                        $scope.at = 'terms-conditions';
                        stateToGoTo = 'rover.tab-kiosk-terms-conditions';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "no-match":
                        $scope.at = 'no-match';
                        stateToGoTo = 'rover.tab-kiosk-no-match';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "select-keys-after-checkin":
                        $scope.at = 'select-keys';
                        stateToGoTo = 'rover.tab-kiosk-select-keys-after-checkin';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "pickupkey":
                        $scope.at = 'pickup-key';
                        stateToGoTo = 'rover.tab-kiosk-pickup-key';
                        $scope.hideNavBtns = false;
                        break;
                        /*
                    case "admin-login":
                        stateToGoTo = 'rover.tab-kiosk-admin-login';
                        break;
                        
                        
                        
                    case "email":
                        stateToGoTo = 'rover.tab-kiosk-checkin-email';
                        break;
                        
                    case "confirmation":
                        stateToGoTo = 'rover.tab-kiosk-checkin-confirmation';
                        break;
                        
                        
                    case "checkin":
                        $scope.at = 'reservation';
                        $scope.setTitle("Find Reservation");
                        stateToGoTo = 'rover.kiosk.reservation';
                        break;
                        
                    case "checkout":
                        break;
                        */
                        
                    case "admin":
                        //stateToGoTo = 'rover.tab-kiosk-admin';
                        $scope.openAdminPopup();
                        cancel = true;
                        break;
                        
                    case "admin-login-screen":
                        //stateToGoTo = 'rover.tab-kiosk-admin';
                        //$scope.openAdminPopup();
                        
                        $scope.at = 'admin-login-screen';
                        stateToGoTo = 'rover.tab-kiosk-admin-login-screen';
                        $scope.headingText = 'Administrator';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        
                        $scope.hideNavBtns = true;
                        cancel = true;
                        break;
                    case "admin-login-username":
                        //stateToGoTo = 'rover.tab-kiosk-admin';
                        //$scope.openAdminPopup();
                        
                        $scope.at = 'admin-login-username';
                        stateToGoTo = 'rover.tab-kiosk-admin-login-username';
                        $scope.headingText = 'Admin Username';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        
                        $scope.hideNavBtns = false;
                        cancel = true;
                        break;
                    case "admin-login-password":
                        //stateToGoTo = 'rover.tab-kiosk-admin';
                        //$scope.openAdminPopup();
                        
                        $scope.at = 'admin-login-password';
                        stateToGoTo = 'rover.tab-kiosk-admin-login-password';
                        $scope.headingText = 'Admin Password';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        
                        $scope.hideNavBtns = false;
                        cancel = true;
                        break;
                        
                    default:
                        stateToGoTo = 'home';
                        stateToGoTo = 'rover.kiosk';
                        $scope.hideNavBtns = true;
                        break;    
                }
                
                var stateParams ={};
                if (override){
                    $scope.closePopup();
                    $scope.resetCounter();
                    $state.go(stateToGoTo, stateParams);
                } else {
                    if (!cancel){
                        event.preventDefault();
                        event.stopImmediatePropagation();
                        event.stopPropagation();

                        $state.go(stateToGoTo, stateParams);
                    } else {
                        $scope.$emit('hideLoader');
                        $scope.$parent.$emit('hideLoader');
                    }
                }
            };
            
            $scope.loginAdmin = function(){
                $scope.goToScreen(null, 'admin-login-username', true);
            };

            initTabletConfig();
	}
]);