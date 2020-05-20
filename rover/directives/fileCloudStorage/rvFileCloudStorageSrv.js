sntRover.service('rvFileCloudStorageSrv', ['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2) {

    this.fetchFileAttachments = function (params) {
        var url = '/sample_json/cards/file_attachments.json';

        return rvBaseWebSrvV2.getJSON(url);
    };

}]);