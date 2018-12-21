export function LikesSrv($q, RVBaseWebSrv) {

    /**
     *
     */
    function fetchLikes(params) {
        return RVBaseWebSrv.getJSON('/staff/preferences/likes.json', {user_id: params.userId});
    }

    /**
     *
     */
    function saveLikes(payLoad) {
        // save user preferences for room
        // --
        return RVBaseWebSrv.postJSON('/staff/guest_cards/' + payLoad.userId + '/update_preferences', payLoad.data);
    }

    return {
        fetchLikes,
        saveLikes
    };
}
