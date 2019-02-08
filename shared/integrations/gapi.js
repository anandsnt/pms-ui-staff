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
            'apiKey': 'AIzaSyA3W6wqAIx9_YE1JoYkZASRRc1URiMiEtI',
            'discoveryDocs': [discoveryUrl],
            'clientId': '1024013218567-uh3t69o29galfu7l0ei8f19c0iea36ip.apps.googleusercontent.com',
            'scope': SCOPE,
            'access_type': 'offline',
            'response_type': 'code token'
        }).then(function () {
            $scope.GoogleAuth = gapi.auth2.getAuthInstance();

            // Listen for sign-in state changes.
            $scope.GoogleAuth.isSignedIn.listen($scope.update);

            // Handle initial sign-in state. (Determine if user is already signed in.)
            $scope.GoogleAuth.signIn();
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
