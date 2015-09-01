sntRover.controller('rvTabletCtrl', [
	'$scope',
	'$rootScope',
	'$filter',
	'$stateParams',
	'$state',
	'$timeout',
        'rvTabletSrv',
        'ngDialog',
	function($scope, $rootScope, $filter, $stateParams, $state, $timeout, rvTabletSrv, ngDialog) {
            BaseCtrl.call(this, $scope);
            $scope.hotel = {
                "title": "Zoku"
            };
            $scope.title = $scope.hotel.title;
            $scope.showHeader = true;
            $scope.kioskModeEnabled = true;
            $scope.reservationsPerPage = 3;//in select
            $scope.hoursNights = 'Nights';
            
            $scope.$on('kioskMode',function(){
               console.log('on kiosk mode change');
               console.log(arguments);
                
                
            });
            
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
            
            $scope.hotelLogo = 'assets/partials/tablet/kiosk/assets/'+$scope.hotel.title+'/logo.svg';
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
                $scope.invokeApi(rvTabletSrv.fetchSettings, {}, fetchCompleted);
                
                
                
                
            };
            
            
            $scope.fetchAdminSettings = function(){
                var fetchCompleted = function(data){
                  //  console.log('data',data);
                    //$scope.settings = data;
                    //fetch the idle timer settings
                    $scope.setupIdleTimer(data);
                    
                    $scope.adminIdleTimeEnabled = data.idle_timer_enabled;
                    $scope.adminIdleTimePrompt = data.idle_prompt;
                    $scope.adminIdleTimeMax = data.idle_max;
                    
                    $scope.settings.adminIdleTimeEnabled = data.idle_timer_enabled;
                    $scope.settings.adminIdleTimePrompt = data.idle_prompt;
                    $scope.settings.adminIdleTimeMax = data.idle_max;
                    
                    
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
            };
            
            $scope.saveAdminSettings = function(){
                
                var saveCompleted = function(data){
                    console.log('data',data);
                    //$scope.settings = data;
                    //fetch the idle timer settings
                    $scope.setupIdleTimer(data);
                    console.log('$scope.settings: ',$scope.settings);
                    
                    
                    
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
                console.log('saving: ',params);
                
                $scope.invokeApi(rvTabletSrv.saveSettings, params, saveCompleted);
            };
            
            $scope.getLogo = function(){
                return $scope.hotelLogo;
            };
            
            

            $scope.openAdminPopup = function() {
                ngDialog.open({
                    template: '/assets/partials/tablet/rvTabletAdminPopup.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: false
                });
            };
            
            $scope.idlePopup = function() {
                ngDialog.open({
                    template: '/assets/partials/tablet/rvTabletIdlePopup.html',
                    className: 'ngdialog-theme-default',
                    scope: $scope,
                    closeByDocument: false,
                    closeByEscape: false
                });
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
            };
            
            $scope.resetCounter = function(){
               clearInterval($scope.idleTimer);
            };
            $scope.resetTime = function(){
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
                                    console.log('idle time max met');
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
            
            
            $scope.goToSelectReservation = function(){
                if (total === 0){
                    
                } else {
                    var total = $scope.reservationPages;
                    var x = 1, n = $scope.reservationsPerPage, p = 1;
                    var pushedCount=0;
                    $scope.reservationShowing = 0;
                    $scope.reservationTotal = Math.ceil(total / n);
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
                }
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
                var fetchCompleted = function(data){
                    if (false){//debuggin
                    //if (data.results.length > 0){
                        $scope.reservationList = data.results;
                        $scope.reservationPages = data.results.length;
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
                    case 'find-by-email':{
                            //fetch reservation list using email as the param
                            //onsuccess push results to window
                        $scope.input.lastEmailValue = textValue;
                        $scope.from = 'find-by-email';
                        $scope.prevStateNav.push($scope.from);
                        $scope.clearInputText();
                        findBy = 'email';
                        break;
                    };
                case 'find-by-confirmation':
                        findBy = 'confirmation_number';
                        $scope.input.lastConfirmationValue = textValue;
                        $scope.from = 'find-by-confirmation';
                        $scope.prevStateNav.push($scope.from);
                        $scope.clearInputText();
                    break;
                }
                $scope.invokeApi(rvTabletSrv.fetchReservations, {
                    'find_by':findBy
                }, fetchCompleted);
                
                
                
            };
            $scope.input = {
                "lastEmailValue": '',
                "lastConfirmationValue": '',
                "inputTextValue": ''
            };
            $scope.clearInputText = function(){
                $scope.input.inputTextValue = '';
            };

            $scope.goToScreen = function(event, screen, override, from){
                //screen = check-in, check-out, pickup-key;
                var stateToGoTo, cancel = false;
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
                        
                    case "check-in":
                        $scope.at = 'find-reservation';
                        stateToGoTo = 'rover.tab-kiosk-find-reservation';
                        break;
                        
                    case "find-by-date":
                        $scope.at = 'find-by-date';
                        stateToGoTo = 'rover.tab-kiosk-find-reservation-by-date';
                        break;
                        
                    case "find-by-confirmation":
                        $scope.at = 'find-by-confirmation';
                        stateToGoTo = 'rover.tab-kiosk-find-reservation-by-confirmation';
                        $scope.headingText = 'Type Your Confirmation Number';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        $scope.input.inputTextValue = '';
                        break;
                        
                    case "find-by-email":
                        $scope.at = 'find-by-email';
                        stateToGoTo = 'rover.tab-kiosk-find-by-email';
                        $scope.headingText = 'Type Your Email Address';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        break;
                        
                    case "re-enter-email":
                        $scope.at = 'find-by-email';
                        stateToGoTo = 'rover.tab-kiosk-find-by-email';
                        $scope.headingText = 'Type Your Email Address';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        $scope.input.inputTextValue = $scope.input.lastEmailValue;
//                "lastConfirmationValue": ''
                        break;
                        
                    case "select-reservation":
                        $scope.at = 'select-reservation';
                        stateToGoTo = 'rover.tab-kiosk-select-reservation';
                        break;
                        
                    case "no-match":
                        $scope.at = 'no-match';
                        stateToGoTo = 'rover.tab-kiosk-no-match';
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
                        
                    case "pickupkey":
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

            initTabletConfig();
	}
]);