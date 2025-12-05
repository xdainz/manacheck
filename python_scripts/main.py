from python_scripts.utils import logo, get_link, get_matches, clear
from python_scripts.fetcher import get

pink_start = '\033[35m'
pink_end = '\033[0m'
italic_start = '\033[3m'
italic_end = '\033[0m'


def main() -> None:
    # start screen
    clear()
    print(logo())
    print(f'\n{italic_start}{pink_start}Currently supported sites: ManaBox, Moxfield.{pink_end}{italic_end}')

    # ask user for links
    search_link = get_link('search')
    repository_link = get_link('repository')
    
    # data storer
    data_search: list[dict] = get(search_link) 
    data_repository: list[dict] = get(repository_link)
    
    # check matching data
    final_matches: list[str] = get_matches(data_search, data_repository)

    if len(final_matches) >=1:
        print('\nMatches found:')
        for match in final_matches:
            print(f'{pink_start}•{pink_end} {match}')
    else:
        print(f'{pink_start}\nNo matches found. :^({pink_end}')

if __name__ == '__main__':
    main()