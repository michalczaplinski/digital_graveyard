$(document).ready(function() {

// ADJUST THE TIME OF THE TWEET TO CLIENT'S LOCAL TIMEZONE
    function adjust_to_users_timezone (time) {
        var date = new Date();
        var utc_offset = date.getTimezoneOffset();

        var new_time = time * 1000 + utc_offset * 60000; // convert to miliseconds, get
        var new_date = new Date(new_time);
        return new_date.toLocaleString();
    }

    $.getJSON('tweets.json', function(json, textStatus) {
        console.log(textStatus);

        var myJSONString = JSON.stringify(json);
        var myEscapedJSONString = myJSONString.replace(/\\n/g, "\\n")
                                              .replace(/\\'/g, "\\'")
                                              .replace(/\\"/g, '\\"');

        var tweetArray = $.parseJSON(myEscapedJSONString);

        var num_tweets = tweetArray.length;

        tweets = [];

        for (var i = 0; i < tweetArray.length; i++) {

            tweets.push({});

            tweets[i].text = tweetArray[i][0];
            tweets[i].user =  '@' + tweetArray[i][1];
            tweets[i].time = adjust_to_users_timezone(tweetArray[i][2]);
            tweets[i].name =  tweetArray[i][3];

        }

        run_graveyard(num_tweets, tweets);

        });
});
