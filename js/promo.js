// ==============================
// PROMO & PAKET HEGAR RAMONA
// ==============================

const rendi_promo_filters = document.querySelectorAll("[data-promo-filter]");
const rendi_promo_cards = document.querySelectorAll(".rendi_promo_card");
const rendi_promo_empty = document.querySelector(".rendi_promo_empty");
const rendi_promo_modal = document.getElementById("rendi_promo_modal");
const rendi_promo_modal_title = document.getElementById("rendi_promo_modal_title");
const rendi_promo_modal_description = document.getElementById("rendi_promo_modal_description");
const rendi_promo_modal_price = document.getElementById("rendi_promo_modal_price");
const rendi_promo_modal_save = document.getElementById("rendi_promo_modal_save");
const rendi_promo_modal_items = document.getElementById("rendi_promo_modal_items");
const rendi_promo_order_link = document.getElementById("rendi_promo_order_link");

function rendi_filter_promo(kategori) {
    let jumlah = 0;

    rendi_promo_cards.forEach((card) => {
        const sesuai = kategori === "semua" || card.dataset.promoKategori === kategori;
        card.classList.toggle("rendi_promo_hidden", !sesuai);
        if (sesuai) jumlah += 1;
    });

    if (rendi_promo_empty) {
        rendi_promo_empty.hidden = jumlah !== 0;
    }
}

rendi_promo_filters.forEach((button) => {
    button.addEventListener("click", () => {
        rendi_promo_filters.forEach((item) => item.classList.remove("rendi_promo_filter_active"));
        button.classList.add("rendi_promo_filter_active");
        rendi_filter_promo(button.dataset.promoFilter);
    });
});

function rendi_buka_promo_modal(card) {
    if (!rendi_promo_modal) return;

    const items = (card.dataset.promoItems || "").split("|").filter(Boolean);
    const title = card.dataset.promoTitle || "Paket Pilihan";

    rendi_promo_modal_title.textContent = title;
    rendi_promo_modal_description.textContent = `Kombinasi produk pilihan untuk ${title.toLowerCase()}.`;
    rendi_promo_modal_price.textContent = card.dataset.promoPrice || "Rp 0";
    rendi_promo_modal_save.textContent = card.dataset.promoSave || "";
    rendi_promo_modal_items.innerHTML = items.map((item) => `<li>${item}</li>`).join("");

    if (rendi_promo_order_link) {
        const params = new URLSearchParams({
            paket: title,
            harga: card.dataset.promoPrice || "Rp 0",
            items: items.join("|"),
            hemat: card.dataset.promoSave || ""
        });
        rendi_promo_order_link.href = `pemesanan.html?${params.toString()}`;
    }

    rendi_promo_modal.classList.add("rendi_promo_modal_open");
    rendi_promo_modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("rendi_modal_no_scroll");
}

function rendi_tutup_promo_modal() {
    if (!rendi_promo_modal) return;
    rendi_promo_modal.classList.remove("rendi_promo_modal_open");
    rendi_promo_modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("rendi_modal_no_scroll");
}

document.querySelectorAll("[data-promo-open]").forEach((button) => {
    button.addEventListener("click", () => {
        const card = button.closest(".rendi_promo_card");
        if (card) rendi_buka_promo_modal(card);
    });
});

document.querySelectorAll("[data-promo-close]").forEach((element) => {
    element.addEventListener("click", rendi_tutup_promo_modal);
});

document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && rendi_promo_modal?.classList.contains("rendi_promo_modal_open")) {
        rendi_tutup_promo_modal();
    }
});

rendi_filter_promo("semua");
