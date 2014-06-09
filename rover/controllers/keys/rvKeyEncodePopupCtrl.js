sntRover.controller('RVKeyEncodePopupCtrl',[ '$rootScope','$scope','ngDialog',  function($rootScope, $scope, ngDialog){
	BaseCtrl.call(this, $scope);
	var that = this;
	$scope.init = function(){
		$scope.deviceConnecting = false;
		$scope.showPrintKeyOptions = false;
		$scope.deviceNotConnected = false;
		$scope.keyesPrinted = false;

		that.noOfErrorMethodCalled = 0;
		that.maxSecForErrorCalling = 1000;
		$scope.showDeviceConnectingMessge();
	};

	/**
	* Check if the card reader device connection is available.
	* Display a screen having device connecting message.
	*/
	$scope.showDeviceConnectingMessge = function(){
		$scope.deviceConnecting = true;
		$scope.deviceNotConnected = false;
		$scope.keyesPrinted = false;
		$scope.showPrintKeyOptions = false;

		var callBack = {
			'successCallBack': showPrintKeyOptions,
			'failureCallBack': showDeviceNotConnected			
		};
		if(sntapp.cardSwipeDebug){
			sntapp.cardReader.checkDeviceConnectedDebug(callBack);
		}
		else {
			try {
				sntapp.cardReader.checkDeviceConnected(callBack);
			} catch(e) {
				that.showDeviceNotConnected();
			}
		}
	};

	/*
	* If the device is not connected, try the connection again after 1 sec.
	* repeat the connection check for 10 seconds. 
	* If the connection still fails, show a device not connected status in the popup.
	*/
	var showDeviceNotConnected = function(){
		//For 10 seconds, we will check the connectivity 
		//and if still no connection found, 
		//will display the device not connected screen
		var secondsAfterCalled = 0;
		that.noOfErrorMethodCalled++;
		secondsAfterCalled = that.noOfErrorMethodCalled * 1000;		
		setTimeout(function(){
			if(secondsAfterCalled <= that.maxSecForErrorCalling){ //10seconds
				$scope.showDeviceConnectingMessge();
			}
		}, 1000);

		if(secondsAfterCalled > that.maxSecForErrorCalling){
			$scope.deviceConnecting = false;
			$scope.keyesPrinted = false;
			$scope.showPrintKeyOptions = false;
			$scope.deviceNotConnected = true;
			$scope.$apply();

		}

	};

	var showPrintKeyOptions = function (){
		$scope.deviceConnecting = false;
		$scope.deviceNotConnected = false;
		$scope.keyesPrinted = false;
		$scope.showPrintKeyOptions = true;
		$scope.$apply();

	};

	var showKeysPrinted = function(){

		$scope.keyesPrinted = true;
	};

	$scope.cancelClicked = function(){

	};


	$scope.init();
	
}]);