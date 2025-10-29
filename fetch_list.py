from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

def get_list(link: str)-> None:

    options = webdriver.ChromeOptions()
    
    options.add_argument('--headless=new')

    driver = webdriver.Chrome(options=options)

    driver.get(link)
    
    content = driver.find_element(By.XPATH, '/html/body/div[1]/astro-island/div/div/div[2]/div[2]/div[2]/div')
    
    assert content is not None

    driver.quit()

if __name__ == '__main__':
    get_list('https://manabox.app/decks/vYzyl7ykTz6UtEkrlQB1bA')