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
        
def is_link_valid(link:str) -> bool:
    return True

       
def clean_data_manabox(raw_data:str) -> set[str]:
    
    to_ignore = ['commander', 'deck', 'planeswalkers', 'creatures', 'artifacts','enchantments',
                 'instants', 'sorceries', 'lands', '//', ' ']

    raw_list = raw_data.split('\n')
    cleaned_set = set()
    
    for data in raw_list:
        try:
            # check if str can be typecasted to an int
            int(data)
        except ValueError:
            # if not assume its str
            if data.lower() not in to_ignore and len(data) >= 2: #shortest card has 2 letters (acording to google)
                cleaned_set.add(data)
        
    return cleaned_set

def get_matches(search_list:set[str], repository_list:set[str]) -> set[str]:
    
    matches = set()
    
    for card in search_list:
        if card in repository_list and card not in matches:
            matches.add(card)
    
    return matches

if __name__ == '__main__':
    pass