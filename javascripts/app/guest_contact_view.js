var GuestContactView = function(domRef){
	BaseView.call(this);
  	var that = this;
  	this.myDom = domRef;
    this.$guestCardClickTime = false;
    this.$contactInfoChange  = false;
	this.pageinit = function(){
       setTimeout(function() {
			that.renderContactInformation();
		}, 700);
		$('#guest-like, #guest-credit, #guest-loyalty').on('click', that.saveContactInfo);
		$('html').on('click', that.callSave);
	};
	this.callSave = function(e){
		if (!$(e.target).is("#guest-card-content *", "#guest-card-content")){
			if (that.$contactInfoChange) {
				that.saveContactInfo();
			} 			
		}
	};
	this.saveContactInfo = function(){
		if(that.$contactInfoChange){
			var userId = $("#user_id").val();
			$contactJsonObj = {};
			$contactJsonObj['guest_id'] = that.myDom.find("#guest_id").val();
			$contactJsonObj['first_name'] = that.myDom.find("#guest_firstname").val();
			$contactJsonObj['last_name'] = that.myDom.find("#guest_lastname").val();
			
			$contactJsonObj['works_at'] = that.myDom.find("#works-at").val();
			$contactJsonObj['job_title'] = that.myDom.find("#job-title").val();
			
			$contactJsonObj['title'] = that.myDom.find("#title").val();
			$contactJsonObj['birthday'] = that.myDom.find("#guest-birthday").val();
			$contactJsonObj['passport_no'] = that.myDom.find("#passport-number").val();
			if(that.myDom.find("#passport-month").val()!="" && that.myDom.find("#passport-year").val()!="")
				$contactJsonObj['passport_expiry'] = "01-"+that.myDom.find("#passport-month").val()+"-"+"20"+that.myDom.find("#passport-year").val();
			$contactJsonObj['language'] = that.myDom.find("#language").val();
			$contactJsonObj['nationality'] = that.myDom.find("#nationality_status").val();
			$contactJsonObj['street'] = that.myDom.find("#streetname").val();
			$contactJsonObj['city'] = that.myDom.find("#city").val();
			$contactJsonObj['state'] = that.myDom.find("#state").val();
			$contactJsonObj['postal_code'] = that.myDom.find("#postalcode").val();
			$contactJsonObj['country'] = that.myDom.find("#country").val();
			$contactJsonObj['phone'] = that.myDom.find("#phone").val();
			$contactJsonObj['email'] = that.myDom.find("#email").val();
			$contactJsonObj['mobile'] = that.myDom.find("#mobile").val();
		
			console.log(JSON.stringify($contactJsonObj));
			$.ajax({
				type : "PUT",
				url : 'staff/guest_cards/' + userId,
				data : JSON.stringify($contactJsonObj),
		
				async : false,
				dataType : 'json',
				contentType : 'application/json',
		
				success : function() {
					that.$contactInfoChange = false;
					// Update guest card header UI.
					$("#gc-firstname").val($("#guest_firstname").val());
					$("#gc-lastname").val($("#guest_lastname").val());
					$("#gc-location").val($("#city").val()+","+$("#state").val());
					$("#gc-phone").val($("#phone").val());
					$("#gc-email").val($("#email").val());
					
				},
				error : function() {
					console.log("There is an error!!");
				}
			});
		}
	};
	this.renderContactInformation = function(){
		$reservation_id = $("#reservation_id").val();
			$.ajax({
				type : "GET",
				url : 'staff/guestcard/show.json',
				data : {
					fakeDataToAvoidCache : new Date(),
					id : $reservation_id
				}, // fakeDataToAvoidCache is iOS Safari fix
				async : false,
				success : function(data) {
					if(data.birthday!=null){
						birthdate = data.birthday.split('-');
						birthday = birthdate[1]+"-"+birthdate[2]+"-"+birthdate[0].substring(2);
						that.myDom.find("#guest-birthday").val(birthday);
					}
					if(data.passport_expiry!=null){
						passport_expiry = data.passport_expiry.split('-');
						that.myDom.find("#passport-month").val(passport_expiry[1]);						
						that.myDom.find("#passport-year").val(passport_expiry[0].substring(2));
					}
					that.myDom.find("#guest_firstname").val(data.first_name);
					that.myDom.find("#guest_lastname").val(data.last_name);
					that.myDom.find("#works-at").val(data.works_at);
					that.myDom.find("#job-title").val(data.job_title);
					that.myDom.find("#title").val(data.title);
					that.myDom.find("#language").val(data.language);						

					that.myDom.find("#nationality_status").val(data.nationality);						
					that.myDom.find("#passport-number").val(data.passport_number);					
					that.myDom.find("#nationality").val(data.nationality);
					that.myDom.find("#email").val(data.email_address);
					that.myDom.find("#streetname").val(data.address);
					that.myDom.find("#city").val(data.city);
					that.myDom.find("#postalcode").val(data.postal_code);
					that.myDom.find("#state").val(data.state);
					that.myDom.find("#country").val(data.country);
					that.myDom.find("#phone").val(data.phone);
					that.myDom.find("#mobile").val(data.mobile);

					$guestCardClickTime = false;
					$(document).on('click change', '#countries_status, #guest_nationality_div #nationality_status, #language', function(){
						that.$contactInfoChange = true;
					});
					// to change flag - to save contact info only if any change happens.
					$(document).on('change', '#guest_firstname, #guest_lastname, #works-at, #job-title, #title, #language, #guest-birthday, #passport-number,#passport-month, #passport-year, #nationality,#guest_nationality_div #nationality_status, #email, #streetname, #city, #postalcode, #state, #country, #phone, #mobile', function(event) {
						that.$contactInfoChange = true;
					});

				},
				error : function() {
					console.log("There is an error!!");
					$guestCardClickTime = true;
				}
			}).done(function() {
				$('#loading').remove();
				var guest_id = $("#guest_id").val();			    

				var viewParams = {"user_id" : $("#user_id").val()};
				sntapp.fetchAndRenderView('staff/preferences/likes', $("#likes"), viewParams);

				sntapp.fetchAndRenderView('staff/payments/payment', $("#cc-payment"), viewParams);
				var reservation_id = getReservationId();
				viewParams = {"reservation_id" : reservation_id};
				sntapp.fetchAndRenderView('staff/user_memberships', $("#loyalty"), viewParams);
				setTimeout(function() {
					refreshGuestCardScroll();
				}, 300);

 				
			});
	};
	this.dateSplit = function(dateToSplit){
		var splitDate = dateToSplit.split('-');
		var returnData = new Array();
		returnData['year'] = splitDate[0];
		returnData['month'] = splitDate[1];
		returnData['day'] = splitDate[2];
		return returnData;
	};
	
};

