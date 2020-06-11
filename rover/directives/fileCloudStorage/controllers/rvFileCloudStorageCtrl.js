sntRover.controller('rvFileCloudStorageCtrl', ['$scope', 'rvFileCloudStorageSrv', '$timeout', 'sntActivity', '$filter', 'ngDialog',
	function($scope, rvFileCloudStorageSrv, $timeout, sntActivity, $filter, ngDialog) {

		$scope.cardData.fileList = [];
		$scope.cardData.selectedFileList = [];
		var newFileList = [];
		var fileDetailsPopup;

		var retrieveFileType = function(content_type) {
			var contentTypeRemovingSlash = content_type.split("/")[1];
			var contentTypeRemovingDot = contentTypeRemovingSlash.split(".")[contentTypeRemovingSlash.split(".").length - 1];
			var finalContentType = contentTypeRemovingDot.split("-")[contentTypeRemovingDot.split("-").length - 1];
			finalContentType = finalContentType === 'powerpoint' ? 'ppt' : finalContentType;

			return finalContentType;
		};

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
						file.full_content_type = angular.copy(file.content_type);
						file.content_type = file.content_type ? retrieveFileType(file.content_type) : '';

						$scope.cardData.fileTypes = _.union($scope.cardData.fileTypes, [file.content_type]);
					});
					$scope.cardData.fileList = fileList;
					$scope.refreshScroller('card_file_list_scroller');
					$scope.cardData.firstFileFetch = false;
				},
				function() {
					sntActivity.stop('FETCH_FILES');
					$scope.errorMessage = [$filter('translate')('FILE_FETCHING_FAILED')];
					$scope.cardData.firstFileFetch = false;
				});
		};

		var closePopupIfOpened = function() {
			if (fileDetailsPopup) {
				fileDetailsPopup.close();
				fileDetailsPopup = '';
			}
		};

		$scope.$on('FILE_UPLOADED', function(evt, file) { 
			console.log(file.base64.split(";base64,")[0]);
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

		$scope.fileReplaced = function() {
			sntActivity.start('UPLOADING_FILES');
			$scope.errorMessage = '';
			var params = angular.copy(newFileList[0]);
			params.id = $scope.selectedFile.id;

			var fileUploadSuccess = function() {
				sntActivity.stop('UPLOADING_FILES');
				newFileList = [];
				$scope.cardData.newFile = {};
				$scope.deleteFiles($scope.selectedFile);
			};

			var file = newFileList[0];
			rvFileCloudStorageSrv.uploadFile(file).
			then(fileUploadSuccess,
				function() {
					sntActivity.stop('UPLOADING_FILES');
					$scope.errorMessage = [$filter('translate')('FILE_UPLOADING_FAILED')];
				});

		};

		$scope.replaceFile = function() {
			$('#replace-file').trigger('click');
		};

		$scope.$on('FILE_UPLOADED_DONE', $scope.fileUploadCompleted);

	$scope.donwloadFiles = function(selectedFile) {
		var fileList = selectedFile ? [selectedFile] : $scope.cardData.selectedFileList;
		var downloadFilesCount = 0;

		sntActivity.start('DOWNLOADING_FILES');
		var zip = new JSZip();
		var fileDownloadSuccess = function(fileData, file) {
			downloadFilesCount++;
			// if there is only one file, download as one, else combine and download as zip file
			if (fileList.length === 1) {
				var a = document.createElement("a");

				a.href = "data:" + file.full_content_type + ";base64," + fileData.base64_data;
				a.download = file.file_name;
				a.click();
				sntActivity.stop('DOWNLOADING_FILES');
			} else {
				zip.file(file.file_name, fileData.base64_data.split(',')[1], {
					base64: true
				});
			}

			console.log(downloadFilesCount + "---------" + fileList.length)

			var fileNameMapping = {
				'guest_card': 'GUEST',
				'stay_card': 'RESERVATION'
			};

			if (fileList.length !== 1 && downloadFilesCount === fileList.length) {

				zip.generateAsync({
						type: "blob"
					})
					.then(function(blob) {
						var fileName = (fileNameMapping[$scope.cardType] ?  fileNameMapping[$scope.cardType] :  $scope.cardType) + "_" + $scope.cardId + ".zip";

						saveAs(blob, fileName);
					});
				sntActivity.stop('DOWNLOADING_FILES');
			}
		};

		_.each(fileList, function(file) {
			rvFileCloudStorageSrv.downLoadFile({
				id: file.id
			}).then(function(response) {
				fileDownloadSuccess(response, file);
			}, function() {
				sntActivity.stop('DOWNLOADING_FILES');
			});
		});
	};

		$scope.deleteFiles = function(selectedFile) {
			var fileList = selectedFile ? [selectedFile] : $scope.cardData.selectedFileList;

			sntActivity.start('DELETING_FILES');
			var deletedFilesCount = 0;
			var fileDeletionSuccess = function() {
				deletedFilesCount++;
				// when all files are uploaded, load new file list
				if (deletedFilesCount === fileList.length) {
					sntActivity.stop('DELETING_FILES');
					$scope.cardData.selectedFileList = [];
					closePopupIfOpened();
					fetchFiles();
				}
			};
			_.each(fileList, function(file) {
				rvFileCloudStorageSrv.deleteFile({
					id: file.id
				}).then(fileDeletionSuccess,
					function() {
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

		$scope.openFileDetails = function(file) {
			$scope.selectedFile = file;
			fileDetailsPopup = ngDialog.open({
				template: '/assets/directives/fileCloudStorage/partials/rvFileDetails.html',
				className: '',
				scope: $scope,
				closeByDocument: false,
				closeByEscape: false
			});
		};

		$scope.closeFileDetailsPopup = function() {
			closePopupIfOpened();
		};

		var imageFormats = ['tif', 'tiff', 'bmp', 'jpg', 'jpeg', 'gif', 'png'];
		var sheetFormats = ['csv', 'numbers', 'xsls', 'sheet', 'excel'];
		var presentationFormats = ['keynote', 'ppt', 'powerpoint'];

		$scope.isImageAndHasThumbNail = function(file) {
			var imageFormats = ['tif', 'tiff', 'bmp', 'jpg', 'jpeg', 'gif', 'png'];
			var indexOfFileType = _.indexOf(imageFormats, file.content_type);

			return indexOfFileType !== -1 && file.preview_url;
		};

		$scope.getIconClass = function(content_type) {

			var iconClass = 'icon-document';

			if (content_type === 'document' || content_type === 'pdf') {
				iconClass = 'icon-document';
			} else if (_.indexOf(sheetFormats, content_type) !== -1) {
				iconClass = 'icon-sheet';
			} else if (_.indexOf(presentationFormats, content_type) !== -1) {
				iconClass = 'icon-presentation';
			}
			return iconClass;
		};

		$scope.getContentTypeClass = function(content_type) {
			var contentTypeClass;

			if (content_type === 'pdf') {
				contentTypeClass = 'pdf';
			} else if (_.indexOf(sheetFormats, content_type) !== -1) {
				contentTypeClass = 'sheet';
			} else if (_.indexOf(presentationFormats, content_type) !== -1) {
				contentTypeClass = 'presentation';
			}

			return contentTypeClass;
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
			$scope.selectedFile = '';
		})();
	}
]);