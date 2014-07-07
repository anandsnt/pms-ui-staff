var DelegateBookMark = function(){
	var that = this;
	// To add book marks
	this.addBookMark = function(bookMarkId){
		$.ajax({
			type : "POST",
			url : '/admin/user_admin_bookmark',
			data : {id:bookMarkId},
			dataType : 'json',
			success : function(data) {
				if (data.status == "success") {

				}
			},
			error : function(jqxhr, status, error){
				//Show ows connectivity error popup
				if (jqxhr.status=="520") {
				    sntapp.activityIndicator.hideActivityIndicator();
				    sntapp.showOWSErrorPopup();
				    return;
				}
            	//checking whether a user is logged in
            	if (jqxhr.status == "401") { sntapp.logout(); return;}
            	if (jqxhr.status=="501" || jqxhr.status=="502" || jqxhr.status=="503") {
            	    location.href = XHR_STATUS.INTERNAL_SERVER_ERROR;
            	    return;
            	}

            	if(jqxhr.status=="404"){
            	    location.href = XHR_STATUS.SERVER_DOWN;
            	    return;
            	}

			  $("#components_"+bookMarkId).removeClass("moved ui-draggable-disabled ui-state-disabled");
			}
		});
	};
	// To remove book marks
	this.removeBookMark = function(bookMarkId){
		$.ajax({
			type : "DELETE",
			url : ' /admin/user_admin_bookmark/'+bookMarkId,
			dataType : 'json',
			success : function(data) {
				if (data.status == "success") {

				}
			},
			error : function(jqxhr, status, error){
				//Show ows connectivity error popup
				if (jqxhr.status=="520") {
				    sntapp.activityIndicator.hideActivityIndicator();
				    sntapp.showOWSErrorPopup();
				    return;
				}
            	//checking whether a user is logged in
            	if (jqxhr.status == "401") { sntapp.logout(); return;}
            	if (jqxhr.status=="501" || jqxhr.status=="502" || jqxhr.status=="503") {
            	    location.href = XHR_STATUS.INTERNAL_SERVER_ERROR;
            	    return;
            	}

            	if(jqxhr.status=="404"){
            	    location.href = XHR_STATUS.SERVER_DOWN;
            	    return;
            	}

			}
		});
	};

};
