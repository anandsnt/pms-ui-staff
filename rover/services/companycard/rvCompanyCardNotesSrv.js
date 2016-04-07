angular.module('sntRover').service('rvCompanyCardNotesSrv', ['$q', 'rvBaseWebSrvV2', function($q, rvBaseWebSrvV2) {

    this.fetchNotes = function(params) {
        var url = '/api/accounts/' + params.accountID + '/account_notes',
            deferred = $q.defer();

        rvBaseWebSrvV2.getJSON(url)
            .then(function(data) {
                    deferred.resolve(data.notes);
                },
                function(errorMessage) {
                    deferred.reject(errorMessage);
                });
        return deferred.promise;
    };

    this.updateNote = function(params) {
        var url = '/api/accounts/' + params.accountID + '/update_account_note',
            deferred = $q.defer(),
            data = {
                'description': params.text,
                'note_id': params.noteID
            };

        rvBaseWebSrvV2.putJSON(url, data)
            .then(function(data) {
                    deferred.resolve(data);
                },
                function(errorMessage) {
                    deferred.reject(errorMessage);
                });
        return deferred.promise;
    };

    this.deleteNote = function(params) {
        var url = '/api/accounts/' + params.accountID + '/delete_account_note/',
            deferred = $q.defer(),
            data = {
                note_id: params.noteID
            };

        rvBaseWebSrvV2.deleteJSON(url, data)
            .then(function(data) {
                deferred.resolve(data);
            }, function(errorMessage) {
                deferred.reject(errorMessage);
            });
        return deferred.promise;
    };

    this.createNote = function(params) {
        var data = {
                'description': params.text
            },
            //url 		= 'ui/show?json_input=cards/new_note.json&format=json',
            url = '/api/accounts/' + params.accountID + '/save_account_note',
            deferred = $q.defer();

        rvBaseWebSrvV2.postJSON(url, data)
            .then(function(data) {
                    deferred.resolve(data);
                },
                function(errorMessage) {
                    deferred.reject(errorMessage);
                });
        return deferred.promise;
    };
}]);