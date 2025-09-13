from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import os

def download_list(link: str)-> None:

    download_dir = os.path.join(os.getcwd(), 'data')
    if not os.path.exists(download_dir):
        os.makedirs(download_dir)

    print(download_dir)
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
        driver.quit()