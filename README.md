# TP1
## Test sur une série de 30 jours et 1 jours
### serie de 30 jours
* bloquant *
  - mesures: 144000
  - poids_moyen_kg: 38.74
  - duree_ms: 224.96
  - pire /ping: 219 ms

* flux *
  - mesures: 144000
  - poids_moyen_kg: 38.74
  - duree_ms: 225.19
  - pire /ping: 3 ms

### serie de 1 jours
* bloquant *
  - mesures: 4800
  - poids_moyen_kg: 37.86
  - duree_ms: 7.67
  - pire /ping: 3 ms

* flux *
  - mesures: 4800
  - poids_moyen_kg: 37.86
  - duree_ms: 12.65
  - pire /ping: 3 ms

# Questions:
1.Pourquoi /ping attend-il pendant l’import bloquant ?  
--> Node.js exécute le JavaScript sur un seul thread. readFileSync, le découpage et les JSON.parse s’exécutent d’un bloc sans rendre la main, donc la boucle d’événements ne peut traiter aucune autre requête avant la fin.

2.La lecture en flux est-elle plus rapide ?  
--> Non, le travail total est le même, voire un peu plus long. Elle apporte la réactivité : for await rend la main à la boucle d’événements entre deux morceaux, donc les autres requêtes sont servies, et la mémoire reste faible (pas besoin de charger tout le fichier).

3.Pourquoi l’effet est-il presque invisible avec 1 jour ?  
--> 4 800 lignes se traitent en quelques millisecondes : le blocage est trop court pour être perçu par la sonde (ping toutes les 10 ms).

# TP2
## Verification:
- [x] GET /api/hives?site_id=SN-CASA ne renvoie que des ruches de SN-CASA
- [x] GET /api/hives/XX-NOPE-999 renvoie 404
- [x] Une mesure créée renvoie 201, pas 200
- [x] Chaque requête apparaît une seule fois dans le journal

* collection :
```
{
	"log": {
		"version": "1.2",
		"creator": {
			"name": "Insomnia REST Client",
			"version": "insomnia.desktop.app:v11.0.2"
		},
		"entries": [
			{
				"startedDateTime": "2026-11-20T09:22:50.374Z",
				"time": 3.419,
				"request": {
					"method": "POST",
					"url": "http://localhost:4000/api/hives/SN-CASA-001/measures",
					"httpVersion": "HTTP/1.1",
					"cookies": [],
					"headers": [
						{
							"name": "Content-Type",
							"value": "application/json"
						},
						{
							"name": "User-Agent",
							"value": "insomnia/11.0.2"
						}
					],
					"queryString": [],
					"postData": {
						"mimeType": "application/json",
						"text": "{\n  \"weight_kg\": 36.84\n}"
					},
					"headersSize": -1,
					"bodySize": -1
				},
				"response": {
					"status": 400,
					"statusText": "Bad Request",
					"httpVersion": "HTTP/1.1",
					"cookies": [],
					"headers": [
						{
							"name": "X-Powered-By",
							"value": "Express"
						},
						{
							"name": "Content-Type",
							"value": "application/json; charset=utf-8"
						},
						{
							"name": "Content-Length",
							"value": "52"
						},
						{
							"name": "ETag",
							"value": "W/\"34-o87pv0qXlwv2+P5fEiDtL06DYIY\""
						},
						{
							"name": "Date",
							"value": "Fri, 20 Nov 2026 09:17:52 GMT"
						},
						{
							"name": "Connection",
							"value": "keep-alive"
						},
						{
							"name": "Keep-Alive",
							"value": "timeout=5"
						}
					],
					"content": {
						"size": 52,
						"mimeType": "application/json; charset=utf-8",
						"text": "{\"error\":\"timestamp et weight_kg sont obligatoires\"}"
					},
					"redirectURL": "",
					"headersSize": -1,
					"bodySize": -1
				},
				"cache": {},
				"timings": {
					"blocked": -1,
					"dns": -1,
					"connect": -1,
					"send": 0,
					"wait": 3.419,
					"receive": 0,
					"ssl": -1
				},
				"comment": "New Request"
			},
			{
				"startedDateTime": "2026-11-20T09:22:50.374Z",
				"time": 6.998,
				"request": {
					"method": "POST",
					"url": "http://localhost:4000/api/hives/SN-CASA-001/measures",
					"httpVersion": "HTTP/1.1",
					"cookies": [],
					"headers": [
						{
							"name": "Content-Type",
							"value": "application/json"
						},
						{
							"name": "User-Agent",
							"value": "insomnia/11.0.2"
						}
					],
					"queryString": [],
					"postData": {
						"mimeType": "application/json",
						"text": "{\n\t\"timestamp\": 1700000000 ,\n  \"weight_kg\": 36.84\n}"
					},
					"headersSize": -1,
					"bodySize": -1
				},
				"response": {
					"status": 201,
					"statusText": "Created",
					"httpVersion": "HTTP/1.1",
					"cookies": [],
					"headers": [
						{
							"name": "X-Powered-By",
							"value": "Express"
						},
						{
							"name": "Content-Type",
							"value": "application/json; charset=utf-8"
						},
						{
							"name": "Content-Length",
							"value": "86"
						},
						{
							"name": "ETag",
							"value": "W/\"56-Y9tBlKcgbXA94tIMXByo5XakMxE\""
						},
						{
							"name": "Date",
							"value": "Fri, 20 Nov 2026 09:16:55 GMT"
						},
						{
							"name": "Connection",
							"value": "keep-alive"
						},
						{
							"name": "Keep-Alive",
							"value": "timeout=5"
						}
					],
					"content": {
						"size": 86,
						"mimeType": "application/json; charset=utf-8",
						"text": "{\"timestamp\":1700000000,\"weight_kg\":36.84,\"hive_id\":\"SN-CASA-001\",\"site_id\":\"SN-CASA\"}"
					},
					"redirectURL": "",
					"headersSize": -1,
					"bodySize": -1
				},
				"cache": {},
				"timings": {
					"blocked": -1,
					"dns": -1,
					"connect": -1,
					"send": 0,
					"wait": 6.998,
					"receive": 0,
					"ssl": -1
				},
				"comment": "New Request"
			},
			{
				"startedDateTime": "2026-11-20T09:22:50.374Z",
				"time": 2.6740000000000004,
				"request": {
					"method": "GET",
					"url": "http://localhost:4000/api/hives/XX-NOPE-999",
					"httpVersion": "HTTP/1.1",
					"cookies": [],
					"headers": [
						{
							"name": "Content-Type",
							"value": "application/json"
						},
						{
							"name": "User-Agent",
							"value": "insomnia/11.0.2"
						}
					],
					"queryString": [],
					"postData": {
						"mimeType": "application/json",
						"text": ""
					},
					"headersSize": -1,
					"bodySize": -1
				},
				"response": {
					"status": 404,
					"statusText": "Not Found",
					"httpVersion": "HTTP/1.1",
					"cookies": [],
					"headers": [
						{
							"name": "X-Powered-By",
							"value": "Express"
						},
						{
							"name": "Content-Type",
							"value": "application/json; charset=utf-8"
						},
						{
							"name": "Content-Length",
							"value": "29"
						},
						{
							"name": "ETag",
							"value": "W/\"1d-CYs7BbrQUc9KQhwhAv95Or8SqLU\""
						},
						{
							"name": "Date",
							"value": "Fri, 20 Nov 2026 09:15:57 GMT"
						},
						{
							"name": "Connection",
							"value": "keep-alive"
						},
						{
							"name": "Keep-Alive",
							"value": "timeout=5"
						}
					],
					"content": {
						"size": 29,
						"mimeType": "application/json; charset=utf-8",
						"text": "{\"error\":\"Ruche introuvable\"}"
					},
					"redirectURL": "",
					"headersSize": -1,
					"bodySize": -1
				},
				"cache": {},
				"timings": {
					"blocked": -1,
					"dns": -1,
					"connect": -1,
					"send": 0,
					"wait": 2.6740000000000004,
					"receive": 0,
					"ssl": -1
				},
				"comment": "New Request"
			},
			{
				"startedDateTime": "2026-11-20T09:22:50.374Z",
				"time": 2.282,
				"request": {
					"method": "GET",
					"url": "http://localhost:4000/api/hives/SN-CASA-001",
					"httpVersion": "HTTP/1.1",
					"cookies": [],
					"headers": [
						{
							"name": "User-Agent",
							"value": "insomnia/11.0.2"
						}
					],
					"queryString": [],
					"postData": {
						"mimeType": "",
						"text": ""
					},
					"headersSize": -1,
					"bodySize": -1
				},
				"response": {
					"status": 200,
					"statusText": "OK",
					"httpVersion": "HTTP/1.1",
					"cookies": [],
					"headers": [
						{
							"name": "X-Powered-By",
							"value": "Express"
						},
						{
							"name": "Content-Type",
							"value": "application/json; charset=utf-8"
						},
						{
							"name": "Content-Length",
							"value": "58"
						},
						{
							"name": "ETag",
							"value": "W/\"3a-wOibqgD56El62VH13Q1UIjvUWJE\""
						},
						{
							"name": "Date",
							"value": "Fri, 20 Nov 2026 09:14:56 GMT"
						},
						{
							"name": "Connection",
							"value": "keep-alive"
						},
						{
							"name": "Keep-Alive",
							"value": "timeout=5"
						}
					],
					"content": {
						"size": 58,
						"mimeType": "application/json; charset=utf-8",
						"text": "{\"id\":\"SN-CASA-001\",\"site_id\":\"SN-CASA\",\"status\":\"active\"}"
					},
					"redirectURL": "",
					"headersSize": -1,
					"bodySize": -1
				},
				"cache": {},
				"timings": {
					"blocked": -1,
					"dns": -1,
					"connect": -1,
					"send": 0,
					"wait": 2.282,
					"receive": 0,
					"ssl": -1
				},
				"comment": "New Request"
			},
			{
				"startedDateTime": "2026-11-20T09:22:50.374Z",
				"time": 3.9909999999999997,
				"request": {
					"method": "GET",
					"url": "http://localhost:4000/api/hives?site_id=SN-CASA",
					"httpVersion": "HTTP/1.1",
					"cookies": [],
					"headers": [
						{
							"name": "User-Agent",
							"value": "insomnia/11.0.2"
						}
					],
					"queryString": [],
					"postData": {
						"mimeType": "",
						"text": ""
					},
					"headersSize": -1,
					"bodySize": -1
				},
				"response": {
					"status": 200,
					"statusText": "OK",
					"httpVersion": "HTTP/1.1",
					"cookies": [],
					"headers": [
						{
							"name": "X-Powered-By",
							"value": "Express"
						},
						{
							"name": "Content-Type",
							"value": "application/json; charset=utf-8"
						},
						{
							"name": "Content-Length",
							"value": "180"
						},
						{
							"name": "ETag",
							"value": "W/\"b4-nWcdGHb15/BLqNh0Eb2oK2pDECI\""
						},
						{
							"name": "Date",
							"value": "Fri, 20 Nov 2026 09:14:36 GMT"
						},
						{
							"name": "Connection",
							"value": "keep-alive"
						},
						{
							"name": "Keep-Alive",
							"value": "timeout=5"
						}
					],
					"content": {
						"size": 180,
						"mimeType": "application/json; charset=utf-8",
						"text": "[{\"id\":\"SN-CASA-001\",\"site_id\":\"SN-CASA\",\"status\":\"active\"},{\"id\":\"SN-CASA-002\",\"site_id\":\"SN-CASA\",\"status\":\"active\"},{\"id\":\"SN-CASA-003\",\"site_id\":\"SN-CASA\",\"status\":\"inactive\"}]"
					},
					"redirectURL": "",
					"headersSize": -1,
					"bodySize": -1
				},
				"cache": {},
				"timings": {
					"blocked": -1,
					"dns": -1,
					"connect": -1,
					"send": 0,
					"wait": 3.9909999999999997,
					"receive": 0,
					"ssl": -1
				},
				"comment": "New Request"
			},
			{
				"startedDateTime": "2026-11-20T09:22:50.374Z",
				"time": 2.682,
				"request": {
					"method": "GET",
					"url": "http://localhost:4000/api/hives",
					"httpVersion": "HTTP/1.1",
					"cookies": [],
					"headers": [
						{
							"name": "User-Agent",
							"value": "insomnia/11.0.2"
						}
					],
					"queryString": [],
					"postData": {
						"mimeType": "",
						"text": ""
					},
					"headersSize": -1,
					"bodySize": -1
				},
				"response": {
					"status": 200,
					"statusText": "OK",
					"httpVersion": "HTTP/1.1",
					"cookies": [],
					"headers": [
						{
							"name": "X-Powered-By",
							"value": "Express"
						},
						{
							"name": "Content-Type",
							"value": "application/json; charset=utf-8"
						},
						{
							"name": "Content-Length",
							"value": "298"
						},
						{
							"name": "ETag",
							"value": "W/\"12a-JrS5fNb7UFgSYF5e6GFmFPRpm2w\""
						},
						{
							"name": "Date",
							"value": "Fri, 20 Nov 2026 09:14:21 GMT"
						},
						{
							"name": "Connection",
							"value": "keep-alive"
						},
						{
							"name": "Keep-Alive",
							"value": "timeout=5"
						}
					],
					"content": {
						"size": 298,
						"mimeType": "application/json; charset=utf-8",
						"text": "[{\"id\":\"SN-CASA-001\",\"site_id\":\"SN-CASA\",\"status\":\"active\"},{\"id\":\"SN-CASA-002\",\"site_id\":\"SN-CASA\",\"status\":\"active\"},{\"id\":\"SN-CASA-003\",\"site_id\":\"SN-CASA\",\"status\":\"inactive\"},{\"id\":\"SN-DAKA-001\",\"site_id\":\"SN-DAKA\",\"status\":\"active\"},{\"id\":\"SN-DAKA-002\",\"site_id\":\"SN-DAKA\",\"status\":\"active\"}]"
					},
					"redirectURL": "",
					"headersSize": -1,
					"bodySize": -1
				},
				"cache": {},
				"timings": {
					"blocked": -1,
					"dns": -1,
					"connect": -1,
					"send": 0,
					"wait": 2.682,
					"receive": 0,
					"ssl": -1
				},
				"comment": "New Request"
			},
			{
				"startedDateTime": "2026-11-20T09:22:50.374Z",
				"time": 3.2230000000000003,
				"request": {
					"method": "GET",
					"url": "http://localhost:4000/health",
					"httpVersion": "HTTP/1.1",
					"cookies": [],
					"headers": [
						{
							"name": "User-Agent",
							"value": "insomnia/11.0.2"
						}
					],
					"queryString": [],
					"postData": {
						"mimeType": "",
						"text": ""
					},
					"headersSize": -1,
					"bodySize": -1
				},
				"response": {
					"status": 200,
					"statusText": "OK",
					"httpVersion": "HTTP/1.1",
					"cookies": [],
					"headers": [
						{
							"name": "X-Powered-By",
							"value": "Express"
						},
						{
							"name": "Content-Type",
							"value": "application/json; charset=utf-8"
						},
						{
							"name": "Content-Length",
							"value": "15"
						},
						{
							"name": "ETag",
							"value": "W/\"f-VaSQ4oDUiZblZNAEkkN+sX+q3Sg\""
						},
						{
							"name": "Date",
							"value": "Fri, 20 Nov 2026 09:14:03 GMT"
						},
						{
							"name": "Connection",
							"value": "keep-alive"
						},
						{
							"name": "Keep-Alive",
							"value": "timeout=5"
						}
					],
					"content": {
						"size": 15,
						"mimeType": "application/json; charset=utf-8",
						"text": "{\"status\":\"ok\"}"
					},
					"redirectURL": "",
					"headersSize": -1,
					"bodySize": -1
				},
				"cache": {},
				"timings": {
					"blocked": -1,
					"dns": -1,
					"connect": -1,
					"send": 0,
					"wait": 3.2230000000000003,
					"receive": 0,
					"ssl": -1
				},
				"comment": "New Request"
			}
		]
	}
}
```

# TP3
## contrat du projet:
 ./docs/api.md

# TP4:
## rendu:

```
npm test
  > queenbee-kit-etudiants-jour1@1.0.0 test
  > node --test

  ✔ refuse un poids hors de sa plage physique (1.261379ms)
  ✔ enregistre une mesure valide (4.102468ms)
  ℹ tests 2
  ℹ suites 0
  ℹ pass 2
  ℹ fail 0
  ℹ cancelled 0
  ℹ skipped 0
  ℹ todo 0
  ℹ duration_ms 80.159935
```
