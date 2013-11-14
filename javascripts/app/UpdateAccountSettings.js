var UpdateAccountSettings = function() {

	BaseModal.call(this);
	var that = this;
	this.url = "admin/user/get_user_name_and_email";
	this.delegateEvents = function() {

		that.myDom.find('#save-changes').on('click', that.saveAccountSettings);
	};

	this.saveAccountSettings = function() {
		var changepwd = that.myDom.find($("#change-password")).val();
		var confirmpwd = that.myDom.find($("#confirm-password")).val();
		
		if(changepwd == "" || confirmpwd == "") {
			alert("Field cannot be empty.");
		} else if (changepwd != confirmpwd)  {
			alert("Password does not match.");
		} else {

			var data = {"new_password" : changepwd };
			$.ajax({
				
				type : "POST",
				url : "admin/user/change_password",
				data : data,

				success : function(data) {
					if (data.status == "success") {
						that.hide();
					}else if(data.status == "failure"){
						try{
							alert(data.errors[0]);
						}catch(e){
							console.log("There is an error!!");
							that.hide();
						}
						
					}
				},
				error : function() {
					console.log("There is an error!!");
				}
			});

		}
		

	};
};

