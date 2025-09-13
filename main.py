import download, reader, utils

search_link = 'https://manabox.app/decks/GgG_dmiHS2iRFdgQQdurwg'
repository_link = 'https://manabox.app/decks/u3AlIDEKTZeN1AfWptxHcw'

download.download_list(search_link)
search = utils.rename_last_file('search.txt')

download.download_list(repository_link)
repository = utils.rename_last_file('repository.txt')

matches = reader.searchMatches(search, repository)

utils.clear()

print('Matches:')
for match in matches:
    print(match)