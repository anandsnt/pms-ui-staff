sntRover.controller('RVSocialLobbyCommentsCrl', [
    '$scope',
    '$rootScope',
    '$filter',
    'RVSocilaLobbySrv',
    '$timeout',
    '$state',
    'ngDialog',
    function($scope, $rootScope, $filter, RVSocilaLobbySrv, $timeout, $state, ngDialog) {

        BaseCtrl.call(this, $scope);

        $scope.parentPost = $scope.posts[$scope.$index];
        $scope.comments = [];
        $scope.commentParams = {'page': 1, 'per_page':10, 'post_id': $scope.parentPost.id};
        $scope.selectedComment = "";
        $scope.newComment = "";
        $scope.middle_page1 = 2, $scope.middle_page2 = 3, $scope.middle_page3 = 4;
        
        var deleteIndex = "";

        var POST_LIST_SCROLL = 'post-list-scroll',
            COMMENT_LIST_SCROLL = 'comment-list-scroll';

        $scope.refreshCommentScroll = function() {
            $scope.refreshScroller(COMMENT_LIST_SCROLL);
            if ( $scope.myScroll.hasOwnProperty(COMMENT_LIST_SCROLL) ) {
                $scope.myScroll[COMMENT_LIST_SCROLL].scrollTo(0, 0, 100);
            };
            
        };

        var setCommentScroller = function() {
            var scrollerOptions = {
                tap: true,
                preventDefault: false
            };

            
            $scope.setScroller(COMMENT_LIST_SCROLL, scrollerOptions);
        };

        setCommentScroller();

        $scope.fetchComments = function(){
            var options = {};
            options.params = $scope.commentParams;
            options.onSuccess = function(data){
                
                $scope.comments = data.results.comments;
                $scope.totalCommentPages = data.results.total_count % $scope.commentParams.per_page > 0 ? Math.floor(data.results.total_count / $scope.commentParams.per_page) + 1 : Math.floor(data.results.total_count / $scope.commentParams.per_page);
                $scope.$emit('hideLoader');
                $scope.refreshCommentScroll();
            }
            $scope.callAPI(RVSocilaLobbySrv.fetchComments, options);
        }

        $scope.fetchComments();

        $scope.refreshComments = function(){
            $scope.commentParams.page = 1;
            $scope.middle_page1 = 2, $scope.middle_page2 = 3, $scope.middle_page3 = 4;
            $scope.newComment = "";
            $scope.fetchComments();
        }

        $scope.addComment = function(){
            var options = {};
            options.params = {
                "comment" :{
                "comment_title": "",
                "comment_text": $scope.newComment
            }};
            options.params.post_id = $scope.parentPost.id;
            options.onSuccess = function(data){

                $scope.refreshComments();
            }
            $scope.callAPI(RVSocilaLobbySrv.addComment, options);
        }

        $scope.deleteCommentClicked = function(comment_id){
            deleteIndex = comment_id;
            ngDialog.open({
                   template: '/assets/partials/socialLobby/rvSLPostDelete.html',
                   className: 'ngdialog-theme-default single-calendar-modal',
                   scope: $scope,
                   closeByDocument: true});
        }
        
        $scope.delete = function(){
            var options = {};
            options.params = {'comment_id': deleteIndex};
            options.onSuccess = function(data){
                
                $scope.refreshComments();
                ngDialog.close();
            }
            $scope.callAPI(RVSocilaLobbySrv.deleteComment, options);
        }

        $scope.paginateComments = function(page){
            if(page == $scope.commentParams.page)
                return;
            $scope.commentParams.page = page;
            $scope.fetchComments();
            if($scope.commentParams.page > $scope.middle_page3 && $scope.commentParams.page < $scope.totalCommentPages){
                $scope.middle_page3++;
                $scope.middle_page2++;
                $scope.middle_page1++;
            }else if($scope.commentParams.page < $scope.middle_page1 && $scope.commentParams.page > 1){
                $scope.middle_page3--;
                $scope.middle_page2--;
                $scope.middle_page1--;
            }else if($scope.commentParams.page == 1){
                $scope.middle_page3 = 4;
                $scope.middle_page2 = 3;
                $scope.middle_page1 = 2;
            }else if($scope.commentParams.page == $scope.totalCommentPages && $scope.totalCommentPages > 5){
                $scope.middle_page3 = $scope.totalCommentPages -1;
                $scope.middle_page2 = $scope.totalCommentPages -2;
                $scope.middle_page1 = $scope.totalCommentPages -3;
            }
        }

    }

]);
