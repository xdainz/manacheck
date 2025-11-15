import os
import pandas as pd
import fetcher

DATABASE = 'data.xlsx'

CARD_NAME = 'Name'
SET = 'Set'
COLLECTOR_NUMBER = 'Collector Number'
RARITY = 'Rarity'
QUANTITY = 'Quantity'

def database_exist() ->bool:
    return os.path.exists(DATABASE)

def create_db() -> None:
    if not database_exist():
        headers = [CARD_NAME, SET, COLLECTOR_NUMBER, RARITY, QUANTITY]

        layout_df = pd.DataFrame(columns=headers)

        try:
            with open(DATABASE, 'x'):
                pass
        except FileExistsError:
            pass
        
        layout_df.to_excel(DATABASE, sheet_name='test', index=False)

def write_db(card_list:list[dict]) -> None:
    # turns card list into a dataframe 
    new_df = pd.DataFrame(card_list)
    
    # read existing db
    db = pd.read_excel(DATABASE)
    
    # merge new and old dataframes
    combined_df = pd.concat([db, new_df], ignore_index=True)
    
    # save new df to database file
    combined_df.to_excel(DATABASE, index=False)


def read_db():
    df = pd.read_excel(DATABASE)
    return df


if __name__ == '__main__':
    create_db()
    write_db(fetcher.get('https://manabox.app/decks/vYzyl7ykTz6UtEkrlQB1bA'))
    print(read_db())