
def readFile(filename: str ) -> list:
    try:
        with open(filename, 'r') as repository:
            raw_array = repository.readlines()
            cleaned_array = []

            for line in raw_array.copy():
                if line != 'Commander\n' and line != 'Deck\n' and line != '\n':
                    cleaned_array.append(line[1:-1])
            
        repository.close()
        return cleaned_array
        
    except FileNotFoundError:
        raise Exception(f"Error: File '{filename}' not found")


def searchMatches(search_file: str, repository_file: str) -> list:
        look_up: list = readFile(search_file)
        repository: list = readFile(repository_file)

        matches: list = []

        for card in look_up:
            if card in repository:
                matches.append(card)

        return matches


def readFiles() -> None:
    for match in searchMatches('search.txt','repository.txt'):
        print(match)


if __name__ == '__main__':
    readFiles()