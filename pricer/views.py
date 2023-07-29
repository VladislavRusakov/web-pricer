import os
from pathlib import Path
from django.shortcuts import render
from django.http import JsonResponse, HttpResponse, Http404
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator

import json

from . import searcher


def mainview(request):
    return render(request, 'index.html',)


@csrf_exempt
def ajax(request):
    if request.method == 'POST':
        steamiddata = json.loads(request.body.decode("utf-8"))
        data = searcher.searcher(steamid=steamiddata['steamid'])
    return JsonResponse({'wishlist': data})