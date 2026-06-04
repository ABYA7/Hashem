const mapsDB = {
    "abraham": {
        "title": "Viajes de Abraham",
        "color": "#27ae60",
        "image": "https://picsum.photos/800/600?random=1",
        "bounds": [[0, 0], [1000, 1000]],
        "markers": [
            { "id": 1, "coords": [750, 850], "title": "Ur de los Caldeos", "desc": "Ciudad de origen de Abram. Dios lo llama a dejar su tierra y su parentela.", "image": "https://picsum.photos/800/600?random=2", "year": -2090 },
            { "id": 2, "coords": [900, 500], "title": "Harán", "desc": "Lugar donde se asienta la familia de Taré y donde este muere. Abram parte desde aquí a los 75 años.", "image": "https://picsum.photos/800/600?random=3", "year": -2085 },
            { "id": 3, "coords": [650, 300], "title": "Siquem (Canaán)", "desc": "Primer campamento en Canaán. Dios promete esta tierra a su descendencia.", "image": "https://picsum.photos/800/600?random=4", "year": -2080 },
            { "id": 4, "coords": [400, 150], "title": "Egipto", "desc": "Debido al hambre en Canaán, Abram desciende a Egipto.", "image": "https://picsum.photos/800/600?random=5", "year": -2078 },
            { "id": 5, "coords": [550, 300], "title": "Hebrón / Mamre", "desc": "Lugar donde se establece Abraham permanentemente y donde compra la cueva de Macpela.", "image": "https://picsum.photos/800/600?random=6", "year": -2060 },
            { "id": 6, "coords": [520, 250], "title": "Beerseba", "desc": "Pacto con Abimelec y donde Abraham planta un tamarisco invocando a El Olam.", "image": "https://picsum.photos/800/600?random=7", "year": -2050 },
            { "id": 7, "coords": [600, 320], "title": "Monte Moriah", "desc": "Prueba suprema: el sacrificio (ligadura) de Isaac.", "image": "https://picsum.photos/800/600?random=8", "year": -2040 }
        ]
    },
    "exodo": {
        "title": "Éxodo de Israel",
        "color": "#2980b9",
        "image": "https://picsum.photos/800/600?random=9",
        "bounds": [[0, 0], [1000, 1000]],
        "markers": [
            { "id": 1, "coords": [800, 200], "title": "Ramesés / Gosén", "desc": "Punto de partida de los israelitas de Egipto tras las diez plagas.", "image": "https://picsum.photos/800/600?random=10", "year": -1446 },
            { "id": 2, "coords": [600, 350], "title": "Cruce del Mar Rojo", "desc": "Dios divide las aguas para el paso de Israel y destruye al ejército del faraón.", "image": "https://picsum.photos/800/600?random=11", "year": -1446 },
            { "id": 3, "coords": [200, 500], "title": "Monte Sinaí", "desc": "Entrega de los Diez Mandamientos y construcción del Tabernáculo.", "image": "https://picsum.photos/800/600?random=12", "year": -1445 },
            { "id": 4, "coords": [700, 550], "title": "Cades Barnea", "desc": "Envío de los 12 espías. Rebelión del pueblo y sentencia de 40 años en el desierto.", "image": "https://picsum.photos/800/600?random=13", "year": -1444 },
            { "id": 5, "coords": [750, 750], "title": "Monte Nebo / Moab", "desc": "Moisés ve la Tierra Prometida antes de morir. Josué asume el liderazgo.", "image": "https://picsum.photos/800/600?random=14", "year": -1406 }
        ]
    },
    "josue": {
        "title": "Conquistas de Josué",
        "color": "#8e44ad",
        "image": "https://picsum.photos/800/600?random=15",
        "bounds": [[0, 0], [1000, 1000]],
        "markers": [
            { "id": 1, "coords": [450, 700], "title": "Paso del Jordán", "desc": "Israel cruza el río Jordán en seco y levanta 12 piedras en Gilgal.", "image": "https://picsum.photos/800/600?random=16", "year": -1406 },
            { "id": 2, "coords": [480, 650], "title": "Jericó", "desc": "Caída milagrosa de las murallas de Jericó tras 7 días de marchas.", "image": "https://picsum.photos/800/600?random=17", "year": -1406 },
            { "id": 3, "coords": [520, 600], "title": "Hai", "desc": "Derrota inicial por el pecado de Acán, seguida de una victoria táctica.", "image": "https://picsum.photos/800/600?random=18", "year": -1405 },
            { "id": 4, "coords": [350, 550], "title": "Campaña del Sur (Gabaón)", "desc": "El sol se detiene sobre Gabaón para derrotar a los 5 reyes amorreos.", "image": "https://picsum.photos/800/600?random=19", "year": -1404 },
            { "id": 5, "coords": [800, 600], "title": "Campaña del Norte (Hazor)", "desc": "Victoria sobre la coalición del norte y destrucción de Hazor.", "image": "https://picsum.photos/800/600?random=20", "year": -1400 }
        ]
    },
    "david": {
        "title": "Reino de David",
        "color": "#f39c12",
        "image": "https://picsum.photos/800/600?random=21",
        "bounds": [[0, 0], [1000, 1000]],
        "markers": [
            { "id": 1, "coords": [350, 450], "title": "Belén", "desc": "Lugar de nacimiento y unción secreta de David por el profeta Samuel.", "image": "https://picsum.photos/800/600?random=22", "year": -1040 },
            { "id": 2, "coords": [450, 300], "title": "Valle de Ela", "desc": "Batalla épica donde el joven David derrota al gigante filisteo Goliat.", "image": "https://picsum.photos/800/600?random=23", "year": -1025 },
            { "id": 3, "coords": [300, 480], "title": "Hebrón", "desc": "David es coronado rey sobre Judá, reinando aquí por 7 años y medio.", "image": "https://picsum.photos/800/600?random=24", "year": -1010 },
            { "id": 4, "coords": [400, 480], "title": "Jerusalén (Jebús)", "desc": "David conquista la fortaleza jebusea y la establece como la Ciudad de David.", "image": "https://picsum.photos/800/600?random=25", "year": -1003 },
            { "id": 5, "coords": [650, 600], "title": "Expansión: Aram y Amón", "desc": "Victorias militares de David que expanden el reino hasta Siria y el Éufrates.", "image": "https://picsum.photos/800/600?random=26", "year": -990 }
        ]
    },
    "pablo": {
        "title": "Viajes Misioneros de Pablo",
        "color": "#c0392b",
        "image": "https://picsum.photos/800/600?random=27",
        "bounds": [[0, 0], [1000, 1000]],
        "markers": [
            { "id": 1, "coords": [400, 900], "title": "Antioquía de Siria", "desc": "Base de operaciones. Los discípulos son llamados cristianos por primera vez.", "image": "https://picsum.photos/800/600?random=28", "year": 47 },
            { "id": 2, "coords": [450, 700], "title": "Asia Menor (1er Viaje)", "desc": "Iconio, Listra y Derbe. Pablo es apedreado pero se levanta milagrosamente.", "image": "https://picsum.photos/800/600?random=29", "year": 48 },
            { "id": 3, "coords": [600, 350], "title": "Macedonia y Grecia (2do Viaje)", "desc": "Filipos, Tesalónica, Corinto. Pablo predica en el Areópago de Atenas.", "image": "https://picsum.photos/800/600?random=30", "year": 51 },
            { "id": 4, "coords": [450, 550], "title": "Éfeso (3er Viaje)", "desc": "Pablo enseña por 3 años. El alboroto de los plateros de Diana.", "image": "https://picsum.photos/800/600?random=31", "year": 54 },
            { "id": 5, "coords": [700, 150], "title": "Roma", "desc": "Pablo llega como prisionero pero predica el evangelio con denuedo en la capital del Imperio.", "image": "https://picsum.photos/800/600?random=32", "year": 60 }
        ]
    }
};
