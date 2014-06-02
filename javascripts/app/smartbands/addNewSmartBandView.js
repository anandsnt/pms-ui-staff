/**
* class for smart band adding (modal screen)
*
*/

var AddNewSmartBandView = function(domRef) {	
	BaseView.call(this);
	this.myDom = domRef;
	var that = this;	
	
	this.delegateEvents = function(){
		that.myDom.find('#continue-button').on('click', that.continueButtonClicked);	
		that.myDom.find('#payment-type').on('click', that.switchedPaymentType);		
		that.myDom.find("#cancel-link").on('click', that.parentController.hide);
	}


	/**
	* event executed when shown the ui
	*/
	this.pageshow = function(){		
		that.parentController.hideButton('see-all-band-button');
    	that.parentController.hideButton('add-new-button');
    	that.myDom.find('#first-name').val('');
    	that.myDom.find('#last-name').val('');
    	that.myDom.find('#fixed-amound').val('');
    	that.myDom.find('#payment-type').prop('checked', false);
    	that.switchedPaymentType();
	}

	


	/**
	* function to handle click on continue button
	* in this operation we are saving the info, on success we are redirecting writing interface
	*/
	this.continueButtonClicked = function(){		
		//preparing the data to write screen
		var data = {};
		data.first_name = $.trim(that.myDom.find('#first-name').val());
		data.last_name = $.trim(that.myDom.find('#last-name').val());		
		var payment_mode = that.myDom.find('#payment-type').is(":checked");
		data.is_fixed = payment_mode;
		if(payment_mode){ //means fixed, then only we need to add this attribute
			data.amount = $.trim(that.myDom.find('#fixed-amound').val());			
		}
		//validation part
		var blankKeys = "";
		if(data.first_name == ''){
			blankKeys = "First Name"			
		}
		if(data.last_name == ''){			
			blankKeys = blankKeys == '' ? "Last Name" : (blankKeys + ", " + 'Last Name');
		}
		if(payment_mode){	
			if(data.amount == ''){			
				blankKeys = blankKeys == '' ? "Amount" : (blankKeys + ", " + "Amount");
			}
			else{
				var pattern = /^(0|[1-9][0-9]{0,2}(?:(,[0-9]{3})*|[0-9]*))(\.[0-9]+){0,1}$/;
				if(!pattern.test(data.amount)){
					blankKeys = blankKeys == '' ? "Amount is not valid" : (blankKeys + ", " + "Amount is not valid");
				}
			}

		}	
		if(blankKeys != "")	{
			sntapp.notification.showErrorMessage('Please enter ' + blankKeys, that.myDom);
		}
		else{
			that.parentController.getControllerObject('write-to-band').data = data;
			that.parentController.showPage('write-to-band');		
		}
	};

	/** 
	* function to handle ui changes on payment type switching
	*/
	this.switchedPaymentType = function(){
		var value = that.myDom.find('#payment-type').is(":checked");
		if(value) {
			that.myDom.find('#fixed-amound').parents("div").eq(0).show();
		}
		else{
			that.myDom.find('#fixed-amound').parents("div").eq(0).hide();
		}
		onOffSwitch();
	};

};