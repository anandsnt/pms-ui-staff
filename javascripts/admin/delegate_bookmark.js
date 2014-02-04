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
            	//checking whether a user is logged in
            	if (jqxhr.status == "401") { sntapp.logout(); return;}

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
            	//checking whether a user is logged in
            	if (jqxhr.status == "401") { sntapp.logout(); return;}
			  
			}
		});
	};
	
};