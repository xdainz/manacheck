from utils import logo, get_link, clean_data, get_matches, clear
from fetcher import get

pink_start = '\033[35m'
pink_end = '\033[0m'
italic_start = '\033[3m'
italic_end = '\033[0m'


def main() -> None:
    # start screen
    clear()
    print(logo())
    print(f'\n{italic_start}{pink_start}Currently supported sites: ManaBox, Moxfield, EDHREC.{pink_end}{italic_end}')

    # data storer
    data_search: set = set() 
    data_repository: set = set()

    # ask user for links
    search_link = get_link('search')
    repository_link = get_link('repository')

    # append fetched data
    for data in clean_data(get(search_link)):
        data_search.add(data)
    
    for data in clean_data(get(repository_link)):
        data_repository.add(data)

    # check matching data
    final_matches: set[str] = get_matches(data_search, data_repository)

    if len(final_matches) >=1:
        print('\nMatches found:')
        for match in final_matches:
            print(f'{pink_start}•{pink_end} {match}')
    else:
        print(f'{pink_start}\nNo matches found. :^({pink_end}')

if __name__ == '__main__':
    main()