const mapsDB = {
    "abraham": {
        "title": "Viajes de Abraham",
        "color": "#27ae60",
        "image": "https://picsum.photos/800/600?random=1",
        "bounds": [[0, 0], [1000, 1000]],
        "markers": [
            { "id": 1, "coords": [750, 850], "title": "Ur de los Caldeos", "desc": "Ciudad de origen de Abram. Dios lo llama a dejar su tierra y su parentela.", "ref": "Génesis 11:31", "image": "https://picsum.photos/800/600?random=2", "year": -2090 },
            { "id": 2, "coords": [900, 500], "title": "Harán", "desc": "Lugar donde se asienta la familia de Taré y donde este muere. Abram parte desde aquí a los 75 años.", "ref": "Génesis 11:31-12:4", "image": "https://picsum.photos/800/600?random=3", "year": -2085 },
            { "id": 3, "coords": [650, 300], "title": "Siquem (Canaán)", "desc": "Primer campamento en Canaán. Dios promete esta tierra a su descendencia.", "ref": "Génesis 12:6-7", "image": "https://picsum.photos/800/600?random=4", "year": -2080 },
            { "id": 4, "coords": [400, 150], "title": "Egipto", "desc": "Debido al hambre en Canaán, Abram desciende a Egipto.", "ref": "Génesis 12:10-20", "image": "https://picsum.photos/800/600?random=5", "year": -2078 },
            { "id": 5, "coords": [550, 300], "title": "Hebrón / Mamre", "desc": "Lugar donde se establece Abraham permanentemente y donde compra la cueva de Macpela.", "ref": "Génesis 13:18, 23:19", "image": "https://picsum.photos/800/600?random=6", "year": -2060 },
            { "id": 6, "coords": [520, 250], "title": "Beerseba", "desc": "Pacto con Abimelec y donde Abraham planta un tamarisco invocando a El Olam.", "ref": "Génesis 21:31-33", "image": "https://picsum.photos/800/600?random=7", "year": -2050 },
            { "id": 7, "coords": [600, 320], "title": "Monte Moriah", "desc": "Prueba suprema: el sacrificio (ligadura) de Isaac.", "ref": "Génesis 22:2", "image": "https://picsum.photos/800/600?random=8", "year": -2040 }
        ]
    },
    "exodo": {
        "title": "Éxodo de Israel",
        "color": "#2980b9",
        "image": "https://picsum.photos/800/600?random=9",
        "bounds": [[0, 0], [1000, 1000]],
        "markers": [
            { "id": 1, "coords": [800, 200], "title": "Ramesés / Gosén", "desc": "Punto de partida de los israelitas de Egipto tras las diez plagas.", "ref": "Éxodo 12:37", "image": "https://picsum.photos/800/600?random=10", "year": -1446 },
            { "id": 2, "coords": [600, 350], "title": "Cruce del Mar Rojo", "desc": "Dios divide las aguas para el paso de Israel y destruye al ejército del faraón.", "ref": "Éxodo 14:21-22", "image": "https://picsum.photos/800/600?random=11", "year": -1446 },
            { "id": 3, "coords": [200, 500], "title": "Monte Sinaí", "desc": "Entrega de los Diez Mandamientos y construcción del Tabernáculo.", "ref": "Éxodo 19-20", "image": "https://picsum.photos/800/600?random=12", "year": -1445 },
            { "id": 4, "coords": [700, 550], "title": "Cades Barnea", "desc": "Envío de los 12 espías. Rebelión del pueblo y sentencia de 40 años en el desierto.", "ref": "Números 13-14", "image": "https://picsum.photos/800/600?random=13", "year": -1444 },
            { "id": 5, "coords": [750, 750], "title": "Monte Nebo / Moab", "desc": "Moisés ve la Tierra Prometida antes de morir. Josué asume el liderazgo.", "ref": "Deuteronomio 34:1-4", "image": "https://picsum.photos/800/600?random=14", "year": -1406 }
        ]
    },
    "josue": {
        "title": "Conquistas de Josué",
        "color": "#8e44ad",
        "image": "https://picsum.photos/800/600?random=15",
        "bounds": [[0, 0], [1000, 1000]],
        "markers": [
            { "id": 1, "coords": [450, 700], "title": "Paso del Jordán", "desc": "Israel cruza el río Jordán en seco y levanta 12 piedras en Gilgal.", "ref": "Josué 3-4", "image": "https://picsum.photos/800/600?random=16", "year": -1406 },
            { "id": 2, "coords": [480, 650], "title": "Jericó", "desc": "Caída milagrosa de las murallas de Jericó tras 7 días de marchas.", "ref": "Josué 6", "image": "https://picsum.photos/800/600?random=17", "year": -1406 },
            { "id": 3, "coords": [520, 600], "title": "Hai", "desc": "Derrota inicial por el pecado de Acán, seguida de una victoria táctica.", "ref": "Josué 7-8", "image": "https://picsum.photos/800/600?random=18", "year": -1405 },
            { "id": 4, "coords": [350, 550], "title": "Campaña del Sur (Gabaón)", "desc": "El sol se detiene sobre Gabaón para derrotar a los 5 reyes amorreos.", "ref": "Josué 10", "image": "https://picsum.photos/800/600?random=19", "year": -1404 },
            { "id": 5, "coords": [800, 600], "title": "Campaña del Norte (Hazor)", "desc": "Victoria sobre la coalición del norte y destrucción de Hazor.", "ref": "Josué 11", "image": "https://picsum.photos/800/600?random=20", "year": -1400 }
        ]
    },
    "david": {
        "title": "Reino de David",
        "color": "#f39c12",
        "image": "https://picsum.photos/800/600?random=21",
        "bounds": [[0, 0], [1000, 1000]],
        "markers": [
            { "id": 1, "coords": [350, 450], "title": "Belén", "desc": "Lugar de nacimiento y unción secreta de David por el profeta Samuel.", "ref": "1 Samuel 16:1-13", "image": "https://picsum.photos/800/600?random=22", "year": -1040 },
            { "id": 2, "coords": [450, 300], "title": "Valle de Ela", "desc": "Batalla épica donde el joven David derrota al gigante filisteo Goliat.", "ref": "1 Samuel 17", "image": "https://picsum.photos/800/600?random=23", "year": -1025 },
            { "id": 3, "coords": [300, 480], "title": "Hebrón", "desc": "David es coronado rey sobre Judá, reinando aquí por 7 años y medio.", "ref": "2 Samuel 2:1-4", "image": "https://picsum.photos/800/600?random=24", "year": -1010 },
            { "id": 4, "coords": [400, 480], "title": "Jerusalén (Jebús)", "desc": "David conquista la fortaleza jebusea y la establece como la Ciudad de David.", "ref": "2 Samuel 5:6-10", "image": "https://picsum.photos/800/600?random=25", "year": -1003 },
            { "id": 5, "coords": [650, 600], "title": "Expansión: Aram y Amón", "desc": "Victorias militares de David que expanden el reino hasta Siria y el Éufrates.", "ref": "2 Samuel 8 y 10", "image": "https://picsum.photos/800/600?random=26", "year": -990 }
        ]
    },
    "pablo": {
        "title": "Viajes Misioneros de Pablo",
        "color": "#c0392b",
        "image": "https://picsum.photos/800/600?random=27",
        "bounds": [[0, 0], [1000, 1000]],
        "markers": [
            { "id": 1, "coords": [400, 900], "title": "Antioquía de Siria", "desc": "Base de operaciones. Los discípulos son llamados cristianos por primera vez.", "ref": "Hechos 11:26", "image": "https://picsum.photos/800/600?random=28", "year": 47 },
            { "id": 2, "coords": [450, 700], "title": "Asia Menor (1er Viaje)", "desc": "Iconio, Listra y Derbe. Pablo es apedreado pero se levanta milagrosamente.", "ref": "Hechos 13-14", "image": "https://picsum.photos/800/600?random=29", "year": 48 },
            { "id": 3, "coords": [600, 350], "title": "Macedonia y Grecia (2do Viaje)", "desc": "Filipos, Tesalónica, Corinto. Pablo predica en el Areópago de Atenas.", "ref": "Hechos 15:36-18:22", "image": "https://picsum.photos/800/600?random=30", "year": 51 },
            { "id": 4, "coords": [450, 550], "title": "Éfeso (3er Viaje)", "desc": "Pablo enseña por 3 años. El alboroto de los plateros de Diana.", "ref": "Hechos 18:23-21:17", "image": "https://picsum.photos/800/600?random=31", "year": 54 },
            { "id": 5, "coords": [700, 150], "title": "Roma", "desc": "Pablo llega como prisionero pero predica el evangelio con denuedo en la capital del Imperio.", "ref": "Hechos 28:16-31", "image": "https://picsum.photos/800/600?random=32", "year": 60 }
        ]
    }
};
