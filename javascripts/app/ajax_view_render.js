var AjaxRender = function(url, domElem, viewName){
    var that = this;
    this.url = url;
    this.viewName = viewName;
    this.domElem = domElem;
    this.newView = "";
	this.params = function(){

	}
	this.start = function(){
		//var confirmNum = $('#guest-card #reservation_id').val();
        $.ajax({
            type: "GET",
            data:that.params,
            url: that.url,
            async: false,
            success: function(data) {    
                that.domElem.html(data);
                that.newView = new window[that.viewName]($(that.domElem));
                that.newView.pageinit();
            },
            error: function(){
            }
       });
	}
}