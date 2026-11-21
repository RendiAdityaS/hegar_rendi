// ==============================
// DETAIL PRODUK HEGAR RAMONA
// ==============================

const rendi_detail_content = document.getElementById("rendi_detail_content");
const rendi_detail_not_found = document.getElementById("rendi_detail_not_found");
const rendi_url_params = new URLSearchParams(window.location.search);
const rendi_id_produk = Number(rendi_url_params.get("id"));
const rendi_cart_key = "hegarRamonaCart";

const rendi_detail_produk = rendi_produk.find((produk) => produk.id === rendi_id_produk);

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

function rendi_update_detail_cart_count() {
    const cart = rendi_get_cart();
    const totalItem = cart.reduce((total, item) => total + Number(item.quantity || 0), 0);
    const count = document.getElementById("rendi_detail_cart_count");
    if (count) count.textContent = totalItem;
}

function rendi_add_detail_to_cart(product, quantity) {
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
    rendi_update_detail_cart_count();

    const notice = document.getElementById("rendi_detail_cart_notice");
    if (notice) {
        notice.textContent = `${quantity} × ${product.nama} ditambahkan ke keranjang.`;
        notice.classList.add("rendi_detail_cart_notice_show");
        window.clearTimeout(window.rendi_detail_notice_timer);
        window.rendi_detail_notice_timer = window.setTimeout(() => {
            notice.classList.remove("rendi_detail_cart_notice_show");
        }, 2800);
    }
}

if (rendi_detail_produk && rendi_detail_content) {
    let rendi_status_class = "";

    if (rendi_detail_produk.status === "Pre-Order") {
        rendi_status_class = "rendi_preorder";
    } else if (rendi_detail_produk.status === "Habis") {
        rendi_status_class = "rendi_habis";
    }

    rendi_detail_content.innerHTML = `
        <div class="rendi_detail_grid">

            <div class="rendi_detail_visual">
                <div class="rendi_detail_image">
                    <img src="${rendi_detail_produk.gambar}" alt="${rendi_detail_produk.nama}">
                </div>
                <div class="rendi_detail_image_caption">
                    <span>Detail Produk</span>
                    <strong>${rendi_detail_produk.label}</strong>
                </div>
            </div>

            <div class="rendi_detail_info">
                <span class="rendi_eyebrow">${rendi_detail_produk.label}</span>
                <h1>${rendi_detail_produk.nama}</h1>

                <div class="rendi_detail_meta_row">
                    <span class="rendi_detail_status ${rendi_status_class}">${rendi_detail_produk.status}</span>
                    <span class="rendi_detail_id">Produk #${String(rendi_detail_produk.id).padStart(2, "0")}</span>
                </div>

                <div class="rendi_detail_price">
                    <strong>${rendi_format_rupiah(rendi_detail_produk.harga)}</strong>
                    <span>/ ${rendi_detail_produk.satuan}</span>
                </div>

                <div class="rendi_detail_description_block">
                    <span class="rendi_detail_section_label">Tentang Produk</span>
                    <p class="rendi_detail_description">${rendi_detail_produk.deskripsi}</p>
                </div>

                <div class="rendi_detail_specs">
                    <div>
                        <span>Kategori</span>
                        <strong>${rendi_detail_produk.label}</strong>
                    </div>
                    <div>
                        <span>Kemasan / Satuan</span>
                        <strong>${rendi_detail_produk.satuan}</strong>
                    </div>
                    <div>
                        <span>Ketersediaan</span>
                        <strong>${rendi_detail_produk.status}</strong>
                    </div>
                </div>

                ${rendi_detail_produk.status === "Habis" ? `
                    <div class="rendi_detail_unavailable">
                        Produk sedang tidak tersedia. Silakan cek kembali katalog untuk produk lainnya.
                    </div>
                ` : `
                    <div class="rendi_detail_buy_box">
                        <div class="rendi_detail_buy_top">
                            <span>Jumlah</span>
                            <div class="rendi_detail_quantity">
                                <button type="button" data-detail-quantity="minus" aria-label="Kurangi jumlah">−</button>
                                <input id="rendi_detail_quantity_input" type="number" min="1" value="1" aria-label="Jumlah produk">
                                <button type="button" data-detail-quantity="plus" aria-label="Tambah jumlah">+</button>
                            </div>
                        </div>

                        <div class="rendi_detail_buy_actions">
                            <button type="button" id="rendi_detail_add_cart" class="rendi_button_primary">
                                🛒 Tambah ke Keranjang
                            </button>
                            <a href="pemesanan.html" class="rendi_detail_cart_link">
                                Lihat Keranjang
                                <span id="rendi_detail_cart_count">0</span>
                            </a>
                        </div>
                    </div>
                `}

                <div id="rendi_detail_cart_notice" class="rendi_detail_cart_notice" role="status" aria-live="polite"></div>
            </div>
        </div>

        <div class="rendi_detail_bottom">
            <div>
                <span class="rendi_detail_section_label">Informasi Pemesanan</span>
                <p>Tambahkan produk ke keranjang untuk menggabungkannya dengan produk lain sebelum melanjutkan ke halaman pemesanan.</p>
            </div>
            <a href="katalog.html" class="rendi_detail_back">← Lanjut Belanja</a>
        </div>
    `;

    rendi_detail_not_found.style.display = "none";
    rendi_update_detail_cart_count();

    const quantityInput = document.getElementById("rendi_detail_quantity_input");
    const quantityButtons = document.querySelectorAll("[data-detail-quantity]");

    quantityButtons.forEach(button => {
        button.addEventListener("click", () => {
            let quantity = Number(quantityInput.value) || 1;
            if (button.dataset.detailQuantity === "plus") quantity += 1;
            if (button.dataset.detailQuantity === "minus") quantity = Math.max(1, quantity - 1);
            quantityInput.value = quantity;
        });
    });

    quantityInput?.addEventListener("change", () => {
        const quantity = Math.max(1, Number(quantityInput.value) || 1);
        quantityInput.value = quantity;
    });

    document.getElementById("rendi_detail_add_cart")?.addEventListener("click", () => {
        const quantity = Math.max(1, Number(quantityInput.value) || 1);
        rendi_add_detail_to_cart(rendi_detail_produk, quantity);
    });
} else {
    if (rendi_detail_content) rendi_detail_content.style.display = "none";
    if (rendi_detail_not_found) rendi_detail_not_found.style.display = "block";
}
