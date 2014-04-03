admin.controller('ADHotelLikesCtrl', ['$scope', '$state', 'ADHotelLikesSrv',
function($scope, $state, ADHotelLikesSrv) {

	BaseCtrl.call(this, $scope);
	$scope.likeList = {};
    $scope.likeData   = {};
    $scope.likeData.type = "textbox"

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
		$scope.likeData   = {};
         $scope.likeData.type = "textbox"
		$scope.isAddmode = true;
	};
	 /*
    * To handle switch
    */
	$scope.switchClicked = function(index){

		//on success

		$scope.likeListArray[index].is_active = ($scope.likeListArray[index].is_active ==='true') ? 'false':'true';
	}

	 /*
    * To fetch the template for chains details add/edit screens
    */
 	$scope.getAddNewTemplateUrl = function(){
 		return "/assets/partials/Likes/adNewLike.html";
 	};


 	$scope.addCancelCliked   = function(){

 		$scope.isAddmode = false;
 	}

 	$scope.addSaveCliked   = function(){

 		console.log($scope.likeData)

 		$scope.isAddmode = false;
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


	

}]);	