import os
import pandas as pd

DATABASE = 'data.csv'

def database_exist() ->bool:
    return os.path.exists(DATABASE)

def create_db() -> None:
    if not database_exist():
        try:
            with open(DATABASE, 'x') as db:
                db.write('card_name, quantity')
                pass
        except FileExistsError:
            pass

def write_db(card_list:list) -> None:
    # turns card list into a dataframe and add up the values
    card_count = pd.Series(card_list).value_counts()
    new_df = card_count.reset_index(name='quantity')
    new_df = new_df.rename(columns={'index': 'card_name'})
    
    # read existing db
    db = pd.read_csv(DATABASE)
    
    # merge new and old dataframes
    combined_df = pd.concat([db, new_df], ignore_index=True)
    updated_df = combined_df.groupby('card_name', as_index=False)['quantity'].sum()
    updated_df['quantity'] = updated_df['quantity'].astype(int)
    
    # save new df to database file
    updated_df.to_csv(DATABASE, index=False)


def read_db():
    df = pd.read_csv(DATABASE)
    print(df)


if __name__ == '__main__':
    test_data = ['test', 'br', 'br' , 'blab', 'asdf', 'asdf','asdf']
    create_db()
    write_db(test_data)
    read_db()