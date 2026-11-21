const rendi_contact_form = document.getElementById("rendi_contact_form");
const rendi_contact_form_message = document.getElementById("rendi_contact_form_message");

if (rendi_contact_form) {
    rendi_contact_form.addEventListener("submit", (event) => {
        event.preventDefault();

        const nama = document.getElementById("rendi_contact_nama").value.trim();
        const email = document.getElementById("rendi_contact_email").value.trim();
        const subjek = document.getElementById("rendi_contact_subjek").value;
        const whatsapp = document.getElementById("rendi_contact_wa").value.trim();
        const pesan = document.getElementById("rendi_contact_pesan").value.trim();

        if (!nama || !email || !subjek || !whatsapp || !pesan) {
            rendi_contact_form_message.textContent = "Lengkapi semua data sebelum mengirim pesan.";
            rendi_contact_form_message.className = "rendi_contact_form_message rendi_contact_form_error";
            return;
        }

        const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        if (!emailValid) {
            rendi_contact_form_message.textContent = "Format email belum sesuai. Silakan periksa kembali.";
            rendi_contact_form_message.className = "rendi_contact_form_message rendi_contact_form_error";
            return;
        }

        const pesanMasuk = {
            id: Date.now(),
            nama,
            email,
            subjek,
            whatsapp,
            pesan,
            waktu: new Date().toLocaleString("id-ID")
        };

        const dataPesan = JSON.parse(localStorage.getItem("hegarRamonaMessages") || "[]");
        dataPesan.push(pesanMasuk);
        localStorage.setItem("hegarRamonaMessages", JSON.stringify(dataPesan));

        rendi_contact_form_message.textContent = "Pesan berhasil dikirim. Terima kasih sudah menghubungi Hegar Ramona!";
        rendi_contact_form_message.className = "rendi_contact_form_message rendi_contact_form_success";
        rendi_contact_form.reset();
    });
}
