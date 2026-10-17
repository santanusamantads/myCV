# My CV website

Static, dynamic-editable CV. No build step.

## Use it
1. Open `index.html` (or run `python3 -m http.server`).
2. Click **✎ Edit** → add photo, text, links, experience, skills, etc. Changes show live and auto-save in your browser.
3. Click **⬇ Download data.json** and replace the `data.json` in this repo (create it if missing).

## Publish on GitHub Pages
```bash
git init && git add . && git commit -m "CV site"
git branch -M main
git remote add origin https://github.com/<you>/<you>.github.io.git   # or any repo name
git push -u origin main
```
Then: repo **Settings → Pages → Deploy from branch → main / (root)**.
Site: `https://<you>.github.io/` (or `/<repo>/`).

## Updating later
Edit in the browser → download `data.json` → commit it. Visitors always see the committed `data.json`;
your browser edits are only visible to you until you commit.
