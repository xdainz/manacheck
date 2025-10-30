import os
import utils
def read_rep_list(rerun: bool) -> list[str]:
    arr: list[str] = []

    file_name:str = 'repositories.txt'

    while True:
        try:
            if os.path.exists(file_name):
                if rerun == False:
                    utils.open_file_editor(file_name)

                with open(file_name) as links:
                    arr = links.readlines()
                    
                    arr.pop(0)
                    arr.pop(0)

                    if arr == []:
                        raise Exception(f'\nNo links where found inside {file_name}')

                    links.close()
                break

            else:
                f = open(file_name, 'a')
                f.write('[----------- MANABOX\'S YOU WANT TO SEARCH INTO -----------]\n')
                f.write('---- ADD A LINK PER LINE UNDER THIS (DO NOT DELETE THESE LINES) ----')
                f.close()
        except Exception:
            raise

    return arr

def read_search_list(rerun: bool) -> list[str]:
    arr: list[str] = []

    file_name:str = 'search_list.txt'

    while True:
        try:
            if os.path.exists(file_name):
                if rerun == False:
                    utils.open_file_editor(file_name)

                with open(file_name) as links:
                    arr = links.readlines()
                    
                    arr.pop(0)
                    arr.pop(0)

                    if arr == []:
                        raise Exception(f'\nNo links where found inside {file_name}.')

                    links.close()
                break

            else:
                f = open(file_name, 'a')
                f.write('[---------- MANABOX WITH THE CARDS YOU ARE LOOKING FOR ----------]\n')
                f.write('---- ADD A LINK PER LINE UNDER THIS (DO NOT DELETE THESE LINES) ----')
                f.close()
        except Exception:
            raise

    return arr
 