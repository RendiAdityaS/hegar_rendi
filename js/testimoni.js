/* ===================================================== */
/* TESTIMONI - FILTER & FORM HEGAR RAMONA                 */
/* ===================================================== */

const rendi_testimoni_filter_buttons = document.querySelectorAll(
    ".rendi_testimoni_filter"
);

const rendi_testimoni_grid = document.querySelector(
    "#rendi_testimoni_grid"
);

const rendi_testimoni_form = document.querySelector(
    "#rendi_testimoni_form"
);

const rendi_testimoni_form_message = document.querySelector(
    "#rendi_testimoni_form_message"
);

const rendi_testimoni_rating_text = document.querySelector(
    "#rendi_testimoni_rating_text"
);

const rendi_testimoni_rating_labels = document.querySelectorAll(
    ".rendi_testimoni_star_input label"
);

const rendi_testimoni_rating_inputs = document.querySelectorAll(
    ".rendi_testimoni_star_input input"
);

const rendi_testimoni_storage_key = "hegarRamonaTestimonials";

/* ============================== */
/* FILTER TESTIMONI                */
/* ============================== */

function rendi_testimoni_apply_filter(rendi_filter) {
    const rendi_testimoni_cards = document.querySelectorAll(
        ".rendi_testimoni_card"
    );

    rendi_testimoni_cards.forEach((rendi_kartu) => {
        const rendi_kategori = rendi_kartu.dataset.category;
        const rendi_tampilkan =
            rendi_filter === "semua" || rendi_kategori === rendi_filter;

        rendi_kartu.classList.toggle(
            "rendi_testimoni_hidden",
            !rendi_tampilkan
        );
    });
}

rendi_testimoni_filter_buttons.forEach((rendi_tombol) => {
    rendi_tombol.addEventListener("click", function () {
        const rendi_filter = this.dataset.filter;

        rendi_testimoni_filter_buttons.forEach((rendi_item) => {
            rendi_item.classList.remove("rendi_testimoni_filter_active");
        });

        this.classList.add("rendi_testimoni_filter_active");
        rendi_testimoni_apply_filter(rendi_filter);
    });
});


/* ============================== */
/* PILIH RATING BINTANG            */
/* ============================== */

rendi_testimoni_rating_inputs.forEach((rendi_input) => {
    rendi_input.addEventListener("change", function () {
        const rendi_nilai = Number(this.value);
        rendi_testimoni_rating_text.textContent =
            `${rendi_nilai} dari 5 bintang dipilih.`;

        rendi_testimoni_rating_labels.forEach((rendi_label) => {
            rendi_label.classList.remove("rendi_testimoni_star_selected");
        });

        rendi_testimoni_rating_labels.forEach((rendi_label) => {
            const rendi_target = document.querySelector(
                `#${rendi_label.htmlFor}`
            );

            if (Number(rendi_target.value) <= rendi_nilai) {
                rendi_label.classList.add("rendi_testimoni_star_selected");
            }
        });
    });
});


/* ============================== */
/* DATA TESTIMONI PENGGUNA         */
/* ============================== */

function rendi_testimoni_get_data() {
    try {
        return JSON.parse(
            localStorage.getItem(rendi_testimoni_storage_key)
        ) || [];
    } catch (rendi_error) {
        return [];
    }
}

function rendi_testimoni_save_data(rendi_data) {
    localStorage.setItem(
        rendi_testimoni_storage_key,
        JSON.stringify(rendi_data)
    );
}

function rendi_testimoni_create_card(rendi_data) {
    const rendi_card = document.createElement("article");
    rendi_card.className = "rendi_testimoni_card";
    rendi_card.dataset.category = rendi_data.kategori;

    const rendi_stars = "★".repeat(rendi_data.rating) +
        "☆".repeat(5 - rendi_data.rating);

    rendi_card.innerHTML = `
        <div class="rendi_testimoni_card_top">
            <span class="rendi_testimoni_quote">“</span>
            <span class="rendi_testimoni_category">
                ${rendi_testimoni_escape(rendi_testimoni_category_label(rendi_data.kategori))}
            </span>
        </div>

        <div class="rendi_testimoni_stars" aria-label="${rendi_data.rating} dari 5 bintang">
            ${rendi_stars}
        </div>

        <p class="rendi_testimoni_text">
            ${rendi_testimoni_escape(rendi_data.pesan)}
        </p>

        <div class="rendi_testimoni_person">
            <div class="rendi_testimoni_avatar">
                ${rendi_testimoni_escape(rendi_data.nama.charAt(0).toUpperCase())}
            </div>
            <div>
                <strong>${rendi_testimoni_escape(rendi_data.nama)}</strong>
                <span>Pembeli ${rendi_testimoni_escape(rendi_testimoni_category_label(rendi_data.kategori))}</span>
            </div>
        </div>
    `;

    return rendi_card;
}

function rendi_testimoni_category_label(rendi_kategori) {
    const rendi_labels = {
        camilan: "Camilan",
        kue: "Kue",
        paket: "Paket"
    };

    return rendi_labels[rendi_kategori] || "Pelanggan";
}

function rendi_testimoni_escape(rendi_value) {
    return String(rendi_value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function rendi_testimoni_render_saved() {
    const rendi_data = rendi_testimoni_get_data();

    rendi_data.forEach((rendi_item) => {
        rendi_testimoni_grid.appendChild(
            rendi_testimoni_create_card(rendi_item)
        );
    });
}


/* ============================== */
/* SUBMIT TESTIMONI                */
/* ============================== */

if (rendi_testimoni_form) {
    rendi_testimoni_form.addEventListener("submit", function (rendi_event) {
        rendi_event.preventDefault();

        const rendi_form_data = new FormData(rendi_testimoni_form);

        const rendi_data_baru = {
            nama: String(rendi_form_data.get("nama")).trim(),
            kategori: String(rendi_form_data.get("kategori")),
            rating: Number(rendi_form_data.get("rating")),
            pesan: String(rendi_form_data.get("pesan")).trim()
        };

        if (
            !rendi_data_baru.nama ||
            !rendi_data_baru.kategori ||
            !rendi_data_baru.rating ||
            !rendi_data_baru.pesan
        ) {
            rendi_testimoni_show_message(
                "Mohon lengkapi nama, kategori, rating, dan testimoni.",
                "error"
            );
            return;
        }

        const rendi_data_lama = rendi_testimoni_get_data();
        rendi_data_lama.push(rendi_data_baru);
        rendi_testimoni_save_data(rendi_data_lama);

        rendi_testimoni_grid.appendChild(
            rendi_testimoni_create_card(rendi_data_baru)
        );

        rendi_testimoni_form.reset();

        rendi_testimoni_rating_labels.forEach((rendi_label) => {
            rendi_label.classList.remove("rendi_testimoni_star_selected");
        });

        rendi_testimoni_rating_text.textContent =
            "Pilih jumlah bintang untuk memberikan penilaian.";

        rendi_testimoni_show_message(
            "Testimoni berhasil ditambahkan. Terima kasih sudah memberikan penilaian!",
            "success"
        );

        rendi_testimoni_apply_filter("semua");

        rendi_testimoni_filter_buttons.forEach((rendi_tombol) => {
            rendi_tombol.classList.toggle(
                "rendi_testimoni_filter_active",
                rendi_tombol.dataset.filter === "semua"
            );
        });
    });
}

function rendi_testimoni_show_message(rendi_pesan, rendi_tipe) {
    rendi_testimoni_form_message.textContent = rendi_pesan;
    rendi_testimoni_form_message.className =
        `rendi_testimoni_form_message rendi_testimoni_message_${rendi_tipe}`;

    window.setTimeout(() => {
        rendi_testimoni_form_message.textContent = "";
        rendi_testimoni_form_message.className =
            "rendi_testimoni_form_message";
    }, 5000);
}

rendi_testimoni_render_saved();
