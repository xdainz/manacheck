from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

TIME_OUT = 10

def get_content(link: str, selector: str)-> str:

    options = webdriver.ChromeOptions()
    
    options.add_argument('--headless=new')

    driver = webdriver.Chrome(options=options)

    driver.get(link)
    
    try:
        wait = WebDriverWait(driver, TIME_OUT)
        element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
        content = element.text
    
    except Exception as e:
       print(f'Error finding element with CSS Selector "{selector}" on {link}: {e}')
       content = None
    
    finally:
        driver.quit()

    assert content is not None, f'Content was not found after {TIME_OUT} seconds.'
    
    return content

def get_manabox_content(link:str) -> str:
    selector = 'body > div.flex-1.w-full > astro-island > div > div > div.flex.w-full.flex-col.items-center.rounded-b-lg.border-2.border-\\[--surface-container-highest\\].bg-\\[--surface-container-regular\\].pb-3.pt-3 > div.flex.w-full > div.flex-1 > div > div' 

    return get_content(link, selector)

def get_moxfield_content(link:str) -> str:
    selector = '#maincontent > div.deck-dnd-wrapper > div.container.mt-3.mb-5 > section > div:nth-child(3) > article'

    return get_content(link, selector)

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