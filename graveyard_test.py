import twitter, re, logging, time


def get_latest_tweets(include_retweets=True):

    tweets = []

    api = twitter.Api(consumer_key='f8olfZWtAPvgANdP9qecg',
                        consumer_secret='bSEnCXJuWazjT8S8hZ6BLWMo1C7egIKNgjObHM6Ck',
                        access_token_key='1726636778-jEn4qUAj2wV60ckbskNSbLJgTRr0c7hiemVOU7x',
                        access_token_secret='UgwEfM3cukoWIxCWjCiIZiJ0gnQVGH9U42WLfJjnEFODw')

    statuses = api.GetSearch(term='#rip', count=100, result_type='recent')

    for s in statuses:

        text = s.text
        time = s.created_at
        user = s.user.screen_name

        if include_retweets is False:
            if text.startswith('RT'):
                continue

        tweets.append((time, text))

    return tweets



def print_names(names):

    if len(names) == 0:
        time.sleep(100)

    elif len(names) > 0:
        for name in names:
            #print name[0]
            print name[1], '\n'

            time.sleep(100/len(names))
    return


def main(old_names = []):
    while True:

            new_names = get_latest_tweets()
            names_to_show = [ x for x in new_names if x not in old_names ]

            print_names(names_to_show)

            old_names.extend(new_names)



if __name__ == '__main__':

    while True:
        try:
            main()
        except StandardError as e:
            print 'There was an error, restarting in 30 seconds...'
            logging.error(e)
            time.sleep(30)











