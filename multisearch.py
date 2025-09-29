import reader, utils, fetch_list

# the list you're looking for
search: str = fetch_list.download_list('https://manabox.app/decks/yai3ffpXRiSX9H2uF1RLEg', 'search')

links: list = utils.read_rep_list()
# link for testing: https://manabox.app/decks/vYzyl7ykTz6UtEkrlQB1bA
# should return 15 non repeated elements even tho the repository has dupes

repositories: set = set()

i = 1
for link in links:
    repositories.add(fetch_list.download_list(link, f'repository [{i}]'))
    i += 1

final_list = set()

for repo in repositories:
    cards = reader.searchMatches(search, repo)
    final_list.update(cards)

i = 1
if len(final_list) >=1:
    print('Matches:')
    for match in final_list:
        print(f'{i}. {match}')
        i += 1
else:
    print('No matches found. :^(\nThis might be an error, try running it again.')
    
# should prob ask user if needs to delete existing data files before a new search