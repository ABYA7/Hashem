const timelineDB = [
    {
        year: -4000,
        yearLabel: "Creación",
        title: "Creación y Caída",
        category: "evento",
        desc: "Dios crea los cielos, la tierra y a la humanidad. Caída de Adán y Eva en el Edén.",
        sync: "Inicio de la historia bíblica (fecha estimada tradicional)."
    },
    {
        year: -2348,
        yearLabel: "2348 a.C.",
        title: "El Diluvio Universal",
        category: "evento",
        desc: "Dios envía un diluvio global. Noé y su familia sobreviven en el arca.",
        sync: "Posibles paralelismos con relatos mesopotámicos antiguos (Ej: Epopeya de Gilgamesh)."
    },
    {
        year: -2090,
        yearLabel: "2090 a.C.",
        title: "Llamamiento de Abraham",
        category: "evento",
        desc: "Abram es llamado de Ur de los Caldeos hacia Canaán. Dios hace pacto con él.",
        sync: "Cultura Sumeria tardía y Dinastía III de Ur."
    },
    {
        year: -1898,
        yearLabel: "1898 a.C.",
        title: "José vendido a Egipto",
        category: "evento",
        desc: "José es vendido por sus hermanos, llevado a Egipto, y posteriormente elevado a gobernador.",
        sync: "Posible coincidencia con el Reino Medio de Egipto."
    },
    {
        year: -1446,
        yearLabel: "1446 a.C.",
        title: "El Éxodo",
        category: "evento",
        desc: "Moisés lidera la salida de Israel de la esclavitud en Egipto tras las 10 plagas.",
        sync: "Imperio Nuevo en Egipto. Reinado debatido (posiblemente Amenhotep II o Tutmosis III)."
    },
    {
        year: -1050,
        yearLabel: "1050 a.C.",
        title: "Saúl, primer rey de Israel",
        category: "rey",
        desc: "Israel pide un rey y Samuel unge a Saúl, marcando el fin de la era de los Jueces.",
        sync: "Transición del final de la Edad del Bronce al comienzo de la Edad del Hierro."
    },
    {
        year: -1010,
        yearLabel: "1010 a.C.",
        title: "Reinado de David",
        category: "rey",
        desc: "David unifica las tribus, conquista Jerusalén y establece el reino firme de Israel.",
        sync: "Expansión del Reino Unido de Israel."
    },
    {
        year: -970,
        yearLabel: "970 a.C.",
        title: "Reinado de Salomón",
        category: "rey",
        desc: "Era de paz y prosperidad. Construcción del Primer Templo en Jerusalén.",
        sync: "Relaciones comerciales con Fenicia (Hiram de Tiro) y Egipto."
    },
    {
        year: -931,
        yearLabel: "931 a.C.",
        title: "División del Reino",
        category: "evento",
        desc: "Tras la muerte de Salomón, el reino se divide en Israel (Norte) y Judá (Sur).",
        sync: "Debilitamiento geopolítico en la región del Levante."
    },
    {
        year: -860,
        yearLabel: "860 a.C.",
        title: "Profeta Elías",
        category: "profeta",
        desc: "Elías confronta la idolatría de Acab y Jezabel. Desafío en el Monte Carmelo.",
        sync: "Reino de Israel (Norte) bajo el dominio de la dinastía de Omri."
    },
    {
        year: -722,
        yearLabel: "722 a.C.",
        title: "Caída del Reino del Norte",
        category: "imperio",
        desc: "El Imperio Asirio conquista Samaria y deporta a las 10 tribus de Israel.",
        sync: "Ascenso del Imperio Neo-Asirio (Tiglat-Pileser III, Salmanasar V, Sargón II)."
    },
    {
        year: -700,
        yearLabel: "700 a.C.",
        title: "Profeta Isaías",
        category: "profeta",
        desc: "Ministerio de Isaías en Judá. Profecías mesiánicas mayores.",
        sync: "Senaquerib asedia Jerusalén, fracasando frente a Ezequías."
    },
    {
        year: -586,
        yearLabel: "586 a.C.",
        title: "Caída de Jerusalén",
        category: "imperio",
        desc: "Nabucodonosor destruye Jerusalén y el Templo. Inicio del exilio en Babilonia.",
        sync: "Hegemonía del Imperio Neo-Babilónico."
    },
    {
        year: -539,
        yearLabel: "539 a.C.",
        title: "Ciro el Grande y Retorno",
        category: "imperio",
        desc: "El Imperio Medo-Persa conquista Babilonia. Ciro permite el regreso judío a Judá.",
        sync: "Inicio del Imperio Aqueménida."
    },
    {
        year: -515,
        yearLabel: "515 a.C.",
        title: "Construcción del Segundo Templo",
        category: "evento",
        desc: "Finaliza la reconstrucción del Templo bajo Zorobabel tras exhortaciones de Hageo y Zacarías.",
        sync: "Reinado de Darío I de Persia."
    },
    {
        year: -332,
        yearLabel: "332 a.C.",
        title: "Alejandro Magno conquista Judea",
        category: "imperio",
        desc: "Grecia toma control de la región sin destruir Jerusalén. Inicia el período helenístico.",
        sync: "Imperio Griego Macedónico."
    },
    {
        year: -167,
        yearLabel: "167 a.C.",
        title: "Rebelión Macabea",
        category: "evento",
        desc: "Los judíos liderados por los Macabeos se rebelan contra Antíoco IV Epífanes.",
        sync: "Conflicto con el Imperio Seléucida."
    },
    {
        year: -63,
        yearLabel: "63 a.C.",
        title: "Roma toma Jerusalén",
        category: "imperio",
        desc: "El general romano Pompeyo entra en Jerusalén. Judea se convierte en provincia romana.",
        sync: "Ascenso de la República/Imperio Romano."
    },
    {
        year: -4,
        yearLabel: "4 a.C.",
        title: "Nacimiento de Jesús",
        category: "evento",
        desc: "Jesucristo nace en Belén de Judea durante el reinado de Herodes el Grande.",
        sync: "Reinado del emperador romano Augusto César."
    },
    {
        year: 30,
        yearLabel: "30 d.C.",
        title: "Crucifixión y Resurrección",
        category: "evento",
        desc: "Ministerio, muerte expiatoria y resurrección de Jesucristo.",
        sync: "Poncio Pilato, prefecto de Judea bajo el emperador Tiberio."
    },
    {
        year: 33,
        yearLabel: "33 d.C.",
        title: "Pentecostés y la Iglesia",
        category: "evento",
        desc: "Derramamiento del Espíritu Santo e inicio de la Iglesia primitiva en Jerusalén.",
        sync: "Crecimiento rápido del cristianismo temprano en el mundo romano."
    },
    {
        year: 70,
        yearLabel: "70 d.C.",
        title: "Destrucción del Templo",
        category: "imperio",
        desc: "Las legiones romanas bajo Tito destruyen Jerusalén y el Segundo Templo.",
        sync: "Dinastía Flavia en Roma."
    },
    {
        year: 95,
        yearLabel: "95 d.C.",
        title: "Apocalipsis y fin del Nuevo Testamento",
        category: "profeta",
        desc: "El apóstol Juan escribe el libro de Apocalipsis en la isla de Patmos.",
        sync: "Persecuciones bajo el emperador Domiciano."
    }
];
