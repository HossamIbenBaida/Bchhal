# Bchhal ?

Compagnon de voyage au Maroc (FR/EN) : **juste prix au souk**, **budget voyage** et **darija de poche**.
Site statique Astro + Tailwind, hébergé sur Cloudflare Workers (assets statiques).

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
| `npm run deploy`  | Build + mise en ligne manuelle (`wrangler deploy`)     |

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
    AudioPlayer.astro    # "show the screen" mode (+ audio, off in V1)
  config.ts              # feature flags (audio off in V1)
    BudgetCalculator.astro   # vanilla JS calculator, reads ?city=
    Faq.astro, UpdatedAt.astro
    templates/           # one template per page type, shared by FR and EN
  pages/
    fr/{prix,darija,budget}/   # thin route files, each calls a template
    en/{prices,darija,budget}/
    robots.txt.ts
public/
  _redirects  _headers  # Cloudflare rules (applied by Workers static assets)
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

### Audio (hors V1)

L'audio est désactivé pour la V1 : `FEATURES.audio = false` dans `src/config.ts`. Les pages phrase gardent le mode
« montrer l'écran ». Pour le réactiver plus tard : passer le drapeau à `true`, mettre `audioRecorded: true` dans la
phrase et déposer le fichier (`bchhal.mp3`) dans R2 (en local : `public/audio/`).

## SEO intégré

- Titre et description uniques par langue, URL canonique, `hreflang` fr / en / x-default
- `sitemap-index.xml` (via `@astrojs/sitemap`) et `robots.txt` générés au build
- JSON-LD : `BreadcrumbList`, `FAQPage`, `Product` + `AggregateOffer` (prix vérifiés uniquement), `WebSite`
- Date « mis à jour le » visible, liens internes objet ↔ phrase ↔ budget de la ville
- Aucun JavaScript sauf le calculateur et le mode « montrer l'écran » ; pas de police externe

## Variables d'environnement

| Nom                 | Rôle                                                          |
| ------------------- | ------------------------------------------------------------- |
| `SITE_URL`          | URL publique (canonical, hreflang, sitemap). Défaut : `https://bchhal.pages.dev` |
| `PUBLIC_AUDIO_BASE` | URL du bucket R2 public pour l'audio. Vide = `/audio/`       |

## Mise en ligne sur Cloudflare (Workers + static assets)

Le site est servi comme **assets statiques d'un Worker** (`wrangler.toml` > `[assets] directory = "./dist"`).
Dans le tableau de bord Cloudflare : **Workers & Pages > Create > Import a repository**, choisir ce repo, puis :

- Build command : `npm run build`
- Deploy command : `npx wrangler deploy`
- Variable de build : `SITE_URL` = le domaine final (sinon `https://bchhal.pages.dev` est utilisé dans les liens canoniques)

Chaque push sur `main` reconstruit et redéploie le site. `public/_headers` et `public/_redirects` sont appliqués
par Workers (en-têtes de sécurité, cache, redirection de `/` vers `/fr/`). Une URL inconnue affiche `404.html`.

Déploiement manuel depuis ton poste : `npx wrangler login` puis `npm run deploy`.
Tester la version Workers en local : `npm run build && npx wrangler dev`.

`wrangler.toml` prépare aussi les liaisons D1, KV et R2 (commentées) pour l'API des prix.

## Prochaines étapes

- API des prix déclarés : Pages Functions + D1, médianes en cache dans KV
- Audio (après la V1) : enregistrements de vraies voix, servis depuis R2
- PWA hors ligne (`@vite-pwa/astro`)
- Contenu : 30 objets, 50 phrases, relevés de prix sur le terrain

## Design system

Les couleurs, polices et composants viennent du design system « Bchhal » (tadelakt, zellige, laiton) : https://claude.ai/artifact/Nrc3j5QRr3Q1vgsB4gZayk

- Tokens et composants : `src/styles/global.css`. Les couleurs suivent le thème clair/sombre du téléphone.
- Utilitaires Tailwind : `bg-zellige`, `text-ink-muted`, `border-brass`, `bg-saffron-soft`, `rounded-tile`…
- Composants CSS `bc-*` : `bc-btn`, `bc-stamp`, `bc-card`, `bc-note`, `bc-phrase`, `bc-play`, `bc-city`, `bc-field`, `bc-range`, `bc-khatem-rule`, `bc-zellige`.
- Polices auto-hébergées via Fontsource (Reem Kufi, Readex Pro, IBM Plex Mono), donc disponibles hors ligne.
- Règle : un prix sans relevé terrain porte toujours le tampon `bc-stamp--verify`.

