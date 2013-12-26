var GuestCardFFPView = function(domRef) {
	BaseInlineView.call(this);
	this.myDom = domRef;
	var that = this;

	this.delegateEvents = function() {
		that.myDom.find($('#ffp')).tablesorter();
	};

	this.onOffClicked = function() {
		onOffSwitch();
	};

}; 