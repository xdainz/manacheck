
def readFile(filename: str ) -> set[str]:
    raw_array: list[str] = []
    cleaned_array: set[str] = set()
    try:
        with open(filename, 'r') as repository:
            raw_array = repository.readlines()
            repository.close()

    finally:
        for line in raw_array.copy():
            if line != 'Commander\n' and line != 'Deck\n' and line != '\n':
                split_card: list = line.split()
                split_card.pop(0)
                final_card = ' '.join(split_card)
                cleaned_array.add(final_card)
                
        return cleaned_array
        
            
def searchMatches(search_file: str, repository_file: str) -> set[str]:
        look_up: set[str] = readFile(search_file)
        repository: set[str] = readFile(repository_file)

        matches: set[str] = set()

        for card in look_up:
            if card in repository:
                matches.add(card)

        return matches