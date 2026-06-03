const fs = require('fs');

const initialData = [
    {
        termino: "Amén",
        categoria: "Cultura hebrea",
        fuente: "Tanaj / Tradición",
        definicion: "La palabra amén (en hebreo: אמן, amen; 'así sea', 'con verdad') es una declaración de afirmación utilizada en el judaísmo, y posteriormente en el cristianismo y el islam. Deriva de la raíz hebrea א-מ-נ (A-M-N) que significa firmeza, certeza o fiabilidad.",
        referencias: ["Deuteronomio 27:15-26", "Jeremías 28:6"]
    },
    {
        termino: "Jerusalén",
        categoria: "Geografía bíblica",
        fuente: "Arqueología / Tanaj",
        definicion: "Ciudad capital de Israel en la antigüedad, situada en los montes de Judea. Conocida también como la Ciudad de David y Sión. Fue el centro político y espiritual del pueblo judío, hogar del Primer y Segundo Templo.",
        referencias: ["2 Samuel 5:6-9", "Salmos 122"]
    },
    {
        termino: "Mishná",
        categoria: "Talmud y Mishná",
        fuente: "Literatura Rabínica",
        definicion: "La Mishná (en hebreo: מִשְׁנָה, 'repetición' o 'estudio') es la primera gran compilación escrita de las tradiciones orales judías, conocida como la Torá oral. Compilada alrededor del año 200 d.C. por el Rabino Judá el Príncipe.",
        referencias: []
    },
    {
        termino: "Muro de los Lamentos",
        categoria: "Arqueología",
        "fuente": "Historia judía",
        definicion: "También conocido como el Kotel, es el lugar más sagrado del judaísmo accesible hoy en día. Es el remanente del muro de contención occidental del Monte del Templo, construido por Herodes el Grande.",
        referencias: []
    },
    {
        termino: "David",
        categoria: "Personajes bíblicos",
        "fuente": "Tanaj",
        definicion: "Segundo rey de Israel, sucesor de Saúl. Es considerado el rey ideal de Israel, un poeta (autor de muchos Salmos) y un guerrero. De su linaje se profetizó que vendría el Mesías.",
        referencias: ["1 Samuel 16", "2 Samuel 2"]
    },
    {
        termino: "Tefilín",
        categoria: "Costumbres antiguas",
        fuente: "Tanaj / Talmud",
        definicion: "Filacterias. Son dos pequeñas cajas de cuero negro que contienen rollos de pergamino con versículos de la Torá. Los judíos observantes se los atan en el brazo izquierdo y en la frente durante las oraciones matutinas.",
        referencias: ["Deuteronomio 6:8", "Éxodo 13:9"]
    },
    {
        termino: "Qumrán",
        categoria: "Arqueología",
        "fuente": "Historia bíblica",
        definicion: "Sitio arqueológico en el desierto de Judea, cerca de la costa noroeste del mar Muerto. Es famoso por ser el lugar más cercano a las cuevas donde se descubrieron los Rollos del Mar Muerto entre 1947 y 1956.",
        referencias: []
    },
    {
        termino: "70 Semanas",
        categoria: "Profecías",
        "fuente": "Tanaj",
        definicion: "Una de las profecías cronológicas más importantes del libro de Daniel, que predice el tiempo desde el decreto para reconstruir Jerusalén hasta la venida del Mesías Príncipe.",
        referencias: ["Daniel 9:24-27"]
    }
];

const newArticles = [
    { termino: "Abraham", categoria: "Personajes bíblicos", fuente: "Tanaj", definicion: "Patriarca del pueblo hebreo y padre de la fe. Originario de Ur de los Caldeos. Dios hizo un pacto con él prometiéndole una descendencia incontable y la tierra de Canaán.", referencias: ["Génesis 12", "Génesis 15"] },
    { termino: "Moisés", categoria: "Personajes bíblicos", fuente: "Tanaj", definicion: "Profeta y líder de Israel que liberó al pueblo de la esclavitud en Egipto. Recibió la Torá en el Monte Sinaí y lideró al pueblo durante 40 años en el desierto.", referencias: ["Éxodo 3", "Deuteronomio 34"] },
    { termino: "Talmud", categoria: "Talmud y Mishná", fuente: "Literatura Rabínica", definicion: "Texto central del judaísmo rabínico compuesto por la Mishná (ley oral) y la Guemará (análisis rabínico). Existen dos versiones: el Talmud de Jerusalén y el Talmud de Babilonia.", referencias: [] },
    { termino: "Arca de la Alianza", categoria: "Arqueología", fuente: "Tanaj", definicion: "Cofre sagrado recubierto de oro que contenía las Tablas de la Ley dadas a Moisés. Descansaba en el Lugar Santísimo del Tabernáculo y posteriormente en el Templo de Salomón.", referencias: ["Éxodo 25:10-22"] },
    { termino: "Tabernáculo", categoria: "Historia judía", fuente: "Tanaj", definicion: "Santuario portátil construido por los israelitas en el desierto tras el Éxodo. Funcionó como el lugar de encuentro de Dios con Su pueblo antes de la construcción del Templo.", referencias: ["Éxodo 26"] },
    { termino: "Mar Muerto", categoria: "Geografía bíblica", fuente: "Ciencia y Geografía", definicion: "Lago salado situado entre Israel, Cisjordania y Jordania. Es el punto más bajo de la Tierra. En la Biblia, la región se asocia con la historia de Sodoma y Gomorra.", referencias: ["Génesis 14:3", "Génesis 19"] },
    { termino: "Sodoma y Gomorra", categoria: "Geografía bíblica", fuente: "Tanaj", definicion: "Ciudades de la llanura del río Jordán, descritas en Génesis como lugares de gran iniquidad, que fueron destruidas por fuego y azufre caídos del cielo.", referencias: ["Génesis 19"] },
    { termino: "Egipto", categoria: "Geografía bíblica", fuente: "Arqueología", definicion: "Imperio del mundo antiguo situado al noreste de África. Fue lugar de refugio (como para Abraham o Jacob) y también casa de servidumbre para los israelitas durante 400 años.", referencias: ["Éxodo 1", "Génesis 46"] },
    { termino: "Día de la Expiación (Yom Kipur)", categoria: "Costumbres antiguas", fuente: "Tanaj", definicion: "El día más sagrado del año judío, centrado en la expiación y el arrepentimiento. Incluía ayuno y, en tiempos del Templo, rituales elaborados realizados por el Sumo Sacerdote.", referencias: ["Levítico 16", "Levítico 23:26-32"] },
    { termino: "Pascua (Pésaj)", categoria: "Costumbres antiguas", fuente: "Tanaj", definicion: "Festividad judía que conmemora la liberación del pueblo hebreo de la esclavitud en Egipto. Su nombre alude a que el ángel destructor 'pasó por alto' (Pésaj) las casas marcadas con la sangre del cordero.", referencias: ["Éxodo 12"] },
    { termino: "Shabat", categoria: "Cultura hebrea", fuente: "Tanaj", definicion: "El séptimo día de la semana judía, dedicado al descanso y la abstinencia de labores creativas en conmemoración de que Dios descansó el séptimo día de la Creación.", referencias: ["Éxodo 20:8-11", "Génesis 2:2-3"] },
    { termino: "Menorá", categoria: "Arqueología", fuente: "Tanaj", definicion: "Candelabro de siete brazos de oro macizo utilizado en el Tabernáculo y luego en el Templo de Jerusalén. Es uno de los símbolos más antiguos y representativos del judaísmo.", referencias: ["Éxodo 25:31-40"] },
    { termino: "Rollo de Isaías", categoria: "Arqueología", fuente: "Manuscritos del Mar Muerto", definicion: "El mayor y mejor conservado de los manuscritos bíblicos encontrados en Qumrán. Data de alrededor de 125 a.C. y contiene la casi totalidad del libro de Isaías, probando su exactitud a lo largo de los milenios.", referencias: ["Isaías 1:1"] },
    { termino: "Piedra de Rosetta", categoria: "Arqueología", fuente: "Historia", definicion: "Estela de granito descubierta en 1799, clave para descifrar los jeroglíficos egipcios. Su descubrimiento permitió leer textos antiguos y corroborar eventos históricos mencionados en la Biblia.", referencias: [] },
    { termino: "Ezequías", categoria: "Personajes bíblicos", fuente: "Tanaj", definicion: "Rey de Judá que promovió una gran reforma religiosa destruyendo los lugares altos e ídolos. Fue defendido por Dios frente a la invasión del asirio Senaquerib.", referencias: ["2 Reyes 18", "2 Crónicas 29"] },
    { termino: "Senaquerib", categoria: "Personajes bíblicos", fuente: "Arqueología / Tanaj", definicion: "Rey asirio que invadió el Reino de Judá en tiempos de Ezequías. Su intento fallido de tomar Jerusalén está documentado tanto en la Biblia como en el Prisma de Taylor (crónica asiria).", referencias: ["2 Reyes 18", "2 Crónicas 32"] },
    { termino: "Valle de Hinón (Gehena)", categoria: "Geografía bíblica", fuente: "Historia judía", definicion: "Valle cercano a Jerusalén asociado históricamente con el culto a deidades paganas, posteriormente utilizado como basurero quemando desechos continuamente, convirtiéndose en símbolo del castigo final.", referencias: ["Jeremías 7:31", "Marcos 9:43"] },
    { termino: "Salomón", categoria: "Personajes bíblicos", fuente: "Tanaj", definicion: "Tercer rey de Israel, hijo de David. Famoso por su sabiduría y por haber construido el Primer Templo de Jerusalén. Autor de Proverbios, Eclesiastés y Cantares.", referencias: ["1 Reyes 3", "1 Reyes 6"] },
    { termino: "Profecía del Mesías Sufriente", categoria: "Profecías", fuente: "Tanaj", definicion: "Profecía clave del profeta Isaías que describe al 'Siervo de Jehová' padeciendo enfermedades, dolores y siendo herido por nuestras rebeliones para darnos la paz.", referencias: ["Isaías 53"] },
    { termino: "Templo de Salomón", categoria: "Historia judía", fuente: "Tanaj", definicion: "El Primer Templo en Jerusalén, centro de la adoración del antiguo Israel, completado bajo el reinado de Salomón y destruido por los babilonios en el 586 a.C.", referencias: ["1 Reyes 6", "2 Crónicas 3"] },
    { termino: "Guemará", categoria: "Talmud y Mishná", fuente: "Literatura Rabínica", definicion: "Parte del Talmud que consiste en discusiones y comentarios rabínicos exhaustivos sobre la Mishná. Fue completada alrededor del año 500 d.C.", referencias: [] },
    { termino: "Essenios", categoria: "Historia judía", fuente: "Literatura Rabínica / Josefo", definicion: "Secta judía que floreció del siglo II a.C. al I d.C. Se caracterizaron por su ascetismo y vida comunitaria; muchos los asocian con la comunidad de Qumrán y los Rollos del Mar Muerto.", referencias: [] },
    { termino: "Mesías", categoria: "Profecías", fuente: "Tanaj", definicion: "Del hebreo 'Mashiach' (ungido). Figura esperada en la escatología judía y cristiana; un rey de la línea de David, enviado por Dios para traer salvación, redención y la instauración de Su Reino.", referencias: ["Salmos 2:2", "Isaías 9:6", "Zacarías 9:9"] },
    { termino: "Sinagoga", categoria: "Historia judía", fuente: "Arqueología", definicion: "Lugar de reunión y culto para las comunidades judías. Comenzaron a surgir durante el exilio babilónico, al no poder acceder al Templo de Jerusalén, y se volvieron el centro de la vida judía tras su destrucción.", referencias: [] },
    { termino: "Torá", categoria: "Cultura hebrea", fuente: "Tanaj", definicion: "La palabra significa 'instrucción' o 'ley'. Se refiere específicamente a los cinco primeros libros de la Biblia (Pentateuco) escritos por Moisés.", referencias: [] },
    { termino: "Efraín", categoria: "Personajes bíblicos", fuente: "Tanaj", definicion: "Hijo menor de José y Asenat. Jacob le dio una bendición especial poniéndolo sobre su hermano mayor Manasés. La tribu de Efraín fue la más preeminente en el Reino del Norte.", referencias: ["Génesis 41:52", "Génesis 48"] },
    { termino: "Pentecostés (Shavuot)", categoria: "Costumbres antiguas", fuente: "Tanaj", definicion: "La fiesta de las Semanas, que conmemora la entrega de la Torá en el Monte Sinaí y es también la fiesta de la recolección de los primeros frutos (primicias).", referencias: ["Éxodo 34:22", "Levítico 23:15-21"] },
    { termino: "Levitas", categoria: "Costumbres antiguas", fuente: "Tanaj", definicion: "Descendientes de la tribu de Leví, encargados del cuidado, mantenimiento y traslado del Tabernáculo. No recibieron tierra como herencia, pues Jehová era su heredad.", referencias: ["Números 3", "Números 8"] },
    { termino: "Babilonia", categoria: "Geografía bíblica", fuente: "Arqueología", definicion: "Antiguo y poderoso imperio de Mesopotamia. Conquistó a la nación de Judá y llevó a los judíos al exilio en el 586 a.C.", referencias: ["2 Reyes 24", "Daniel 1"] },
    { termino: "Canaán", categoria: "Geografía bíblica", fuente: "Tanaj", definicion: "La Tierra Prometida que Dios le dio a Abraham y a su descendencia. Abarcaba el territorio de lo que hoy es Israel, los territorios palestinos y Líbano.", referencias: ["Génesis 12:5", "Josué 1"] },
    { termino: "Elías", categoria: "Personajes bíblicos", fuente: "Tanaj", definicion: "Profeta de Israel en tiempos del rey Acab. Famoso por su celo por Jehová, sus milagros, y su desafío a los profetas de Baal en el monte Carmelo.", referencias: ["1 Reyes 17", "1 Reyes 18"] },
    { termino: "Monte Carmelo", categoria: "Geografía bíblica", fuente: "Tanaj", definicion: "Cadena montañosa costera del norte de Israel, escenario de la épica confrontación de Elías contra los profetas paganos de Baal.", referencias: ["1 Reyes 18:19"] },
    { termino: "Monte del Templo (Monte Moriá)", categoria: "Arqueología", fuente: "Geografía bíblica", definicion: "Una colina en la Ciudad Vieja de Jerusalén que es venerada en el judaísmo, islam y cristianismo. Lugar del sacrificio de Isaac y donde se levantó el Templo de Salomón.", referencias: ["Génesis 22:2", "2 Crónicas 3:1"] },
    { termino: "Ur de los Caldeos", categoria: "Arqueología", fuente: "Geografía bíblica", definicion: "Antigua ciudad sumeria del sur de Mesopotamia de donde era originario Abraham, quien partió de allí por orden divina.", referencias: ["Génesis 11:31", "Génesis 15:7"] },
    { termino: "Midrash", categoria: "Talmud y Mishná", fuente: "Literatura Rabínica", definicion: "Término rabínico para el análisis exegético y la interpretación profunda y homilética de los textos bíblicos. Suele rellenar lagunas en el relato y dar contexto teológico.", referencias: [] },
    { termino: "Profeta (Naví)", categoria: "Cultura hebrea", fuente: "Tanaj", definicion: "Del hebreo 'Navi'. Alguien llamado por Dios para ser Su portavoz, comunicar Su voluntad y, a menudo, llamar al arrepentimiento o anunciar eventos futuros.", referencias: ["Deuteronomio 18:15", "Jeremías 1:5"] },
    { termino: "Josué", categoria: "Personajes bíblicos", fuente: "Tanaj", definicion: "Sucesor de Moisés que lideró las campañas militares para la conquista de la tierra de Canaán. Famoso por la caída de Jericó.", referencias: ["Josué 1", "Josué 6"] },
    { termino: "Ruta de los Reyes", categoria: "Geografía bíblica", fuente: "Arqueología", definicion: "Antigua ruta comercial en el Medio Oriente que pasaba de Egipto hasta Mesopotamia cruzando a través de Edom, Moab y Amón.", referencias: ["Números 20:17", "Números 21:22"] },
    { termino: "Imperio Persa", categoria: "Historia judía", fuente: "Arqueología", definicion: "Potencia mundial que bajo Ciro el Grande venció a Babilonia y permitió el retorno de los judíos a Judea para reconstruir el Templo.", referencias: ["Esdras 1", "Daniel 6"] },
    { termino: "Fariseos", categoria: "Historia judía", fuente: "Literatura Rabínica", definicion: "Secta judía importante surgida antes del siglo I. Creían firmemente en la Torá Oral, la resurrección de los muertos, los ángeles y los espíritus.", referencias: [] },
    { termino: "Saduceos", categoria: "Historia judía", fuente: "Literatura Rabínica", definicion: "Partido aristocrático y sacerdotal del judaísmo en tiempos del Segundo Templo. Rechazaban la tradición oral, la resurrección y las intervenciones angélicas, ciñéndose estrictamente al Pentateuco escrito.", referencias: [] },
    { termino: "Sanedrín", categoria: "Historia judía", fuente: "Talmud y Mishná", definicion: "Asamblea o concilio supremo de jueces que actuaba en el antiguo Israel. Compuesto por 71 sabios con el Sumo Sacerdote a la cabeza.", referencias: [] },
    { termino: "Rollo de Ciro", categoria: "Arqueología", fuente: "Historia", definicion: "Cilindro de arcilla antiguo que documenta la toma de Babilonia por Ciro. Confirma la práctica persa de permitir a los pueblos deportados regresar y reconstruir sus templos, como se describe en Esdras.", referencias: ["Esdras 1:1-4"] },
    { termino: "Filisteos", categoria: "Personajes bíblicos", fuente: "Tanaj / Arqueología", definicion: "Pueblo marítimo asentado en la costa suroeste de Canaán. Fueron enemigos persistentes de Israel en la época de los Jueces, de Saúl y de David (ej. Goliat).", referencias: ["1 Samuel 17", "Jueces 13-16"] },
    { termino: "Goliat", categoria: "Personajes bíblicos", fuente: "Tanaj", definicion: "Guerrero gigante filisteo de la ciudad de Gat, que desafió a los ejércitos de Israel y fue vencido por el joven pastor David con una honda.", referencias: ["1 Samuel 17"] },
    { termino: "Arcángel Miguel", categoria: "Personajes bíblicos", fuente: "Tanaj", definicion: "Príncipe celestial y protector angélico del pueblo de Israel mencionado en visiones apocalípticas y proféticas.", referencias: ["Daniel 10:13", "Daniel 12:1"] },
    { termino: "Mezuzá", categoria: "Costumbres antiguas", fuente: "Cultura hebrea", definicion: "Pequeño estuche adherido al marco derecho de las puertas judías que contiene un pergamino con versículos de la Torá (el Shemá).", referencias: ["Deuteronomio 6:9", "Deuteronomio 11:20"] },
    { termino: "Jubileo (Yovel)", categoria: "Costumbres antiguas", fuente: "Tanaj", definicion: "Año sabático que ocurre cada 50 años. Durante el Jubileo las tierras volvían a sus dueños originales y los esclavos hebreos eran liberados.", referencias: ["Levítico 25:8-55"] },
    { termino: "Nehemías", categoria: "Personajes bíblicos", fuente: "Tanaj", definicion: "Gobernador judío de Judea bajo el imperio Persa, responsable de la reconstrucción de los muros de Jerusalén tras el exilio, a pesar de gran oposición.", referencias: ["Nehemías 1-6"] },
    { termino: "Esdras", categoria: "Personajes bíblicos", fuente: "Tanaj", definicion: "Sacerdote y escriba judío que guió un grupo desde el exilio babilónico hacia Jerusalén. Es considerado por el Talmud como un restaurador central de la Torá.", referencias: ["Esdras 7"] },
    { termino: "La Diáspora", categoria: "Historia judía", fuente: "Geografía bíblica", definicion: "La dispersión del pueblo judío fuera de su hogar ancestral (la Tierra de Israel), a menudo provocada por conquistas asirias, babilónicas o romanas.", referencias: [] }
];

const combined = [...initialData, ...newArticles];
fs.writeFileSync('data/diccionario.json', JSON.stringify(combined, null, 2));
console.log('Diccionario actualizado con ' + combined.length + ' artículos!');
