var HotelChainsView = function(domRef){
	BaseInlineView.call(this);
	this.myDom = domRef;
	this.textOptionStart = 1;
	var that = this;
    this.fileContent = "";


	// page init function
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

	this.bindNewformEvents = function(){
		//Setup the input fields to display the file names
   	 	setupFile();
   	 	//bind the file change event
		$('#ca-cert').on('change', function(){
  			that.readCertificate(this, "certificate");
  		});
	};
	// text box clearing when value is null
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
	//on entering value in text box show next text box
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
	// set key up operations
	this.keyUpOperations = function(event){
		var element = $(event.target);
		if(element.hasClass('delete-option')){
			that.removeLOV(element);
		}
	};
	// function to update chain
	this.updateApi = function(event){
		var chainID = that.myDom.find("#edit-chain-details").attr("data_chain_id");
		var chainName = $.trim(that.myDom.find("#chain-name").val());
		var hotelCode = $.trim(that.myDom.find("#hotel-code").val());
		var programName = $.trim(that.myDom.find("#program-name").val());
		var programCode = $.trim(that.myDom.find("#program-code").val());
		var phoneT_C = $.trim(that.myDom.find("#phone").val()); //T_C : terms & conditions
		var emailT_C = $.trim(that.myDom.find("#email").val()); //T_C : terms & conditions
		var terms_and_condtn = $.trim(that.myDom.find("#terms_and_condtn").val());
		// sftp details
		var sftp_location = $.trim(that.myDom.find("#sftp-location").val());
		var sftp_port = $.trim(that.myDom.find("#sftp-port").val());
		var sftp_user = $.trim(that.myDom.find("#sftp-user").val());
		var sftp_password = $.trim(that.myDom.find("#sftp-password").val());
		var sftp_respath = $.trim(that.myDom.find("#sftp-respath").val());

		var lovs = new Array();
		// looping over list of values text boxes
		that.myDom.find('input[name=lov]').each(function(){
			var id = $(this).attr("data-id");
		    var name =  $.trim($(this).val());
		    dict = {'value': id, 'name': name};
			if( name !== ""){
				lovs.push(dict);
			}
		});

		var webservice = new WebServiceInterface();
		var url = '/admin/hotel_chains/'+chainID;

		if(typeof url === 'undefined' || url == "#" )
			return false;

		var data = {};
		data.value = chainID;
		data.name = chainName;
		data.hotel_code = hotelCode;
		data.loyalty_program_name = programName;
		data.loyalty_program_code = programCode;
		data.terms_cond_phone = phoneT_C;
		data.terms_cond_email = emailT_C;
		data.terms_cond = terms_and_condtn;
		data.lov = lovs;
		data.sftp_location = sftp_location;
		data.sftp_port = sftp_port;
		data.sftp_user = sftp_user;
		data.sftp_password = sftp_password;
		data.sftp_respath = sftp_respath;
		data.ca_certificate = that.fileContent;

	    var options = {
				   successCallBack: that.fetchCompletedOfSave,
				   failureCallBack: that.fetchFailedOfSave,
				   requestParameters: data,
	    		   loader: 'normal',
		};
	    webservice.putJSON(url, options);

	};


	// function to save new chain
	this.saveNewApi = function(){
		var chainName = $.trim(that.myDom.find("#chain-name").val());
		var hotelCode = $.trim(that.myDom.find("#hotel-code").val());
		var programName = $.trim(that.myDom.find("#program-name").val());
		var programCode = $.trim(that.myDom.find("#program-code").val());
		var phoneT_C = $.trim(that.myDom.find("#phone").val()); //T_C : terms & conditions
		var emailT_C = $.trim(that.myDom.find("#email").val()); //T_C : terms & conditions
		var terms_and_condtn = $.trim(that.myDom.find("#terms_and_condtn").val());
		// sftp details
		var sftp_location = $.trim(that.myDom.find("#sftp-location").val());
		var sftp_port = $.trim(that.myDom.find("#sftp-port").val());
		var sftp_user = $.trim(that.myDom.find("#sftp-user").val());
		var sftp_password = $.trim(that.myDom.find("#sftp-password").val());
		var sftp_respath = $.trim(that.myDom.find("#sftp-respath").val());

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

		var webservice = new WebServiceInterface();
		var url = '/admin/hotel_chains';

		if(typeof url === 'undefined' || url == "#" )
			return false;

		var data = {};
		data.name = chainName;
		data.hotel_code = hotelCode;
		data.loyalty_program_name = programName;
		data.loyalty_program_code = programCode;
		data.terms_cond_phone = phoneT_C;
		data.terms_cond_email = emailT_C;
		data.terms_cond = terms_and_condtn;
		data.lov = lovs;
		data.sftp_location = sftp_location;
		data.sftp_port = sftp_port;
		data.sftp_user = sftp_user;
		data.sftp_password = sftp_password;
		data.sftp_respath = sftp_respath;
	    var options = {
				   successCallBack: that.fetchCompletedOfSave,
				   failureCallBack: that.fetchFailedOfSave,
				   requestParameters: data,
	    		   loader: 'normal',
		};
	    webservice.postJSON(url, options);

	};
	// show success message on complete
	this.fetchCompletedOfSave = function(data){

		// update the view of listing the chain listing
		viewParams = {};
		var url = "/admin/hotel_chains";
		sntapp.fetchAndRenderView(url, that.myDom, {}, 'BLOCKER', viewParams, false);
	    sntapp.notification.showSuccessMessage('Successfully Saved');

	};
	//Handling failure
   this.fetchFailedOfSave = function(errorMessage){
	 sntapp.activityIndicator.hideActivityIndicator();
	 sntapp.notification.showErrorMessage("Error: " + errorMessage, that.myDom);
   };

   	this.readCertificate = function(input, type) {
        if (input.files && input.files[0]) {
          var reader = new FileReader();
          reader.onload = function(e) {
              that.fileContent = e.target.result;
        console.log(that.fileContent);

          };
          reader.readAsDataURL(input.files[0]);
        }

    };

};
