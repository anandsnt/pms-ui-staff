var TestView = function(viewDom){
  BaseView.call(this);
  var that = this;
  this.myDom = viewDom;
  this.pageinit = function(){
  	console.log("Page Init inside testview");
  }
}