var HotelChainsView = function(domRef){
  
	BaseInlineView.call(this);  
	this.myDom = domRef;
	this.textOptionStart = 1;
	var that = this;
	
	
	this.pageinit = function(){
		that.myDom.unbind('click');
		that.myDom.unbind("keyup");
		that.myDom.unbind("focusin");
		that.myDom.unbind("focusout");		 
	};
	
	this.delegateSubviewEvents = function() {
		that.myDom.on("keyup", that.keyUpOperations);
		that.myDom.on("focusin", that.viewEventHandler);
		that.myDom.on("focusout", that.viewFocusOutHandler);
	};
	
	this.viewFocusOutHandler = function(event){
		var element = $(event.target);
		if(typeof element !== 'undefined'){
			
			// for add new list of values
			if(element.hasClass('add-new-option')){
				element.removeClass('add-new-option').addClass('delete-option');
				that.removeLOV(element);
			}
		}
	};
	
	this.viewEventHandler = function(event){
		var element = $(event.target);
		if(typeof element !== 'undefined'){
			
			// for add new list of values
			if(element.hasClass('add-new-option')){
				that.appendNewLOV(element);
			}			
		}
		else{
			sntapp.notification.showErrorMessage('Something went wrong, please refresh the page and try again');			
		}
	};
	
	// for appending new List of value (LOV) textbox
	this.appendNewLOV = function(element){
		
		// we assume that, id naming is the combination of elementName and text '-option' and an integer incrementer.
		var elementName = element.attr("name");		
		that.textOptionStart++;
		
		element
			.clone() 														// Clone element
			.val('') 														// Clear value
			.attr('id', elementName + '-option' + that.textOptionStart) 	// Increment ID value
			.insertAfter(element.parent('.entry'))							// Insert after this one
			.wrap('<div class="entry" />');									// Wrap to div
		
		//element.removeClass('add-new-option').addClass('delete-option');
	};
	
	// for removing blank List of value (LOV) textbox
	this.removeLOV = function(element){
		
		var value = $.trim(element.val());
		if(value === ""){
			element.parent('.entry').remove();
		}
	};
	
	this.keyUpOperations = function(event){
		var element = $(event.target);
		if(element.hasClass('delete-option')){
			that.removeLOV(element);
		}
	};
	
	this.updateApi = function(event){
		var chainID = that.myDom.find("#edit-chain-details").attr("data_chain_id");
		var chainName = $.trim(that.myDom.find("#chain-name").val());		
		var hotelCode = $.trim(that.myDom.find("#hotel-code").val());
		var programName = $.trim(that.myDom.find("#program-name").val());
		var programCode = $.trim(that.myDom.find("#program-code").val());
		var phoneT_C = $.trim(that.myDom.find("#phone").val()); //T_C : terms & conditions
		var emailT_C = $.trim(that.myDom.find("#email").val()); //T_C : terms & conditions
		var terms_and_condtn = $.trim(that.myDom.find("#terms_and_condtn").val());
		
		var lovs = []; //list of values
		// looping over list of values text boxes
		that.myDom.find('input[name=lov]').each(function(){ 
			var lov_value = $.trim($(this).val());
			if( lov_value !== ""){
				lovs.push(lov_value);
			}
		});
		
		// the validation part need to be modified or removed based on which validation that
		// we are going to use. I mean jQuery validator or something like that.
		if(typeof chainName === 'undefined' || chainName === ""){
			alert('Please enter a valid chain name');
			return false;
		}
		else if(typeof chainID === 'undefined' || chainID === ""){ // rare case
			sntapp.notification.showErrorMessage('Some thing went wrong, please refresh the page and try again');
			return false;
		}
		else{
			
			
			var webservice = new WebServiceInterface();
			var url = '#';
			
			if(typeof url === 'undefined' || url == "#" )
				return false;	
			
			var data = {};
			data.chain_id = chainID;
			data.chain_name = chainName;
			data.hotel_code = hotelCode;
			data.program_name = programName;
			data.program_code = programCode;
			data.phoneT_C = phoneT_C;
			data.emailT_C = emailT_C;
			data.terms_and_condtn = terms_and_condtn;
			data.list_of_values = lovs;
					
		    var options = {
					   successCallBack: that.fetchCompletedOfUpdateApi,
					   requestParameters: data,
		    		   loader: 'normal',
			};
		    webservice.postJSON(url, options);				
		}
	};
	
	this.fetchCompletedOfUpdateApi = function(data){
		sntapp.notification.showSuccessMessage('Successfully updated');
		// update the view of listing the chain listing
		
	};
	
	this.saveNewApi = function(){
		var chainName = $.trim(that.myDom.find("#chain-name").val());
		var hotelCode = $.trim(that.myDom.find("#hotel-code").val());	
		var programName = $.trim(that.myDom.find("#program-name").val());
		var programCode = $.trim(that.myDom.find("#program-code").val());
		var phoneT_C = $.trim(that.myDom.find("#phone").val()); //T_C : terms & conditions
		var emailT_C = $.trim(that.myDom.find("#email").val()); //T_C : terms & conditions
		var terms_and_condtn = $.trim(that.myDom.find("#terms_and_condtn").val());	
		
		var lovs = []; //list of values
		// looping over list of values text boxes
		that.myDom.find('input[name=lov]').each(function(){ 
			var lov_value = $.trim($(this).val());
			if( lov_value !== ""){
				lovs.push(lov_value);
			}
		});		
		
		// the validation part need to be modified or removed based on which validation that
		// we are going to use. I mean jQuery validator or something like that.
		if(typeof hotelCode === 'undefined' || hotelCode === ""){ 
			alert('Please enter a valid hotel code');
			return false;
		}
		else if(typeof chainName === 'undefined' || chainName === ""){
			alert('Please enter a valid chain name');
			return false;
		}
		else{
			var webservice = new WebServiceInterface();
			var url = '#';
			
			if(typeof url === 'undefined' || url == "#" )
				return false;	
			
			var data = {};
			data.chain_name = chainName;
			data.hotel_code = hotelCode;
			data.program_name = programName;
			data.program_code = programCode;
			data.phoneT_C = phoneT_C;
			data.emailT_C = emailT_C;
			data.terms_and_condtn = terms_and_condtn;
			data.list_of_values = lovs;	
		
		    var options = {
					   successCallBack: that.fetchCompletedOfSaveNewApi,
					   requestParameters: data,
		    		   loader: 'normal',
			};
		    webservice.postJSON(url, options);				
		}		
	};
	this.fetchCompletedOfSaveNewApi = function(data){
		sntapp.notification.showSuccessMessage('Successfully updated');
		// update the view of listing the chain listing
		
	};	

};