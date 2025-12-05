import os
import pandas as pd

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
    DTYPE_MAP = {
        CARD_NAME: str,
        SET: str,
        COLLECTOR_NUMBER: str, # force data type to str on read
        RARITY: str,
        QUANTITY: int
    }

    # turns card list into a dataframe 
    new_df = pd.DataFrame(card_list)
   
    # read existing db
    db = pd.read_excel(DATABASE, dtype=DTYPE_MAP)
    
    # merge new and old dataframes
    combined_df = pd.concat([db, new_df], ignore_index=True)
    
    # headers that should match to increase quantity and avoid duplicates
    unique_headers = [CARD_NAME, SET, COLLECTOR_NUMBER, RARITY]
    
    final_df = combined_df.groupby(unique_headers, as_index=False)[QUANTITY].sum()
    
    # save new df to database file
    final_df.to_excel(DATABASE, index=False)

def read_db():
    df = pd.read_excel(DATABASE)
    return df


if __name__ == '__main__':
    import fetcher
    create_db()
    write_db(fetcher.get('https://manabox.app/decks/vYzyl7ykTz6UtEkrlQB1bA'))
    print(read_db())