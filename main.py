import fetcher, utils

pink_start = '\033[35m'
pink_end = ' \033[0m'

def main() -> None:
    # start screen
    utils.splash_screen()
    
    # data storer
    data_search: set = set() 
    data_repository: set = set()

    # ask user for links
    
    search_link = utils.get_link('search')
#    search_link = 'https://manabox.app/decks/yai3ffpXRiSX9H2uF1RLEg'
    
    repository_link = utils.get_link('repository')
#    repository_link = 'https://manabox.app/decks/vYzyl7ykTz6UtEkrlQB1bA'

   
    # look up search link
    for data in utils.clean_data(fetcher.get_manabox_content(search_link)):
        data_search.add(data)
    
    # look up repository link
    for data in utils.clean_data(fetcher.get_manabox_content(repository_link)):
        data_repository.add(data)

    # check matching data
    final_matches: set[str] = utils.get_matches(data_search, data_repository)

    if len(final_matches) >=1:
        print('\nMatches found:')
        for match in final_matches:
            print(f'{pink_start}•{pink_end} {match}')
    else:
        print('\nNo matches found. :^(\nThis might be an error, try running it again.')

if __name__ == '__main__':
    main()