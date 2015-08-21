
sntRover.controller('RVLikesController', ['$scope', 'RVLikesSrv', 'dateFilter', '$stateParams',
	function($scope, RVLikesSrv, dateFilter, $stateParams) {


		$scope.errorMessage = "";
		$scope.guestCardData.likes = {};
		$scope.guestLikesData = {};
		$scope.setScroller('likes_info');
		$scope.calculatedHeight = 274; //height of Preferences + News paper + Room type + error message div
		var presentLikeInfo  = {};
		var updateData = {};
		$scope.$on('clearNotifications', function() {
			$scope.errorMessage = "";
			$scope.successMessage = "";
		});

		$scope.init = function() {
			BaseCtrl.call(this, $scope);
			var fetchLikesFailureCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = data;
			};
			var data = {
				'userId': $scope.guestCardData.contactInfo.user_id,
				'isRefresh': $stateParams.isrefresh || 'true'
			};
			$scope.invokeApi(RVLikesSrv.fetchLikes, data, $scope.fetchLikesSuccessCallback, fetchLikesFailureCallback, 'NONE');
		};
		$scope.fetchLikesSuccessCallback = function(data) {

			$scope.$emit('hideLoader');

			$scope.guestLikesData = data;

			angular.forEach($scope.guestLikesData.preferences, function(eachPref, key) {
				$scope.calculatedHeight += 34;
				var rowCount = 0;
				angular.forEach(eachPref.values, function(prefValue, prefKey) {
					rowCount++;
					if (rowCount % 2 !== 0) {
						$scope.calculatedHeight += 50;
					}
					var userPreference = $scope.guestLikesData.user_preference;
					if (userPreference.indexOf(prefValue.id) !== -1) {
						prefValue.isChecked = true;
						eachPref.isChecked = true;
					} else {
						prefValue.isChecked = false;
						eachPref.isChecked = false;
					}
				});
			});

			var rowCount = 0;
			angular.forEach($scope.guestLikesData.room_features, function(value, key) {

				angular.forEach(value.values, function(roomFeatureValue, roomFeatureKey) {
					rowCount++;
					if (rowCount > 6 && $scope.guestLikesData.preferences.length <= 2) {
						$scope.calculatedHeight += 50;
					}
					var userRoomFeature = value.user_selection;
					if (userRoomFeature.indexOf(roomFeatureValue.id) !== -1) {
						roomFeatureValue.isSelected = true;
					} else {
						roomFeatureValue.isSelected = false;
					}

				});

			});
			$scope.guestCardData.likes = $scope.guestLikesData;



			setTimeout(function(){
				$scope.refreshScroller('likes_info');
			}, 1000);


		};

		$scope.$on('SHOWGUESTLIKESINFO', function() {
			$scope.init();
		});

		$scope.$on('REFRESHLIKESSCROLL', function() {
			$scope.refreshScroller('likes_info');
		});
		$scope.$on("$viewContentLoaded", function() {
			$scope.refreshScroller('likes_info');
		});

		$scope.saveLikes = function() {

			var saveUserInfoSuccessCallback = function(data) {
				$scope.$emit('hideLoader');
			};
			var saveUserInfoFailureCallback = function(data) {
				$scope.$emit('hideLoader');
				$scope.errorMessage = data;
				$scope.$emit('likesInfoError', true);
			};
			 presentLikeInfo = JSON.parse(JSON.stringify(updateData));

			updateData.guest_id = $scope.guestCardData.contactInfo.guest_id;
			updateData.preference = [];
			angular.forEach($scope.guestLikesData.newspapers, function(value, key) {
				var newsPaperUpdateData = {};
				if (value.id === $scope.guestLikesData.user_newspaper) {
					newsPaperUpdateData.type = "NEWSPAPER";
					newsPaperUpdateData.value = value.name;
					updateData.preference.push(newsPaperUpdateData);
				}
			});
			angular.forEach($scope.guestLikesData.roomtype, function(value, key) {
				var roomTypeUpdateData = {};
				if (value.id === $scope.guestLikesData.user_roomtype) {
					roomTypeUpdateData.type = "ROOM TYPE";
					roomTypeUpdateData.value = value.name;
					updateData.preference.push(roomTypeUpdateData);
				}
			});

			angular.forEach($scope.guestLikesData.room_features, function(value, key) {
				angular.forEach(value.values, function(roomFeatureValue, roomFeatureKey) {
					var roomFeatureUpdateData = {};
					if (roomFeatureValue.isSelected) {
						roomFeatureUpdateData.type = "ROOM FEATURE";
						roomFeatureUpdateData.value = roomFeatureValue.details;
						updateData.preference.push(roomFeatureUpdateData);
					}

				});
			});
			angular.forEach($scope.guestLikesData.preferences, function(value, key) {
				var preferenceUpdateData = {};
				angular.forEach(value.values, function(prefValue, prefKey) {

					if (prefValue.isChecked) {
						preferenceUpdateData.type = value.name;
						preferenceUpdateData.value = prefValue.details;
					}
				});
				updateData.preference.push(preferenceUpdateData);
			});

			var dataToUpdate = JSON.parse(JSON.stringify(updateData));
		    var dataUpdated = (angular.equals(dataToUpdate, presentLikeInfo))?true:false;

			var saveData = {
				userId: $scope.guestCardData.contactInfo.user_id,
				data: updateData
			};

			if (typeof $scope.guestCardData.contactInfo.user_id !== "undefined" && $scope.guestCardData.contactInfo.user_id !== null && $scope.guestCardData.contactInfo.user_id !== "" && !dataUpdated) {
				$scope.invokeApi(RVLikesSrv.saveLikes, saveData, saveUserInfoSuccessCallback, saveUserInfoFailureCallback);
			}
		};


		/**
		 * to handle click actins outside this tab
		 */
		$scope.$on('SAVELIKES', function() {
			$scope.saveLikes();
		});

		$scope.changedPreference = function(parentIndex, index) {
			angular.forEach($scope.guestLikesData.preferences[parentIndex].values, function(value, key) {
				if (key !== index) {
					value.isChecked = false;
				}
			});
		};

		$scope.getHalfArray = function(ar) {
			//TODO: Cross check math.ceil for all browsers
			var out = new Array(Math.ceil(ar.length / 2));
			return out;
		};
		/*
		 * If number of elements in odd, then show if value exists
		 */
		$scope.showLabel = function(featureName) {
			var showDiv = true;
			if (featureName === '' || featureName === undefined) {
				showDiv = false;
			}
			return showDiv;

		};


		$scope.getHalfArrayPref = function(ar) {
			//TODO: Cross check math.ceil for all browsers
			var out = new Array(Math.ceil(ar.length / 2));
			return out;
		};
		$scope.shouldShowRoomFeatures = function(roomFeatures) {
			var showRoomFeature = false;
			angular.forEach(roomFeatures, function(value, key) {
				if (value.values.length > 0) {
					showRoomFeature = true;
				}
			});
			return showRoomFeature;
		};


	}
]);
