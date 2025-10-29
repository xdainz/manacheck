import os
import subprocess

def clear() -> None:
    if os.name == 'nt':
        os.system('cls')
    else:
        os.system('clear')

def open_file_editor(file_path) -> None:
    if os.name == 'nt':
        subprocess.Popen(['notepad.exe', file_path])
    else:
        subprocess.call(['vim', file_path])
   
def read_rep_list() -> list[str]:
    arr: list[str] = []

    while True:
        try:
            if os.path.exists('repositories.txt'):
                open_file_editor('repositories.txt')
                with open('repositories.txt') as links:
                    arr = links.readlines()
                    
                    arr.pop(0)
                    arr.pop(0)

                    if arr == []:
                        raise Exception('\nNo links where found inside repositories.txt')

                    links.close()
                break

            else:
                f = open('repositories.txt', 'a')
                f.write('[----------- MANABOX\'S YOU WANT TO SEARCH INTO -----------]\n')
                f.write('---- ADD A LINK PER LINE UNDER THIS (DO NOT DELETE THESE LINES) ----')
                f.close()
        except Exception:
            raise

    return arr

def read_search_list() -> list[str]:
    arr: list[str] = []

    while True:
        try:
            if os.path.exists('search_list.txt'):
                open_file_editor('search_list.txt')
                with open('search_list.txt') as links:
                    arr = links.readlines()
                    
                    arr.pop(0)
                    arr.pop(0)

                    if arr == []:
                        raise Exception('\nNo links where found inside.')

                    links.close()
                break

            else:
                f = open('search_list.txt', 'a')
                f.write('[---------- MANABOX WITH THE CARDS YOU ARE LOOKING FOR ----------]\n')
                f.write('---- ADD A LINK PER LINE UNDER THIS (DO NOT DELETE THESE LINES) ----')
                f.close()
        except Exception:
            raise

    return arr
        
def clean_data_manabox(raw_data:str) -> list[str]:
    
    to_ignore = ['commander', 'deck', 'planeswalkers', 'creatures', 'artifacts','instants', 'sorceries', 'lands', '//']

    raw_list = raw_data.split('\n')
    cleaned_list = []
    
    for data in raw_list:
        try:
            # check if str can be typecasted to an int
            int(data)
        except ValueError:
            # if not assume its str
            if data.lower() not in to_ignore or len(data) >= 2: #shortest card has 2 letters (acording to google)
                cleaned_list.append(data)
        
    return cleaned_list

if __name__ == '__main__':
    pass