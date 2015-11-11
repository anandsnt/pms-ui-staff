sntZestStation.controller('rvTabletCtrl', [
        '$scope',
        '$rootScope',
        'rvTabletSrv',
        '$document',
        '$state',
        '$timeout',
        'rvTabletSrv',
        'ngDialog',
        '$window',
        '$sce',
    function($scope, 
    $rootScope,
        rvTabletSrv, 
        $document, 
        $state, 
        $timeout, 
        rvTabletSrv, 
        ngDialog,
        $window,
        $sce) {
                
            BaseCtrl.call(this, $scope);
            $scope.hotel = {
                "title": "Zoku"
            };
            
            $scope.debug = false;
            $scope.debugAt = 'select-keys-after-checkin';
            
            $scope.title = $scope.hotel.title;
            $scope.showHeader = true;
            $scope.reservationsPerPage = 3;//in select
            $scope.hoursNights = 'Nights';
            $scope.alwaysCollectCC = true;//force collect the credit card after reservation details
            
            $scope.maxAddGuests = 4;//config to limit Addt'l guests in the Add/Rmove screen
            
            $scope.signatureData = "";
            //options fo signature plugin
            var screenWidth = angular.element($window).width(); // Calculating screen width.
            $scope.signaturePluginOptions = {
                            height : 230,
                            width : screenWidth-60,
                            lineWidth : 1
            };
            
            $scope.emailOptional = true;//if false, email input will allow user to skip after selecting reservation
            
            $scope.$watch('at',function(to, from, evt){
                
                if (to !== 'home' && from === 'home'){
                    $scope.resetTime();
                } else if (to === 'home' && from !== 'home'){
                    $scope.resetCounter();
                }
            });
            
            
            $scope.$on('showLoader',function(){
                $scope.hasLoader = true;
            });
            $scope.$on('hideLoader',function(){
                $scope.hasLoader = false;
            });
            
            
            
            $scope.hasPrev = false;
            $scope.hasNext = false;
            
            $scope.selectedFindBy = '';    
            //config to show / hide options depending on hotel setting (ie. check-out only)
            $scope.show = {
                    pickupkey: true,
                    swipecardScreen: true,
                    check_in: true,
                    check_out: true
                };
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
            
            
            var setTitle = function() {
                var title = $scope.hotel.title;
                //yes, we are setting the heading and title
                 $scope.title = $document[0].title = title;
                 $scope.windowTitle = angular.element(window.document)[0].title = title;
            };
            
            $scope.hotelLogo = 'assets/css/themes/'+$scope.hotel.title.toLowerCase()+'/logo.svg';
            $scope.at = 'home';
            $scope.hideNavBtns = true;
            $scope.inRover = true;
            
            $scope.headingText = 'Header Text Here';
            $scope.subHeadingText = 'Subheader Text Here';
            $scope.inputTextPlaceholder = 'Input Text Here';
            $scope.currencySymbol = '';

            //set Home screen options based on admin settings
            var setHomeScreenOptions   = function(data){
                $scope.show.pickupkey  = data.home_screen.pickup_keys;
                $scope.show.check_out  = data.home_screen.check_out;
                $scope.show.check_in   = data.home_screen.check_in;
            };

            var initTabletConfig = function(){
//                $('head').append('<link rel="stylesheet" type="text/css" href="../assets/css/zoku.css">');
                //$scope.settings = $rootScope.kiosk;
                var fetchCompleted = function(data){
                    $scope.settings = data;
                    //fetch the idle timer settings
                    $scope.setupIdleTimer();
                    setHomeScreenOptions(data);
                    $scope.$emit('hideLoader');
                };
                
                $scope.hotel_settings = $scope.zestStationData;
                $scope.hotel_terms_and_conditions = $scope.zestStationData.hotel_terms_and_conditions;
                //fetch the idle timer settings
                $scope.currencySymbol = $scope.zestStationData.currencySymbol;
    
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
                
                $scope.invokeApi(rvTabletSrv.fetchSettings, {}, fetchCompleted);
                $scope.invokeApi(rvTabletSrv.fetchHotelBusinessDate, {}, fetchBizDateComplete);
                setTitle();
                
                $('.root-view').addClass('kiosk');
            };
            $scope.datePickerMin;
            $scope.resetDatePicker = function(){
                        $scope.showDatePick = false;
                        var defaultDate = $scope.business_date+'';//for datepicker
                        var d = defaultDate.split(' ');
                        //day of wk = d[0]
                        var year = d[3]+'',
                                month = $scope.getMonthN(d[1])-1,//this method is 1 based, adjust for 0-based date obj
                                day = d[2]+'';
                        if (parseInt(day) < 10){
                            day = '0'+day;
                        }
                        if (parseInt(month) < 10){
                            month = '0'+month;
                        }
                        defaultDate = $scope.getMonthName(month)+'-'+day+'-'+year;
                        
                        $state.setDate = defaultDate;
                        $scope.datePickerMin = defaultDate;
                        $scope.input.lastDateValue = defaultDate;
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
                
                if ($scope.settings){
                    $scope.settings.adminIdleTimeEnabled = $scope.idleSettingsPopup.enabled;
                }
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
                    //$scope.goToScreen({},'timeout',true, 'idle');
                    $scope.goToScreen(null, 'cc-sign-time-out', true, 'cc-sign');
                    $scope.$apply();
                } else {
                    if ($scope.at !== 'home' && $scope.at !== 'cc-sign' && $scope.at !== 'cc-sign-time-out'){
                        ngDialog.open({
                                template: '/assets/partials/zestStation/rvTabletIdlePopup.html',
                                className: 'ngdialog-theme-default',
                                scope: $scope,
                                closeByDocument: false,
                                closeByEscape: false
                        });
                    }
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
            if ($scope.at !== 'home'){ 
                clearInterval($scope.idleTimer);
                $scope.startCounter();
            }
               
            };
            
            $scope.startCounter = function(){
                var time = $scope.idle_max, promptTime = $scope.idle_prompt;
                
                    var timer = time, minutes, seconds;
                    var timerInt = setInterval(function () {
                        if ($scope.idle_timer_enabled && $scope.at !== 'home'){
                                
                                minutes = parseInt(timer / 60, 10);
                                seconds = parseInt(timer % 60, 10);

                                minutes = minutes < 10 ? "0" + minutes : minutes;
                                seconds = seconds < 10 ? "0" + seconds : seconds;
                                
                                if (timer === promptTime){
                                    $scope.idlePopup();
                                }
                                
                                if (--timer < 0) {
                                    setTimeout(function(){
                                        //setup a timeout @ logic depending on which screen you are, you may get a "Are you still there" different look
                                        //like re-swipe card, etc.;
                                        $scope.handleIdleTimeout();
                                    },1000);
                                    
                                    clearInterval(timerInt);
                                    return;
                                    //timer = duration;
                                }
                        }
                    }, 1000);
                    $scope.idleTimer = timerInt;
            };
            
            $scope.handleIdleTimeout = function(){
                $scope.navToHome();
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
                var fromScreen;
                 if (!fromSelect){
                     fromScreen = 'select-reservation';
                 } else {
                     fromScreen = $scope.from;
                 }
                $scope.goToScreen(null, 'reservation-details', true, fromScreen);
                $scope.selectedReservation = r;
                $scope.selectedReservation.reservation_details = {};
                $scope.invokeApi(rvTabletSrv.fetchReservationDetails, {
                    'id': r.confirmation_number
                }, $scope.onSuccessFetchReservationDetails);
            };
            
            
            $scope.is_rates_suppressed = false;
            $scope.checkIfSupressed = function(){
                //if selected rate is supressed, set flag;
                $scope.is_rates_suppressed = false;
                if ($scope.selectedReservation){
                    if ($scope.selectedReservation.reservation_details){
                        if ($scope.selectedReservation.reservation_details.data){
                            var rateData = $scope.selectedReservation.reservation_details.data;
                            if (rateData.reservation_card.is_rates_suppressed === 'true'){
                                $scope.is_rates_suppressed = true;
                                /*
                                 * Since the rate is supressed, the balance will need to be set to 0.00 unless a different requirement for the hotel exists
                                 * Yotel / Zoku currently set to 0.00 balance in Reservation details as of Sprint 38
                                 */
                                $scope.selectedReservation.reservation_details.balance = 0.00;

                            }
                        }
                    }
                }
                console.log($scope.selectedReservation);
            };
            //$scope
            $scope.formatCurrency = function(amt){
               return parseFloat(amt).toFixed(2);
            };
            
            
            $scope.onSuccessFetchReservationDetails = function(data){
                    $scope.selectedReservation.reservation_details = data;
                    //$scope.input.lastEmailValue = data.reservation_card;
                    
                    var info = data.data.reservation_card;
                    var nites, avgDailyRate, packageRate, taxes, subtotal, deposits, balanceDue;
                    nites = parseInt(info.total_nights);
                    $scope.selectedReservation.total_nights = nites;
                    avgDailyRate = parseFloat(info.deposit_attributes.room_cost).toFixed(2);
                    
                    deposits = parseFloat(info.deposit_attributes.deposit_paid).toFixed(2);
                    
                    if (info.deposit_attributes.packages){
                        packageRate = parseFloat(info.deposit_attributes.packages).toFixed(2);
                    } else {
                        packageRate = 0;
                    }
                    
                    taxes = parseFloat(info.deposit_attributes.fees).toFixed(2);
                    
                    subtotal = parseFloat(info.deposit_attributes.sub_total).toFixed(2);
                    
                    balanceDue = parseFloat(info.deposit_attributes.outstanding_stay_total).toFixed(2);
                    
                    
                  
                  
                  //comma format
                  avgDailyRate = $scope.CommaFormatted((parseFloat(avgDailyRate))+'');
                  packageRate  = $scope.CommaFormatted((parseFloat(packageRate))+'');
                  taxes        = $scope.CommaFormatted((parseFloat(taxes))+'');
                  subtotal = $scope.CommaFormatted((parseFloat(subtotal))+'');
                  deposits = $scope.CommaFormatted((parseFloat(deposits))+'');
                  balanceDue = $scope.CommaFormatted((parseFloat(balanceDue))+'');
                  
                  
                  //in-view elements
                  $scope.selectedReservation.reservation_details.daily_rate  = $scope.getFloat(avgDailyRate);
                  
                  $scope.selectedReservation.reservation_details.package_price = $scope.getFloat(packageRate);
                  
                  $scope.selectedReservation.reservation_details.taxes = $scope.getFloat(taxes);
                  
                  $scope.selectedReservation.reservation_details.sub_total = $scope.getFloat(subtotal);
                  
                  $scope.selectedReservation.reservation_details.deposits = $scope.getFloat(deposits);
                  
                  $scope.selectedReservation.reservation_details.balance = $scope.getFloat(balanceDue);
                 
                 
                    $scope.checkIfSupressed();
                 //reservation_addons?reservation_id=1646512
                 var fetchCompleted = function(addonData){
                     $scope.$emit('hideLoader');
                     $scope.selectedReservation.addons = addonData.existing_packages;
                     
                     var items = $scope.selectedReservation.addons.length;
                     for (var i=0; i < items; i++){
                         if (i === (items-1)){
                             $scope.selectedReservation.addons[i].isLastAddon = true;
                         } else {
                             $scope.selectedReservation.addons[i].isLastAddon = false;
                         }
                     }
                     
                 };
                  $scope.invokeApi(rvTabletSrv.fetchAddonDetails, {
                            'id':info.reservation_id
                        }, fetchCompleted);
                 
                    $scope.$emit('hideLoader');
            };
            
            $scope.getFloat = function(n){
                //to check/remove any commas in a string..
                var num = n+'';
                num = num.replace(/,/gi, "");
                return $scope.CommaFormatted( parseFloat(num).toFixed(2) + '' );//return with comma back in
            };
            
            $scope.modalBtn1 = 'LOGIN';
            $scope.modalBtn2 = 'Exit';
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
            
            
            $scope.navToPrev = function(nopop){
                var from = $scope.from, toScreen;
                if ($scope.prevStateNav.length === 0){
                    toScreen = $scope.from;
                } else {
                    if (!nopop){
                        toScreen = $scope.prevStateNav.pop();
                    }
                     
                }
                $scope.goToScreen(null, toScreen, true);
            };
            
            $scope.navToHome = function(){
                $scope.prevStateNav = [];
                $scope.goToScreen(null, 'home', true);
                $scope.clearInputText();
                $scope.clearSignature();
                $scope.resetDatePicker();
                $scope.input.madeKey = 0;
                $scope.$apply();
            };
            
            $scope.lastTextInput = '';
            
            $scope.inputTextHandler = function(at, textValue, el){
                if (!$scope.from){
                    $scope.from = 'home';
                }
                //lose focus of inputfield to drop keyboard in mobile
               // $scope.hideKeyboard();
                
                var fetchCompleted = function(data){
                    
                    
                    if (data.results.length > 1){//debuggin
                    //if (data.results.length > 0){
                        $scope.reservationList = [];
                        $scope.resList = [];
                        $scope.reservationList = data.results;
                        $scope.reservationPages = Math.ceil(data.results.length/$scope.reservationsPerPage);
                        $scope.goToSelectReservation();
                        $scope.reservationPageNum = 1;
                        $scope.$emit('hideLoader');
                    } else if (data.results.length === 1){
                        $scope.selectReservation(data.results[0], true);
                    } else {
                        $scope.goToScreen(null, 'no-match', true, at);
                        $scope.$emit('hideLoader');
                    }
                    //fetch the idle timer settings
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
                    case 'add-guest-last':{
                            //fetch reservation list using email as the param
                            //onsuccess push results to window
                        $scope.input.addguest_last = textValue;
                        $scope.clearInputText();
                        $scope.goToScreen(null, 'add-guest-first', true);
                        break;
                    };
                    case 'add-guest-first':{
                            //fetch reservation list using email as the param
                            //onsuccess push results to window
                        $scope.input.addguest_first = textValue;
                        $scope.clearInputText();
                        $scope.addGuestToReservation($scope.input.addguest_first,$scope.input.addguest_last);
                        $scope.goToScreen(null, 'add-guests', true);
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
                        findBy = $scope.searchBy;
                        $scope.input.last_name = textValue;
                        $scope.clearInputText();
                        var value;
                        switch(findBy){
                            case 'email':
                                    value = $scope.input.lastEmailValue;
                                    break;
                                case 'confirmation_number':
                                    value = $scope.input.lastConfirmationValue;
                                    break;
                                case 'departure_date':
                                    value = $scope.input.lastDateValue;
                                    break;
                        }
                        
                        if ($scope.from === 'no-match'){
                            $scope.invokeApi(rvTabletSrv.fetchReservations, {
                            'find_by':findBy,
                            'last_name':$scope.input.last_name,
                            'value': value
                        }, fetchCompleted);
                        } else {
                            $scope.goToScreen(null, 'find-reservation', true);
                        }
                        
                        break;
                    };
                    
                    case 'input-email':{
                        $scope.input.lastEmailValue = $scope.input.inputTextValue;
                        $scope.clearInputText();
                        $scope.setLast('input-email');
                        if (!$scope.isValidEmail($scope.input.lastEmailValue)){
                            //invalid email warning;
                            
                            $scope.goToScreen(null, 'invalid-email', true, $scope.from);
                            break
                        }
                        if ($scope.from === 'card-swipe'){
                             //fetch reservation list using email as the param
                                //onsuccess push results to window
                            $scope.clearInputText();
                            $scope.goToScreen(null, 'select-keys-after-checkin', true, $scope.from);
                        }
                        
                        if ($scope.from === 'email-delivery'){
                             //fetch reservation list using email as the param
                                //onsuccess push results to window
                            $scope.clearInputText();
                            $scope.goToScreen(null, 'email-delivery', true, 'input-email');
                        }
                        break;
                    };
                                
                    case 'find-by-email':{
                        $scope.searchBy = 'email';
                        findBy = 'email';
                        $scope.selectedFindBy = 'find-by-email';
                            //fetch reservation list using email as the param
                            //onsuccess push results to window
                        $scope.input.lastEmailValue = textValue;
                        $scope.from = 'find-by-email';
                        if (!$scope.isValidEmail($scope.input.lastEmailValue)){
                            $scope.goToScreen(null, 'invalid-email', true, $scope.from);
                            break;
                        }
                        
                        $scope.setLast($scope.from);
                        $scope.clearInputText();
                        
                        $scope.invokeApi(rvTabletSrv.fetchReservations, {
                            'find_by':findBy,
                            'last_name':$scope.input.last_name,
                            'value': textValue
                        }, fetchCompleted);
                        break;
                    };
                    case 'find-by-date':{
                        $scope.searchBy = 'departure_date';
                        $scope.input.lastEmailValue = '';
                            //fetch reservation by last name + departure date
                        findBy = 'departure_date';
                        $scope.from = at;
                        $scope.setLast($scope.from);
                        $scope.clearInputText();
                            var d = $state.setDate.split('-');
                            var day = parseInt(d[1]), 
                            year = parseInt(d[2]),
                            month = parseInt($scope.getMonthN(d[0]))+1;
                            
                            if (day < 10){
                                day  = '0'+day;
                            }
                            if (month < 10){
                                month = '0'+month;
                            }
                        var dateInput = year+'-'+month+'-'+day;
                        $scope.input.lastDateValue = dateInput;
                        $scope.selectedFindBy = 'find-by-date';
                        $scope.invokeApi(rvTabletSrv.fetchReservations, {
                            'find_by':findBy,
                            'last_name':$scope.input.last_name,
                            'value': dateInput
                        }, fetchCompleted);
                        break;
                    };
                case 'find-by-confirmation':
                        $scope.searchBy = 'confirmation_number';
                        $scope.input.lastEmailValue = '';
                        findBy = 'confirmation_number';
                        $scope.input.lastConfirmationValue = textValue;
                        $scope.from = 'find-by-confirmation';
                        $scope.setLast($scope.from);
                        $scope.clearInputText();
                        $scope.selectedFindBy = 'find-by-confirmation';
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
                "lastDateValue":'',
                "inputTextValue": '',
                'makeKeys': 1,
                'madeKey': 0,
                "admin":{
                    "username":'',
                    "password":''
                }
            };
            
            
            $scope.isValidEmail = function(email){
                email = email.replace(/\s+/g, '');
                if ($scope.ValidateEmail(email)){
                    return false;
                } else return true;
                
            };
            
            $scope.ValidateEmail = function(email) {
                if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
                    return false;
                } else return true;
            };

            
            $scope.clearInputText = function(){
                $scope.input.inputTextValue = '';
            };
            
            $scope.deliverRegistration = function(){
               $scope.goToScreen(null, 'deliver-registration', true, 'key-success');
            };
            $scope.getMonthN = function(mo){
                var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ];
              for (var i in monthNames){
                  if (monthNames[i].toLowerCase() == mo.toLowerCase() || monthNames[i].toLowerCase().indexOf(mo.toLowerCase()) != -1){//exact or not
                        return i;
                  }
              }
            };
            
            $scope.getMonthName = function(mo){
                var monthNames = ["January", "February", "March", "April", "May", "June",
                "July", "August", "September", "October", "November", "December"
              ];
              for (var i=0; i < monthNames.length; i++){
                  if (i === parseInt(mo)){
                      return monthNames[i];
                  }
              }
            };
            
            $scope.addGuestToReservation = function(){
                var first = $scope.input.addguest_first,
                last = $scope.input.addguest_last;
                $scope.selectedReservation.guest_details.push({
                    last_name: last,
                    first_name: first
                });
            };
            $scope.clearSignature = function(){
                $scope.signatureData = '';
                $("#signature").jSignature("clear");
            };
            
            $scope.checkInGuest = function(){
              /*
               * 
               *    {
                        reservation_id
                        signature
                        authorize_credit_card
                        payment_type
                        payment_type{
                            credit_card
                            card_name
                            card_expiry
                            card_number
                            et2
                            etb
                            pan
                            ksn
                            is_encrypted
                            token
                        }
                    }
               */  
                 var reservation_id = $scope.selectedReservation.id,
                        payment_type = $scope.selectedReservation.payment_type,
                        signature = $scope.signatureData;
                
                
                //if ($scope.selectedReservation.payment_method_used === 'CC'){
                 //   signature = $scope.signatureData;
                //} else {
                   // signature = null;
                    //cash or other pmt, ignore credit card stuff
                    
                    $scope.invokeApi(rvTabletSrv.checkInGuest, {
                        'reservation_id':reservation_id, 
                        "authorize_credit_card": false,
                        "do_not_cc_auth": false,
                        "is_promotions_and_email_set": false,
                        "no_post": "",
                        'signature':signature
                       // 'payment_type': {
                        //    'payment_type':payment_type
                        //}
                    }, $scope.afterGuestCheckinCallback, $scope.afterGuestCheckinCallback);
               // }
                        
                
            };
            $scope.generalError = function(){
                $scope.$emit('hideLoader');
                $scope.goToScreen(null, 'error', true, $scope.from);
            };
            
            $scope.afterGuestCheckinCallback = function(){
                $scope.$emit('hideLoader');
                 var guestEmailEnteredOrOnReservation = function(){
                    var useEmail = '';
                    if ($scope.input.lastEmailValue !== ''){
                        useEmail = $scope.input.lastEmailValue;
                    }
                    if ($scope.selectedReservation.guest_details[0].email !== ''){
                        useEmail = $scope.selectedReservation.guest_details[0].email;
                        $scope.input.lastEmailValue = $scope.selectedReservation.guest_details[0].email;
                    };
                    $scope.useEmail = useEmail;
                    if (useEmail !== '' && $scope.isValidEmail(useEmail)){
                        return true;
                    } else {
                        return false;
                    }
                };
                var haveValidGuestEmail = guestEmailEnteredOrOnReservation();//also sets the email to use for delivery
                
                //detect if coming from email input
                if (haveValidGuestEmail){
                        $scope.goToScreen(null, 'select-keys-after-checkin', true, $scope.from);
                    return;
                }
                $scope.goToScreen(null, 'input-email', true, $scope.from);
                $scope.clearSignature();
            };
            $scope.submitSignature = function(){
                /*
                 * this method will check the guest in after swiping a card
                 */
	 	$scope.signatureData = JSON.stringify($("#signature").jSignature("getData", "native"));
                $scope.checkInGuest();
            };
            $scope.goToLast = function(){
                if (!$scope.from){
                    $scope.goToScreen(null, 'home', true);
                } else {
                    $scope.goToScreen(null, $scope.from, true);
                }
            };
            
            $scope.hideKeyboard = function(){
                var field = document.createElement('input');
                field.setAttribute('type', 'text');
                document.body.appendChild(field);

                setTimeout(function() {
                    field.focus();
                    setTimeout(function() {
                        field.setAttribute('style', 'display:none;');
                    }, 50);
                }, 50);
            };
            
            
            
            
            $scope.scrollId = 'textual';
            
            $scope.scrollerOptions = {click: true, preventDefault: false};
            
            $scope.setScroll = function() {
                //setting scroller things
                $scope.setScroller($scope.scrollId, $scope.scrollerOptions);
                setTimeout(function(){
                    $scope.refreshScroller($scope.scrollId);
                },500);
            };
            sntZestStation.filter('unsafe', function($sce) {
                return function(val) {
                    return $sce.trustAsHtml(val);
                };
            });
            

            $scope.goToScreen = function(event, screen, override, from){
                //screen = check-in, check-out, pickup-key;
                var stateToGoTo, cancel = false;
                if (typeof screen === null || typeof screen === typeof undefined){
                      screen = 'home';
                }
                if (typeof from !== null && typeof from !== typeof undefined){
                    if (from !== $scope.from && from !== 'idle'){
                        $scope.from = from;
                        $scope.setLast($scope.from);
                    }
                }
                if (screen !== 'home'){
                    $scope.hideNavBtns = false;
                }
                
                switch(screen){
                    case "home":
                        if ($scope.debug){
                            $scope.goToScreen(null, $scope.debugAt, true);
                            break;
                        }
                        $scope.at = 'home';
                        //stateToGoTo = 'station';
                        $scope.hideNavBtns = true;
                        break;
                        
                    case "error":
                        $scope.at = 'error';
                        
                        $scope.headingText = 'So Sorry.';
                        $scope.subHeadingText = 'Something is broken.\n\
                                                    Please find a staff member to help you.';
                        $scope.modalBtn1 = 'Done';
                        $scope.$apply();
                        //stateToGoTo = 'station';
                        $scope.hideNavBtns = true;
                        break;
                        
                    case 'invalid-email':
                        $scope.at = 'invalid-email';
                        $scope.headingText = 'Hm.';
                        $scope.subHeadingText = 'This does not appear to be a valid e-mail address.';
                        
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
                        
                       $scope.input.date = '';
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
                        
                    case 'timeout':
                        if ($scope.at === 'card-swipe' || $scope.at === 'cc-sign'){
                            $scope.headingText = 'Are you still there';
                            $scope.subHeadingText = 'Please select one of the following';
                        }
                        break;
                        
                    case "card-swipe":
                            $scope.setLast('reservation-details');
                        if ($scope.from === 'reservation-details' && ($scope.selectedReservation.reservation_details.data.reservation_card.payment_method_used === 'CC' || $scope.alwaysCollectCC)){
                            $scope.at = 'card-swipe';
                            //stateToGoTo = 'station.tab-kiosk-find-by-email';
                            $scope.headingText = 'To Complete Check-in...';
                            $scope.subHeadingText = '';
                            $scope.inputTextPlaceholder = '';
                            $scope.hideNavBtns = false;
                        } else {
                            //go directly to make-keys
                            
                            $scope.goToScreen(null, 'terms-conditions', true, 'reservation-details');
                                //$scope.goToScreen(null, 'make-keys', true, 'reservation-details');
                        }
                        break;
                        
                    case "add-guests":
                        $scope.at = 'add-guests';
                        $scope.setLast('reservation-details');
                        $scope.addGuestsHeading = 'Additional Guests';
                        //stateToGoTo = 'station.tab-kiosk-find-by-email';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "add-guest-last":
                        $scope.at = 'add-guest-last';
                        $scope.setLast('add-guests');
                        $scope.headingText = 'Enter the Guests Last Name';
                        //stateToGoTo = 'station.tab-kiosk-find-by-email';
                        $scope.hideNavBtns = false;
                        break;
                    case "add-guest-first":
                        $scope.setLast('add-guest-last');
                        $scope.at = 'add-guest-first';
                        $scope.headingText = 'Enter the Guests First Name';
                        //stateToGoTo = 'station.tab-kiosk-find-by-email';
                        $scope.hideNavBtns = false;
                        break;
                        
                        
                    case "input-email":
                        if ($scope.from === 'email-delivery'){
                            $scope.setLast($scope.from);
                            $scope.at = 'input-email';
                            $scope.input.inputTextValue = $scope.input.lastEmailValue;
                            $scope.headingText = 'Enter your email address';
                            $scope.subHeadingText = "You'll be able to receive your bill, check out, order a late check out, and more online!";
                            $scope.inputTextPlaceholder = '';
                            $scope.hideNavBtns = false;
                            
                        } else {//no email found, email text field should be blank
                            $scope.at = 'input-email';
                            $scope.from = 'card-swipe';
                           // stateToGoTo = 'station.tab-kiosk-input-email';
                            $scope.headingText = 'Enter your email address';
                            $scope.subHeadingText = "You'll be able to receive your bill, check out, order a late check out, and more online!";
                            $scope.inputTextPlaceholder = '';
                            $scope.hideNavBtns = false;
                        }
                        
                        
                        break;
                        
                    case "talk-to-staff":
                        $scope.at = 'talk-to-staff';
                        //stateToGoTo = 'station.tab-kiosk-find-reservation-by-date';
                        $scope.headingText = 'Speak to a staff member.';
                        $scope.subHeadingText = 'A staff member at the front desk will assist you';
                        
                        $scope.modalBtn1 = 'Return';
                        $scope.modalBtn2 = '';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "re-enter-date":
                        $scope.at = 'find-by-date';
                        //stateToGoTo = 'station.tab-kiosk-find-reservation-by-date';
                        $scope.datepicker_heading = 'Find By Date';
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
                        
                    case "re-enter-confirmation":
                        $scope.at = 'find-by-confirmation';
                        //stateToGoTo = 'station.tab-kiosk-find-by-email';
                        $scope.headingText = 'Type Your Confirmation Number';
                        $scope.subHeadingText = '';
                        $scope.inputTextPlaceholder = '';
                        $scope.input.inputTextValue = $scope.input.lastConfirmationValue;
                        $scope.hideNavBtns = false;
//                "lastConfirmationValue": ''
                        break;
                        
                    case "key-success":
                        $scope.at = 'key-success';
                        //stateToGoTo = 'station.tab-kiosk-find-by-email';
                        $scope.headingText = 'Success!';
                       // $scope.subHeadingText = 'Please grab your key(s) from the target below';
                        $scope.modalBtn1 = 'Next';
                        $scope.hideNavBtns = false;
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
                        $scope.setLast('card-swipe');
                        
                        $scope.clearSignature();
                       // stateToGoTo = 'station.tab-kiosk-reservation-sign';
                        $scope.hideNavBtns = false;
                        break;
                        
                        
                    case "make-keys":
                        $scope.greenKey = false;
                       // stateToGoTo = 'station.tab-kiosk-make-key';
                        $scope.setLast('select-keys-after-checkin');
                        $scope.at = 'make-keys';
                        var make_1_key = false, make_2_keys = false;
                        
                        if ($scope.input.makeKeys === 1){
                            make_1_key = true;
                            make_2_keys = false;
                        } else {
                            make_1_key = false;
                            make_2_keys = true;
                        }
                        
                        var oneKeySetup = function(){
                            $scope.at = 'make-keys';
                            
                            $scope.headingText = 'Make your key.';
                            $scope.subHeadingText = 'Select a blank key from the bowl and place it on the target below. When the green light appears, the key is made';
                            $scope.modalBtn1 = 'Next';
                            $scope.input.madeKey = 0;
                            $scope.$apply();
                        };
                        var oneKeySuccess = function(){
                            setTimeout(function(){
                                $scope.goToScreen(null, 'key-success', true, $scope.from);

                                $scope.headingText = 'Success!';
                                $scope.subHeadingText = 'Please grab your key from the target below';
                                $scope.modalBtn1 = 'Next';
                                $scope.input.madeKey = 1;
                                $scope.$apply();
                            },2500);
                        };
                        
                        
                        var keyOneOfTwoSetup = function(){
                            $scope.input.madeKey = 0;
                            $scope.at = 'make-keys';
                             
                            $scope.setLast('select-keys-after-checkin');
                            $scope.headingText = 'Make your first key!';
                            $scope.subHeadingText = 'Select a Blank Key from the Bowl and place it on the target below. \n\
                                                            When the green light appears, the key is made.';
                            $scope.$apply();
                        };
                        var keyOneOfTwoSuccess = function(){
                            setTimeout(function(){
                                $scope.input.madeKey = 1;
                                $scope.goToScreen(null, 'key-success', true, $scope.from);
                                
                                $scope.headingText = 'Success! Make your second key';
                                $scope.subHeadingText = 'Remove the first key, select a Blank Key from the Bowl and place it on the target below.\n\
                                                            When the green light appears, the key is made.';
                                $scope.modalBtn1 = 'Make Key 2/2';
                                
                                
                                $scope.$apply();
                            },2500);
                        };
                        
                        
                        var keyTwoOfTwoSetup = function(){
                            $scope.at = 'make-keys';
                            
                            $scope.headingText = 'Make your second key';
                            $scope.subHeadingText = 'Remove the first key, select a Blank Key from the Bowl and place it on the target below.\n\
                                                        When the green light appears, the key is made.';
                            $scope.$apply();
                        };
                        var keyTwoOfTwoSuccess = function(){
                            setTimeout(function(){
                                $scope.input.madeKey = 2;
                                $scope.goToScreen(null, 'key-success', true, $scope.from);
                                
                                $scope.headingText = 'Success!';
                                $scope.subHeadingText = 'Please grab your keys from the target below';
                                $scope.modalBtn1 = 'Next';
                                
                                $scope.$apply(); 
                            },2500);
                        };
                        
                       
                       
                       
                        if (make_1_key){
                            oneKeySetup();
                            oneKeySuccess();
                        } else if (make_2_keys){
                            //at first key
                            if ($scope.input.madeKey === 0){
                                keyOneOfTwoSetup();
                                keyOneOfTwoSuccess();
                            } else if($scope.input.madeKey === 1) {
                                keyTwoOfTwoSetup();
                                keyTwoOfTwoSuccess();
                            } 
                        }
                        
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "cc-sign-time-out":
                        $scope.at = 'cc-sign-time-out';
                       // stateToGoTo = 'station.tab-kiosk-reservation-signature-time-out';
                        $scope.hideNavBtns = true;
                        break;
                        
                    case "terms-conditions":
                        $scope.termsHeading = "";
                        $scope.subHeading = "";
                        $scope.subHeadingText = "";
                        $scope.headingText = "Terms & Conditions";
                        
                        $scope.agreeButtonText = "I Agree";
                        $scope.cancelButtonText = "Cancel";
                        
                        $scope.at = 'terms-conditions';
                        setTimeout(function(){$scope.setScroll()},200)
                       // stateToGoTo = 'station.tab-kiosk-terms-conditions';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "no-match":
                        $scope.at = 'no-match';
                       // stateToGoTo = 'station.tab-kiosk-no-match';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "select-keys-after-checkin":
                        $scope.at = 'select-keys-after-checkin';
                       // stateToGoTo = 'station.tab-kiosk-select-keys-after-checkin';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "pickupkey":
                        $scope.at = 'pickup-key';
                       // stateToGoTo = 'station.tab-kiosk-pickup-key';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case "last_confirm":
                        $scope.headingText = 'Done!';
                        $scope.subHeadingText = '';
                        
                        $scope.modalBtn1 = '';
                        $scope.modalBtn2 = 'Exit';
                        
                        $scope.at = 'last_confirm';
                        $scope.hideNavBtns = false;
                        break;
                        
                    case 'deliver-registration':{
                            $scope.setLast('deliver-registration');
                             //fetch reservation list using email as the param
                                //onsuccess push results to window
                            $scope.at = 'deliver-registration';
                            $scope.headingText = "Your Registration is Ready";
                            $scope.subHeadingText = "Please select how to receive your registration";
                            $scope.hideNavBtns = true;
                           // $scope.goToScreen(null, 'terms-conditions', true);
                        break;
                    };
                    case 'print-delivery':{
                             //fetch reservation list using email as the param
                                //onsuccess push results to window
                            $scope.printRegistrationCards();
                            $scope.headingText = "Your Registration is Printed Below";
                            $scope.subHeadingText = "";
                            
                            $scope.goToScreen(null, 'last_confirm', true, $scope.from);
                            $scope.hideNavBtns = false;
                           // $scope.goToScreen(null, 'terms-conditions', true);
                        break;
                    };
                    case 'email-delivery':{
                             //fetch reservation list using email as the param
                                //onsuccess push results to window
                            $scope.at = 'email-delivery';
                            $scope.headingText = "We will send your registration to:";
                            $scope.subHeadingText = $scope.input.lastEmailValue;
                            
                            $scope.$apply();
                           
                            $scope.hideNavBtns = false;
                           // $scope.goToScreen(null, 'terms-conditions', true);
                        break;
                    };
                    
                    case 'send-registration':{
                             //fetch reservation list using email as the param
                                //onsuccess push results to window
                            var fetchHotelCompleted = function(response){
                                $scope.at = 'send-registration';
                                $scope.headingText = "Your Registration Has Been sent to:";
                                $scope.subHeadingText = $scope.input.lastEmailValue;
                                $scope.at = 'last_confirm'; 
                                $scope.$emit('hideLoader');
                            };
                            var id = $scope.selectedReservation.id;
                            $scope.invokeApi(rvTabletSrv.sendRegistrationByEmail, {'id':id}, fetchHotelCompleted, $scope.generalError);
                          
                            $scope.hideNavBtns = false;
                           // $scope.goToScreen(null, 'terms-conditions', true);
                        break;
                    };
                    
                    
                        
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
                        $scope.modalBtn1 = 'LOGIN';
                        $scope.modalBtn2 = 'Exit';
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
               
                $scope.resetTime();
            };
            $scope.agreeTerms = function(){
                //$scope.goToScreen(null, 'select-keys-after-checkin', true);
                $scope.goToScreen(null, 'card-swipe', true);
            };
            $scope.skipEmailEntryAfterSwipe = function(){
                if ($scope.from === 'card-swipe'){
                    $scope.clearInputText();
                    $scope.from = 'input-email';
                    $scope.setLast('input-email');
                    $scope.goToScreen(null, 'select-keys-after-checkin', true, 'input-email');
                }
            };
            
            //$scope.today = new Date();
            //$scope.yesterday = new Date($scope.today.getTime() - 86400000);
            //$scope.yesterday = new Date($scope.today.getTime());//placeholder
            
            
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
        
                        $scope.input.madeKey = 0;
        
        $scope.addGuestsHeading = 'Additional Guests';
        $scope.removeGuest = function(i){//where i is the index in $scope.selectedReservation.guest_details
            if ($scope.selectedReservation.guest_details.length > 1){
                var guests = [];
                for (var x = 0; x < $scope.selectedReservation.guest_details.length; x++){
                    if (i !== x){
                        guests.push($scope.selectedReservation.guest_details[x]);
                    }
                }
                $scope.selectedReservation.guest_details = guests;
            }
        };
        
        $scope.searchBy;
        $scope.showDatePick = false;
	$scope.showDatePicker = function(){
                $scope.showDatePick = true;
                $("#picker").datepicker( "option", "minDate", $scope.datePickerMin);
                /*setTimeout(function(){
                    $("a[title='Next']").css("text-indent", "0");
                    $("a[title='Prev']").css("text-indent", "0");
                    $("a[title='Prev']").css("display", "block");
                },300)
                */
                setTimeout(function(){
                       if ($state.setDate === $scope.datePickerMin){
                           var d = $scope.datePickerMin.split('-');
                           var year, month, day;
                           year = parseInt(d[2]);
                           month = parseInt($scope.getMonthN(d[0]));
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
            
            
            
            $scope.loginAdmin = function(){
                $scope.headingText = 'Admin Username';
                $scope.subHeadingText = '';
                $scope.inputTextPlaceholder = '';
                $scope.goToScreen(null, 'admin-login-username', true);
            };

            $scope.setLast = function(state){
                if($scope.prevStateNav.length > 0){
                    if ($scope.prevStateNav[$scope.prevStateNav.length-1] !== state){
                        $scope.prevStateNav.push(state);
                    }
                } else {
                    $scope.prevStateNav.push(state);
                }
                
            };
            
            
             $scope.CommaFormatted = function(amount) {//snipplet pulled from css-tricks.com
                if (amount.indexOf('.') === -1){
                    amount = parseFloat(amount).toFixed(2) + '';
                }
                var delimiter = ","; 
                var a = amount.split('.',2)
                var d = a[1];
                var i = parseInt(a[0]);
                if(isNaN(i)) { return ''; }
                var minus = '';
                if(i < 0) { minus = '-'; }
                i = Math.abs(i);
                var n = new String(i);
                var a = [];
                while(n.length > 3) {
                        var nn = n.substr(n.length-3);
                        a.unshift(nn);
                        n = n.substr(0,n.length-3);
                }
                if(n.length > 0) { a.unshift(n); }
                n = a.join(delimiter);
                if(d.length < 1) { amount = n; }
                else { amount = n + '.' + d; }
                amount = minus + amount;
                return amount;
        };
            /*
             * print registration stuff, copied from group registration printing methods
             */
            
        $scope.printRegistrationCards = function() {
            // add the print orientation after printing
            var removePrintOrientation = function() {
                    $('#print-orientation').remove();
                },
                addPrintOrientation = function() { // add the print orientation before printing
                    $('head').append("<style id='print-orientation'>@page { size: portrait; }</style>");
                },
                sucessCallback = function(data) {
                    $scope.$emit('hideLoader');
                    $scope.printRegCardData = data;
                    $scope.errorMessage = "";

                    // CICO-9569 to solve the hotel logo issue
                    $("header .logo").addClass('logo-hide');
                    $("header .h2").addClass('text-hide');

                    // add the orientation
                    addPrintOrientation();

                    /*
                     *   ======[ READY TO PRINT ]======
                     */
                    // this will show the popup with full bill
                    $scope.isPrintRegistrationCard = true;
                    $rootScope.addNoPrintClass = true;

                    $timeout(function() {
                        /*
                         *   ======[ PRINTING!! JS EXECUTION IS PAUSED ]======
                         */

                        $window.print();
                        if (sntapp.cordovaLoaded) {
                            cordova.exec(function(success) {}, function(error) {}, 'RVCardPlugin', 'printWebView', []);
                        };
                    }, 100);

                    /*
                     *   ======[ PRINTING COMPLETE. JS EXECUTION WILL UNPAUSE ]======
                     */
                    $timeout(function() {
                        $scope.isPrintRegistrationCard = false;
                        $rootScope.addNoPrintClass = false;
                        // CICO-9569 to solve the hotel logo issue
                        $("header .logo").removeClass('logo-hide');
                        $("header .h2").addClass('text-hide');

                        // remove the orientation after similar delay
                        removePrintOrientation();
                    }, 100);

                },
                failureCallback = function(errorData) {
                    $scope.isPrintRegistrationCard = false;
                    $scope.$emit('hideLoader');
                    $scope.errorMessage = errorData;
                };
            var id = $scope.selectedReservation.id;
            $scope.invokeApi(rvTabletSrv.printRegistration, {
                'id': id
            }, sucessCallback, failureCallback);
        };
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            
            

            initTabletConfig();
	}
]);