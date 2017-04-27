function CardReaderCtrl($scope, $rootScope, $timeout, $interval, $log) {

    var self = this;

    self.cardReaderInitiationAttempts = 0;
    self.cardReaderInitiationMaxAttempts = 2;
    self.cardReaderInitiationAttemptInterval = 2000;
    self.refreshIntervalInMilliSeconds = 10000;

    self.initiateIntervalObserveResets = function() {
        $interval.cancel(self.intervalHandle);
        self.intervalHandle = $interval(function() {
            try {
                $log.info('reset the observeForSwipe request with a fresh callback!');
                sntapp.cardReader.startReader(self.options);
            } catch (e) {
                $log.warn(e);
            }
        }, self.refreshIntervalInMilliSeconds);
    };

    self.initiateCardReader = function() {
        $log.info('trying to initiate an observeForSwipe request...');

        if (sntapp.cordovaLoaded && 'rv_native' === sntapp.browser) {
            sntapp.cardReader.startReader(self.options);
            $log.info('request made to observe for swipe!');
            self.initiateIntervalObserveResets();
        } else {
            // If cordova not loaded in server, or page is not yet loaded completely
            // One second delay is set so that call will repeat in 1 sec delay
            if (self.cardReaderInitiationAttempts < self.cardReaderInitiationMaxAttempts) {
                $log.warn($scope.$state.current.name);
                $log.info('cordova not loaded in server! Next attempt in ' + self.cardReaderInitiationAttemptInterval + 'ms');
                self.timeoutHandle = $timeout(function() {
                    self.cardReaderInitiationAttempts++;
                    self.initiateCardReader();
                }, self.cardReaderInitiationAttemptInterval);
            } else {
                $log.info('cordova not loaded! Max attempts to connect reached!');
            }
        }
    };

    $scope.observeForSwipe = function(numAttempts) {
        $log.warn('initiate attempts to observe for swipe from ' + $scope.$state.current.name);
        self.cardReaderInitiationMaxAttempts = numAttempts || self.cardReaderInitiationMaxAttempts;
        self.cardReaderInitiationAttempts++;
        self.initiateCardReader();
    };

    $scope.$on('$destroy', function() {
        $log.warn("interval cleared? " + $interval.cancel(self.intervalHandle));
        $log.warn("timeout cleared? " + $timeout.cancel(self.timeoutHandle));
        $log.warn('stopping listening to observe for swipe from ' + $scope.$state.current.name);
        self.options = null;
    });

    (function() {
        self.options = {
            'successCallBack': function(data) {
                $rootScope.$emit('BROADCAST_SWIPE_ACTION', data);
                $log.info($scope.$state.current.name + ' SUCCESS callback received from cordova...', data);
                self.initiateCardReader();
            },
            'failureCallBack': function(errorMessage) {
                $scope.errorMessage = errorMessage;
                $log.info($scope.$state.current.name + 'FAILURE callback received from cordova...', errorMessage);
                self.initiateCardReader();
            }
        };
    })();
}