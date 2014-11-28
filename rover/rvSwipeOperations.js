var SwipeOperation = function(){

	var that = this;

	
	this.createSWipedDataToRender = function(swipedCardData){
		console.log(JSON.stringify(swipedCardData));
		var swipedCardDataToRender = {
			"cardType": swipedCardData.RVCardReadCardType,
			"cardNumber": "xxxx-xxxx-xxxx-" + swipedCardData.token.slice(-4),
			"nameOnCard": swipedCardData.RVCardReadCardName,
			"cardExpiry": swipedCardData.RVCardReadExpDate,
			"cardExpiryMonth": swipedCardData.RVCardReadExpDate.slice(-2),
			"cardExpiryYear": swipedCardData.RVCardReadExpDate.substring(0, 2),
			"et2": swipedCardData.RVCardReadTrack2,
			'ksn': swipedCardData.RVCardReadTrack2KSN,
			'pan': swipedCardData.RVCardReadMaskedPAN,
			'etb': swipedCardData.RVCardReadETB,
			'swipeFrom': swipedCardData.swipeFromm,
			'token': swipedCardData.token
		};
		
		console.log(swipedCardDataToRender);
		return swipedCardDataToRender;
		// "credit_card": data.RVCardReadCardType,
						// "card_number": "xxxx-xxxx-xxxx-" + tokenData.slice(-4),
						// "name_on_card": data.RVCardReadCardName,
						// "card_expiry": data.RVCardReadExpDate,
						// "et2": data.RVCardReadTrack2,
						// 'ksn': data.RVCardReadTrack2KSN,
						// 'pan': data.RVCardReadMaskedPAN,
						// 'etb': data.RVCardReadETB,
						// 'token': tokenData,
	};
	
	this.createSWipedDataToSave = function(swipedCardData){
		console.log("================TO SAVE===============");
		console.log(JSON.stringify(swipedCardData));
		
		
		var swipedCardDataToSave = {
			"cardType": swipedCardData.cardType,
			"et2": swipedCardData.et2,
			"ksn": swipedCardData.ksn,
			"pan": swipedCardData.pan,
			"mli_token": swipedCardData.token,
			"payment_type": "CC"
		};
		return swipedCardDataToSave;
// 		
		// $scope.saveData.et2 = $scope.passData.et2;
			// $scope.saveData.ksn = $scope.passData.ksn;
			// $scope.saveData.pan = $scope.passData.pan;
			// $scope.saveData.mli_token = $scope.passData.token;
			// if($scope.passData.is_swiped){
				// $scope.saveData.payment_credit_type = $scope.passData.credit_card;
				// $scope.saveData.credit_card = $scope.passData.credit_card;
	};

    

};