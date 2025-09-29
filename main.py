import fetch_list, reader, utils

search_link = 'https://manabox.app/decks/GgG_dmiHS2iRFdgQQdurwg'
repository_link = 'https://manabox.app/decks/u3AlIDEKTZeN1AfWptxHcw'

search = fetch_list.download_list(search_link, 'search')

repository = fetch_list.download_list(repository_link, 'repository')

matches = reader.searchMatches(search, repository)

utils.clear()

if len(matches) >=1:
    print('Matches:')
    for match in matches:
        print(match)
else:
    print('No matches found. :^(\nThis might be an error, try running it again.')