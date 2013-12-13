
var LikesView = function(domRef){
  
  BaseView.call(this);
  
  var that = this;
  this.myDom = domRef;
  var guest_id = $("#guest_id").val();
  this.$likeInfoChange = false;
  this.pageinit = function(){
  	
  this.handleLikeValueChanged();
  	
  	//refreshGuestCardScroll();
  	// These two bindings is not coming under domref
  	$('html').on('click', that.callSaveLikes);    
  	$('#guest-contact, #guest-credit, #guest-loyalty').on('click', that.handleTabClick);      
  };
  
  this.handleTabClick = function(e) {  		  
		if (that.$likeInfoChange) {
			that.saveLikes();
		} 
   };
  
  this.callSaveLikes = function(e) {  	   
		if (!$(e.target).is("#guest-card-content *", "#guest-card-content")){
			 if (that.$likeInfoChange) {
				that.saveLikes();
			};
		};
   };    
  
   this.saveLikes = function(event){
	     if (this.$likeInfoChange) {
			var $totalPreferences = $("#totalpreference").val();
			$totalFeatures = $("#totalfeatures").val();
			jsonObj = {};
	
			jsonObj['guest_id'] = $("#guest_id").val();
			jsonObj['preference'] = [];
			$preference = {};
			$preference["type"] = "NEWSPAPER";
			$preference["value"] = $('#newspaper').val();
			jsonObj['preference'].push($preference);
			$preference = {};
			$preference["type"] = "ROOM TYPE";
			$preference["value"] = $('#roomtype').val();
			jsonObj['preference'].push($preference);
			for ( i = 0; i < $totalPreferences; i++) {
				$preference = {};
				$preference["type"] = $("#pref_" + i).attr('prefname');
				$preference["value"] = $('input[name="pref_' + i + '"]:checked').val();
				jsonObj['preference'].push($preference);
			}
	
			for ( j = 0; j < $totalFeatures; j++) {
				$feature = {};
				if ($('#feat_' + j).is(':checked')) {
					$preference = {};
					$preference["type"] = "ROOM FEATURE";
					$preference["value"] = $('#feat_' + j).val();
					jsonObj['preference'].push($preference);
				}
			}
	
			var userId = $("#user_id").val();
			// $.ajax({
				// type : "POST",
				// url : 'staff/guest_cards/' + userId + '/update_preferences',
				// data : JSON.stringify(jsonObj),
				// dataType : "json",
				// success : function(data) {
					// that.$likeInfoChange = false;
				// },
				// error : function() {
				// }
			// });
			var url = 'staff/guest_cards/' + userId + '/update_preferences';
		    var webservice = new WebServiceInterface();
			var options = {
				   requestParameters: JSON.stringify(jsonObj),
				   successCallBack: that.fetchCompletedOfSaveLikes,
				   loader: 'NORMAL',
		    };
		    webservice.postJSON(url, options);
			
	   	
	     };
   };
   this.fetchCompletedOfSaveLikes = function(data){
   		if(data.status == 'success'){
   			that.$likeInfoChange = false;
   			sntapp.notification.showSuccessMessage("Successfully Saved.", that.myDom); 
   		}else{
   			sntapp.notification.showErrorList(data.errors, that.myDom); 
   		}
   };
   this.handleLikeValueChanged = function(event){  	   
	  
		
		that.myDom.find($('#newspaper,#roomtype')).on('change', function(event) {				
			   that.$likeInfoChange = true;
	    });		
	
		var $totalPreferences = $("#totalpreference").val();
		$totalFeatures = $("#totalfeatures").val();
		for ( i = 0; i < $totalPreferences; i++) {
			
			that.myDom.find($('#pref_'+i)).on('change', function(event) {
				that.$likeInfoChange = true;				
			});		
			
		}
		for ( j = 0; j < $totalFeatures; j++) {
			that.myDom.find($('#feat_'+j)).on('change click', function(event) {
				that.$likeInfoChange = true;				
			});				
		}
   };

};


