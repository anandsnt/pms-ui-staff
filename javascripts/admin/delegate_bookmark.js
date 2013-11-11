var DelegateBookMark = function(){
	var that = this;
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
			error : function() {	
			  $("#components_"+bookMarkId).removeClass("moved ui-draggable-disabled ui-state-disabled");
			}
		});
	};
	
};