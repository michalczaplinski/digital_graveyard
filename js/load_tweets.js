$(document).ready(function() {

// ADJUST THE TIME OF THE TWEET TO CLIENT'S LOCAL TIMEZONE
    function adjust_to_users_timezone (time) {
        var new_time = time * 1000 + utc_offset * 60000; // convert to miliseconds, get
        var new_date = new Date(new_time)
        return new_date.toLocaleString()
    }

    $.getJSON('/tweets.json', function(json, textStatus) {
        console.log(textStatus)

        var num_tweets = json.length

        var tweetArray = JSON.parse(json);

        run_graveyard();

        });
});
