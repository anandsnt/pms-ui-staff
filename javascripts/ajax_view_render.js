var AjaxRender = function(url, domElem, view){
	this.url = url;
	this.domElem = domElem;
	this.params = function(){

	}
	this.start = function(){
		$.ajax({
			type: "GET",
            url: that.url,
            async: false,
            success: function(data) {    
            	that.domElem.html(data);
            },
            error: function(){
                console.log("There is an error!!");
            }
       });
	}
}