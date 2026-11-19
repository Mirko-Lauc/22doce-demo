(function () {
  "use strict";
  var D = DD.load(), I = DD.icon, esc = DD.esc, money = DD.money;
  var $ = function (id) { return document.getElementById(id); };
  var content = $("content"), view = "resumen";
  var catName = function (id) { var c = D.categorias.filter(function (c) { return c.id === id; })[0]; return c ? c.nombre : id; };
  function save(msg) { if (DD.save(D)) toast(msg || "Guardado"); else toast("No hay más espacio en el navegador. Probá con fotos más livianas."); }
  function toast(m) { var t = $("toast"); t.textContent = m; t.classList.add("is-on"); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove("is-on"); }, 2600); }

  /* ---------- Ingreso ---------- */
  function enter() { $("login").hidden = true; $("app").hidden = false; go(location.hash.slice(1) || "resumen"); }
  $("loginForm").addEventListener("submit", function (e) { e.preventDefault(); try { sessionStorage.setItem("dd22_in", "1"); } catch (x) {} enter(); });
  $("logout").innerHTML = I("logout") + "<span>Salir</span>";
  $("logout").addEventListener("click", function () { try { sessionStorage.removeItem("dd22_in"); } catch (x) {} location.hash = ""; location.reload(); });
  $("viewSite").innerHTML = I("eye") + "<span>Ver la tienda</span>";

  /* ---------- Navegación ---------- */
  var VIEWS = [
    ["resumen", "Resumen", "chart"], ["productos", "Productos", "box"], ["pedidos", "Pedidos", "cart"],
    ["resenas", "Reseñas de Google", "star"], ["pedir", "Pedir reseñas", "send"], ["datos", "Datos del local", "settings"]
  ];
  function drawNav() {
    var nuevos = D.pedidos.filter(function (p) { return p.estado === "Nuevo"; }).length;
    var sinResp = D.resenas.filter(function (r) { return !r.respondida; }).length;
    $("sideNav").innerHTML = VIEWS.map(function (v) {
      var badge = v[0] === "pedidos" && nuevos ? nuevos : v[0] === "resenas" && sinResp ? sinResp : "";
      return '<a href="#' + v[0] + '" class="side__item' + (view === v[0] ? " is-on" : "") + '"' + (view === v[0] ? ' aria-current="page"' : "") + ">" + I(v[2]) + "<span>" + v[1] + "</span>" + (badge ? '<em class="badge">' + badge + "</em>" : "") + "</a>";
    }).join("");
  }
  window.addEventListener("hashchange", function () { if (!$("app").hidden) go(location.hash.slice(1)); });
  function go(v) {
    if (!R[v]) v = "resumen"; view = v;
    var meta = VIEWS.filter(function (x) { return x[0] === v; })[0];
    $("title").textContent = meta[1]; $("topActions").innerHTML = "";
    drawNav(); content.innerHTML = ""; R[v](); window.scrollTo(0, 0);
  }

  /* ---------- Vistas ---------- */
  var R = {};

  R.resumen = function () {
    var nuevos = D.pedidos.filter(function (p) { return p.estado === "Nuevo"; });
    var avg = D.resenas.length ? D.resenas.reduce(function (s, r) { return s + r.estrellas; }, 0) / D.resenas.length : 0;
    var sinResp = D.resenas.filter(function (r) { return !r.respondida; }).length;
    var vis = D.productos.filter(function (p) { return p.visible !== false; }).length;
    var sinStock = D.productos.filter(function (p) { return !p.stock; }).length;
    content.innerHTML =
      '<div class="hello"><div><h2>¡Hola! <span class="hand">Qué lindo verte</span></h2><p>Desde acá manejás tu tienda: cargás productos, ves los pedidos que llegan por la web y cuidás tus reseñas de Google.</p></div>' +
      '<button class="btn btn--primary" data-go="nuevo">' + I("plus") + "Cargar producto</button></div>" +
      '<div class="kpis">' +
      kpi("box", vis, "productos en la web", sinStock + " sin stock") +
      kpi("cart", nuevos.length, "pedidos nuevos", D.pedidos.length + " en total") +
      kpi("star", avg.toFixed(1).replace(".", ","), "puntaje en Google", D.resenas.length + " reseñas") +
      kpi("message", sinResp, "reseñas sin responder", "Respondelas en Google") + "</div>" +
      '<div class="cols2"><section class="panel"><div class="panel__head"><h3>Últimos pedidos</h3><a href="#pedidos" class="link-arrow">Ver todos</a></div>' +
      (D.pedidos.length ? '<ul class="mini">' + D.pedidos.slice(0, 4).map(function (p) {
        return "<li><div><b>" + esc(p.cliente) + "</b><small>" + p.items.length + " productos · " + new Date(p.fecha).toLocaleString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) + "</small></div><span class=\"pill pill--" + slug(p.estado) + '">' + esc(p.estado) + "</span><b>" + money(p.total) + "</b></li>";
      }).join("") + "</ul>" : '<div class="empty-sm">' + I("cart") + "<p>Todavía no llegaron pedidos. Probá hacer uno desde la tienda: va a aparecer acá.</p></div>") + "</section>" +
      '<section class="panel panel--cta"><span class="panel__ico">' + I("star") + "</span><h3>Más reseñas, más clientes</h3><p>Los negocios con muchas reseñas aparecen primero en Google Maps. Mandale el link a tus clientes por WhatsApp en un clic, o poné el QR en el mostrador.</p>" +
      '<a class="btn btn--gold" href="#pedir">Pedir una reseña</a></section></div>';
    content.querySelector("[data-go=nuevo]").addEventListener("click", function () { openForm(); });
  };
  function kpi(ic, n, label, sub) { return '<div class="kpi"><span class="kpi__ico">' + I(ic) + '</span><b>' + n + "</b><span>" + label + "</span><small>" + sub + "</small></div>"; }
  function slug(s) { return String(s).toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/\s+/g, "-"); }

  /* Productos */
  var pf = { q: "", cat: "todas" };
  R.productos = function () {
    $("topActions").innerHTML = '<button class="btn btn--primary" id="newP">' + I("plus") + "Nuevo producto</button>";
    $("newP").addEventListener("click", function () { openForm(); });
    content.innerHTML = '<div class="filters"><label class="search"><span class="sr">Buscar</span><input type="search" id="pq" placeholder="Buscar producto" value="' + esc(pf.q) + '"></label>' +
      '<label class="select"><span class="sr">Categoría</span><select id="pcat"><option value="todas">Todas las categorías</option>' +
      D.categorias.map(function (c) { return '<option value="' + c.id + '"' + (pf.cat === c.id ? " selected" : "") + ">" + esc(c.nombre) + "</option>"; }).join("") + "</select></label></div>" +
      '<div class="plist" id="plist"></div>';
    $("pq").addEventListener("input", function () { pf.q = this.value; list(); });
    $("pcat").addEventListener("change", function () { pf.cat = this.value; list(); });
    list();
    function list() {
      var q = pf.q.trim().toLowerCase();
      var arr = D.productos.filter(function (p) { return (pf.cat === "todas" || p.cat === pf.cat) && (!q || p.nombre.toLowerCase().indexOf(q) > -1); });
      $("plist").innerHTML = arr.length ? arr.map(function (p) {
        return '<article class="prow' + (p.visible === false ? " is-hidden" : "") + '"><img src="' + esc(p.img) + '" alt="" width="64" height="64" loading="lazy">' +
          '<div class="prow__txt"><b>' + esc(p.nombre) + "</b><small>" + esc(catName(p.cat)) + (p.destacado ? " · Destacado" : "") + (p.visible === false ? " · Oculto" : "") + "</small></div>" +
          '<span class="prow__price">' + money(p.precio) + "</span>" +
          '<label class="tgl tgl--sm" title="Stock"><input type="checkbox" data-stock="' + p.id + '"' + (p.stock ? " checked" : "") + '><span></span><em>' + (p.stock ? "Con stock" : "Sin stock") + "</em></label>" +
          '<button class="icon-btn" data-edit="' + p.id + '" aria-label="Editar ' + esc(p.nombre) + '">' + I("edit") + "</button></article>";
      }).join("") : '<div class="empty-sm">' + I("search") + "<p>No hay productos con ese filtro.</p></div>";
    }
    $("plist").addEventListener("click", function (e) { var b = e.target.closest("[data-edit]"); if (b) openForm(b.getAttribute("data-edit")); });
    $("plist").addEventListener("change", function (e) {
      var id = e.target.getAttribute("data-stock"); if (!id) return;
      var p = byId(id); p.stock = e.target.checked; e.target.parentNode.querySelector("em").textContent = p.stock ? "Con stock" : "Sin stock";
      save(p.stock ? "Marcado con stock" : "Marcado sin stock");
    });
  };
  function byId(id) { return D.productos.filter(function (p) { return p.id === id; })[0]; }

  /* Formulario de producto */
  var pm = $("pModal"), editing = null, imgData = null;
  $("pClose").innerHTML = I("x"); $("dropIco").innerHTML = I("image");
  $("pCat").innerHTML = D.categorias.map(function (c) { return '<option value="' + c.id + '">' + esc(c.nombre) + "</option>"; }).join("");
  function openForm(id) {
    editing = id ? byId(id) : null; imgData = editing ? editing.img : null;
    $("pTitle").textContent = editing ? "Editar producto" : "Nuevo producto";
    $("pName").value = editing ? editing.nombre : ""; $("pCat").value = editing ? editing.cat : (pf.cat !== "todas" ? pf.cat : D.categorias[0].id);
    $("pPrice").value = editing ? editing.precio : ""; $("pDesc").value = editing ? editing.desc : "";
    $("pStock").checked = editing ? !!editing.stock : true; $("pVis").checked = editing ? editing.visible !== false : true;
    $("pDest").checked = editing ? !!editing.destacado : false; $("pNew").checked = editing ? !!editing.nuevo : true;
    $("pDelete").hidden = !editing; showImg(imgData); pm.showModal(); setTimeout(function () { $("pName").focus(); }, 50);
  }
  function showImg(src) { $("pPreview").hidden = !src; $("dropEmpty").hidden = !!src; if (src) $("pPreview").src = src; }
  ["pClose", "pCancel"].forEach(function (b) { $(b).addEventListener("click", function () { pm.close(); }); });
  $("pPick").addEventListener("click", function () { $("pFile").click(); });
  $("drop").addEventListener("click", function () { $("pFile").click(); });
  $("drop").addEventListener("dragover", function (e) { e.preventDefault(); this.classList.add("is-over"); });
  $("drop").addEventListener("dragleave", function () { this.classList.remove("is-over"); });
  $("drop").addEventListener("drop", function (e) { e.preventDefault(); this.classList.remove("is-over"); if (e.dataTransfer.files[0]) readImg(e.dataTransfer.files[0]); });
  $("pFile").addEventListener("change", function () { if (this.files[0]) readImg(this.files[0]); this.value = ""; });
  function readImg(file) {
    if (!/^image\//.test(file.type)) { toast("Elegí un archivo de imagen"); return; }
    var fr = new FileReader();
    fr.onload = function () {
      var im = new Image();
      im.onload = function () {
        var s = Math.min(1, 800 / Math.max(im.width, im.height)), c = document.createElement("canvas");
        c.width = Math.round(im.width * s); c.height = Math.round(im.height * s);
        c.getContext("2d").drawImage(im, 0, 0, c.width, c.height);
        imgData = c.toDataURL("image/jpeg", 0.8); showImg(imgData);
      };
      im.src = fr.result;
    };
    fr.readAsDataURL(file);
  }
  $("pForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var name = $("pName").value.trim(), price = Math.round(+$("pPrice").value);
    if (!name) { $("pName").focus(); toast("Poné el nombre del producto"); return; }
    if (!(price > 0)) { $("pPrice").focus(); toast("Poné un precio"); return; }
    if (!imgData) { toast("Subí una foto del producto"); return; }
    var p = editing || { id: "p" + Date.now() };
    Object.assign(p, { nombre: name, cat: $("pCat").value, precio: price, desc: $("pDesc").value.trim(), img: imgData,
      stock: $("pStock").checked, visible: $("pVis").checked, destacado: $("pDest").checked, nuevo: $("pNew").checked });
    if (!editing) D.productos.unshift(p);
    pm.close(); save(editing ? "Producto actualizado. Ya se ve en la tienda." : "Producto cargado. Ya se ve en la tienda.");
    if (view === "productos") R.productos(); else go("productos");
  });
  $("pDelete").addEventListener("click", function () {
    if (!editing || !confirm("¿Eliminar \"" + editing.nombre + "\"? No se puede deshacer.")) return;
    D.productos = D.productos.filter(function (p) { return p !== editing; }); pm.close(); save("Producto eliminado"); R.productos();
  });

  /* Pedidos */
  var ESTADOS = ["Nuevo", "Preparando", "Listo para retirar", "Entregado"];
  R.pedidos = function () {
    if (!D.pedidos.length) {
      content.innerHTML = '<div class="panel empty-big">' + I("cart") + "<h3>Todavía no hay pedidos</h3><p>Cuando un cliente arma su carrito en la tienda y toca <b>Enviar pedido por WhatsApp</b>, te llega el mensaje y además queda anotado acá.</p><a class=\"btn btn--primary\" href=\"index.html#catalogo\" target=\"_blank\" rel=\"noopener\">Probar un pedido</a></div>";
      return;
    }
    content.innerHTML = '<div class="orders">' + D.pedidos.map(function (p, i) {
      return '<article class="order panel"><div class="order__head"><div><b>' + esc(p.cliente) + "</b><small>Pedido " + esc(p.id) + " · " + new Date(p.fecha).toLocaleString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) + "</small></div>" +
        '<label class="select"><span class="sr">Estado</span><select data-est="' + i + '">' + ESTADOS.map(function (e) { return "<option" + (e === p.estado ? " selected" : "") + ">" + e + "</option>"; }).join("") + "</select></label></div>" +
        '<ul class="order__items">' + p.items.map(function (it) { return "<li><span>" + it.qty + " × " + esc(it.nombre) + "</span><span>" + money(it.precio * it.qty) + "</span></li>"; }).join("") + "</ul>" +
        '<div class="order__foot"><span class="pill">' + I(p.entrega === "retiro" ? "store" : "truck") + (p.entrega === "retiro" ? "Retira en el local" : "Envío a domicilio") + "</span>" + (p.nota ? '<span class="order__note">“' + esc(p.nota) + "”</span>" : "") + "<b>" + money(p.total) + "</b></div></article>";
    }).join("") + "</div>";
    content.querySelector(".orders").addEventListener("change", function (e) { var i = e.target.getAttribute("data-est"); if (i == null) return; D.pedidos[+i].estado = e.target.value; save("Estado actualizado"); drawNav(); });
  };

  /* Reseñas */
  var rf = "todas";
  R.resenas = function () {
    var rs = D.resenas, n = rs.length, avg = n ? rs.reduce(function (s, r) { return s + r.estrellas; }, 0) / n : 0;
    $("topActions").innerHTML = '<a class="btn btn--primary" href="#pedir">' + I("send") + "Pedir reseñas</a>";
    var dist = [5, 4, 3, 2, 1].map(function (k) { var c = rs.filter(function (r) { return r.estrellas === k; }).length; return '<div class="bar"><span>' + k + '</span><div><i style="width:' + (n ? c / n * 100 : 0) + '%"></i></div><small>' + c + "</small></div>"; }).join("");
    content.innerHTML = '<div class="note">' + I("star") + "<p><b>Demo:</b> estas reseñas son de ejemplo. En la versión final se traen solas de tu Perfil de Google y se actualizan todos los días.</p></div>" +
      '<div class="cols2 cols2--rev"><section class="panel score-card"><b class="big">' + avg.toFixed(1).replace(".", ",") + "</b>" + DD.stars(Math.round(avg)) + "<small>" + n + " reseñas en Google</small><div class=\"bars\">" + dist + "</div></section>" +
      '<section class="panel"><div class="panel__head"><h3>Opiniones</h3><div class="seg" id="seg"><button data-f="todas"' + (rf === "todas" ? ' class="is-on"' : "") + '>Todas</button><button data-f="sin"' + (rf === "sin" ? ' class="is-on"' : "") + ">Sin responder</button></div></div><div id=\"rlist\"></div></section></div>";
    function list() {
      var arr = rs.filter(function (r) { return rf === "todas" || !r.respondida; });
      $("rlist").innerHTML = arr.length ? arr.map(function (r) {
        var i = rs.indexOf(r);
        return '<article class="rv"><div class="rv__top"><span class="avatar">' + esc(r.autor.charAt(0)) + "</span><div><b>" + esc(r.autor) + "</b><small>" + DD.fecha(r.fecha) + "</small></div>" + DD.stars(r.estrellas) + "</div><p>" + esc(r.texto) + "</p>" +
          '<div class="rv__foot">' + (r.respondida ? '<span class="pill pill--ok">' + I("check") + "Respondida</span>" :
            '<a class="btn btn--sm btn--ghost" href="https://business.google.com/reviews" target="_blank" rel="noopener">Responder en Google</a><button class="btn btn--sm btn--soft" data-resp="' + i + '">Marcar respondida</button>') + "</div></article>";
      }).join("") : '<div class="empty-sm">' + I("check") + "<p>¡Respondiste todas las reseñas!</p></div>";
    }
    list();
    $("seg").addEventListener("click", function (e) { var b = e.target.closest("[data-f]"); if (!b) return; rf = b.getAttribute("data-f"); this.querySelectorAll("button").forEach(function (x) { x.classList.toggle("is-on", x === b); }); list(); });
    $("rlist").addEventListener("click", function (e) { var b = e.target.closest("[data-resp]"); if (!b) return; rs[+b.getAttribute("data-resp")].respondida = true; save("Marcada como respondida"); drawNav(); list(); });
  };

  /* Pedir reseñas */
  var PLANTILLA = "¡Hola {nombre}! Gracias por comprar en 22doce Deco Hogar 💛\n¿Nos ayudás con una reseña en Google? Son 30 segundos y nos ayuda muchísimo:\n{link}";
  R.pedir = function () {
    var link = D.local.linkResena;
    content.innerHTML = '<div class="cols2 cols2--ask">' +
      '<section class="panel"><h3>Mandar por WhatsApp</h3><p class="muted">Escribí el nombre y el celular del cliente. Se abre WhatsApp con el mensaje listo para enviar.</p>' +
      '<form id="askForm"><div class="row2"><label class="field"><span>Nombre</span><input id="aName" placeholder="Ej.: Laura" required></label>' +
      '<label class="field"><span>Celular</span><input id="aPhone" type="tel" inputmode="tel" placeholder="Ej.: 3498 112233" required></label></div>' +
      '<label class="field"><span>Mensaje</span><textarea id="aMsg" rows="5"></textarea><small>Podés cambiarlo. {nombre} y {link} se completan solos.</small></label>' +
      '<div class="wa-preview"><small>Así lo va a ver tu cliente</small><div class="bubble" id="aPrev"></div></div>' +
      '<button class="btn btn--primary btn--block" type="submit">' + DD.WA + "Enviar por WhatsApp</button></form></section>" +
      '<section class="panel qr-card"><h3>QR para el mostrador</h3><p class="muted">Imprimilo y ponelo en la caja: el cliente lo escanea y deja su reseña.</p>' +
      '<div class="qr-print" id="qrPrint"><img src="img/logo-22doce.png" alt="" width="70" height="70"><p class="hand">¿Te gustó tu compra?</p><div id="qr"></div><small>Escaneá y dejanos tu reseña en Google</small></div>' +
      '<div class="qr-actions"><button class="btn btn--ghost btn--sm" id="copyLink">' + I("copy") + 'Copiar link</button><button class="btn btn--ghost btn--sm" id="printQr">Imprimir</button></div></section></div>' +
      '<section class="panel"><div class="panel__head"><h3>Pedidos de reseña enviados</h3><small class="muted">' + D.solicitudes.length + " en total</small></div><div id=\"hist\"></div></section>";
    $("aMsg").value = PLANTILLA;
    function msg() { return $("aMsg").value.replace(/\{nombre\}/g, $("aName").value.trim() || "Laura").replace(/\{link\}/g, link); }
    function prev() { $("aPrev").textContent = msg(); }
    ["aName", "aMsg"].forEach(function (id) { $(id).addEventListener("input", prev); }); prev();
    $("askForm").addEventListener("submit", function (e) {
      e.preventDefault();
      var tel = $("aPhone").value.replace(/\D/g, "");
      if (tel.length < 10) { $("aPhone").focus(); toast("Revisá el celular: con característica, sin 0 ni 15"); return; }
      if (tel.indexOf("54") !== 0) tel = "549" + tel;
      window.open(DD.waLink(tel, msg()), "_blank", "noopener");
      D.solicitudes.unshift({ nombre: $("aName").value.trim(), tel: $("aPhone").value.trim(), fecha: new Date().toISOString() });
      save("Listo. Se abrió WhatsApp con el mensaje"); $("aName").value = ""; $("aPhone").value = ""; prev(); hist();
    });
    try { new QRCode($("qr"), { text: link, width: 168, height: 168, colorDark: "#520E1B", colorLight: "#FFFBF5", correctLevel: QRCode.CorrectLevel.M }); }
    catch (e) { $("qr").innerHTML = '<p class="muted">No se pudo generar el QR sin internet.</p>'; }
    $("copyLink").addEventListener("click", function () { (navigator.clipboard ? navigator.clipboard.writeText(link) : Promise.reject()).then(function () { toast("Link copiado"); }, function () { prompt("Copiá el link:", link); }); });
    $("printQr").addEventListener("click", function () { document.body.classList.add("printing-qr"); window.print(); setTimeout(function () { document.body.classList.remove("printing-qr"); }, 500); });
    function hist() {
      $("hist").innerHTML = D.solicitudes.length ? '<ul class="mini">' + D.solicitudes.slice(0, 8).map(function (s) {
        return "<li><div><b>" + esc(s.nombre) + "</b><small>" + esc(s.tel) + "</small></div><small>" + new Date(s.fecha).toLocaleString("es-AR", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }) + '</small><span class="pill pill--ok">' + I("check") + "Enviado</span></li>";
      }).join("") + "</ul>" : '<div class="empty-sm">' + I("send") + "<p>Acá vas a ver a quién le pediste reseña.</p></div>";
    }
    hist();
  };

  /* Datos del local */
  R.datos = function () {
    var L = D.local;
    var f = function (k, label, help, type) { return '<label class="field"><span>' + label + '</span><input data-k="' + k + '" type="' + (type || "text") + '" value="' + esc(L[k]) + '">' + (help ? "<small>" + help + "</small>" : "") + "</label>"; };
    content.innerHTML = '<form class="panel form-grid" id="dForm"><h3>Datos que se ven en la tienda</h3>' +
      '<div class="row2">' + f("waVisible", "WhatsApp (como se muestra)", "") + f("wa", "WhatsApp (para los botones)", "Con 549 adelante, sin espacios. Ej.: 5493498475590") + "</div>" +
      '<div class="row2">' + f("direccion", "Dirección", "") + f("instagram", "Instagram", "") + "</div>" +
      f("horario", "Horario", "") + f("aviso", "Aviso de la barra de arriba", "Ideal para promos: “20% off en velas este finde”") +
      f("linkResena", "Link para dejar reseña en Google", "Lo sacás de tu Perfil de Google → Pedir reseñas → Compartir.", "url") +
      '<div class="form-actions"><button class="btn btn--primary" type="submit">Guardar cambios</button></div></form>' +
      '<section class="panel danger"><h3>Volver a la demo original</h3><p class="muted">Borra los productos, pedidos y cambios que hiciste en este navegador.</p><button class="btn btn--ghost" id="resetAll">Restablecer demo</button></section>';
    $("dForm").addEventListener("submit", function (e) {
      e.preventDefault(); this.querySelectorAll("[data-k]").forEach(function (i) { L[i.getAttribute("data-k")] = i.value.trim(); });
      save("Datos guardados. Ya se ven en la tienda.");
    });
    $("resetAll").addEventListener("click", function () { if (confirm("¿Restablecer la demo? Se pierden los cambios hechos en este navegador.")) { DD.reset(); D = DD.load(); toast("Demo restablecida"); go("resumen"); } });
  };

  var logged = false;
  try { logged = !!sessionStorage.getItem("dd22_in"); } catch (x) {}
  if (logged) enter();
})();
