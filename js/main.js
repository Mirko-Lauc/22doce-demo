(function () {
  "use strict";
  var D = DD.load(), I = DD.icon, esc = DD.esc, money = DD.money;
  var $ = function (id) { return document.getElementById(id); };
  var CART_KEY = "dd22_cart";
  var catName = {}; D.categorias.forEach(function (c) { catName[c.id] = c.nombre; });
  var visibles = function () { return D.productos.filter(function (p) { return p.visible !== false; }); };
  var byId = function (id) { return D.productos.filter(function (p) { return p.id === id; })[0]; };
  var L = D.local;

  /* ---------- Íconos y datos del local ---------- */
  $("openSearch").innerHTML = I("search");
  $("openCart").insertAdjacentHTML("afterbegin", I("cart"));
  $("openMenu").innerHTML = I("menu");
  $("closeCart").innerHTML = I("x");
  $("closeModal").innerHTML = I("x");
  $("perk1").innerHTML = I("gift"); $("perk2").innerHTML = I("store"); $("perk3").innerHTML = I("truck");
  document.querySelectorAll("[data-i]").forEach(function (el) { el.innerHTML = I(el.getAttribute("data-i")); });
  document.querySelector(".visit__ico--wa").innerHTML = DD.WA;

  $("aviso").textContent = L.aviso;
  var hola = "¡Hola 22doce! Quería hacer una consulta.";
  $("heroWa").href = DD.waLink(L.wa, hola);
  $("heroWa").insertAdjacentHTML("afterbegin", DD.WA);
  $("giftWa").href = DD.waLink(L.wa, "¡Hola 22doce! Quiero armar un regalo. Es para: ");
  $("waFloat").href = DD.waLink(L.wa, hola);
  $("waFloat").innerHTML = DD.WA;
  $("vDir").textContent = L.direccion;
  $("vHor").textContent = L.horario;
  $("vWa").textContent = L.waVisible;
  $("vWaBtn").href = DD.waLink(L.wa, hola);
  $("vMap").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent("22doce Deco Hogar " + L.direccion);
  $("fDir").textContent = L.direccion;
  $("fWa").innerHTML = '<a href="' + DD.waLink(L.wa, hola) + '" target="_blank" rel="noopener">WhatsApp ' + esc(L.waVisible) + "</a>";
  $("fIg").textContent = L.instagram;
  $("leaveReview").href = L.linkResena;
  $("leaveReview").insertAdjacentHTML("afterbegin", I("star"));

  /* ---------- Menú celular ---------- */
  var nav = $("nav");
  $("openMenu").addEventListener("click", function () {
    var open = nav.classList.toggle("is-open");
    this.setAttribute("aria-expanded", open);
    this.innerHTML = I(open ? "x" : "menu");
  });
  nav.addEventListener("click", function (e) { if (e.target.tagName === "A") { nav.classList.remove("is-open"); $("openMenu").innerHTML = I("menu"); $("openMenu").setAttribute("aria-expanded", "false"); } });

  /* ---------- Categorías ---------- */
  $("cats").innerHTML = D.categorias.map(function (c) {
    var n = visibles().filter(function (p) { return p.cat === c.id; }).length;
    return '<button class="cat reveal" data-cat="' + c.id + '"><img src="' + esc(c.img) + '" alt="" loading="lazy" width="400" height="500">' +
      '<span class="cat__txt"><b>' + esc(c.nombre) + "</b><small>" + esc(c.desc) + " · " + n + " productos</small></span></button>";
  }).join("");
  $("cats").addEventListener("click", function (e) {
    var b = e.target.closest("[data-cat]"); if (!b) return;
    setCat(b.getAttribute("data-cat")); $("catalogo").scrollIntoView({ behavior: "smooth" });
  });
  $("footCats").innerHTML = D.categorias.map(function (c) { return '<li><a href="#catalogo" data-fcat="' + c.id + '">' + esc(c.nombre) + "</a></li>"; }).join("");
  $("footCats").addEventListener("click", function (e) { var a = e.target.closest("[data-fcat]"); if (a) setCat(a.getAttribute("data-fcat")); });

  /* ---------- Tarjetas ---------- */
  function card(p) {
    var tag = !p.stock ? '<span class="tag tag--out">Sin stock</span>' : p.nuevo ? '<span class="tag">Nuevo</span>' : "";
    return '<article class="card">' +
      '<button class="card__img" data-view="' + p.id + '" aria-label="Ver ' + esc(p.nombre) + '"><img src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '" loading="lazy" width="400" height="400">' + tag + "</button>" +
      '<div class="card__body"><small>' + esc(catName[p.cat] || "") + "</small>" +
      '<h3><button data-view="' + p.id + '">' + esc(p.nombre) + "</button></h3>" +
      '<div class="card__row"><span class="price">' + money(p.precio) + "</span>" +
      (p.stock ? '<button class="add" data-add="' + p.id + '" aria-label="Agregar ' + esc(p.nombre) + ' al carrito">' + I("plus") + "<span>Agregar</span></button>" : '<span class="muted-sm">Consultar</span>') +
      "</div></div></article>";
  }

  $("destacados").innerHTML = visibles().filter(function (p) { return p.destacado; }).map(card).join("");

  /* ---------- Catálogo ---------- */
  var state = { cat: "todas", q: "", sort: "dest" };
  function drawChips() {
    var all = [{ id: "todas", nombre: "Todo" }].concat(D.categorias);
    $("chips").innerHTML = all.map(function (c) {
      return '<button class="chip' + (state.cat === c.id ? " is-on" : "") + '" role="tab" aria-selected="' + (state.cat === c.id) + '" data-chip="' + c.id + '">' + esc(c.nombre) + "</button>";
    }).join("");
  }
  function drawGrid() {
    var q = state.q.trim().toLowerCase();
    var list = visibles().filter(function (p) {
      return (state.cat === "todas" || p.cat === state.cat) && (!q || (p.nombre + " " + p.desc + " " + (catName[p.cat] || "")).toLowerCase().indexOf(q) > -1);
    });
    var s = state.sort;
    list.sort(function (a, b) {
      if (s === "asc") return a.precio - b.precio;
      if (s === "desc") return b.precio - a.precio;
      if (s === "az") return a.nombre.localeCompare(b.nombre);
      return (b.destacado ? 1 : 0) - (a.destacado ? 1 : 0) || (b.stock ? 1 : 0) - (a.stock ? 1 : 0);
    });
    $("count").textContent = list.length + (list.length === 1 ? " producto" : " productos");
    $("grid").innerHTML = list.length ? list.map(card).join("") :
      '<div class="empty">' + I("search") + "<p>No encontramos productos con esa búsqueda.</p><button class=\"btn btn--ghost\" id=\"clearQ\">Ver todo</button></div>";
    var c = $("clearQ"); if (c) c.addEventListener("click", function () { $("q").value = ""; state.q = ""; setCat("todas"); });
  }
  function setCat(id) { state.cat = id; drawChips(); drawGrid(); }
  $("chips").addEventListener("click", function (e) { var b = e.target.closest("[data-chip]"); if (b) setCat(b.getAttribute("data-chip")); });
  var tq; $("q").addEventListener("input", function () { var v = this.value; clearTimeout(tq); tq = setTimeout(function () { state.q = v; drawGrid(); }, 150); });
  $("sort").addEventListener("change", function () { state.sort = this.value; drawGrid(); });
  $("openSearch").addEventListener("click", function () { $("catalogo").scrollIntoView({ behavior: "smooth" }); setTimeout(function () { $("q").focus({ preventScroll: true }); }, 450); });
  drawChips(); drawGrid();

  /* ---------- Detalle ---------- */
  var modal = $("modal");
  function openProduct(id) {
    var p = byId(id); if (!p) return;
    $("modalIn").innerHTML = '<div class="modal__img"><img src="' + esc(p.img) + '" alt="' + esc(p.nombre) + '"></div>' +
      '<div class="modal__txt"><small class="eyebrow">' + esc(catName[p.cat] || "") + '</small><h2 id="mTitle">' + esc(p.nombre) + "</h2>" +
      '<p class="price price--lg">' + money(p.precio) + "</p><p>" + esc(p.desc) + "</p>" +
      (p.stock ?
        '<div class="qty-row"><div class="qty" aria-label="Cantidad"><button data-q="-1" aria-label="Restar">' + I("minus") + '</button><output id="mQty">1</output><button data-q="1" aria-label="Sumar">' + I("plus") + "</button></div>" +
        '<button class="btn btn--primary" id="mAdd">' + I("cart") + "Agregar al carrito</button></div>"
        : '<p class="tag tag--out tag--inline">Sin stock por ahora</p>') +
      '<a class="btn btn--ghost btn--block" target="_blank" rel="noopener" href="' + DD.waLink(L.wa, "¡Hola 22doce! Quería consultar por: " + p.nombre + " (" + money(p.precio) + ")") + '">' + DD.WA + "Consultar por WhatsApp</a>" +
      '<ul class="modal__perks"><li>' + I("gift") + "Envoltorio de regalo sin cargo</li><li>" + I("store") + "Retiro en " + esc(L.direccion) + "</li></ul></div>";
    var qty = 1;
    modal.querySelectorAll("[data-q]").forEach(function (b) { b.addEventListener("click", function () { qty = Math.max(1, qty + +b.getAttribute("data-q")); $("mQty").textContent = qty; }); });
    var add = $("mAdd"); if (add) add.addEventListener("click", function () { addToCart(p.id, qty); modal.close(); });
    modal.showModal();
  }
  $("closeModal").addEventListener("click", function () { modal.close(); });
  modal.addEventListener("click", function (e) { if (e.target === modal) modal.close(); });

  document.addEventListener("click", function (e) {
    var v = e.target.closest("[data-view]"); if (v) { openProduct(v.getAttribute("data-view")); return; }
    var a = e.target.closest("[data-add]"); if (a) { addToCart(a.getAttribute("data-add"), 1, a); }
  });

  /* ---------- Carrito ---------- */
  var cart = [];
  try { cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]").filter(function (i) { return byId(i.id); }); } catch (e) { cart = []; }
  var entrega = "retiro";
  function persist() { try { localStorage.setItem(CART_KEY, JSON.stringify(cart)); } catch (e) {} }
  function total() { return cart.reduce(function (s, i) { return s + byId(i.id).precio * i.qty; }, 0); }
  function units() { return cart.reduce(function (s, i) { return s + i.qty; }, 0); }

  function addToCart(id, qty, btn) {
    var it = cart.filter(function (i) { return i.id === id; })[0];
    if (it) it.qty += qty; else cart.push({ id: id, qty: qty });
    persist(); drawCart();
    var cc = $("cartCount"); cc.classList.remove("bump"); void cc.offsetWidth; cc.classList.add("bump");
    if (btn) { btn.classList.add("is-done"); btn.innerHTML = I("check") + "<span>Listo</span>"; setTimeout(function () { btn.classList.remove("is-done"); btn.innerHTML = I("plus") + "<span>Agregar</span>"; }, 1300); }
    toast(byId(id).nombre + " se agregó al carrito");
  }

  function drawCart() {
    var n = units(); $("cartCount").textContent = n; $("cartCount").hidden = !n;
    if (!cart.length) {
      $("cartBody").innerHTML = '<div class="empty empty--cart">' + I("cart") + "<p>Tu carrito está vacío.</p><button class=\"btn btn--primary\" data-close-go>Ver catálogo</button></div>";
      $("cartFoot").innerHTML = ""; return;
    }
    $("cartBody").innerHTML = '<ul class="lines">' + cart.map(function (i) {
      var p = byId(i.id);
      return '<li class="line"><img src="' + esc(p.img) + '" alt="" width="72" height="72"><div class="line__txt"><b>' + esc(p.nombre) + "</b><span>" + money(p.precio) + "</span>" +
        '<div class="qty qty--sm"><button data-cq="' + i.id + '|-1" aria-label="Restar">' + I("minus") + "</button><output>" + i.qty + '</output><button data-cq="' + i.id + '|1" aria-label="Sumar">' + I("plus") + "</button></div></div>" +
        '<div class="line__end"><b>' + money(p.precio * i.qty) + '</b><button class="link-btn" data-rm="' + i.id + '" aria-label="Quitar ' + esc(p.nombre) + '">' + I("trash") + "</button></div></li>";
    }).join("") + "</ul>" +
      '<fieldset class="ship"><legend>¿Cómo lo recibís?</legend>' +
      '<label class="opt"><input type="radio" name="ent" value="retiro"' + (entrega === "retiro" ? " checked" : "") + ">" + I("store") + "<span><b>Retiro en el local</b><small>" + esc(L.direccion) + " · Sin cargo</small></span></label>" +
      '<label class="opt"><input type="radio" name="ent" value="envio"' + (entrega === "envio" ? " checked" : "") + ">" + I("truck") + "<span><b>Envío a domicilio</b><small>Coordinamos el costo por WhatsApp</small></span></label></fieldset>" +
      '<label class="field"><span>Tu nombre</span><input id="cName" autocomplete="name" placeholder="Ej.: Laura"></label>' +
      '<label class="field"><span>Nota (opcional)</span><input id="cNote" placeholder="Ej.: es para regalo, envolver por separado"></label>';
    $("cartFoot").innerHTML = '<div class="sum"><span>Total</span><b>' + money(total()) + "</b></div>" +
      '<button class="btn btn--primary btn--block" id="checkout">' + DD.WA + "Enviar pedido por WhatsApp</button>" +
      '<p class="fine">Te confirmamos stock y forma de pago (efectivo, transferencia o Mercado Pago) por WhatsApp.</p>';
    $("checkout").addEventListener("click", checkout);
  }

  $("cartBody").addEventListener("click", function (e) {
    var q = e.target.closest("[data-cq]"), r = e.target.closest("[data-rm]");
    if (e.target.closest("[data-close-go]")) { closeCart(); $("catalogo").scrollIntoView({ behavior: "smooth" }); return; }
    if (q) { var pr = q.getAttribute("data-cq").split("|"); var it = cart.filter(function (i) { return i.id === pr[0]; })[0]; it.qty += +pr[1]; if (it.qty < 1) cart.splice(cart.indexOf(it), 1); persist(); drawCart(); }
    if (r) { cart = cart.filter(function (i) { return i.id !== r.getAttribute("data-rm"); }); persist(); drawCart(); }
  });
  $("cartBody").addEventListener("change", function (e) { if (e.target.name === "ent") entrega = e.target.value; });

  function checkout() {
    var name = ($("cName").value || "").trim();
    if (!name) { $("cName").focus(); $("cName").closest(".field").classList.add("is-error"); toast("Escribí tu nombre para enviar el pedido"); return; }
    var note = ($("cNote").value || "").trim();
    var lines = cart.map(function (i) { var p = byId(i.id); return "• " + i.qty + " x " + p.nombre + " — " + money(p.precio * i.qty); });
    var msg = "¡Hola 22doce! Soy " + name + " y quiero hacer este pedido:\n\n" + lines.join("\n") + "\n\nTotal: " + money(total()) +
      "\nEntrega: " + (entrega === "retiro" ? "retiro en el local" : "envío a domicilio") + (note ? "\nNota: " + note : "");
    // Demo: el pedido queda registrado en el panel (mismo navegador)
    var data = DD.load();
    data.pedidos.unshift({ id: "P" + Date.now().toString().slice(-6), fecha: new Date().toISOString(), cliente: name, entrega: entrega, nota: note, total: total(),
      items: cart.map(function (i) { var p = byId(i.id); return { nombre: p.nombre, qty: i.qty, precio: p.precio }; }), estado: "Nuevo" });
    DD.save(data);
    window.open(DD.waLink(L.wa, msg), "_blank", "noopener");
    cart = []; persist(); drawCart(); closeCart();
    toast("¡Gracias! Te abrimos WhatsApp con tu pedido");
  }

  var drawer = $("cart"), scrim = $("scrim"), lastFocus;
  function openCart() { lastFocus = document.activeElement; drawer.classList.add("is-open"); drawer.setAttribute("aria-hidden", "false"); scrim.hidden = false; requestAnimationFrame(function () { scrim.classList.add("is-on"); }); document.body.classList.add("lock"); $("closeCart").focus(); }
  function closeCart() { drawer.classList.remove("is-open"); drawer.setAttribute("aria-hidden", "true"); scrim.classList.remove("is-on"); setTimeout(function () { scrim.hidden = true; }, 250); document.body.classList.remove("lock"); if (lastFocus) lastFocus.focus(); }
  $("openCart").addEventListener("click", openCart);
  $("closeCart").addEventListener("click", closeCart);
  scrim.addEventListener("click", closeCart);
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && drawer.classList.contains("is-open")) closeCart(); });
  drawCart();

  /* ---------- Reseñas ---------- */
  var rs = D.resenas;
  var avg = rs.length ? rs.reduce(function (s, r) { return s + r.estrellas; }, 0) / rs.length : 5;
  $("scoreNum").textContent = avg.toFixed(1).replace(".", ",");
  $("scoreStars").innerHTML = DD.stars(Math.round(avg));
  $("scoreCount").textContent = rs.length + " reseñas en Google";
  $("reviews").innerHTML = rs.slice(0, 6).map(function (r) {
    return '<figure class="review reveal"><div class="review__top"><span class="avatar">' + esc(r.autor.charAt(0)) + "</span><div><b>" + esc(r.autor) + "</b><small>" + DD.fecha(r.fecha) + "</small></div>" +
      '<svg class="g" viewBox="0 0 24 24" aria-label="Google"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.27-4.74 3.27-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84A11 11 0 0 0 12 23z"/><path fill="#FBBC05" d="M5.84 14.09a6.6 6.6 0 0 1 0-4.18V7.07H2.18a11 11 0 0 0 0 9.86l3.66-2.84z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15A10.96 10.96 0 0 0 12 1 11 11 0 0 0 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z"/></svg></div>' +
      DD.stars(r.estrellas) + "<blockquote>" + esc(r.texto) + "</blockquote></figure>";
  }).join("");

  /* ---------- Toast ---------- */
  function toast(m) { var t = $("toast"); t.textContent = m; t.classList.add("is-on"); clearTimeout(toast.t); toast.t = setTimeout(function () { t.classList.remove("is-on"); }, 2400); }

  /* ---------- Aparición al bajar ---------- */
  var header = document.querySelector(".header");
  window.addEventListener("scroll", function () { header.classList.toggle("is-scrolled", window.scrollY > 10); }, { passive: true });
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var io = new IntersectionObserver(function (es) { es.forEach(function (en) { if (en.isIntersecting) { en.target.classList.add("is-in"); io.unobserve(en.target); } }); }, { rootMargin: "0px 0px -8% 0px" });
    document.querySelectorAll(".reveal").forEach(function (el) { io.observe(el); });
  } else { document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("is-in"); }); }
})();
