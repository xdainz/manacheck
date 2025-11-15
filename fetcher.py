import requests, json, html
from bs4 import BeautifulSoup

def get_content(link: str)-> str:
    response = requests.get(link)
   
    return response

def get_manabox_content(link:str) -> str:
    response = get_content(link)
    soup = BeautifulSoup(response.text, 'html.parser')
    
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
            "Rarity": rarity.capitalize(),
            "Quantity": quantity
        })
    
    return cleaned_list

def get_moxfield_content(link:str) -> str:
    # replace deck link to call directly the api and preserve deck id
    moxfield_api = 'https://api2.moxfield.com/v3/decks/all/'
    deck_link = link.replace('https://moxfield.com/decks/', moxfield_api)

    response = get_content(deck_link)

    data_object = json.loads(response.text) 

    cleaned_list = []

    card_categories = ['mainboard', 'sideboard', 'maybeboard', 'commanders', 'companions', 'signatureSpells']

    boards_data = data_object['boards']

    for category in card_categories:
        card_list = boards_data[category]['cards']
        
        for key, card in card_list.items():
            data = card['card']
            
            card_name = data['name']
            set_id = data['set']
            collector_number = data['cn']
            rarity = data['rarity']
            quantity = card['quantity']
            
            cleaned_list.append({
                'Name': card_name,
                "Set": set_id.upper(),
                "Collector Number": collector_number,
                "Rarity": rarity.capitalize(),
                "Quantity": quantity
            })

    return cleaned_list

def get_edhrec_content(link:str) -> str:
    pass

def get(link: str) -> str:
    
    DOMAINS = {
        'https://manabox.app/': get_manabox_content,
        'https://moxfield.com/decks/': get_moxfield_content,
        #'https://edhrec.com/deckpreview/': get_edhrec_content
    }

    for domain, func in DOMAINS.items():
        if link.startswith(domain):
            return func(link)

    raise ValueError(f'Failed to match {link} with a supported domain.')


   
if __name__ == '__main__':
  
   var = get('https://moxfield.com/decks/wP8d8ugZaEWz2N9B-nMWeA')
   print(var)