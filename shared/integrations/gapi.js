GAPI = function ($scope) {
    $scope.GoogleAuth = null;
    var SCOPE = 'https://www.googleapis.com/auth/drive';

    var handleClientLoad = function() {
        // Load the API's client and auth2 modules.
        // Call the initClient function after the modules load.
        gapi.load('client:auth2', initClient);
    };

    var initClient = function() {


        var auth = gapi.auth2.getAuthInstance();

        if (auth) {
            auth.signOut();
            auth.disconnect();
        }

        if ($scope.GoogleAuth) {
            $scope.GoogleAuth.signOut();
            $scope.GoogleAuth.disconnect();
        }
        // Retrieve the discovery document for version 3 of Google Drive API.
        // In practice, your app can retrieve one or more discovery documents.
        var discoveryUrl = 'https://www.googleapis.com/discovery/v1/apis/drive/v3/rest';

        // Initialize the gapi.client object, which app uses to make API requests.
        // Get API key and client ID from API Console.
        // 'scope' field specifies space-delimited list of access scopes.
        gapi.client.init({
            'apiKey': $scope.config.gapi_client.api_key,
            'discoveryDocs': [discoveryUrl],
            'clientId': $scope.config.gapi_client.client_id,
            'scope': SCOPE,
            'access_type': 'offline',
            'response_type': 'code token'
        }).then(function () {
            $scope.GoogleAuth = gapi.auth2.getAuthInstance();
        });
    };

    $scope.signOut = function() {
        $scope.GoogleAuth.signOut();
    };

    $scope.disconnect = function() {
        $scope.GoogleAuth.disconnect();
    };

    handleClientLoad();
};
