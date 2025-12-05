# Manacheck: A simple MTG filtering tool

ManaCheck is a Python utility for comparing  MTG decklists from web platforms.

_"Searches the cards **you** want in the decklists some rando sent."_

## 🚀 Setup

### Prerequisites

-   Python: Requires `3.13` or higher.

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

### 🌐 Currently supported sites:

-   [ManaBox](https://manabox.app/)

-   [Moxfield](https://moxfield.com/)

---

_Data collection relies on specific CSS Selectors on some sites. Maintenance will be required if the target websites change their HTML structure._
