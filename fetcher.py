from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

TIME_OUT = 10

def get_content(link: str, xpath: str)-> str:

    options = webdriver.ChromeOptions()
    
    options.add_argument('--headless=new')

    driver = webdriver.Chrome(options=options)

    driver.get(link)
    
    try:
        wait = WebDriverWait(driver, TIME_OUT)
        element = wait.until(EC.presence_of_element_located((By.XPATH, xpath)))
        content = element.text
    
    except Exception as e:
       print(f'Error finding element with Xpath "{xpath}" on {link}: {e}')
       content = None
    
    finally:
        driver.quit()

    assert content is not None, f'Content was not found after {TIME_OUT} seconds.'
    
    return content

def get_manabox_content(link:str) -> str:
   xpath = '/html/body/div[1]/astro-island/div/div/div[2]/div[2]/div[2]/div' 

   return get_content(link, xpath)

def get_moxfield_content(link:str) -> str:
   xpath = '/html/body/div/main/div[3]/div[5]/section/div[2]/article'

   return get_content(link, xpath)


def get(link: str) -> str:
    
    DOMAINS = {
        'https://manabox.app/': get_manabox_content,
        'https://moxfield.com/': get_moxfield_content
    }

    for domain, func in DOMAINS.items():
        if link.startswith(domain):
            return func(link)

    raise ValueError(f'Failed to match {link} with a supported domain.')


   
if __name__ == '__main__':
  
   var = get('https://moxfield.com/decks/mLvJIellBEGt7KPWqgwefQ')
   print(var)