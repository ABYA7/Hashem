const mapsDB = {
    "abraham": {
        "title": "Viajes de Abraham",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Ancient_Near_East_topographical_map.png/1024px-Ancient_Near_East_topographical_map.png",
        "bounds": [[0, 0], [1000, 1000]], // Virtual coordinate system Y, X
        "markers": [
            { "id": 1, "coords": [750, 850], "title": "Ur de los Caldeos", "desc": "Ciudad de origen de Abram. Dios lo llama a dejar su tierra y su parentela.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/36/Ziggurat_of_Ur.jpg/400px-Ziggurat_of_Ur.jpg", "year": -2090 },
            { "id": 2, "coords": [900, 500], "title": "Harán", "desc": "Lugar donde se asienta la familia de Taré y donde este muere. Abram parte desde aquí a los 75 años.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Harran_ruins.jpg/400px-Harran_ruins.jpg", "year": -2085 },
            { "id": 3, "coords": [650, 300], "title": "Siquem (Canaán)", "desc": "Primer campamento en Canaán. Dios promete esta tierra a su descendencia.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/5/52/Shechem_Tell_Balata.jpg/400px-Shechem_Tell_Balata.jpg", "year": -2080 },
            { "id": 4, "coords": [400, 150], "title": "Egipto", "desc": "Debido al hambre en Canaán, Abram desciende a Egipto.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e3/Kheops-Pyramid.jpg/400px-Kheops-Pyramid.jpg", "year": -2078 },
            { "id": 5, "coords": [550, 300], "title": "Hebrón / Mamre", "desc": "Lugar donde se establece Abraham permanentemente y donde compra la cueva de Macpela.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Cave_of_the_Patriarchs.jpg/400px-Cave_of_the_Patriarchs.jpg", "year": -2060 },
            { "id": 6, "coords": [520, 250], "title": "Beerseba", "desc": "Pacto con Abimelec y donde Abraham planta un tamarisco invocando a El Olam.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/22/Tel_Be%27er_Sheva.jpg/400px-Tel_Be%27er_Sheva.jpg", "year": -2050 },
            { "id": 7, "coords": [600, 320], "title": "Monte Moriah", "desc": "Prueba suprema: el sacrificio (ligadura) de Isaac.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Temple_Mount_%28Aerial_view%2C_2007%29.jpg/400px-Temple_Mount_%28Aerial_view%2C_2007%29.jpg", "year": -2040 }
        ]
    },
    "exodo": {
        "title": "Éxodo de Israel",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Route_of_the_Exodus.svg/1024px-Route_of_the_Exodus.svg.png",
        "bounds": [[0, 0], [1000, 1000]],
        "markers": [
            { "id": 1, "coords": [800, 200], "title": "Ramesés / Gosén", "desc": "Punto de partida de los israelitas de Egipto tras las diez plagas.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/0/07/Pi-Ramesses.jpg/400px-Pi-Ramesses.jpg", "year": -1446 },
            { "id": 2, "coords": [600, 350], "title": "Cruce del Mar Rojo", "desc": "Dios divide las aguas para el paso de Israel y destruye al ejército del faraón.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/18/Red_Sea.jpg/400px-Red_Sea.jpg", "year": -1446 },
            { "id": 3, "coords": [200, 500], "title": "Monte Sinaí", "desc": "Entrega de los Diez Mandamientos y construcción del Tabernáculo.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Mount_Sinai.jpg/400px-Mount_Sinai.jpg", "year": -1445 },
            { "id": 4, "coords": [700, 550], "title": "Cades Barnea", "desc": "Envío de los 12 espías. Rebelión del pueblo y sentencia de 40 años en el desierto.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cd/Negev.jpg/400px-Negev.jpg", "year": -1444 },
            { "id": 5, "coords": [750, 750], "title": "Monte Nebo / Moab", "desc": "Moisés ve la Tierra Prometida antes de morir. Josué asume el liderazgo.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Mount_Nebo.jpg/400px-Mount_Nebo.jpg", "year": -1406 }
        ]
    },
    "josue": {
        "title": "Conquistas de Josué",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Map_of_ancient_Israel_and_Judah.png/800px-Map_of_ancient_Israel_and_Judah.png",
        "bounds": [[0, 0], [1000, 1000]],
        "markers": [
            { "id": 1, "coords": [450, 700], "title": "Paso del Jordán", "desc": "Israel cruza el río Jordán en seco y levanta 12 piedras en Gilgal.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cb/Jordan_River.jpg/400px-Jordan_River.jpg", "year": -1406 },
            { "id": 2, "coords": [480, 650], "title": "Jericó", "desc": "Caída milagrosa de las murallas de Jericó tras 7 días de marchas.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/Jericho_Tel_es_Sultan.jpg/400px-Jericho_Tel_es_Sultan.jpg", "year": -1406 },
            { "id": 3, "coords": [520, 600], "title": "Hai", "desc": "Derrota inicial por el pecado de Acán, seguida de una victoria táctica.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/Et-Tell.jpg/400px-Et-Tell.jpg", "year": -1405 },
            { "id": 4, "coords": [350, 550], "title": "Campaña del Sur (Gabaón)", "desc": "El sol se detiene sobre Gabaón para derrotar a los 5 reyes amorreos.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Ajalon_Valley.jpg/400px-Ajalon_Valley.jpg", "year": -1404 },
            { "id": 5, "coords": [800, 600], "title": "Campaña del Norte (Hazor)", "desc": "Victoria sobre la coalición del norte y destrucción de Hazor.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f6/Tel_Hazor.jpg/400px-Tel_Hazor.jpg", "year": -1400 }
        ]
    },
    "david": {
        "title": "Reino de David",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/Map_of_ancient_Israel_and_Judah.png/800px-Map_of_ancient_Israel_and_Judah.png",
        "bounds": [[0, 0], [1000, 1000]],
        "markers": [
            { "id": 1, "coords": [350, 450], "title": "Belén", "desc": "Lugar de nacimiento y unción secreta de David por el profeta Samuel.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/29/Bethlehem_Manger_Square.jpg/400px-Bethlehem_Manger_Square.jpg", "year": -1040 },
            { "id": 2, "coords": [450, 300], "title": "Valle de Ela", "desc": "Batalla épica donde el joven David derrota al gigante filisteo Goliat.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Valley_of_Elah.jpg/400px-Valley_of_Elah.jpg", "year": -1025 },
            { "id": 3, "coords": [300, 480], "title": "Hebrón", "desc": "David es coronado rey sobre Judá, reinando aquí por 7 años y medio.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/91/Cave_of_the_Patriarchs.jpg/400px-Cave_of_the_Patriarchs.jpg", "year": -1010 },
            { "id": 4, "coords": [400, 480], "title": "Jerusalén (Jebús)", "desc": "David conquista la fortaleza jebusea y la establece como la Ciudad de David.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/City_of_David_Excavations.jpg/400px-City_of_David_Excavations.jpg", "year": -1003 },
            { "id": 5, "coords": [650, 600], "title": "Expansión: Aram y Amón", "desc": "Victorias militares de David que expanden el reino hasta Siria y el Éufrates.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a2/Aram_Damascus.jpg/400px-Aram_Damascus.jpg", "year": -990 }
        ]
    },
    "pablo": {
        "title": "Viajes Misioneros de Pablo",
        "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/87/Paul%27s_Journeys.jpg/1024px-Paul%27s_Journeys.jpg",
        "bounds": [[0, 0], [1000, 1000]],
        "markers": [
            { "id": 1, "coords": [400, 900], "title": "Antioquía de Siria", "desc": "Base de operaciones. Los discípulos son llamados cristianos por primera vez.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/8/86/Antakya_Orontes.jpg/400px-Antakya_Orontes.jpg", "year": 47 },
            { "id": 2, "coords": [450, 700], "title": "Asia Menor (1er Viaje)", "desc": "Iconio, Listra y Derbe. Pablo es apedreado pero se levanta milagrosamente.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/6/63/Lystra_Mound.jpg/400px-Lystra_Mound.jpg", "year": 48 },
            { "id": 3, "coords": [600, 350], "title": "Macedonia y Grecia (2do Viaje)", "desc": "Filipos, Tesalónica, Corinto. Pablo predica en el Areópago de Atenas.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Athens_Areopagus.jpg/400px-Athens_Areopagus.jpg", "year": 51 },
            { "id": 4, "coords": [450, 550], "title": "Éfeso (3er Viaje)", "desc": "Pablo enseña por 3 años. El alboroto de los plateros de Diana.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Ephesus_Celsus_Library.jpg/400px-Ephesus_Celsus_Library.jpg", "year": 54 },
            { "id": 5, "coords": [700, 150], "title": "Roma", "desc": "Pablo llega como prisionero pero predica el evangelio con denuedo en la capital del Imperio.", "image": "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Colosseum_in_Rome.jpg/400px-Colosseum_in_Rome.jpg", "year": 60 }
        ]
    }
};
