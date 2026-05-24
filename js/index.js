/* index.js — Modal PDF et email anti-bot (spécifique à index.html) */
document.addEventListener('DOMContentLoaded', function() {

    /* ── MODALE PDF ──────────────────────────────────────────────────
       Les cartes CV ont data-pdf + data-title.
       Le clic ouvre la modale avec un iframe PDF intégré.
       Tous les liens ouvrent dans un nouvel onglet (target=_blank).  */
    function openModal(url, title) {
        document.getElementById('modalTitle').textContent  = title;
        document.getElementById('pdfFrame').src            = url;
        document.getElementById('modalDownload').href      = url;
        document.getElementById('modalDownload').download  = url.split('/').pop();
        document.getElementById('pdfModal').classList.add('active');
    }
    function closeModal() {
        document.getElementById('pdfModal').classList.remove('active');
        document.getElementById('pdfFrame').src = '';
    }

    document.querySelectorAll('.cv-card[data-pdf]').forEach(function(card) {
        card.addEventListener('click', function(e) {
            e.preventDefault();
            openModal(this.dataset.pdf, this.dataset.title);
        });
    });

    var closeBtn     = document.getElementById('modalCloseBtn');
    var closeBtnFoot = document.getElementById('modalCloseBtnFooter');
    var overlay      = document.getElementById('pdfModal');
    if (closeBtn)     closeBtn.addEventListener('click', closeModal);
    if (closeBtnFoot) closeBtnFoot.addEventListener('click', closeModal);
    if (overlay)      overlay.addEventListener('click', function(e) {
        if (e.target === this) closeModal();
    });
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeModal();
    });

    /* ── EMAIL ANTI-BOT ─────────────────────────────────────────────
       Adresse reconstruite en JS, jamais en clair dans le HTML.      */
    document.querySelectorAll('.email-link').forEach(function(el) {
        el.addEventListener('click', function(e) {
            e.preventDefault();
            var addr = this.dataset.user + '@' + this.dataset.domain;
            window.open('mailto:' + addr, '_blank');
        });
    });

});
