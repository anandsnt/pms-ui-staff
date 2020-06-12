sntRover.service('rvFileCloudStorageSrv', ['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2) {
    var service = this;
    
    service.fetchFiles = function (params) {
        var url = '/api/file_attachments';

        return rvBaseWebSrvV2.getJSON(url, params);
    };

    service.uploadFile = function (params) {
        var url = '/api/file_attachments';

        return rvBaseWebSrvV2.postJSON(url, params);
    };

    service.downLoadFile = function(params) {

        var url = '/api/file_attachments/' + params.id + '/download';

        return rvBaseWebSrvV2.getJSON(url, params);
    };

    service.deleteFile = function(params) {
        var url = '/api/file_attachments/' + params.id;

        return rvBaseWebSrvV2.deleteJSON(url, params);
    };

    service.updateFile = function(params) {
        var url = '/api/file_attachments/' + params.id;

        return rvBaseWebSrvV2.putJSON(url, params);
    };
}]);