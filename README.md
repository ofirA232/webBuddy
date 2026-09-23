# webBuddy – הפורטפוליו של אופיר זנגי

React 18 + Vite 5 + Tailwind 3, מוגש דרך Express.

## הרצה

```bash
npm install
PORT=5177 npm run dev      # פיתוח (Git Bash / WSL; ברירת המחדל היא פורט 5000)
npm run build && npm start # פרודקשן: dist/public + dist/index.js
npm run check              # בדיקת טיפוסים
```

## תמונות

מקורות נשמרים ב-`assets-src/` והפלט המאופטם (WebP) נכנס ל-git תחת `client/src/assets/`.

| מקור | פלט | רוחבים |
| --- | --- | --- |
| `assets-src/projects/<slug>.png` | `client/src/assets/projects/<slug>.webp`, `<slug>@640.webp` | 1280 / 640 |
| `assets-src/skills/<key>.png` | `client/src/assets/skills/<key>.webp`, `<key>@640.webp` | 1280 / 640 |
| `assets-src/hero/<name>.jpg` | `client/src/assets/hero/<name>.webp`, `<name>@480.webp` | 960 / 480 |
| `assets-src/creative/<name>.png` | `client/src/assets/creative/<name>.webp`, `<name>@480.webp`, `manifest.json` | 900 / 480 |
| `assets-src/og.png` | `client/public/og.jpg` | 1200×630 |

```bash
npm run images
```

לאחר מכן מייבאים את קובץ ה-webp ב-`client/src/data/portfolioData.ts` (פרויקטים) או ב-`client/src/components/SkillsSection.tsx` (כישורים). ה-`slug` וה-`key` שם הם שמות הקבצים הצפויים.

**חוץ מקריאייטיב**: סקשן הקריאייטיב קורא את התיקייה שלו לבד, כך שאחרי `npm run images` הקיר מתעדכן בלי לגעת בקוד. הפרטים ב-`assets-src/creative/README.md`.

## ערכים אמיתיים

`client/src/data/site.ts` מרכז שם, תיאור, דומיין, אימייל וקישורי סושיאל. ערך ריק מוסתר בממשק.
