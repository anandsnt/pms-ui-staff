admin.controller('ADHotelLikesCtrl', ['$scope', '$state', 'ADHotelLikesSrv',
    function($scope, $state, ADHotelLikesSrv) {

       BaseCtrl.call(this, $scope);
       $scope.likeList = {};
       $scope.likeData   = {};
       $scope.likeData.type = "textbox"
       $scope.isAddmode = false;
       $scope.isEditmode = false;
       $scope.currentClickedElement = -1;

		/**
	 * To fetch upsell details
	 *
	 */
    $scope.fetchHotelLikes = function() {
      var fetchHotelLikesSuccessCallback = function(data) {
         $scope.$emit('hideLoader');
         $scope.likeList = data;
     };
     $scope.invokeApi(ADHotelLikesSrv.fetch, {}, fetchHotelLikesSuccessCallback);
 };

 $scope.fetchHotelLikes();

	/*
   * To render add screen
   */
   $scope.addNew = function(){

      $scope.likeTitle  ="Add New";
      $scope.likeSubtitle ="Like category";
      $scope.likeData   = {};
      $scope.likeData.type = "textbox"
      $scope.likeData.options =[{'name':''}];
      $scope.isAddmode = true;
  };
	 /*
    * To handle switch
    */
    $scope.switchClicked = function(index){

		//on success
       var toggleSwitchLikesSuccessCallback = function(data) {
        $scope.$emit('hideLoader');
        $scope.fetchHotelLikes();

    };
    $scope.likeList.likes[index].is_active = ($scope.likeList.likes[index].is_active ==='true') ? 'false':'true';
    var data = {'id' : $scope.likeList.likes[index].id,'set_active' : $scope.likeList.likes[index].is_active}
    $scope.invokeApi(ADHotelLikesSrv.toggleSwitch,data, toggleSwitchLikesSuccessCallback);



}

	 /*
    * To fetch the template for chains details add/edit screens
    */
    $scope.getTemplateUrl = function(rowName){

        if(rowName === "ROOM FEATURE")
            return "/assets/partials/Likes/adRoomFeatureEdit.html";

        else if(rowName === "NEWSPAPER")
            return "/assets/partials/Likes/adNewsPaperEdit.html";
        else            
           return "/assets/partials/Likes/adNewLike.html";
   };



   $scope.checkBoxClicked = function(index){


        $scope.likeData.news_papers[index].is_checked = ($scope.likeData.news_papers[index].is_checked === 'true') ? 'false' :'true';
      
   }

   $scope.checkBoxDeleteClicked = function(index){


      $scope.likeData.news_papers.splice(index,1);
    
   }
     /*
   * To render edit screen
   * @param {int} index index of selected chain
   * @paran {string} id - chain id
   */
   $scope.editSelected = function(index,id,rowName,isSystemDefined)    {

      
      $scope.currentClickedElement = index;
  
    if(isSystemDefined === 'true'){
       $scope.isEditmode = false;
   }
 
   else{

      $scope.showNewsPaperOption = false;
      $scope.showNewRoomOption = false;

       $scope.isEditmode = true;

       $scope.editId = id;
       if(rowName === "ROOM FEATURE")
        editID = 1;
      if(rowName === "NEWSPAPER")
        editID = 5;
       var editID = { 'editID' : id };
       var editLikeSuccessCallback = function(data) {
        $scope.$emit('hideLoader');
        $scope.likeData = data;
        $scope.isEditmode = true;
        $scope.likeTitle  ="Edit";
        $scope.likeSubtitle =$scope.likeData.name;
    };      
    $scope.invokeApi(ADHotelLikesSrv.edit,editID,editLikeSuccessCallback);
}
};


$scope.showNewNewsPaperOption = function(){
    $scope.showNewsPaperOption = true;
}

$scope.shownewInputRoomOption = function(){
    $scope.showNewRoomOption = true;
}

$scope.$watch('likeData.type',function(){

    if($scope.likeData.type === "textbox"){
       $scope.showTextBox = true;
       $scope.showRadio = false;
       $scope.showDropDown = false;
       $scope.showCheckbox = false;
   }
   else if ($scope.likeData.type ==="radio"){
       $scope.showRadio = true;
       $scope.showTextBox = false
       $scope.showDropDown = false;
       $scope.showCheckbox = false;

       $scope.likeData.options =[{'name':''},{'name':''}];

   }
   else if ($scope.likeData.type === "dropdown"){
       $scope.showDropDown = true;
       $scope.showTextBox = false
       $scope.showRadio = false;
       $scope.showCheckbox = false;
   }
   else{
       $scope.showCheckbox = true;
       $scope.showTextBox = false
       $scope.showRadio = false;
       $scope.showDropDown = false;

   }
});

     /*
    * To handle focus event on lov levels
    */
    $scope.onFocus = function(index){
        if((index === $scope.likeData.options.length-1) || ($scope.likeData.options.length==1)){
            $scope.newOptionAvailable = true;
            // exclude first two fields
            if($scope.likeData.options.length > 2){
                angular.forEach($scope.likeData.options,function(item, index) {
                    if (item.name == "" && index < $scope.likeData.options.length-1 ) {
                        $scope.newOptionAvailable = false;
                    }
                });
            }
            if($scope.newOptionAvailable)
                $scope.likeData.options.push({'name':''});
        }
    };
   /*
    * To handle text change on lov levels
    */
    $scope.textChanged = function(index){

        if($scope.likeData.options.length>1){
            if($scope.likeData.options[index].name == "")
                $scope.likeData.options.splice(index, 1);
        }
    };
   /*
    * To handle blur event on lov levels
    */
    $scope.onBlur = function(index){
        if($scope.likeData.options.length>1){
            if($scope.likeData.options[index].name == "")
                $scope.likeData.options.splice(index, 1);
            angular.forEach($scope.likeData.options,function(item, i) {
                if (item.name == "" && i != $scope.likeData.options.length-1) {
                 $scope.likeData.options.splice(i, 1);
             }
         });
        }
    };


    $scope.cancelCliked   = function(){

        $scope.isAddmode = false;
        $scope.isEditmode = false;
    }

    $scope.addSaveCliked   = function(){

        console.log($scope.likeData)

        angular.forEach($scope.likeData.options,function(item, index) {
            if (item.name == "") {
             $scope.likeData.options.splice(index, 1);
         }

     });


        var newLikesSuccessCallback = function(data) {
            $scope.$emit('hideLoader');
            $scope.likeList = data;
            $scope.isAddmode = false;
            $scope.fetchHotelLikes();

        };
        $scope.invokeApi(ADHotelLikesSrv.addEditNewFeature, $scope.likeData, newLikesSuccessCallback);
        


    }




}]);	