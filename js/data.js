/* =========================================================
   CONTENIDO DE 22DOCE DECO HOGAR (DEMO)
   Los productos, fotos y reseñas son de ejemplo.
   En la demo, el panel guarda los cambios en el navegador.
   ========================================================= */

window.DD_DEFAULT = {
  local: {
    nombre: "22doce Deco Hogar",
    wa: "5493498475590",
    waVisible: "3498 47 55 90",
    direccion: "Santa Fe 310",
    horario: "Lunes a sábados de 9 a 12:30 y de 17 a 21 h",
    instagram: "@22doce_decohogar",
    aviso: "Envolvemos tus regalos sin cargo · Retirá en el local o coordinamos el envío",
    linkResena: "https://search.google.com/local/writereview?placeid=TU_PLACE_ID"
  },

  categorias: [
    { id: "bazar", nombre: "Bazar", desc: "Vajilla, cocina y mesa", img: "img/productos/utensilios-blancos.jpg" },
    { id: "decoracion", nombre: "Decoración", desc: "Jarrones, cuadros y objetos", img: "img/productos/floreros-flores.jpg" },
    { id: "regaleria", nombre: "Regalería", desc: "Regalos para toda ocasión", img: "img/productos/cajas-regalo.jpg" },
    { id: "velas", nombre: "Velas y aromas", desc: "Velas, difusores y sahumerios", img: "img/productos/vela-bandeja.jpg" },
    { id: "textiles", nombre: "Textiles", desc: "Almohadones, mantas y toallas", img: "img/productos/mantas-sillon.jpg" },
    { id: "plantas", nombre: "Plantas y macetas", desc: "Verde para cada rincón", img: "img/productos/plantas-mix.jpg" }
  ],

  productos: [
    { id: "p1", nombre: "Vela de soja con bandeja", cat: "velas", precio: 14900, img: "img/productos/vela-bandeja.jpg", desc: "Vela de cera de soja en tonos nude, con bandeja de madera y pétalos secos. Aroma vainilla y coco.", destacado: true, nuevo: true, stock: true },
    { id: "p2", nombre: "Vela aromática en vaso", cat: "velas", precio: 18500, img: "img/productos/vela-rosas.jpg", desc: "Vaso de vidrio con tapa, 40 horas de duración. Aroma cítrico y salvia.", destacado: true, stock: true },
    { id: "p3", nombre: "Difusor de varillas ámbar", cat: "velas", precio: 16900, img: "img/productos/difusor-ambar.jpg", desc: "Frasco de vidrio ámbar de 120 ml con varillas de ratán. Perfuma hasta 2 meses.", stock: true },
    { id: "p4", nombre: "Perfume para ambientes", cat: "velas", precio: 12900, img: "img/productos/perfume-ambiente.jpg", desc: "Spray de 250 ml para ambientes y textiles. Aroma flores blancas.", stock: true },
    { id: "p5", nombre: "Sahumerios artesanales x12", cat: "velas", precio: 4500, img: "img/productos/sahumerio.jpg", desc: "Caja de 12 sahumerios de resinas naturales. Lavanda, palo santo o mirra.", stock: true },

    { id: "p6", nombre: "Floreros de cerámica x2", cat: "decoracion", precio: 21900, img: "img/productos/floreros-flores.jpg", desc: "Dúo de floreros de cerámica esmaltada en mostaza y crema. Alto 18 y 12 cm.", destacado: true, stock: true },
    { id: "p7", nombre: "Jarrón negro mate", cat: "decoracion", precio: 19500, img: "img/productos/jarron-negro.jpg", desc: "Jarrón de cerámica negra con terminación mate. Alto 24 cm.", nuevo: true, stock: true },
    { id: "p8", nombre: "Escultura de cerámica blanca", cat: "decoracion", precio: 24900, img: "img/productos/escultura-blanca.jpg", desc: "Busto abstracto de cerámica blanca, ideal para estantes y mesas de luz.", destacado: true, stock: true },
    { id: "p9", nombre: "Arbolitos de madera", cat: "decoracion", precio: 15900, img: "img/productos/arbolitos-madera.jpg", desc: "Set de árboles y casita de madera natural sobre base. Hecho a mano.", stock: true },
    { id: "p10", nombre: "Portarretratos de madera", cat: "decoracion", precio: 9900, img: "img/productos/portarretratos.jpg", desc: "Marco de madera para foto de 13 x 18 cm, de pie o para colgar.", stock: true },
    { id: "p11", nombre: "Canasto de fibras naturales", cat: "decoracion", precio: 17500, img: "img/productos/canasto.jpg", desc: "Canasto tejido a mano, para frutas, plantas o mantas. 30 cm de diámetro.", stock: false },

    { id: "p12", nombre: "Utensilios de porcelana", cat: "bazar", precio: 27900, img: "img/productos/utensilios-blancos.jpg", desc: "Set de jarra, bowls y utensilios de madera y silicona. Todo en blanco y natural.", destacado: true, stock: true },
    { id: "p13", nombre: "Cucharas de madera x3", cat: "bazar", precio: 11900, img: "img/productos/cucharas-madera.jpg", desc: "Cucharas de madera de olivo con porta utensilios de cerámica.", stock: true },
    { id: "p14", nombre: "Pava enlozada vintage", cat: "bazar", precio: 32900, img: "img/productos/pavas.jpg", desc: "Pava de cobre envejecido, 1,5 litros. Apta para todo tipo de cocinas.", nuevo: true, stock: true },
    { id: "p15", nombre: "Tazas de cerámica", cat: "bazar", precio: 7900, img: "img/productos/tazas-vitrina.jpg", desc: "Tazas de cerámica esmaltada en colores pastel. Precio por unidad.", stock: true },
    { id: "p16", nombre: "Set de platos de cerámica x6", cat: "bazar", precio: 38900, img: "img/productos/platos-ceramica.jpg", desc: "Seis platos playos de cerámica en crema. Aptos para microondas y lavavajillas.", stock: true },
    { id: "p17", nombre: "Copas de vino x4", cat: "bazar", precio: 19900, img: "img/productos/copa-vino.jpg", desc: "Copas de cristal de 450 ml. Vienen en caja, listas para regalar.", stock: true },
    { id: "p18", nombre: "Tabla de picada de madera", cat: "bazar", precio: 23900, img: "img/productos/tabla-picada.jpg", desc: "Tabla de madera maciza de 40 x 25 cm con manija.", stock: true },

    { id: "p19", nombre: "Tazas con frases", cat: "regaleria", precio: 9500, img: "img/productos/tazas-frases.jpg", desc: "Tazas de cerámica con frases e ilustraciones. Elegí la tuya en el local.", destacado: true, nuevo: true, stock: true },
    { id: "p20", nombre: "Caja de regalo armada", cat: "regaleria", precio: 29900, img: "img/productos/cajas-regalo.jpg", desc: "Caja con vela, taza y sahumerios, envuelta y con tarjeta. Personalizable.", destacado: true, stock: true },
    { id: "p21", nombre: "Regalo sorpresa con moño", cat: "regaleria", precio: 24900, img: "img/productos/regalo-mono.jpg", desc: "Contanos para quién es y armamos el regalo. Envoltorio de regalo incluido.", stock: true },
    { id: "p22", nombre: "Gift card 22doce", cat: "regaleria", precio: 20000, img: "img/productos/regalo-rojo.jpg", desc: "Tarjeta de regalo para usar en el local. El monto lo elegís vos.", stock: true },

    { id: "p23", nombre: "Almohadón de lino", cat: "textiles", precio: 13900, img: "img/productos/almohadon.jpg", desc: "Funda de lino lavado con relleno, 45 x 45 cm. Varios colores.", stock: true },
    { id: "p24", nombre: "Juego de toallas de algodón", cat: "textiles", precio: 18900, img: "img/productos/toallas-estante.jpg", desc: "Toalla y toallón de algodón peinado de 500 g/m².", stock: true },
    { id: "p25", nombre: "Toallón premium", cat: "textiles", precio: 15900, img: "img/productos/toalla-enrollada.jpg", desc: "Toallón de 70 x 140 cm, suave y absorbente. Color arena.", stock: true },
    { id: "p26", nombre: "Manta tejida", cat: "textiles", precio: 26900, img: "img/productos/mantas-sillon.jpg", desc: "Manta tejida con flecos, 130 x 170 cm. Ideal para el sillón.", destacado: true, stock: true },

    { id: "p27", nombre: "Maceta de barro con suculenta", cat: "plantas", precio: 8900, img: "img/productos/planta-maceta.jpg", desc: "Maceta de terracota de 12 cm con suculenta natural.", stock: true },
    { id: "p28", nombre: "Set de macetas decoradas", cat: "plantas", precio: 22500, img: "img/productos/plantas-mix.jpg", desc: "Tres macetas de cerámica pintadas a mano, con plantas de interior.", nuevo: true, stock: true }
  ],

  // Reseñas de Google (EJEMPLO). En la versión final se traen del Perfil de Google del local.
  resenas: [
    { autor: "Mariela G.", estrellas: 5, fecha: "2026-11-12", texto: "Hermoso local, todo muy bien presentado. Compré un regalo y me lo envolvieron divino. ¡Súper recomendable!", respondida: true },
    { autor: "Lucas P.", estrellas: 5, fecha: "2026-11-08", texto: "Muy buena atención y precios accesibles. Tienen de todo para la casa.", respondida: false },
    { autor: "Carolina S.", estrellas: 5, fecha: "2026-10-30", texto: "Las velas son lo más, el aroma dura muchísimo. Siempre encuentro algo lindo.", respondida: true },
    { autor: "Graciela M.", estrellas: 4, fecha: "2026-10-21", texto: "Mucha variedad en bazar y decoración. Me gustaría que tengan más tazas grandes.", respondida: false },
    { autor: "Sofía R.", estrellas: 5, fecha: "2026-10-15", texto: "Me asesoraron un montón para armar un regalo de cumpleaños. Volveré.", respondida: true },
    { autor: "Javier L.", estrellas: 5, fecha: "2026-10-02", texto: "Local muy cálido, se nota el cariño en cada detalle.", respondida: true }
  ],

  pedidos: [],
  solicitudes: []
};
