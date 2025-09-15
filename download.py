from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os
from time import sleep
from utils import rename_last_file

def download_list(link: str, file_name: str)-> str:

    download_dir = os.path.join(os.getcwd(), 'data')

    if os.path.exists(os.path.join(download_dir, 'search.txt')):
        print(os.path.join(download_dir, 'search.txt'))
        return 'search.txt'

    if not os.path.exists(download_dir):
        os.makedirs(download_dir)

    options = webdriver.ChromeOptions()
    
    prefs = {'download.default_directory': download_dir}
    
    options.add_experimental_option("prefs", prefs)

    driver = webdriver.Chrome( options=options)
    driver.get(link)
    
    try:
        download_button = WebDriverWait(driver, 10).until(
            EC.element_to_be_clickable((By.CSS_SELECTOR, '[aria-label="Download deck file"]')))

        download_button.click()

    finally:
        sleep(2)
        driver.quit()
        return rename_last_file(f'{file_name}.txt')