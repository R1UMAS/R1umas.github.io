/* shared.js — Thème, langue, animations au scroll */
(function initTheme() {
    try {
        var s = localStorage.getItem('mq-theme');
        var d = window.matchMedia('(prefers-color-scheme: dark)').matches;
        document.documentElement.setAttribute('data-theme', s || (d ? 'dark' : 'light'));
    } catch(e) { document.documentElement.setAttribute('data-theme', 'dark'); }
})();

function applyLang(lang, save) {
    var h = document.documentElement;
    h.setAttribute('data-lang', lang);
    h.setAttribute('lang', lang);
    ['fr','en'].forEach(function(l) {
        var b = document.getElementById('btn-' + l);
        if (!b) return;
        b.classList.toggle('active', l === lang);
        b.setAttribute('aria-pressed', String(l === lang));
    });
    if (save) { try { localStorage.setItem('mq-lang', lang); } catch(e) {} }
}

(function initLang() {
    try { applyLang(localStorage.getItem('mq-lang') || 'fr', false); }
    catch(e) { applyLang('fr', false); }
})();

document.addEventListener('DOMContentLoaded', function() {
    var themeBtn = document.getElementById('themeBtn');
    if (themeBtn) themeBtn.addEventListener('click', function() {
        var h = document.documentElement;
        var n = h.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        h.setAttribute('data-theme', n);
        try { localStorage.setItem('mq-theme', n); } catch(e) {}
    });
    var bfr = document.getElementById('btn-fr');
    var ben = document.getElementById('btn-en');
    if (bfr) bfr.addEventListener('click', function() { applyLang('fr', true); });
    if (ben) ben.addEventListener('click', function() { applyLang('en', true); });

    /* Fade-in au scroll */
    if ('IntersectionObserver' in window) {
        var fo = new IntersectionObserver(function(entries) {
            entries.forEach(function(e) {
                if (e.isIntersecting) {
                    e.target.style.opacity = '1';
                    e.target.style.transform = 'translateY(0)';
                    fo.unobserve(e.target);
                }
            });
        }, { threshold: 0.05 });
        document.querySelectorAll('.section-inner, .proj-section').forEach(function(el) {
            el.style.opacity = '0';
            el.style.transform = 'translateY(24px)';
            el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
            fo.observe(el);
        });
    }
});
