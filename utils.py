import os
import glob
import subprocess

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
            if os.path.exists('multisearch.txt'):
                open_file_editor('multisearch.txt')
                with open('multisearch.txt') as links:
                    arr = links.readlines()
                    
                    arr.pop(0)

                    if arr == []:
                        raise Exception('\nNo links where found inside multisearch.txt')

                    links.close()
                break

            else:
                f = open('multisearch.txt', 'a')
                f.write('---- ADD A LINK PER LINE UNDER THIS (DO NOT DELETE THIS LINE)----')
                f.close()
        except Exception:
            raise

    return arr

 
if __name__ == '__main__':
    read_rep_list()
#    open_file_editor('multisearch.txt')