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

def open_file_editor(file_path):
    if os.name == 'nt':
        subprocess.Popen(['notepad.exe', file_path])
    else:
        subprocess.call(['vim', file_path])
   
 
if __name__ == '__main__':
    open_file_editor('multisearch.txt')