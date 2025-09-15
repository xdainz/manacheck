
def readFile(filename: str ) -> list:
    raw_array: list = []
    cleaned_array: list = []
    try:
        with open(filename, 'r') as repository:
            raw_array = repository.readlines()
            repository.close()

    finally:
        for line in raw_array.copy():
            if line != 'Commander\n' and line != 'Deck\n' and line != '\n':
                cleaned_array.append(line[1:-1])
            
        return cleaned_array
        
            
def searchMatches(search_file: str, repository_file: str) -> list:
        look_up: list = readFile(search_file)
        repository: list = readFile(repository_file)

        matches: list = []

        for card in look_up:
            if card in repository:
                matches.append(card)

        return matches