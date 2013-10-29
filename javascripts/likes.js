
var LikesView = function(domRef){
  
  BaseView.call(this);
  
  var that = this;
  this.myDom = domRef;
  console.log(domRef);
  var guest_id = $("#guest_id").val();
  this.$likeInfoChange = false;
  console.log("inside likes");
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
	   	 console.log("reached save likes");
	     if (this.$likeInfoChange) {
			var $totalPreferences = $("#totalpreference").val();
			$totalFeatures = $("#totalfeatures").val();
			jsonObj = {};
	
			jsonObj['user_id'] = $("#guest_id").val();
			jsonObj['preference'] = [];
			$preference = {};
			$preference["type"] = "NEWSPAPER";
			$preference["value"] = $('#newspaper').val();
			jsonObj['preference'].push($preference);
			$preference = {};
			$preference["type"] = "ROOMTYPE";
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
					$preference["type"] = "ROOMFEATURE";
					$preference["value"] = $('#feat_' + j).val();
					jsonObj['preference'].push($preference);
				}
			}
			console.log(JSON.stringify(jsonObj));
	
			var userId = $("#user_id").val();
			$.ajax({
				type : "POST",
				url : 'staff/guest_cards/' + userId + '/update_preferences',
				data : JSON.stringify(jsonObj),
				dataType : "json",
				success : function(data) {
					$likeInfoChange = false;
					console.log("Saved successfully");
				},
				error : function() {
					console.log("There is an error!!");
				}
			});
	
	   	
	     };
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


