sntRover.controller('rvFileCloudStorageCtrl', ['$scope', 'rvFileCloudStorageSrv', '$timeout', 'sntActivity', '$filter',
	function($scope, rvFileCloudStorageSrv, $timeout, sntActivity, $filter) {

		$scope.cardData.fileList = [];
		$scope.cardData.selectedFileList = [];
		var newFileList = [];
		var fetchFiles = function() {
			$scope.errorMessage = '';
			sntActivity.start('FETCH_FILES');
			rvFileCloudStorageSrv.fetchFiles({
				card_id: $scope.cardId
			}).then(function(fileList) {
				sntActivity.stop('FETCH_FILES');
				$scope.cardData.fileTypes = [];
				_.each(fileList, function(file) {
					var indexOffileInSelectedList = _.findIndex($scope.cardData.selectedFileList, function(selectedFile) {
						return selectedFile.id === file.id;
					});

					file.is_selected = indexOffileInSelectedList !== -1;
					file.content_type = file.content_type ? file.content_type.split("/")[1] : '';

					$scope.cardData.fileTypes = _.union($scope.cardData.fileTypes, [file.content_type]);
				});
				$scope.cardData.fileList = fileList;
				$scope.refreshScroller('card_file_list_scroller');
				$scope.cardData.firstFileFetch = false;
			},
			function(){
				sntActivity.stop('FETCH_FILES');
				$scope.errorMessage = [$filter('translate')('FILE_FETCHING_FAILED')];
			});
		};

		$scope.$on('FILE_UPLOADED', function(evt, file) {
			var newFile = {
				"file_name": file.name,
				"content_type": file.type,
				"base64_data": file.base64 ? file.base64.split(";base64,")[1] : '',
				"card_id": $scope.cardId,
				"card_type": "guest_card"
			};

			$scope.cardData.newFile = file;
			newFileList.push(newFile);
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
				return file.content_type === fileType;
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
					sntActivity.stop('UPLOADING_FILES');
					newFileList = [];
					$scope.cardData.newFile = {};
					fetchFiles();
				}
			};
			sntActivity.start('UPLOADING_FILES');
			$scope.errorMessage = '';
			_.each(newFileList, function(file) {
				rvFileCloudStorageSrv.uploadFile(file).
				then(fileUploadSuccess,
					function() {
						sntActivity.stop('UPLOADING_FILES');
						$scope.errorMessage = [$filter('translate')('FILE_UPLOADING_FAILED')];
					});
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
			sntActivity.start('DELETING_FILES');
			var deletedFilesCount = 0;
			var fileDeletionSuccess = function() {
				deletedFilesCount++;
				// when all files are uploaded, load new file list
				if (deletedFilesCount === $scope.cardData.selectedFileList.length) {
					sntActivity.stop('DELETING_FILES');
					$scope.cardData.selectedFileList = [];
					fetchFiles();
				}
			};
			_.each($scope.cardData.selectedFileList, function(file) {
				rvFileCloudStorageSrv.deleteFile({
					id: file.id
				}).then(fileDeletionSuccess,
				function(){
					sntActivity.stop('DELETING_FILES');
					$scope.errorMessage = [$filter('translate')('FILE_DELETION_FAILED')];
				});
			});
		};

		$scope.$on('FETCH_FILES', function() {
			$scope.setScroller('card_file_list_scroller', {});
			$scope.cardData.firstFileFetch = true;
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