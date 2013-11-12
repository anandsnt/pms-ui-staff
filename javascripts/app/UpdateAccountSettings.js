var UpdateAccountSettings = function() {

	BaseModal.call(this);
	var that = this;
	this.url = "ui/updateAccountSettings";
	this.delegateEvents = function() {

		that.myDom.find('#modal-overlay, #modal-close, #cancel').on('click', that.hide);
		that.myDom.find('#save-changes').on('click', that.saveAccountSettings);
	};

	this.modalInit = function() {
		console.log("modal init in sub modal");
	};

	this.saveAccountSettings = function() {
		var changepwd = $("#change-password").val();
		var confirmpwd = $("#confirm-password").val();
		
		if (changepwd != confirmpwd) {
			alert("Password does not match.");
		} else if (changepwd == "" || confirmpwd == "") {
			alert("Field cannot be empty.");
		} else {

			var data = {"new_password" : changepwd };

			$.ajax({
				
				type : "POST",
				url : "admin/user/change_password",
				data : data,

				success : function(data) {
					if (data.status == "success") {
					console.log("success");
					that.hide();
					}
				},
				error : function() {
					console.log("There is an error!!");
				}
			});

		}
		

	}
}

