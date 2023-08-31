import requests

from bs4 import BeautifulSoup as BS
import aiohttp
import asyncio


def searcher(steamid: str):  
    """Main async web scrapping funcion"""

    async def http_get(session, url, item):
        """Sends request, parses the response, fills in the wishlist"""
        async with session.get(url) as response:
            if response.status == 200:
                data = await response.text()
                soup = BS(data, "html.parser")
                item['rubprice'] = soup.find("div", class_=("product__current-price")).text.replace('\n', '')
            else:
                item['shopgamelink'] = ''
                shopsearchlink = f"{SHOP_SEARCH_URL}{item['name'].lower().replace(' ', '+')}"
                async with session.get(shopsearchlink) as response:
                    data = await response.text()
                    soup = BS(data, "html.parser")
                    if len(soup.find_all('a', class_="catalog-item")) > 0:
                        item['shopsearchlink'] = shopsearchlink
            
    async def create_task_list(session, wishlist):
        """Second function of async part. Iterates through wishlist and creates list of tasks with requests"""
        tasks = []
        for item in wishlist:
            item['steamlink'] = f"https://store.steampowered.com/app/{item['id']}/"
            task = asyncio.create_task(http_get(session, item['shopgamelink'], item))
            tasks.append(task)
        results = await asyncio.gather(*tasks)
        return results

    async def main(wishlist):
        """Entry point for async srapping. Creates a session. Calls create_task_list()"""
        async with aiohttp.ClientSession() as session:
            data = await create_task_list(session, wishlist)
            return data

    """Function starts working here with getting a wishlist via steam API"""
    SHOP_SEARCH_URL = 'https://steampay.com/search?q='
    SHOP_GAME_URL = 'https://steampay.com/game/'

    response = requests.get(f'https://store.steampowered.com/wishlist/profiles/{steamid}/wishlistdata').json()

    """This cycle creates a list of dicts and fills in the data"""
    wishlist = []
    for key in response.keys():
        price = 'none'
        if response[key]['subs']:
            price = str(response[key]['subs'][0]['price'])
            price = f"{price[0:-2]}.{price[-2:]}$"
        name = response[key]['name'].replace('™', '').replace('®', '')
        wishlist.append({"name": name,
                        "lowercasename": name.lower().replace(' - ', '-').replace(' ', '-').replace(':', ''),
                        "price": price,
                        "id": key,
                        "steamlink":'',
                        "rubprice": '',
                        "shopgamelink": '',
                        "shopsearchlink": '',
                        })
    
    """Adds urls to the data wishlist"""
    for item in wishlist:
        item['shopgamelink'] = f"{SHOP_GAME_URL}{item['lowercasename']}"
    
    """Here comes an async part. Look at main()"""
    asyncio.run(main(wishlist))
    return wishlist
