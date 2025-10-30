# Manacheck: A simple MTG filtering tool

ManaCheck is a Python CLI utility for comparing two Magic: The Gathering decklists fetched from web platforms. It identifies which cards from one decklist are present in another.

## 🚀 Setup

### Prerequisites

-   Python: Requires `3.13` or higher.

-   Google Chrome: Must be installed on your system.

### Installation

Clone the repository:

```shell
git clone https://github.com/xdainz/manacheck.git
cd manacheck
```

Install dependencies:

```shell
pip install -r requirements.txt
```

## 🐣 How to use Manacheck

Run the main script:

```shell
python main.py
```

You will be prompted for the URL of the decklists you want to filter

-   Search Link &rarr; the decklist that contains the cards you are looking for.

-   Repository Link &rarr; the decklist some dude posted and you want to filter through.

## ⚙️ How it works

Manacheck scrapes using a headless Chrome instance via Selenium to handle JS rendering directly from the provided decklist URLs and performs a text-based comparison to identify card name matches.

Currently supported sites:

-   [ManaBox](https://manabox.app/)

-   [Moxfield](https://moxfield.com/)

---

_Scraping relies on specific CSS Selectors for each site. Maintenance will be required if the target websites change their HTML structure._
