admin.controller('adExternalInterfaceCtrl',
    ['$scope', '$rootScope', '$controller', 'ngDialog', 'adExternalInterfaceCommonSrv', 'adSiteminderSetupSrv',
        'adSynxisSetupSrv', 'adZDirectSetupSrv', 'adTravelTripperSetupSrv', 'adGivexSetupSrv',
        'ADChannelMgrSrv', '$state', '$filter',
        function ($scope, $rootScope, $controller, ngDialog, adExternalInterfaceCommonSrv, adSiteminderSetupSrv,
                  adSynxisSetupSrv, adZDirectSetupSrv, adTravelTripperSetupSrv, adGivexSetupSrv,
                  ADChannelMgrSrv, $state, $filter) {

            $scope.$emit('changedSelectedMenu', (function () {
                return _.indexOf($scope.data.menus,
                    _.findWhere($scope.data.menus, {
                        menu_id: 9 // 9 is ID returned by API for the Interfaces Menu
                    }));
            })());

    $scope.errorMessage = '';
    $scope.successMessage = '';
    $scope.isLoading = true;
    $scope.refreshButtonEnabled = 'enabled';
    $scope.lastRefreshedTimeObj;
    $scope.lastRefreshedTimeRef = '';
    $scope.initTimeout = false;
    $scope.booking = {};
    $scope.payments = {};
    BaseCtrl.call(this, $scope);
    $scope.currentState = $state.current.name;
    $scope.interfaceId = $state.current.interface_id;
    $scope.simpleName = $state.current.simple_name;
    $scope.failedMessages = [];
    $scope.limitResponseLength = 999;
    $scope.maxRefreshDaysApart = 60;// in days
    $scope.ota = {
      checkbox_isDisabled: false,
      has_checked: false
    };
    $scope.has_checked_number = 0;
    $scope.checkBox = function (item) {
      if (item.selected) {
        $scope.has_checked_number--;
      } else {
        $scope.has_checked_number++;
      }
      if ($scope.has_checked_number > 0) {
        $scope.ota.has_checked = true;
      } else {
        $scope.ota.has_checked = false;
      }
    };
    // these setup a generic method to access each service api, using the router namespace
    $scope.serviceController;
    $scope.interfaceName;
    $scope.interfaceConfig = {// controller to find the proper service controller, name to update success/fail messages with proper view/title
      'admin.sitemindersSetup': {
        'controller': adSiteminderSetupSrv,
        'name': $scope.simpleName,
        'service_name': 'adSiteminderSetupSrv'
      },
      'admin.synxisSetup': {
        'controller': adSynxisSetupSrv,
        'name': $scope.simpleName,
        'service_name': 'adSynxisSetupSrv'
      },
      'admin.zDirectSetup': {
        'controller': adZDirectSetupSrv,
        'name': $scope.simpleName,
        'service_name': 'adZDirectSetupSrv'
      },
      'admin.travelTripperSetup': {
        'controller': adTravelTripperSetupSrv,
        'name': $scope.simpleName,
        'service_name': 'adTravelTripperSetupSrv'
      },
      'admin.givexSetup': {'controller': adGivexSetupSrv, 'name': $scope.simpleName, 'service_name': 'adGivexSetupSrv'}
    };
    $scope.init = function () {
      var currentInterface = $scope.interfaceConfig[$scope.currentState];

      if (currentInterface) {
        $scope.serviceController = currentInterface.controller;
        $scope.interfaceName = currentInterface.name;
        // fetch payment methods, source origins, then values

        $scope.fetchSetup();
      } else {
        var onSuccess = function (data) {
          for (var i in data.data) {
            // if (data.data[i].message_type !== 'restriction'){
            data.data[i].can_resubmit = true;// placeholder
            // } else {
//                        }


            // if (data.data[i].message_type !== 'restriction'){
            data.data[i].can_delete = true;// placeholder
            // } else {
            //    data.data[i].can_resubmit = false;
            // }
          }
          $scope.failedMessages = data.data;

          $scope.$emit('hideLoader');
        };

        $scope.invokeApi(adExternalInterfaceCommonSrv.fetchFailedMessages, {}, onSuccess);
      }
    };
    $scope.resetChecked = function () {
      $scope.has_checked_number = 0;
      $scope.ota.has_checked = false;
    };
    $scope.destroyFailedMessage = function (msg) {
      msg.can_delete = false;

      var message_id = [msg.id];
      var onSuccess = function (data) {
        for (var i in $scope.failedMessages) {
          if ($scope.failedMessages[i].id === message_id[0]) {
            $scope.checkBox($scope.failedMessages[i]);
            delete $scope.failedMessages[i];
          }
        }
        // $scope.failedMessages = data.data;
        $scope.$emit('hideLoader');
      };

      $scope.invokeApi(adExternalInterfaceCommonSrv.deleteFailedMessages, {id: message_id}, onSuccess);
    };

    $scope.resubmitFailedMessage = function (msg) {
      var message_id = [msg.id];
      var onSuccess = function (data) {
        // $scope.failedMessages = data.data;
        $scope.$emit('hideLoader');
      };

      $scope.invokeApi(adExternalInterfaceCommonSrv.resubmitFailedMessages, {id: message_id}, onSuccess);
    };
    $scope.resubmitCheckedFailedMessage = function (msg, many) {
      var messages = [];

      if (many) {// msg will be the list of IDs from resubmitSelected
        messages = msg;
      } else {
        for (var msg in $scope.failedMessages) {
          if (msg.is_checked) {
            messages.push(msg.id);
          }
        }
      }
      var onSuccess = function (data) {
        // $scope.failedMessages = data.data;
        $scope.$emit('hideLoader');
      };

      $scope.invokeApi(adExternalInterfaceCommonSrv.resubmitFailedMessages, {id: messages}, onSuccess);

    };

    $scope.resubmitSelected = function () {
      var forResubmit = [];

      for (var i in $scope.failedMessages) {
        if ($scope.failedMessages[i].selected) {
          forResubmit.push($scope.failedMessages[i].id);
        }
      }
      $scope.resubmitCheckedFailedMessage(forResubmit, true);

    };
    $scope.deleteSelected = function () {
      var forDelete = [];

      for (var i in $scope.failedMessages) {
        if ($scope.failedMessages[i].selected) {
          forDelete.push($scope.failedMessages[i].id);
        }
      }
      $scope.deleteCheckedFailedMessage(forDelete, true);

    };


    $scope.deleteCheckedFailedMessage = function (msg, many) {
      var messages = [];

      if (many) {// msg will be the list of IDs from resubmitSelected
        messages = msg;
      } else {
        for (var msg in $scope.failedMessages) {
          if (msg.is_checked) {
            messages.push(msg.id);
          }
        }
      }
      var onSuccess = function (data) {
        // $scope.failedMessages = data.data;
        $scope.$emit('hideLoader');
        $scope.resetChecked();
        $scope.init();
      };

      $scope.invokeApi(adExternalInterfaceCommonSrv.deleteFailedMessages, {id: messages}, onSuccess);
    };


    $scope.getTimeConverted = function (time) {
      if (time === null || time === undefined || time.indexOf("undefined") > -1) {
        return "";
      }
      if (time.indexOf('T') !== -1) {
        var t = time.split('T');

        time = t[1];
      }
      var timeDict = tConvert(time);

      return (timeDict.hh + ":" + timeDict.mm + " " + timeDict.ampm);
    };
    // /////////////////////////
    // /FETCH
    //
    // initial fetch when view initializes
    $scope.givex = {
      enabled: false,
      timeout: '',
      username: '',
      password: '',
      url: '',
      secondary_url: ''
    };
    $scope.fetchSetupSuccessCallback = function (data) {
        if (data.data && data.data.product_cross_customer) {
            $scope.interface = data.data.product_cross_customer.interface_id;
            $scope.fetchMinimalRateDetails();
        }
        
      if ($scope.interfaceName === 'Givex') {
        $scope.givex = data;
        $scope.$emit('hideLoader');
      } else if ($scope.interfaceName === 'ZDirect') {
        $scope.data = data;
        $scope.$emit('hideLoader');
      } else {// siteminder, synxis, traveltripper all use these
        $scope.data = data;
        if (data.data.product_cross_customer) {
            if (typeof data.data.product_cross_customer.default_rate === typeof 123) {
                data.data.product_cross_customer.default_rate = data.data.product_cross_customer.default_rate + "";
                $scope.setDefaultRate();
            }
        }
        // load up origins and payment methods
        $scope.invokeApi(adExternalInterfaceCommonSrv.fetchOrigins, {}, fetchOriginsSuccessCallback);
        $scope.invokeApi(adExternalInterfaceCommonSrv.fetchPaymethods, {}, fetchPaymethodsSuccess);
        $scope.invokeApi(adExternalInterfaceCommonSrv.fetchRoomTypes, {}, fetchRoomTypesSuccess);
        // default source code is available only for Siteminder now.
        if ($scope.interfaceName === 'Siteminder') {
          $scope.invokeApi(adExternalInterfaceCommonSrv.fetchSourceCodes, {}, fetchSourceCodeSuccess);
        }

        $scope.setRefreshTime();
      }
    };
    
    
    $scope.setDefaultRate = function() {
        var value = $scope.data.data.product_cross_customer.default_rate;

        if (typeof value !== typeof undefined) {
            setTimeout(function() {
                var el = $('[name=default-rate]');

                $(el).val(value);
            }, 950);
        }
    };
    
    $scope.fetchFailSuccessCallback = function (data) {
      // load up origins and payment methods
      $scope.invokeApi(adExternalInterfaceCommonSrv.fetchOrigins, {}, fetchOriginsSuccessCallback);
      $scope.invokeApi(adExternalInterfaceCommonSrv.fetchPaymethods, {}, fetchPaymethodsSuccess);
    };
    $scope.fetchSetup = function () {
      if ($scope.interfaceName !== 'Givex') {
        $scope.invokeApi(adExternalInterfaceCommonSrv.fetchSetup, {'interface_id': $scope.interfaceId}, $scope.fetchSetupSuccessCallback, $scope.fetchSetupFailCallback);
      } else {
        $scope.invokeApi(adGivexSetupSrv.fetchSetup, {}, $scope.fetchSetupSuccessCallback, $scope.fetchSetupFailCallback);
      }
    };
    var fetchOriginsSuccessCallback = function (data) {
      if ($scope.interfaceName !== 'Givex' && $scope.interfaceName !== 'ZDirect') {
        $scope.$emit('hideLoader');
        $scope.isLoading = false;
        $scope.booking.booking_origins = data.booking_origins;
        setOrigin();
      }
    };

    var fetchPaymethodsSuccess = function (data) {
      if ($scope.interfaceName !== 'Givex' && $scope.interfaceName !== 'ZDirect') {
        $scope.$emit('hideLoader');
        $scope.isLoading = false;
        $scope.payments.payments = data.payments;
        setPayment();
      }
    };

    $scope.roomTypes = [];
    var fetchRoomTypesSuccess = function(data) {
        if ($scope.interfaceName !== 'Givex' && $scope.interfaceName !== 'ZDirect') {
            $scope.roomTypes = data.room_types;
        }
    };

    $scope.sourceCodes = [];
    var fetchSourceCodeSuccess = function(data) {
        $scope.sourceCodes = data.sources;
    };

    if ($scope.interfaceName !== 'Givex') {
        // Set the selected payment and origin
        var setPayment = function() {
            var value = parseInt($scope.data.data.product_cross_customer.default_payment_id);

            if (typeof value !== typeof undefined) {
                setTimeout(function() {
                    var payment = $('[name=default-payment]');

                    $(payment).val(value);
                }, 50);// takes a moment for angularjs to catch up with the list population, possibly longer if list grows too big
            }
        };
        var setOrigin = function() {
            var value = parseInt($scope.data.data.product_cross_customer.default_origin);

            if (typeof value !== typeof undefined) {
                setTimeout(function() {
                    var payment = $('[name=default-origin]');

                    $(payment).val(value);
                }, 50);
            }
        };
    }
    $scope.populateRateSelection = function() {
        $scope.rateSelection = [];
        var rates = $scope.minimalRates,
            rate;

        for (var i in rates) {
            rate = {
              id: rates[i].id,
              rate_name: rates[i].name
            };
            if (rate) {
                $scope.rateSelection.push(rate);
            }
        }
    };

    $scope.fetchMinimalRateDetails = function() {
        var fetchSuccess = function (data) {
            $scope.$emit('hideLoader');
            $scope.minimalRates = data.results;
            $scope.populateRateSelection();
        };
        var fetchFailure = function(data) {
            $scope.errorMessage = data;
            $scope.$emit('hideLoader');
        };

        $scope.invokeApi(ADChannelMgrSrv.fetchMinimalRateDetails, {'exclude_expired': true}, fetchSuccess, fetchFailure);
    };

    $scope.init();
    
    $scope.initSave = function() {
        var saveData = $scope.lastSaved;

        if ($scope.interfaceName === 'Givex') {
        $scope.invokeApi($scope.serviceController.saveSetup, $scope.givex, $scope.saveSetupSuccessCallback, $scope.saveSetupFailureCallback);
      } else if ($scope.interfaceName === 'ZDirect') {
        $scope.invokeApi($scope.serviceController.saveSetup, saveData, $scope.saveSetupSuccessCallback, $scope.saveSetupFailureCallback);
      } else {
        // these values currently coming back as strings, parse to int before sending back
        if (saveData.data.product_cross_customer.default_origin) {
          saveData.data.product_cross_customer.default_origin = parseInt($scope.data.data.product_cross_customer.default_origin);
        }
        if (saveData.data.product_cross_customer.default_payment_id) {
          saveData.data.product_cross_customer.default_payment_id = parseInt($scope.data.data.product_cross_customer.default_payment_id);
        }
        $scope.invokeApi($scope.serviceController.saveSetup, saveData, $scope.saveSetupSuccessCallback, $scope.saveSetupFailureCallback);
      }
    };
    
    $scope.initActiveInactiveSave = function() {
      if ($scope.interfaceName === 'Givex') {
        $scope.initSave();
      } else {
        if ($scope.data.data) {
          if ($scope.data.data.product_cross_customer) {
            var active = $scope.data.data.product_cross_customer.active,
              id = $scope.interfaceId,
              int_id = $scope.interface_id;

            $scope.invokeApi(adExternalInterfaceCommonSrv.toggleActive, {
              'interface': id,
              // 'interface_id': int_id,
              'active': active
            }, $scope.initSave());
          }
        }
      }
    };
    // ////////////////////
    // //SAVE
    //
    // Save changes button click action
    $scope.saveSetupSuccessCallback = function (data) {
        $scope.isLoading = false;
        $scope.successMessage = $scope.interfaceName + ' Save Success';
        $scope.$emit('hideLoader');
      };

      $scope.saveSetupFailureCallback = function (data) {
          $scope.isLoading = false;
          if (data && data.length) {
              $scope.errorMessage = data;
          } else {
              $scope.errorMessage = $scope.interfaceName + ' Save Failed ';
          }

          $scope.$emit('hideLoader');
      };

    $scope.saveSetup = function () {
        var saveData;

        if ($scope.interfaceName === 'Givex') {
            saveData = $scope.data;
        } else {
            var unwantedKeys = ["available_trackers", "bookmark_count", "bookmarks", "current_hotel", "hotel_list", "menus", "interface_types"];

             saveData = dclone($scope.data, unwantedKeys);
        }
      
      saveData.interface = $scope.interfaceId;
      $scope.lastSaved = saveData;
      
      if ($scope.activeDirty) {
          $scope.initActiveInactiveSave();
      } else {
          $scope.initSave();
      }
      
    };
    // ////////////////////
    // Active / Inactive Toggle to turn ON/OFF interface for the hotel

    $scope.toggleSMActiveSuccess = function () {
      $scope.data.data.product_cross_customer.active = !$scope.data.data.product_cross_customer.active;
      $scope.invokeApi(adExternalInterfaceCommonSrv.fetchSetup, {
        'interface_id': $scope.interfaceId,
        'active': $scope.data.data.product_cross_customer.active
      }, $scope.fetchSetupSuccessCallback);
    };

    $scope.activeDirty = false;
    $scope.toggleSMClicked = function () {
        $scope.activeDirty = true;
        if ($scope.interfaceName === 'Givex') {
            $scope.givex.enabled = !$scope.givex.enabled;
          } else {
                if ($scope.data.data) {
                    if ($scope.data.data.product_cross_customer) {
                      var active = $scope.data.data.product_cross_customer.active;

                      if (active) {
                        $scope.data.data.product_cross_customer.active = false;
                      } else {
                        $scope.data.data.product_cross_customer.active = true;
                      }
                    }
                }
          }
        
    };
    
        $scope.refreshDatePickerData = {
            start_date: $rootScope.businessDate,
            end_date: '',
            end_date_for_display: '',
            start_date_for_display: $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd')
        };
        
        $scope.getDateOptionsStrMinusDays = function(day) {
            day = day + '';
            var i = day.split('-');
            var year = i[0], mo = i[1], dayN = i[2];
            var setDate = new Date(year, mo - 1, dayN);
            var nDaysLater = 86400000 * $scope.maxRefreshDaysApart;
            var nDay = new Date(setDate.valueOf() + nDaysLater);
            var nDayDate = nDay.getDate(), nYear = nDay.getFullYear(), nMonth = nDay.getMonth() + 1;
            
            // var newDateToSet = nYear+'-'+nMonth+'-'+nDayDate;
            var n = new Date(nYear, nMonth - 1, nDayDate);

            return n;
        };
        
        $scope.setDefaultEndDate = function() {
            if ($scope.refreshDatePickerData.start_date) {
                $scope.refreshDatePickerData.end_date = $scope.refreshDatePickerData.start_date;
            }
            if ($scope.refreshDatePickerData.start_date_for_display) {
                $scope.refreshDatePickerData.end_date_for_display = $scope.refreshDatePickerData.start_date_for_display;
            }
        };
        $scope.validateEndDate = function() {
            // upon selecting a start date; if the start date < the end date, the end date value needs to be updated to match the same day,
            // otherwise the datepicker has the old date that was input
            // start date
            var d = $scope.refreshDatePickerData.start_date_for_display.split('-');
            var sYr = parseInt(d[0]), sMo = parseInt(d[1]), sDay = parseInt(d[2]);
            
            // end date
            var ed = $scope.refreshDatePickerData.end_date_for_display.split('-');
            var eYr = parseInt(ed[0]), eMo = parseInt(ed[1]), eDay = parseInt(ed[2]);
            
              var s = new Date(sYr, sMo - 1, sDay),
              e = new Date(eYr, eMo - 1, eDay);
              
              var start_date = s.valueOf(),
              end_date = e.valueOf();

              if (end_date < start_date) {
                  $scope.refreshDatePickerData.end_date = $scope.refreshDatePickerData.start_date;
                  $scope.refreshDatePickerData.end_date_for_display = $scope.refreshDatePickerData.start_date_for_display;
              }
            
        };
        $scope.setUpDatePicker = function() {
            $scope.refreshDatePickerData.start_date = $rootScope.businessDate;
            $scope.refreshDatePickerData.start_date_for_display = $filter('date')(tzIndependentDate($rootScope.businessDate), 'yyyy-MM-dd');
            
            $scope.startDateOptions = {
                changeYear: false,
                changeMonth: true,
                minDate: tzIndependentDate($rootScope.businessDate),
                onSelect: function(dateText, inst) {
                    $scope.refreshDatePickerData.start_date_for_display = $filter('date')(tzIndependentDate($scope.refreshDatePickerData.start_date), 'yyyy-MM-dd');
                    $scope.endDateOptions.minDate = tzIndependentDate($scope.refreshDatePickerData.start_date);
                    $scope.endDateOptions.maxDate = tzIndependentDate($scope.getDateOptionsStrMinusDays($scope.refreshDatePickerData.start_date));// n days from the start date (max range of days = 2nd arg)
                    $scope.validateEndDate();
                }
            };
            
             $scope.endDateOptions = {
                changeYear: false,
                changeMonth: true,
                onSelect: function(dateText, inst) {
                    $scope.refreshDatePickerData.end_date_for_display = $filter('date')(tzIndependentDate($scope.refreshDatePickerData.end_date), 'yyyy-MM-dd');
                }
            };
            
            if ($scope.refreshDatePickerData.start_date) {
                $scope.endDateOptions.minDate = tzIndependentDate($scope.refreshDatePickerData.start_date);
                $scope.endDateOptions.maxDate = tzIndependentDate($scope.getDateOptionsStrMinusDays($scope.refreshDatePickerData.start_date));// n days from the start date (max range of days = 2nd arg)
            } else {
                $scope.endDateOptions.minDate = tzIndependentDate($rootScope.businessDate);
                $scope.endDateOptions.maxDate = tzIndependentDate($scope.getDateOptionsStrMinusDays($rootScope.businessDate));// n days from the start date (max range of days = 2nd arg)
           
            }
            $scope.setDefaultEndDate();
            
        };
        $scope.setUpDatePicker();
        $scope.closeDialog = function() {
             ngDialog.close();
        };
        
	$scope.showDatePicker = function() {
            $scope.setUpDatePicker();// this sets up default start and end date
            ngDialog.open({
                template: '/assets/partials/SiteminderSetup/adSiteminderDatepicker.html',
                className: 'ngdialog-theme-default single-calendar-modal siteminder-date-picker',
                scope: $scope,
                closeByDocument: true
            });
	};
        

        $scope.setRefreshTime = function() {
            
            if ($scope.interfaceName !== 'Givex') {
                /* this refresh timer disabled now that we can send date ranges for refresh
               */
                if ($scope.data.data.product_cross_customer.full_refresh !== null) {
                   $scope.lastRefreshedTime = new Date($scope.data.data.product_cross_customer.full_refresh);
                   $scope.lastRefreshedTimeRef = $scope.formatDate(new Date($scope.data.data.product_cross_customer.full_refresh));
                   $scope.lastRefreshedTimeObj = new Date($scope.data.data.product_cross_customer.full_refresh);

                   
                   $scope.lastRefreshedTimeMark = $scope.timeSince($scope.lastRefreshedTimeObj.valueOf());
                   
                    if (!$scope.initTimeout) {
                        $scope.countdownTimer();
                        $scope.initTimeout = true;
                    }
               }
               
               
           }
        };

    $scope.runFullRefresh = function () {
      var lastRefreshed = $scope.data.data.product_cross_customer.full_refresh, refreshNowDate = new Date();
      var data = {};

      data.start_date = $scope.refreshDatePickerData.start_date;
      data.end_date = $scope.refreshDatePickerData.end_date;
      data.interface_id = $scope.interfaceId;
      
      if (lastRefreshed !== null) {
        try {
          var lastRefreshedDate = new Date($scope.data.data.product_cross_customer.full_refresh);

          lastRefreshed = lastRefreshedDate.valueOf();
        } catch (err) {

        }
      }
      var fullRefreshSuccess = function () {
        $scope.successMessage = $scope.interfaceName + ' Full Refresh Success!';
        $scope.$emit('hideLoader');
        $scope.fetchSetup();
      };
      var fullRefreshFail = function (response) {
        var msg = '';

        if (response[0]) {
          if (response[0].length > 0) {
            msg = ': "' + response[0] + '"';
          }
        }
        $scope.errorMessage = $scope.interfaceName + ' Full Refresh Failed' + msg;
        $scope.$emit('hideLoader');
      };

        $scope.invokeApi($scope.serviceController.fullRefresh, data, fullRefreshSuccess, fullRefreshFail);
    };

    // Test connection button click action
    $scope.testSetup = function () {
      var testSetupSuccessCallback = function (data) {
        // double check to see if it Actually failed..
        if (data.status === 'failure') {
          var msg = '';

          if (typeof data[0] === typeof 'str') {
            if (data[0].length > 1) {
              msg = ': ' + data[0];
            } else if (typeof data === typeof 'str') {
              msg = ': data';
            }
          }
          $scope.errorMessage = $scope.interfaceName + ' Test Failed' + msg;
        } else {
          $scope.isLoading = false;
          $scope.successMessage = $scope.interfaceName + ' Test Success';
        }
        $scope.$emit('hideLoader');
      };
      var testSetupFailureCallback = function (data) {
        $scope.isLoading = false;
        var msg = '';

        if (typeof data[0] === typeof 'str') {
          if (data[0].length > 1) {
            msg = ': ' + data[0];
          } else if (typeof data === typeof 'str') {
            msg = ': data';
          }
        }
        $scope.errorMessage = $scope.interfaceName + ' Test Failed' + msg;
        $scope.$emit('hideLoader');
      };

      var checkCallback = function (response) {
        $scope.$emit('hideLoader');
        if (response.status === 'failure') {
          testSetupFailureCallback(response);
        } else {
          testSetupSuccessCallback(response);
        }
      };

      var unwantedKeys = ["available_trackers"];
      var testData = dclone($scope.data, unwantedKeys);

      testData.interface = $scope.interfaceId;
      $scope.invokeApi($scope.serviceController.testSetup, testData, checkCallback);
    };


    // COUNTDOWN Timer Utilities
    $scope.timeSince = function (date) {
      var seconds = Math.floor((new Date() - date) / 1000);// local to the user
      var interval = Math.floor(seconds / 31536000);

      if (interval > 1) {
        return interval + " years";
      }
      interval = Math.floor(seconds / 2592000);
      if (interval > 1) {
        return interval + " months";
      }
      interval = Math.floor(seconds / 86400);
      if (interval > 1) {
        return interval + " days";
      }
      interval = Math.floor(seconds / 3600);
      if (interval > 1) {
        return interval + " hours";
      }
      interval = Math.floor(seconds / 60);
      if (interval > 1) {
        return interval + " minutes";
      }
      return Math.floor(seconds) + " seconds";
    };
    $scope.formatDate = function (now) {
      var year = "" + now.getFullYear();
      var month = "" + (now.getMonth() + 1);

      if (month.length === 1) {
        month = "0" + month;
      }
      var day = "" + now.getDate();

      if (day.length === 1) {
        day = "0" + day;
      }
      var hour = "" + now.getHours();

      if (hour.length === 1) {
        hour = "0" + hour;
      }
      var minute = "" + now.getMinutes();

      if (minute.length === 1) {
        minute = "0" + minute;
      }
      var second = "" + now.getSeconds();

      if (second.length === 1) {
        second = "0" + second;
      }
      return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    };
    // ////////////////////

    $scope.countdownTimer = function () {
      setTimeout(function () {
        $scope.$apply(function () {
          if ($scope.lastRefreshedTimeMark) {
            $scope.lastRefreshedTimeMark = $scope.timeSince($scope.lastRefreshedTimeObj.valueOf());
            $scope.countdownTimer();
          }
          $scope.setRefreshTime();
        });
      }, 1000);
    };

    /*
     * Failed OTA Messages
     */
  }]);
