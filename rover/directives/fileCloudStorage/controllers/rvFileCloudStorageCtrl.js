sntRover.controller('rvFileCloudStorageCtrl', ['$scope', 'rvFileCloudStorageSrv',
	function($scope, rvFileCloudStorageSrv) {

		var newFileList = [];
		var fetchFiles = function() {
			rvFileCloudStorageSrv.fetchFiles({}).then(function(fileList) {
				_.each(fileList, function(file) {
					file.is_selected = false;
				});
				$scope.cardData.fileList = fileList;
				$scope.refreshScroller('card_file_list_scroller');
				// console.log(fileList)
			});
		};

		$scope.$on('FILE_UPLOADED', function(evt, file) {
			$scope.cardData.newFile = file;
			newFileList.push(file);
		});

		$scope.fileChange = function() {
			// File selection done
			var uploadedFileCount = 0;
			var fileUploadSuccess = function() {
				uploadedFileCount++;
				// when all files are uploaded, load new file list
				if (uploadedFileCount === newFileList.length) {
					newFileList = [];
					$scope.cardData.newFile = {};
					fetchFiles();
				}
			};

			_.each(newFileList, function(file) {
				rvFileCloudStorageSrv.uploadFile({
					"name": file.name
				}).then(fileUploadSuccess);
			});
		};

		$scope.markFileSelected = function(file) {
			file.is_selected = !file.is_selected;
		};

		var filterSelectedFilesList = function() {
			return _.filter($scope.cardData.fileList, function(file) {
				return file.is_selected;
			});
		};

		$scope.donwloadFiles = function() {
			var selectedFilesList = filterSelectedFilesList();

			_.each(selectedFilesList, function(file) {
				rvFileCloudStorageSrv.downLoadFile({
					id: file.id
				});
			});
		};

		$scope.deleteFiles = function() {
			var selectedFilesList = filterSelectedFilesList();

			_.each(selectedFilesList, function(file) {
				rvFileCloudStorageSrv.deleteFile({
					id: file.id
				}).then(fetchFiles);
			});
		};

		$scope.$on('FETCH_FILES', fetchFiles);

		(function() {
			$scope.cardData.fileList = [];
			$scope.cardData.newFile = {
				base64: '',
				name: '',
				size: '',
				type: ''
			};
			$scope.setScroller('card_file_list_scroller', {});
		})();
	}
]);