import os
import psutil

pink_start = '\033[35m'
pink_end = ' \033[0m'

def splash_screen() -> None:
    clear()
    print(
f'{pink_start}'
'   ▄▄▄▄███▄▄▄▄      ▄████████ ███▄▄▄▄      ▄████████  ▄████████    ▄█    █▄       ▄████████  ▄████████    ▄█   ▄█▄ \n'
' ▄██▀▀▀███▀▀▀██▄   ███    ███ ███▀▀▀██▄   ███    ███ ███    ███   ███    ███     ███    ███ ███    ███   ███ ▄███▀\n'
' ███   ███   ███   ███    ███ ███   ███   ███    ███ ███    █▀    ███    ███     ███    █▀  ███    █▀    ███▐██▀   \n'
' ███   ███   ███   ███    ███ ███   ███   ███    ███ ███         ▄███▄▄▄▄███▄▄  ▄███▄▄▄     ███         ▄█████▀    \n'
' ███   ███   ███ ▀███████████ ███   ███ ▀███████████ ███        ▀▀███▀▀▀▀███▀  ▀▀███▀▀▀     ███        ▀▀█████▄    \n'
' ███   ███   ███   ███    ███ ███   ███   ███    ███ ███    █▄    ███    ███     ███    █▄  ███    █▄    ███▐██▄   \n'
' ███   ███   ███   ███    ███ ███   ███   ███    ███ ███    ███   ███    ███     ███    ███ ███    ███   ███ ▀███▄ \n'
'  ▀█   ███   █▀    ███    █▀   ▀█   █▀    ███    █▀  ████████▀    ███    █▀      ██████████ ████████▀    ███   ▀█▀ \n'
'                                                                                                         ▀         '
f'{pink_end}\n')

def clear() -> None:
    if is_powershell():
        os.system('cls')
    else:
        os.system('clear -x')

def is_powershell():
    program_id = os.getppid()
    parent_process = psutil.Process(program_id)
    shell_name = parent_process.name().lower()

    windows_shells = ['pwsh.exe', 'powershell.exe', 'cmd.exe'] 

    if shell_name in windows_shells:
        return True
    else:
        return False

def is_link_valid(link:str) -> bool:
    return True
       
def clean_data(raw_data:str) -> set[str]:
    
    to_ignore = ('commander', 'deck', 'planeswalkers', 'creatures', 'artifacts','enchantments',
                 'instants', 'sorceries', 'lands', '//')

    raw_list = raw_data.split('\n')
    cleaned_set = set()
    
    for data in raw_list:
        try:
            # check if str can be typecasted to an int
            int(data)
        except ValueError:
            # if not assume its str
            if not data.lower().startswith(to_ignore) and len(data) >= 2: #shortest card has 2 letters (acording to google)
                cleaned_set.add(data)
        
    return cleaned_set

def get_matches(search_list:set[str], repository_list:set[str]) -> set[str]:
    
    matches = set()
    
    for card in search_list:
        if card in repository_list and card not in matches:
            matches.add(card)
    
    return matches

if __name__ == '__main__':
    import fetcher
    var = clean_data(fetcher.get_moxfield_content('https://moxfield.com/decks/mLvJIellBEGt7KPWqgwefQ'))
    var2 = clean_data(fetcher.get_manabox_content('https://manabox.app/decks/91XFcE76SQKLoSk_FoIMrw'))
    print(var)
    print(var2)