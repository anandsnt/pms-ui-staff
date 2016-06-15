var SwipeOperation = function(){
	var that = this;
	/*
	 * Function to create the token - Swipe.
	 * @param {obj} swipedCardData - initial swiped data to create token
	 */
	this.createDataToTokenize = function(swipedCardData){
            if (typeof swipedCardData === typeof 'str'){
                swipedCardData = JSON.parse(swipedCardData);
            }
            if (swipedCardData.evt === null && swipedCardData.data){
                swipedCardData = swipedCardData.data;
            }
            //alert('tokenize from: ');
            //alert(JSON.stringify(swipedCardData));
            
			var ksn = swipedCardData.RVCardReadTrack2KSN;
                        if(swipedCardData.RVCardReadETBKSN !== "" && typeof swipedCardData.RVCardReadETBKSN !== "undefined"){
				ksn = swipedCardData.RVCardReadETBKSN;
			}
			var getTokenFrom = {
				'ksn': ksn,
				'pan': swipedCardData.RVCardReadMaskedPAN
			};
                        
			if(swipedCardData.RVCardReadTrack2!==''){
				getTokenFrom.et2 = swipedCardData.RVCardReadTrack2;
			} else if(swipedCardData.RVCardReadETB !==""){
				getTokenFrom.etb = swipedCardData.RVCardReadETB;
			}
                        
			getTokenFrom.is_encrypted = true;
			if(swipedCardData.RVCardReadIsEncrypted === 0 || swipedCardData.RVCardReadIsEncrypted === '0'){
				getTokenFrom.is_encrypted = false;
			}
                       // alert('tokenize form...'+JSON.stringify(getTokenFrom));
			return getTokenFrom;
	};
	/*
	 * Function to create the data to render in screens
	 */
	this.createSWipedDataToRender = function(swipedCardData){
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
			'swipeFrom': swipedCardData.swipeFrom,
			'token': swipedCardData.token
		};

		return swipedCardDataToRender;
	};
	/*
	 * Function to create the data to save which is passed to API
	 */
	this.createSWipedDataToSave = function(swipedCardData){
		var swipedCardDataToSave = {
			"cardType": swipedCardData.RVCardReadCardType,
                        'ksn': swipedCardData.RVCardReadTrack2KSN,
			'pan': swipedCardData.RVCardReadMaskedPAN,
			"mli_token": swipedCardData.token,
			"payment_type": "CC",
                        "cardExpiryMonth": swipedCardData.cardExpiryMonth,
                        "cardExpiryYear": swipedCardData.cardExpiryYear,//2-digit
                        "cardNumber": "xxxx-xxxx-xxxx-" + swipedCardData.token.slice(-4),//xxxx-xxxx-xxxx-0123
                        "addToGuestCard":false,
			"card_name": swipedCardData.RVCardReadCardName,
                        "payment_credit_type":swipedCardData.RVCardReadCardType,
			"credit_card":swipedCardData.RVCardReadCardType,//VA / AX
			"card_expiry": '20'+swipedCardData.RVCardReadExpDate.substring(0, 2)+'-01-'+swipedCardData.RVCardReadExpDate.slice(-2),//2017-12-01
                        "add_to_guest_card":false
		};
                
                var ksn = swipedCardData.RVCardReadTrack2KSN;
                if(swipedCardData.RVCardReadETBKSN !== "" && typeof swipedCardData.RVCardReadETBKSN !== "undefined"){
                        ksn = swipedCardData.RVCardReadETBKSN;
                }
                if (swipedCardDataToSave.ksn === '' && ksn !== ''){
                    swipedCardDataToSave.ksn = ksn;
                }
                if(swipedCardData.RVCardReadTrack2!==''){
                        swipedCardDataToSave.et2 = swipedCardData.RVCardReadTrack2;
                } else if(swipedCardData.RVCardReadETB !==""){
                        swipedCardDataToSave.etb = swipedCardData.RVCardReadETB;
                }
		return swipedCardDataToSave;
	};



};