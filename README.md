# Bchhal ?

Compagnon de voyage au Maroc (FR/EN) : **juste prix au souk**, **budget voyage** et **darija de poche**.
Site statique Astro + Tailwind, hébergé sur Cloudflare Pages.

## Lancer le projet

Prérequis : Node.js 22 ou plus récent.

```bash
npm install
cp .env.example .env   # optional, see "Variables d'environnement"
npm run dev            # http://localhost:4321 (redirects to /fr/)
```

| Commande          | Rôle                                                   |
| ----------------- | ------------------------------------------------------ |
| `npm run dev`     | Serveur de développement avec rechargement à chaud     |
| `npm run build`   | Génère le site statique dans `dist/` (+ sitemap)       |
| `npm run preview` | Sert `dist/` en local pour vérifier le build           |
| `npm run check`   | Vérification TypeScript et Astro                       |
| `npm run deploy`  | Build + mise en ligne manuelle avec Wrangler           |

## Structure

```
src/
  content/
    objets/*.json        # 1 file = 1 souk item = 1 FR page + 1 EN page
    phrases/*.json       # 1 file = 1 Darija phrase = 1 FR page + 1 EN page
    itineraires/*.md     # city itineraries (used by the budget later)
  content.config.ts      # schemas of the 3 collections (validated at build)
  data/budget.json       # budget calculator values (DEMO, to verify)
  i18n/ui.ts             # UI strings, localised URL segments, path() helper
  layouts/BaseLayout.astro   # <head>: title, description, canonical, hreflang, JSON-LD
  components/
    AudioPlayer.astro    # audio + "show the screen" full-screen mode
    BudgetCalculator.astro   # vanilla JS calculator, reads ?city=
    Faq.astro, UpdatedAt.astro
    templates/           # one template per page type, shared by FR and EN
  pages/
    fr/{prix,darija,budget}/   # thin route files, each calls a template
    en/{prices,darija,budget}/
    robots.txt.ts
public/
  _redirects  _headers  # Cloudflare Pages rules
```

### URLs

| Page          | FR                     | EN                       |
| ------------- | ---------------------- | ------------------------ |
| Accueil       | `/fr/`                 | `/en/`                   |
| Objet         | `/fr/prix/tapis/`      | `/en/prices/rug/`        |
| Phrase        | `/fr/darija/bchhal/`   | `/en/darija/bchhal/`     |
| Budget        | `/fr/budget/`          | `/en/budget/`            |

Les slugs sont traduits (`slug.fr` / `slug.en` dans chaque JSON) ; les balises hreflang relient les deux versions.

## Ajouter du contenu

1. Copier `src/content/objets/tapis.json` (ou `phrases/bchhal.json`) sous un nouveau nom, par ex. `babouches.json`.
2. Remplir les champs FR et EN. Le nom du fichier sert d'identifiant pour les liens internes
   (`"phrases": ["bchhal"]` dans un objet, `"objets": ["tapis"]` dans une phrase).
3. `npm run dev` : les deux pages existent. Une erreur de schéma bloque le build et indique le champ fautif.

### Règle sur les prix

Chaque fourchette a un champ `verified`. Tant qu'il vaut `false`, la page affiche un avertissement
« à vérifier sur le terrain » et **aucune donnée structurée `Product` n'est envoyée à Google**.
Passer à `true` seulement avec un relevé réel, en renseignant `source` et `surveyedAt`.
Les montants actuels de `tapis.json` et de `data/budget.json` sont des **valeurs de démonstration**.

### Audio

Mettre `audioRecorded: true` et déposer le fichier (`bchhal.mp3`) dans R2. En local, le placer dans `public/audio/`.
Tant que `audioRecorded` vaut `false`, la page affiche « enregistrement à venir ».

## SEO intégré

- Titre et description uniques par langue, URL canonique, `hreflang` fr / en / x-default
- `sitemap-index.xml` (via `@astrojs/sitemap`) et `robots.txt` générés au build
- JSON-LD : `BreadcrumbList`, `FAQPage`, `Product` + `AggregateOffer` (prix vérifiés uniquement), `WebSite`
- Date « mis à jour le » visible, liens internes objet ↔ phrase ↔ budget de la ville
- Aucun JavaScript sauf le calculateur et le lecteur audio ; pas de police externe

## Variables d'environnement

| Nom                 | Rôle                                                          |
| ------------------- | ------------------------------------------------------------- |
| `SITE_URL`          | URL publique (canonical, hreflang, sitemap). Défaut : `https://bchhal.pages.dev` |
| `PUBLIC_AUDIO_BASE` | URL du bucket R2 public pour l'audio. Vide = `/audio/`       |

## Mise en ligne sur Cloudflare Pages

Dans le tableau de bord Cloudflare : **Workers & Pages > Create > Pages > Connect to Git**, choisir ce repo, puis :

- Framework preset : **Astro**
- Build command : `npm run build`
- Build output directory : `dist`
- Variable d'environnement : `SITE_URL` = le domaine final (et `NODE_VERSION` = `22` si besoin)

Chaque push sur `main` déclenche un déploiement ; chaque branche a son URL de prévisualisation.
`wrangler.toml` prépare déjà les liaisons D1, KV et R2 (commentées) pour les prochaines étapes.

## Prochaines étapes

- API des prix déclarés : Pages Functions + D1, médianes en cache dans KV
- Lecteur audio branché sur R2
- PWA hors ligne (`@vite-pwa/astro`)
- Contenu : 30 objets, 50 phrases, relevés de prix sur le terrain
