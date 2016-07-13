import twitter, re, time


def test_tweet(text):
    if text.startswith('RT'):
        return False
    else:
        return True


def clean_up_tweet_text(text):
    '''Removes the @somebody from the tweet text'''

    text = re.sub('\s@[a-zA-Z_]*', ' ', text)
    return text


def clean_up_name(name):
    name = name.strip(',.!')
    if name.endswith('\'s'):
        name.strip('\'s')
    return name


def is_name_in_text(name, text):
    '''Checks if the string contains the name'''

    if re.search('\s+' + name + '\s+', text) is not None:
        return True
    else:
        return False


def get_the_rest(name, text):
    '''Cuts off the part of the string 'text' up until the end of the name'''

    m = re.search(name, text)
    rest_of_text = text[m.end(0)+1:]
    return rest_of_text


def has_name(text, first_names, last_names):
    '''Recursively check every word of the tweet for the name.'''

    split_text      = text.split(' ', 1)
    candidate_name  = split_text[0]
    candidate_name  = clean_up_name(candidate_name)

    if unicode(candidate_name) in first_names:
        return candidate_name
    else:

        # Run again for the rest of the tweet, unless it's the end of the tweet.
        try:
            return has_name(split_text[1], first_names, last_names)
        except IndexError:
            return None


def get_full_name_from_tweet_text(name, text, name_so_far, first_names, last_names):
    '''
    First, we get the first word from the remaining text.
    Second, we check if it's in the list of first or last names.
    If so, append to the name and repeat from step one.
    '''

    the_rest        = get_the_rest(name, text)
    candidate_name  = the_rest.split(' ', 1)[0]
    candidate_name  = clean_up_name(candidate_name)

    if unicode(candidate_name) in first_names or unicode(candidate_name) in last_names:
        name_so_far += ' ' + candidate_name
        return get_full_name_from_tweet_text(candidate_name, the_rest, name_so_far, first_names, last_names)
    else:
        return name_so_far


def connect_to_API_and_get_statuses():
    '''Connect to twitter API and pull tweets (statuses)'''
    api = twitter.Api(consumer_key='f8olfZWtAPvgANdP9qecg',
                        consumer_secret='bSEnCXJuWazjT8S8hZ6BLWMo1C7egIKNgjObHM6Ck',
                        access_token_key='1726636778-jEn4qUAj2wV60ckbskNSbLJgTRr0c7hiemVOU7x',
                        access_token_secret='UgwEfM3cukoWIxCWjCiIZiJ0gnQVGH9U42WLfJjnEFODw')
    statuses = api.GetSearch(term='#rip', count=100, result_type='recent')
    return statuses


def get_lists_of_names():
    '''Get the list of first names and last names from the files.'''

    with open('firstnames.txt', 'r') as f:
        first_names = [ x.strip('\n') for x in f.readlines() ]
    with open('lastnames.txt', 'r') as l:
        last_names  = [ x.strip('\n') for x in l.readlines() ]
    return first_names, last_names



def main():
    statuses = connect_to_API_and_get_statuses()
    first_names, last_names = get_lists_of_names()

    tweets = []

    for s in statuses:

        text = s.text
        time = s.created_at
        user = s.user.screen_name

        cleaned_up_text = clean_up_tweet_text(text)

        if not test_tweet(cleaned_up_text):
            continue

        name = has_name(cleaned_up_text, first_names, last_names)

        if name is not None:
            name_from_tweet = get_full_name_from_tweet_text(name, cleaned_up_text, name, first_names, last_names)
            tweets.append((time, name_from_tweet, text))

    return tweets


def print_names(names):
    for name in names:
        print name[0]
        print name[1]
        print name[2]
        print

        time.sleep(10)

    return


if __name__ == '__main__':

    old_names = []

    while True:

        new_names = main()
        names_to_show = ( x for x in new_names if x not in old_names )

        print_names(names_to_show)

        old_names.extend(new_names)

        time.sleep(20)





