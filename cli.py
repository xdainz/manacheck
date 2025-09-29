import reader, fetch_list, utils

def cli() -> None:
    print(' ----------------------------\n'
          '| Welcome to Manabox-Checker |\n'
          ' ----------------------------\n')
    
    if utils.search_files_exist():
        while True:
            del_previous_files = input('Previous search files have been found.\n'
                                       '\033[1mDo you want to remove them and perform a new search? [Y/n] \033[0m')

            if del_previous_files.upper() == 'Y':
                utils.del_search_files()
                break
            else:
                print('No files were deleted, searching existing files...')
                break
    else:
        input('Your editor will open with further instructions.\n'
              'Press Enter to continue. ')
            
    # look up search links :v
    search_links: list = utils.read_search_list()
    
    search_files: set = set()

    i = 1
    for link in search_links:
        search_files.add(fetch_list.download_list(link, f'search [{i}]'))
        i += 1
    
    input('\nLink/s have been found.\n'
          'Press Enter to continue. ')

    # look up repositories
    repository_links: list = utils.read_rep_list()
    
    repository_files: set = set()

    i = 1
    for link in repository_links:
        repository_files.add(fetch_list.download_list(link, f'repository [{i}]'))
        i += 1

    final_matches: set = set()
    
    for search in search_files:
        for repo in repository_files:
            final_matches.update(reader.searchMatches(search, repo))

    i = 1
    if len(final_matches) >=1:
        print('\nMatches found:')
        for match in final_matches:
            print(f'{i}. {match}')
            i += 1
    else:
        print('\nNo matches found. :^(\nThis might be an error, try running it again.')
 
    
if __name__ == '__main__':
    cli()