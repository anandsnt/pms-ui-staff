sntRover.controller('rvFileCloudStorageCtrl', ['$scope', 'rvFileCloudStorageSrv',
	function($scope, rvFileCloudStorageSrv) {

		var fetchFiles = function() {
			rvFileCloudStorageSrv.fetchFileAttachments({}).then(function(fileList) {
					_.each(fileList, function(file) {
						file.is_selected = false;
					});
					$scope.cardData.fileList = fileList;
					console.log(fileList)
				},
				function(errorMessage) {

				});
		};

		$scope.$on('FILE_UPLOADED', function(evt, file) {
			$scope.cardData.newFile = file;
			$scope.cardData.newFileList.push(file);
			console.log($scope.cardData.newFileList);
		});

		$scope.fileChange = function() {
			// File selection done
			console.log($scope.cardData.newFile);
		};

		$scope.$on('FETCH_FILES', fetchFiles);

		(function() {
			$scope.cardData.fileList = [];
			$scope.cardData.newFileList = [];
			$scope.cardData.newFile = {
				base64: '',
				name: '',
				size: '',
				type: ''
			};
		})();
	}
]);