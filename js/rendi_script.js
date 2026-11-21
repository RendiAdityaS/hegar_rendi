// ==============================
// KATALOG + KERANJANG HEGAR RAMONA
// ==============================

const rendi_product_grid = document.getElementById("rendi_product_grid");
const rendi_search_product = document.getElementById("rendi_search_product");
const rendi_sort_product = document.getElementById("rendi_sort_product");
const rendi_empty_product = document.getElementById("rendi_empty_product");
const rendi_catalog_result = document.getElementById("rendi_catalog_result");

const rendi_cart_key = "hegarRamonaCart";
const rendi_cart_float = document.getElementById("rendi_cart_float");
const rendi_cart_count = document.getElementById("rendi_cart_count");
const rendi_cart_drawer = document.getElementById("rendi_cart_drawer");
const rendi_cart_items = document.getElementById("rendi_cart_items");
const rendi_cart_empty = document.getElementById("rendi_cart_empty");
const rendi_cart_footer = document.getElementById("rendi_cart_footer");
const rendi_cart_total_value = document.getElementById("rendi_cart_total_value");
const rendi_cart_close = document.getElementById("rendi_cart_close");
const rendi_cart_checkout = document.getElementById("rendi_cart_checkout");

let rendi_kategori_aktif = "semua";

function rendi_format_rupiah(angka) {
    return `Rp ${Number(angka).toLocaleString("id-ID")}`;
}

function rendi_get_cart() {
    try {
        const cart = JSON.parse(localStorage.getItem(rendi_cart_key) || "[]");
        return Array.isArray(cart) ? cart : [];
    } catch (error) {
        return [];
    }
}

function rendi_save_cart(cart) {
    localStorage.setItem(rendi_cart_key, JSON.stringify(cart));
}

function rendi_add_to_cart(product, quantity = 1) {
    if (!product || product.status === "Habis") return;

    const cart = rendi_get_cart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += quantity;
    } else {
        cart.push({
            id: product.id,
            nama: product.nama,
            harga: product.harga,
            satuan: product.satuan,
            quantity,
            note: ""
        });
    }

    rendi_save_cart(cart);
    rendi_render_cart();
    rendi_tampilkan_toast(`${product.nama} ditambahkan ke keranjang.`);
}

function rendi_render_cart() {
    const cart = rendi_get_cart();

    if (rendi_cart_count) {
        const totalQty = cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
        rendi_cart_count.textContent = totalQty;
        rendi_cart_count.style.display = totalQty > 0 ? "inline-grid" : "none";
    }

    if (!rendi_cart_items || !rendi_cart_empty || !rendi_cart_footer) return;

    rendi_cart_items.innerHTML = "";

    if (cart.length === 0) {
        rendi_cart_empty.style.display = "block";
        rendi_cart_footer.style.display = "none";
        if (rendi_cart_total_value) rendi_cart_total_value.textContent = "Rp 0";
        return;
    }

    rendi_cart_empty.style.display = "none";
    rendi_cart_footer.style.display = "block";

    let grandTotal = 0;

    cart.forEach((item, index) => {
        const subtotal = Number(item.harga) * Number(item.quantity);
        grandTotal += subtotal;

        const row = document.createElement("div");
        row.className = "rendi_cart_item";
        row.innerHTML = `
            <div class="rendi_cart_item_info">
                <span>${item.satuan}</span>
                <strong>${item.nama}</strong>
                <small>${rendi_format_rupiah(item.harga)} / ${item.satuan}</small>
            </div>
            <div class="rendi_cart_item_bottom">
                <div class="rendi_cart_quantity">
                    <button type="button" data-cart-action="minus" data-index="${index}" aria-label="Kurangi jumlah">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" data-cart-action="plus" data-index="${index}" aria-label="Tambah jumlah">+</button>
                </div>
                <strong>${rendi_format_rupiah(subtotal)}</strong>
                <button type="button" class="rendi_cart_remove" data-cart-action="remove" data-index="${index}">Hapus</button>
            </div>
        `;
        rendi_cart_items.appendChild(row);
    });

    rendi_cart_total_value.textContent = rendi_format_rupiah(grandTotal);
}


function rendi_tampilkan_toast(pesan) {
    let toast = document.getElementById("rendi_cart_toast");
    if (!toast) {
        toast = document.createElement("div");
        toast.id = "rendi_cart_toast";
        toast.className = "rendi_cart_toast";
        document.body.appendChild(toast);
    }

    toast.textContent = `✓ ${pesan}`;
    toast.classList.add("rendi_cart_toast_show");

    clearTimeout(window.rendiToastTimer);
    window.rendiToastTimer = setTimeout(() => {
        toast.classList.remove("rendi_cart_toast_show");
    }, 1800);
}

function rendi_buka_keranjang() {
    if (!rendi_cart_drawer) return;
    rendi_render_cart();
    rendi_cart_drawer.classList.add("rendi_cart_drawer_open");
    rendi_cart_drawer.setAttribute("aria-hidden", "false");
    document.body.classList.add("rendi_modal_no_scroll");
}

function rendi_tutup_keranjang() {
    if (!rendi_cart_drawer) return;
    rendi_cart_drawer.classList.remove("rendi_cart_drawer_open");
    rendi_cart_drawer.setAttribute("aria-hidden", "true");
    document.body.classList.remove("rendi_modal_no_scroll");
}

// ==============================
// MENAMPILKAN PRODUK
// ==============================
function rendi_tampilkan_produk() {
    if (!rendi_product_grid || typeof rendi_produk === "undefined") return;

    const kata_kunci = rendi_search_product
        ? rendi_search_product.value.toLowerCase().trim()
        : "";

    const urutan = rendi_sort_product ? rendi_sort_product.value : "default";

    let produk_terfilter = rendi_produk.filter((produk) => {
        const sesuai_kategori =
            rendi_kategori_aktif === "semua" || produk.kategori === rendi_kategori_aktif;
        const sesuai_pencarian = produk.nama.toLowerCase().includes(kata_kunci);
        return sesuai_kategori && sesuai_pencarian;
    });

    if (urutan === "nama") produk_terfilter.sort((a, b) => a.nama.localeCompare(b.nama));
    if (urutan === "nama-desc") produk_terfilter.sort((a, b) => b.nama.localeCompare(a.nama));
    if (urutan === "harga-asc") produk_terfilter.sort((a, b) => a.harga - b.harga);
    if (urutan === "harga-desc") produk_terfilter.sort((a, b) => b.harga - a.harga);

    rendi_product_grid.innerHTML = "";

    produk_terfilter.forEach((produk) => {
        let status_class = "";
        if (produk.status === "Pre-Order") status_class = "rendi_preorder";
        if (produk.status === "Habis") status_class = "rendi_habis";

        rendi_product_grid.innerHTML += `
            <article class="rendi_product_card">
                <div class="rendi_product_image">
                    <img src="${produk.gambar}" alt="${produk.nama}" loading="lazy">
                    <span class="rendi_product_status ${status_class}">${produk.status}</span>
                </div>
                <div class="rendi_product_info">
                    <span class="rendi_product_category">${produk.label}</span>
                    <h3>${produk.nama}</h3>
                    <p class="rendi_product_description">${produk.deskripsi}</p>
                    <div class="rendi_product_price">
                        <strong>${rendi_format_rupiah(produk.harga)}</strong>
                        <span>/ ${produk.satuan}</span>
                    </div>
                    <div class="rendi_product_actions">
                        <a href="detail-produk.html?id=${produk.id}" class="rendi_product_button rendi_product_detail_button">Lihat Detail ↗</a>
                        ${produk.status === "Habis"
                            ? `<button type="button" class="rendi_product_button rendi_product_order_button rendi_product_order_disabled" disabled>Stok Habis</button>`
                            : `<button type="button" class="rendi_product_button rendi_product_order_button" data-add-cart-id="${produk.id}">+ Tambah ke Keranjang</button>`
                        }
                    </div>
                </div>
            </article>
        `;
    });

    if (rendi_catalog_result) {
        const labelKategori = rendi_kategori_aktif === "semua"
            ? "Semua Produk"
            : document.querySelector(`.rendi_filter_button[data-kategori="${rendi_kategori_aktif}"]`)?.textContent.trim() || "Produk";
        rendi_catalog_result.textContent = `Menampilkan ${produk_terfilter.length} produk • ${labelKategori}`;
    }

    if (rendi_empty_product) {
        rendi_empty_product.style.display = produk_terfilter.length === 0 ? "block" : "none";
    }
}

// Filter kategori
const rendi_filter_buttons = document.querySelectorAll(".rendi_filter_button");
rendi_filter_buttons.forEach((button) => {
    button.addEventListener("click", () => {
        rendi_filter_buttons.forEach(item => item.classList.remove("rendi_filter_active"));
        button.classList.add("rendi_filter_active");
        rendi_kategori_aktif = button.dataset.kategori;
        rendi_tampilkan_produk();
    });
});

if (rendi_search_product) rendi_search_product.addEventListener("input", rendi_tampilkan_produk);
if (rendi_sort_product) rendi_sort_product.addEventListener("change", rendi_tampilkan_produk);

// Tambahkan produk tanpa pindah halaman. Pengunjung bisa terus memilih produk lain.
if (rendi_product_grid) {
    rendi_product_grid.addEventListener("click", (event) => {
        const tombol = event.target.closest("[data-add-cart-id]");
        if (!tombol) return;

        const produk = rendi_produk.find(item => item.id === Number(tombol.dataset.addCartId));
        if (!produk) return;

        rendi_add_to_cart(produk, 1);
    });
}

// Interaksi keranjang
if (rendi_cart_float) rendi_cart_float.addEventListener("click", rendi_buka_keranjang);
if (rendi_cart_close) rendi_cart_close.addEventListener("click", rendi_tutup_keranjang);
if (rendi_cart_drawer) {
    rendi_cart_drawer.addEventListener("click", (event) => {
        if (event.target.matches("[data-close-cart]")) rendi_tutup_keranjang();
    });
}

if (rendi_cart_items) {
    rendi_cart_items.addEventListener("click", (event) => {
        const button = event.target.closest("[data-cart-action]");
        if (!button) return;

        const index = Number(button.dataset.index);
        const action = button.dataset.cartAction;
        const cart = rendi_get_cart();
        const item = cart[index];
        if (!item) return;

        if (action === "plus") item.quantity += 1;
        if (action === "minus") item.quantity = Math.max(1, item.quantity - 1);
        if (action === "remove") cart.splice(index, 1);

        rendi_save_cart(cart);
        rendi_render_cart();
    });
}

// Jangan menuju halaman pemesanan kalau keranjang kosong.
if (rendi_cart_checkout) {
    rendi_cart_checkout.addEventListener("click", (event) => {
        if (rendi_get_cart().length === 0) {
            event.preventDefault();
            alert("Keranjang masih kosong. Tambahkan produk terlebih dahulu.");
        }
    });
}

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && rendi_cart_drawer?.classList.contains("rendi_cart_drawer_open")) {
        rendi_tutup_keranjang();
    }
});

// Render awal
rendi_tampilkan_produk();
rendi_render_cart();
