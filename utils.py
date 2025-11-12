import os
import psutil

bold_start = '\033[1m'
bold_end = '\033[0m'
pink_start ='\033[35m'
pink_end = '\033[0m'

def splash_screen() -> None:
    file_name = 'logo.txt'

    try:
        with open(file_name, 'r', encoding='utf-8') as file:
            logo_content = file.read()

        print(f'\n{pink_start}{logo_content}{pink_end}')
        LOGO = f'\n{pink_start}{logo_content}{pink_end}'

    except FileNotFoundError:
        print(f'Error: {file_name} was not found.')

    except Exception as e:
        print(f'Erro: {e}')
    
    

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
    allowed_domains = ('https://manabox.app/', 'https://moxfield.com/', 'https://edhrec.com/deckpreview/')
    
    return link.startswith(allowed_domains)

def get_link(prompt) -> str:

    link = input(f'\n{bold_start}Enter {prompt} link:\n{bold_end}> ').strip()

    if is_link_valid(link):
        return link

    raise ValueError(f'{link} is not a valid domain.')
    
def clean_data(raw_data:str) -> set[str]:
    
    to_ignore = ('commander', 'deck', 'planeswalkers', 'creatures', 'artifacts','enchantments',
                 'instants', 'sorceries', 'lands', '//')

    raw_list = raw_data.split('\n')
    cleaned_set = set()
    
    for data in raw_list:
        try:
            # check if str can be typecasted to an int
            int(data.strip())
        except ValueError:
            # if not assume its str
            if not data.strip().lower().startswith(to_ignore) and len(data) >= 2: #shortest card has 2 letters (acording to google)
                cleaned_set.add(data.strip())
        
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