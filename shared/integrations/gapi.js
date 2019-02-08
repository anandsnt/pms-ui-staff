GAPI = function ($scope) {
    $scope.GoogleAuth = null;
    var SCOPE = 'https://www.googleapis.com/auth/drive.metadata.readonly';

    var handleClientLoad = function() {
        // Load the API's client and auth2 modules.
        // Call the initClient function after the modules load.
        gapi.load('client:auth2', initClient);
    };

    var initClient = function() {
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

            // Listen for sign-in state changes.
            $scope.GoogleAuth.isSignedIn.listen($scope.update);

            // Handle initial sign-in state. (Determine if user is already signed in.)
            var user = $scope.GoogleAuth.currentUser.get();

            $scope.GoogleAuth.signIn();
        });
    };

    $scope.updateSigninStatus = function (isSignedIn) {
        console.log($scope.GoogleAuth.currentUser.get());
    };

    // $scope.signIn = function () {
    //     $scope.GoogleAuth.signIn();
    // };

    $scope.signOut = function() {
        $scope.GoogleAuth.signOut();
    };

    $scope.disconnect = function() {
        $scope.GoogleAuth.disconnect();
    };

    handleClientLoad();
};
