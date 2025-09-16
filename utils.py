import os
import glob
import subprocess
import shutil

def clear() -> None:
    if os.name == 'nt':
        os.system('cls')
    else:
        os.system('clear')

def rename_last_file(new_file_name: str) -> str:

    download_dir = 'data'

    file_list = glob.glob(os.path.join(download_dir, '*'))

    last_file = max(file_list, key=os.path.getctime)

    new_name = os.path.join(download_dir, new_file_name)

    if last_file != 'search.txt' and last_file != 'repository.txt': 
        if os.path.exists(new_name):
            os.remove(new_name)
        
        os.rename(last_file, new_name)

    return new_name

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

def search_files_exist() -> bool:

    if os.path.exists('./data'):
        if len(os.listdir('./data')) >= 2:
            return True
    
    return False

def del_search_files() -> None:
    if os.path.exists('./data'):
        shutil.rmtree('./data')        

if __name__ == '__main__':
    print(search_files_exist())
#    open_file_editor('multisearch.txt')