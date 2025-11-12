import os
import pandas as pd

DATABASE = 'data.csv'

CARD_NAME = 'Card Name'
QUANTITY = 'Quantity'

def database_exist() ->bool:
    return os.path.exists(DATABASE)

def create_db() -> None:
    if not database_exist():
        try:
            with open(DATABASE, 'x') as db:
                db.write(f'{CARD_NAME}, {QUANTITY}')
                pass
        except FileExistsError:
            pass

def write_db(card_list:list) -> None:
    # turns card list into a dataframe and add up the values
    card_count = pd.Series(card_list).value_counts()
    new_df = card_count.reset_index(name=QUANTITY)
    new_df = new_df.rename(columns={'index': CARD_NAME})
    
    # read existing db
    db = pd.read_csv(DATABASE)
    
    # merge new and old dataframes
    combined_df = pd.concat([db, new_df], ignore_index=True)
    updated_df = combined_df.groupby(CARD_NAME, as_index=False)[QUANTITY].sum()
    updated_df[QUANTITY] = updated_df[QUANTITY].astype(int)
    
    # save new df to database file
    updated_df.to_csv(DATABASE, index=False)


def read_db():
    df = pd.read_csv(DATABASE)
    return df


if __name__ == '__main__':
    test_data = ['test', 'br', 'br' , 'blab', 'asdf', 'asdf','asdf']
    create_db()
    write_db(test_data)
    print(read_db())