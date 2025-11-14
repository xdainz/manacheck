import requests, json, html
from bs4 import BeautifulSoup

def get_content(link: str)-> str:
    response = requests.get(link)
   
    page_content = BeautifulSoup(response.text, 'html.parser')
   
    return page_content

def get_manabox_content(link:str) -> str:
    soup = get_content(link)
    
    raw_content = soup.find_all('astro-island')[1].get('props')

    json_string = html.unescape(raw_content)

    try:
        data_object = json.loads(json_string)

    except json.JSONDecodeError as e:
        print(f'Error: {e}')
        
    raw_card_list = data_object['deck'][1]['cards'][1]

    cleaned_list = []

    for card in raw_card_list:
        data = card[1]
        
        card_name = data['name'][1]
        set_id = data['setId'][1]
        collector_number = data['collectorNumber'][1]
        rarity = data['rarity'][1]
        quantity = data['quantity'][1]
        
        cleaned_list.append({
            'Name': card_name,
            "Set": set_id.upper(),
            "Collector Number": collector_number,
            "Rarity": rarity,
            "Quantity": quantity
        })
    
    return cleaned_list

def get_moxfield_content(link:str) -> str:
    selector = '#maincontent > div.deck-dnd-wrapper > div.container.mt-3.mb-5 > section > div:nth-child(3) > article'

    return get_content(link, selector)

def get_edhrec_content(link:str) -> str:
    selector = '#__next > main > div.d-flex.flex-grow-1.p-3.pe-lg-0 > div > div.Main_left__B9nka > div.Container_container__A7FAx > div.Panels_container__jvZjo > div > div.shadow-sm.rounded-0.rounded-bottom-3.card > div > div.DecklistPanel_decklist__VZZae > div > ul'

    return get_content(link, selector)

def get(link: str) -> str:
    
    DOMAINS = {
        'https://manabox.app/': get_manabox_content,
        'https://moxfield.com/': get_moxfield_content,
        'https://edhrec.com/deckpreview/': get_edhrec_content
    }

    for domain, func in DOMAINS.items():
        if link.startswith(domain):
            return func(link)

    raise ValueError(f'Failed to match {link} with a supported domain.')


   
if __name__ == '__main__':
  
   var = get('https://manabox.app/decks/vYzyl7ykTz6UtEkrlQB1bA')
   print(var)