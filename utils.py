import os
import psutil

bold_start = '\033[1m'
bold_end = '\033[0m'

def logo() -> str:
    file_name = 'logo.txt'
    logo_content = ''

    try:
        with open(file_name, 'r', encoding='utf-8') as file:
            logo_content = file.read()


    except FileNotFoundError:
        print(f'Error: {file_name} was not found.')

    except Exception as e:
        print(f'Erro: {e}')
    
    return logo_content
    

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
    allowed_domains = ('https://manabox.app/', 'https://moxfield.com/')#, 'https://edhrec.com/deckpreview/')
    return link.startswith(allowed_domains)

def get_link(prompt) -> str:

    link = input(f'\n{bold_start}Enter {prompt} link:\n{bold_end}> ').strip()

    if is_link_valid(link):
        return link

    raise ValueError(f'{link} is not a valid domain.')

def get_matches(search_list:list[dict], repository_list:list[dict]) -> list[str]:
    
    search_card_names = {card['Name'] for card in search_list}
    
    matches = [
        card for card in repository_list
        if card['Name'] in search_card_names
    ]
   
    return matches

if __name__ == '__main__':
    import fetcher
    var = fetcher.get('https://manabox.app/decks/91XFcE76SQKLoSk_FoIMrw')
    var2 = fetcher.get('https://manabox.app/decks/91XFcE76SQKLoSk_FoIMrw')
    
    matches = get_matches(var, var2)
    
    for match in matches:
        print(match)