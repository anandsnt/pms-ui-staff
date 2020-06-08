sntRover.controller('rvFileCloudStorageCtrl', ['$scope', 'rvFileCloudStorageSrv', '$timeout',
	function($scope, rvFileCloudStorageSrv, $timeout) {

		$scope.cardData.fileList = [];
		$scope.cardData.selectedFileList = [];
		var newFileList = [];
		var fetchFiles = function() {
			rvFileCloudStorageSrv.fetchFiles({}).then(function(fileList) {
				_.each(fileList, function(file) {
					var indexOffileInSelectedList = _.findIndex($scope.cardData.selectedFileList, function(selectedFile) {
						return selectedFile.id === file.id;
					});

					file.is_selected = indexOffileInSelectedList !== -1;
					$scope.cardData.fileTypes = _.union($scope.cardData.fileTypes, [file.type]);
				});
				$scope.cardData.fileList = fileList;
				$scope.refreshScroller('card_file_list_scroller');
			});
		};

		$scope.$on('FILE_UPLOADED', function(evt, file) {
			$scope.cardData.newFile = file;
			newFileList.push(file);
			$timeout(function() {
				$scope.cardData.dragInProgress = false;
			}, 100);
		});

		$scope.fileSelectionChanged = function() {
			$scope.cardData.selectedFileList = _.filter($scope.cardData.fileList, function(file) {
				return file.is_selected;
			});
		};

		$scope.cancelFileSelection = function() {
			_.each($scope.cardData.fileList, function(file) {
				file.is_selected = false;
			});
			$scope.fileSelectionChanged();
		};

		$scope.getFileCount = function(fileType) {
			var filesOfFileType = _.filter($scope.cardData.fileList, function(file) {
				return file.type === fileType;
			});

			return filesOfFileType.length;
		};

		$scope.filterChanged = function() {
			$scope.refreshScroller('card_file_list_scroller');
		};

		$scope.fileUploadCompleted = function() {
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

		$scope.$on('FILE_UPLOADED_DONE', $scope.fileUploadCompleted);

		$scope.donwloadFiles = function() {

			_.each($scope.cardData.selectedFileList, function(file) {
				rvFileCloudStorageSrv.downLoadFile({
					id: file.id
				});
			});
		};

		$scope.deleteFiles = function() {
			_.each($scope.cardData.selectedFileList, function(file) {
				rvFileCloudStorageSrv.deleteFile({
					id: file.id
				}).then(fetchFiles);
			});
		};

		$scope.$on('FETCH_FILES', function() {
			$scope.setScroller('card_file_list_scroller', {});
			fetchFiles();
		});

		$scope.sortFiles = function(file) {
			var dateString = file.updated_date + ' ' + file.updated_time;
			var date = moment(dateString, 'MM-DD-YYYY hh:mm A');

			return date;
		};

		(function() {
			$scope.cardData.newFile = {
				base64: '',
				name: '',
				size: '',
				type: ''
			};
			$scope.cardData.hasFilePersmissions = true;
			$scope.cardData.sort_files_by = 'NEWLY_ADDED';
			$scope.cardData.group_files_by = 'UNGROUPED';
			$scope.cardData.searchText = '';
			$scope.cardData.dragInProgress = false;
		})();
	}
]);