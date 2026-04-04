# Marius Queulin — Portfolio

## Structure des fichiers

```
site/
├── index.html          ← fichier principal
├── images/             ← placez vos images ici
│   ├── big-cop.jpg         couverture projet Big Cop Big Moto
│   ├── terminus.jpg        couverture projet Terminus
│   ├── breaking-point.jpg  couverture projet Breaking Point
│   ├── jail.jpg            couverture projet Jail
│   ├── mini1.jpg           mini-galerie (1/5)
│   ├── mini2.jpg           mini-galerie (2/5)
│   ├── mini3.jpg           mini-galerie (3/5)
│   ├── mini4.jpg           mini-galerie (4/5)
│   ├── mini5.jpg           mini-galerie (5/5)
│   ├── portrait.jpg        photo profil (carré recommandé)
│   ├── cv-fr-thumb.jpg     vignette CV Français  (ratio A4 = 1:1.414)
│   ├── cv-en-thumb.jpg     vignette CV Anglais   (ratio A4 = 1:1.414)
│   └── refbook-thumb.jpg   vignette Reference Book (ratio A4 = 1:1.414)
└── pdfs/               ← placez vos PDF ici
    ├── cv-fr.pdf
    ├── cv-en.pdf
    └── reference-book.pdf
```

## Personnalisation rapide

| Élément           | Où changer                                |
|-------------------|-------------------------------------------|
| Vidéo YouTube     | Remplacez `VIDEO_ID` dans index.html      |
| Espacement global | Variable `--section-gap` (ligne ~25)      |
| Hauteur CV        | Variable `--cv-height` (ligne ~395)       |
| LinkedIn          | href dans `.social-icons` (profil)        |
| Itch.io           | href dans `.social-icons` (profil)        |
| Email             | href `mailto:` dans `.social-icons`       |
| URLs des projets  | Attributs `href="#projet-NOM"` sur chaque `.project-card` |

<iframe src="https://www.youtube.com/embed/J1c7Rca3tqk?si=IDIZiIppOrp7Snvy"
        title="DEMOREEL 2025 – Junior Level Designer – Marius Queulin"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen>
</iframe>
