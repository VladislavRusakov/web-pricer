import requests

from bs4 import BeautifulSoup as BS


def searcher(steamid: str):
    """Забирает вишлист, ищет цены в стиме и на сайте магазина. Создаёт ссылки"""
    SHOP_SEARCH_URL = 'https://steampay.com/search?q='
    SHOP_GAME_URL = 'https://steampay.com/game/'


    response = requests.get(f'https://store.steampowered.com/wishlist/profiles/{steamid}/wishlistdata').json()

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

    for item in wishlist:
        """Основной цикл поиска цен на игры из ввишлиста в магазине"""
        shopgamelink = f"{SHOP_GAME_URL}{item['lowercasename']}"
        response = requests.get(shopgamelink)

        steamlink = f"https://store.steampowered.com/app/{item['id']}/"
        item['steamlink'] = steamlink

        # print(item['name'])
        # print(f"Steam price is - {item['price']}")
        # print(steamlink)

        if response.status_code == 200:
            """Нашлась страница товара в магазине
            Добавляет цену в рублях с сайта"""
            soup = BS(response.text, "html.parser")
            rub_price = soup.find("div", class_=("product__current-price")).text.replace('\n', '')

            # print(f'Steampay price is - {rub_price}')
            # print(shopgamelink)

            item['rubprice'] = rub_price
            item['shopgamelink'] = shopgamelink
        else:
            """Не нашлась страница игры. Пытаемся найти игру в поиске"""
            shopsearchlink = f"{SHOP_SEARCH_URL}{item['name'].lower().replace(' ', '+')}"
            response = requests.get(shopsearchlink)
            soup = BS(response.text, "html.parser")

            if len(soup.find_all('a', class_="catalog-item")) > 0:
                """Нашлось хотя бы одно совпадение с названием игры в поиске"""
                # print(f'Game not found: {shopsearchlink}')
                item['shopsearchlink'] = shopsearchlink
        # print("-" * 20 + "\n")
    """Сортировка по цене в магазине"""
    # wishlist = sorted(wishlist, key=lambda d:d['rubprice'], reverse=True)
    return wishlist
