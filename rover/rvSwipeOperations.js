var SwipeOperation = function(){

	var that = this;

	
	this.createSWipedDataToRender = function(swipedCardData){
		console.log(JSON.stringify(swipedCardData));
		var swipedCardDataToRender = {
			"cardType": swipedCardData.RVCardReadCardType,
			"cardNumber": "xxxx-xxxx-xxxx-" + swipedCardData.token.slice(-4),
			"nameOnCard": swipedCardData.RVCardReadCardName,
			"cardExpiry": swipedCardData.RVCardReadExpDate,
			"et2": swipedCardData.RVCardReadTrack2,
			'ksn': swipedCardData.RVCardReadTrack2KSN,
			'pan': swipedCardData.RVCardReadMaskedPAN,
			'etb': swipedCardData.RVCardReadETB,
			'swipeFrom': swipedCardData.swipeFrom
		};
		console.log(">>>>")
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

    

};