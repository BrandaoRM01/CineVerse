import requests

def fazer_requisicao(url):
    r = requests.get(url)
    
    if r.status_code == 200: 
        return r.json() 
    else:
        return {}