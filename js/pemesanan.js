const rendi_nomor_wa = "62895396867854";
const rendi_cart_key = "hegarRamonaCart";

const rendi_parameter = new URLSearchParams(window.location.search);
const rendi_id_produk = Number(rendi_parameter.get("id"));
const rendi_jumlah_url = Number(rendi_parameter.get("jumlah"));
const rendi_catatan_url = rendi_parameter.get("catatan") || "";
const rendi_paket_url = rendi_parameter.get("paket") || "";
const rendi_harga_paket_url = rendi_parameter.get("harga") || "";
const rendi_items_paket_url = rendi_parameter.get("items") || "";
const rendi_hemat_paket_url = rendi_parameter.get("hemat") || "";

const rendi_form_pemesanan = document.getElementById("rendi_order_form");
const rendi_order_items = document.getElementById("rendi_order_items");
const rendi_order_empty = document.getElementById("rendi_order_empty");
const rendi_order_grand_total_value = document.getElementById("rendi_order_grand_total_value");
const rendi_input_catatan = document.getElementById("rendi_catatan_pesanan");

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

function rendi_parse_harga(angka) {
    return Number(String(angka).replace(/[^0-9]/g, "")) || 0;
}

function rendi_add_package_to_cart(namaPaket, hargaPaket, itemsPaket, hematPaket = "") {
    const cart = rendi_get_cart();
    const packageId = `paket-${namaPaket.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;
    const existing = cart.find(item => item.id === packageId);

    const note = `Isi: ${itemsPaket.join(", ")}${hematPaket ? ` | ${hematPaket}` : ""}`;

    if (existing) {
        existing.quantity += 1;
    } else {
        cart.push({
            id: packageId,
            nama: namaPaket,
            harga: hargaPaket,
            satuan: "Paket",
            quantity: 1,
            note,
            isPackage: true
        });
    }

    rendi_save_cart(cart);
}

function rendi_add_to_cart(product, quantity = 1, note = "") {
    const cart = rendi_get_cart();
    const existing = cart.find(item => item.id === product.id);

    if (existing) {
        existing.quantity += quantity;
        if (note) {
            existing.note = existing.note ? `${existing.note}; ${note}` : note;
        }
    } else {
        cart.push({
            id: product.id,
            nama: product.nama,
            harga: product.harga,
            satuan: product.satuan,
            quantity,
            note
        });
    }

    rendi_save_cart(cart);
}

function rendi_render_cart() {
    if (!rendi_order_items || !rendi_order_empty || !rendi_order_grand_total_value) {
        return;
    }

    const cart = rendi_get_cart();
    rendi_order_items.innerHTML = "";

    if (cart.length === 0) {
        rendi_order_empty.hidden = false;
        rendi_order_grand_total_value.textContent = "Rp 0";
        return;
    }

    rendi_order_empty.hidden = true;
    let grandTotal = 0;

    cart.forEach((item, index) => {
        const subtotal = item.harga * item.quantity;
        grandTotal += subtotal;

        const row = document.createElement("div");
        row.className = "rendi_order_item";
        row.innerHTML = `
            <div class="rendi_order_item_info">
                <span class="rendi_order_item_category">${item.satuan}</span>
                <strong>${item.nama}</strong>
                <small>${rendi_format_rupiah(item.harga)} / ${item.satuan}</small>
            </div>

            <div class="rendi_order_item_controls">
                <div class="rendi_cart_quantity">
                    <button type="button" data-cart-action="minus" data-index="${index}" aria-label="Kurangi jumlah">−</button>
                    <span>${item.quantity}</span>
                    <button type="button" data-cart-action="plus" data-index="${index}" aria-label="Tambah jumlah">+</button>
                </div>
                <strong class="rendi_order_item_subtotal">${rendi_format_rupiah(subtotal)}</strong>
                <button type="button" class="rendi_order_item_remove" data-cart-action="remove" data-index="${index}">Hapus</button>
            </div>

            ${item.note ? `<p class="rendi_order_item_note">Catatan: ${item.note}</p>` : ""}
        `;

        rendi_order_items.appendChild(row);
    });

    rendi_order_grand_total_value.textContent = rendi_format_rupiah(grandTotal);
}

// Alur langsung dari halaman Promo & Paket: paket langsung dimasukkan ke keranjang.
if (rendi_paket_url) {
    const itemsPaket = rendi_items_paket_url.split("|").filter(Boolean);
    const hargaPaket = rendi_parse_harga(rendi_harga_paket_url);
    if (hargaPaket > 0 && itemsPaket.length > 0) {
        rendi_add_package_to_cart(rendi_paket_url, hargaPaket, itemsPaket, rendi_hemat_paket_url);
    }
    window.history.replaceState({}, document.title, "pemesanan.html");
}

// Kompatibilitas dengan alur lama: jika halaman dibuka memakai ?id=..., produk
// otomatis dimasukkan ke keranjang sekali lalu URL dibersihkan.
if (!rendi_paket_url && rendi_id_produk && typeof rendi_produk !== "undefined") {
    const produk = rendi_produk.find(item => item.id === rendi_id_produk);
    if (produk && produk.status !== "Habis") {
        const jumlah = Number.isFinite(rendi_jumlah_url) && rendi_jumlah_url >= 1
            ? rendi_jumlah_url
            : 1;
        rendi_add_to_cart(produk, jumlah, rendi_catatan_url);
        window.history.replaceState({}, document.title, "pemesanan.html");
    }
}

// Render keranjang saat halaman dibuka.
rendi_render_cart();

// Interaksi jumlah dan hapus produk.
if (rendi_order_items) {
    rendi_order_items.addEventListener("click", (event) => {
        const button = event.target.closest("[data-cart-action]");
        if (!button) return;

        const index = Number(button.dataset.index);
        const action = button.dataset.cartAction;
        const cart = rendi_get_cart();
        const item = cart[index];

        if (!item) return;

        if (action === "plus") {
            item.quantity += 1;
        } else if (action === "minus") {
            item.quantity = Math.max(1, item.quantity - 1);
        } else if (action === "remove") {
            cart.splice(index, 1);
        }

        rendi_save_cart(cart);
        rendi_render_cart();
    });
}

// Proses pengiriman semua produk dalam keranjang.
if (rendi_form_pemesanan) {
    rendi_form_pemesanan.addEventListener("submit", function(event) {
        event.preventDefault();

        const rendi_nama = document.getElementById("rendi_nama_pemesan").value.trim();
        const rendi_nomor = document.getElementById("rendi_nomor_pemesan").value.trim();
        const rendi_catatan = rendi_input_catatan?.value.trim() || "";
        const cart = rendi_get_cart();

        if (!rendi_nama || !rendi_nomor) {
            alert("Mohon lengkapi nama dan nomor WhatsApp.");
            return;
        }

        if (cart.length === 0) {
            alert("Belum ada produk yang dipilih. Silakan tambahkan produk terlebih dahulu.");
            return;
        }

        if (!rendi_nomor_wa) {
            alert("Nomor WhatsApp Hegar Ramona belum diatur. Silakan hubungi pemilik usaha.");
            return;
        }

        let grandTotal = 0;
        let daftar_produk = "";

        cart.forEach((item, index) => {
            const subtotal = item.harga * item.quantity;
            grandTotal += subtotal;
            daftar_produk += `${index + 1}. ${item.nama}\n`;
            daftar_produk += `   Harga: ${rendi_format_rupiah(item.harga)} / ${item.satuan}\n`;
            daftar_produk += `   Jumlah: ${item.quantity}\n`;
            daftar_produk += `   Subtotal: ${rendi_format_rupiah(subtotal)}\n`;
            if (item.note) {
                daftar_produk += `   Catatan produk: ${item.note}\n`;
            }
            daftar_produk += "\n";
        });

        const rendi_pesan =
            `Halo Hegar Ramona, saya ingin memesan beberapa produk.\n\n` +
            `Nama: ${rendi_nama}\n` +
            `Nomor WhatsApp: ${rendi_nomor}\n\n` +
            `DAFTAR PESANAN:\n` +
            `${daftar_produk}` +
            `TOTAL PERKIRAAN: ${rendi_format_rupiah(grandTotal)}\n\n` +
            `Catatan Pesanan: ${rendi_catatan || "-"}\n\n` +
            `Mohon konfirmasi ketersediaan dan detail pesanan saya. Terima kasih.`;

        const rendi_link_wa =
            `https://wa.me/${rendi_nomor_wa}?text=${encodeURIComponent(rendi_pesan)}`;

        // Keranjang dikosongkan setelah pengguna memilih lanjut ke WhatsApp.
        localStorage.removeItem(rendi_cart_key);
        window.open(rendi_link_wa, "_blank");
    });
}
