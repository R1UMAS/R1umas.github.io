/* index.js — Modal PDF, email anti-bot, share button, confetti (index.html) */
document.addEventListener('DOMContentLoaded', function() {

    /* ── MODALE PDF ──────────────────────────────────────────────────
       Les cartes CV ont data-pdf + data-title.
       Le clic ouvre la modale avec un iframe PDF intégré.            */
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

    /* ── SHARE BUTTON ────────────────────────────────────────────────────────
       Copies the site URL to clipboard. Shows brief ✓ checkmark feedback.   */
    var shareBtn = document.getElementById('shareBtn');
    var shareOk  = document.getElementById('shareOk');
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            var url = 'https://mqueulin.com/';
            if (navigator.clipboard) {
                navigator.clipboard.writeText(url).then(function() {
                    showShareOk();
                }).catch(function() { fallbackCopy(url); });
            } else {
                fallbackCopy(url);
            }
        });
    }
    function fallbackCopy(text) {
        var ta = document.createElement('textarea');
        ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
        document.body.appendChild(ta); ta.focus(); ta.select();
        try { document.execCommand('copy'); } catch(e) {}
        document.body.removeChild(ta);
        showShareOk();
    }
    function showShareOk() {
        if (!shareOk) return;
        shareOk.textContent = '✓';
        shareOk.classList.add('visible');
        setTimeout(function() {
            shareOk.classList.remove('visible');
            setTimeout(function() { shareOk.textContent = ''; }, 300);
        }, 2000);
    }

    /* ── CONFETTI ────────────────────────────────────────────────────────────
       Canvas fixed above everything. Each click fires a new burst of ~70
       particles from the confetti button position. Particles travel upward
       with slight random angle, fade out, then canvas is removed when empty.
       Spammable: each click adds a new burst without clearing previous ones.

       ── VERSIONS ALTERNATIVES (décommente l'une pour tester) ──────────────

       VERSION A (actuelle) : canvas fixe, particules rectangulaires colorées,
       gravité + fade, lancé depuis le bouton.

       VERSION B : canvas fullscreen, mix rectangles + cercles, rebond sur les
       bords de l'écran, durée de vie plus longue, couleurs pastel.
       → Pour activer : remplace spawnBurst() par spawnBurstB() ci-dessous,
         et animateConfetti() par animateConfettiB().

       VERSION C : pas de canvas. Crée des divs emoji (🎊🎉✨) qui tombent
       depuis le haut, avec animation CSS keyframes, puis se suppriment.
       → Pour activer : remplace le bloc if(confettiBtn) par le bloc VERSION C.

       ────────────────────────────────────────────────────────────────────── */

    var confettiBtn    = document.getElementById('confettiBtn');
    var confettiCanvas = null;
    var ctx            = null;
    var particles      = [];
    var animFrame      = null;

    var COLORS = ['#7b8cff','#ff7bc8','#ffcf7b','#7bffd8','#ff7b7b','#c07bff','#ffffff'];

    /* ── VERSION A helpers ── */
    function ensureCanvas() {
        if (!confettiCanvas) {
            confettiCanvas = document.createElement('canvas');
            confettiCanvas.id = 'confetti-canvas';
            confettiCanvas.width  = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
            confettiCanvas.style.cssText = 'position:fixed;inset:0;width:100%;height:100%;pointer-events:none;z-index:99999;';
            document.body.appendChild(confettiCanvas);
            ctx = confettiCanvas.getContext('2d');
            window.addEventListener('resize', resizeCanvas);
        }
    }
    function resizeCanvas() {
        if (confettiCanvas) {
            confettiCanvas.width  = window.innerWidth;
            confettiCanvas.height = window.innerHeight;
        }
    }
    function removeCanvas() {
        if (confettiCanvas) {
            window.removeEventListener('resize', resizeCanvas);
            confettiCanvas.parentNode && confettiCanvas.parentNode.removeChild(confettiCanvas);
            confettiCanvas = null; ctx = null;
        }
        if (animFrame) { cancelAnimationFrame(animFrame); animFrame = null; }
    }

    function spawnBurst(x, y) {
        var count = 70;
        for (var i = 0; i < count; i++) {
            var baseAngle = -Math.PI / 2;
            var spread    = (Math.random() - 0.5) * (Math.PI * 0.75);
            var angle     = baseAngle + spread;
            var speed     = 4 + Math.random() * 8;
            particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                rot: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.3,
                w: 6 + Math.random() * 8,
                h: 3 + Math.random() * 4,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                alpha: 1,
                gravity: 0.18 + Math.random() * 0.1,
                fadeSpeed: 0.008 + Math.random() * 0.006
            });
        }
    }

    function animateConfetti() {
        if (!ctx) return;
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        particles = particles.filter(function(p) { return p.alpha > 0; });
        if (particles.length === 0) { removeCanvas(); return; }
        particles.forEach(function(p) {
            p.x  += p.vx;
            p.y  += p.vy;
            p.vy += p.gravity;
            p.vx *= 0.99;
            p.rot += p.rotSpeed;
            p.alpha -= p.fadeSpeed;
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rot);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });
        animFrame = requestAnimationFrame(animateConfetti);
    }

    /* ── VERSION B helpers (décommentez pour tester) ──
    function spawnBurstB(x, y) {
        var count = 90;
        for (var i = 0; i < count; i++) {
            var angle = Math.random() * Math.PI * 2;
            var speed = 2 + Math.random() * 10;
            var isCircle = Math.random() > 0.5;
            particles.push({
                x: x, y: y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                r: 3 + Math.random() * 5,
                w: 5 + Math.random() * 9,
                h: 2 + Math.random() * 5,
                isCircle: isCircle,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                alpha: 1,
                gravity: 0.08 + Math.random() * 0.08,
                fadeSpeed: 0.004 + Math.random() * 0.005,
                rot: Math.random() * Math.PI * 2,
                rotSpeed: (Math.random() - 0.5) * 0.2
            });
        }
    }
    function animateConfettiB() {
        if (!ctx) return;
        ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
        particles = particles.filter(function(p) { return p.alpha > 0; });
        if (particles.length === 0) { removeCanvas(); return; }
        particles.forEach(function(p) {
            p.x  += p.vx;
            p.y  += p.vy;
            p.vy += p.gravity;
            p.rot += p.rotSpeed;
            p.alpha -= p.fadeSpeed;
            if (p.x < 0 || p.x > confettiCanvas.width)  p.vx *= -0.7;
            if (p.y > confettiCanvas.height) p.vy *= -0.7;
            ctx.save();
            ctx.globalAlpha = Math.max(0, p.alpha);
            ctx.fillStyle = p.color;
            if (p.isCircle) {
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fill();
            } else {
                ctx.translate(p.x, p.y);
                ctx.rotate(p.rot);
                ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            }
            ctx.restore();
        });
        animFrame = requestAnimationFrame(animateConfettiB);
    }
    ── Fin VERSION B ── */

    /* ── VERSION C : emojis CSS (décommentez le bloc if(confettiBtn) ci-dessous) ──
    if (confettiBtn) {
        confettiBtn.addEventListener('click', function() {
            var emojis = ['🎊','🎉','✨','🌟','💫'];
            for (var i = 0; i < 20; i++) {
                (function(i) {
                    var el = document.createElement('span');
                    el.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                    el.style.cssText = 'position:fixed;top:-30px;left:'+(5+Math.random()*90)+'vw;'
                        +'font-size:'+(1+Math.random()*1.5)+'rem;pointer-events:none;z-index:99999;'
                        +'animation:confetti-fall '+(1.2+Math.random()*1.5)+'s ease-in forwards;'
                        +'animation-delay:'+(i*0.06)+'s;';
                    document.body.appendChild(el);
                    el.addEventListener('animationend', function() { el.remove(); });
                })(i);
            }
        });
    }
    // Keyframes needed in CSS for VERSION C:
    // @keyframes confetti-fall { to { top: 110vh; opacity: 0; } }
    ── Fin VERSION C ── */

    /* ── VERSION A active ── */
    if (confettiBtn) {
        confettiBtn.addEventListener('click', function() {
            ensureCanvas();
            var rect = confettiBtn.getBoundingClientRect();
            var x = rect.left + rect.width  / 2;
            var y = rect.top  + rect.height / 2;
            spawnBurst(x, y);
            if (!animFrame) animFrame = requestAnimationFrame(animateConfetti);
        });
    }

});
