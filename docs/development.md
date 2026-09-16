# Development

## Prerequisites

- Windows 10 or 11.
- [Node.js](https://nodejs.org) 20 or newer (only needed to build; host apps bring their own Node runtime).
- A host app to test with: Elgato Stream Deck 7.1+, or Fifine Control Deck / StreamDock.

```bash
npm install
npm run build
```

## Project layout

```
.
├── com.mcristoni.windows-shortcuts.sdPlugin/   # The plugin folder loaded by the host app
│   ├── manifest.json                           # Plugin metadata, actions, states, images
│   ├── bin/                                    # Compiled plugin (generated, not committed)
│   ├── imgs/actions/                           # Action and key images (hand-edited PNGs)
│   └── imgs/plugin/                            # Plugin and category icons (generated from icons/)
├── src/
│   ├── plugin.ts                               # Entry point: registers actions and connects
│   ├── actions/do-not-disturb.ts               # The Do Not Disturb key
│   ├── windows/do-not-disturb.ts               # Client for the PowerShell worker
│   ├── windows/dnd-worker.ps1                  # PowerShell worker (embedded into plugin.js at build time)
│   └── types.d.ts                              # Lets TypeScript import *.ps1 files as text
├── icons/                                      # SVG sources for the plugin and category icons
├── tools/
│   ├── build-icons.mjs                         # icons/*.svg -> imgs/plugin/*.png (base + @2x)
│   ├── build-doc-images.mjs                    # Key previews for the docs (docs/images/)
│   ├── pack.mjs                                # Build + release artifacts in dist/
│   └── reload-plugin.ps1                       # Restart the running plugin
├── docs/                                       # Documentation (docs/images/ holds generated previews)
└── rollup.config.mjs                           # Bundles src/ (including the .ps1 worker) into bin/plugin.js
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run build` | Bundles `src/` into `com.mcristoni.windows-shortcuts.sdPlugin/bin/plugin.js`. |
| `npm run watch` | Rebuilds on every change and runs `npm run reload` after each build. |
| `npm run reload` | Kills the running plugin process; the host app relaunches it with the new build. |
| `npm run icons` | Renders `icons/*.svg` into the plugin and category PNGs in `imgs/plugin/`. Never touches `imgs/actions/`. |
| `npm run doc-images` | Rebuilds the key previews in `docs/images/` from the action PNGs. |
| `npm run pack` | Builds and writes the release artifacts to `dist/`. |

## Loading the plugin from source

Link the `.sdPlugin` folder into the host app's plugins folder, so every build is picked up without copying files.

### Elgato Stream Deck

The Elgato CLI creates the link and restarts the plugin for you:

```bash
npx streamdeck link com.mcristoni.windows-shortcuts.sdPlugin
```

With Stream Deck, you can use `npx streamdeck restart com.mcristoni.windows-shortcuts` instead of `npm run reload`.

### Fifine Control Deck / StreamDock

Close the app, make sure no copy of the plugin exists in `%APPDATA%\HotSpot\StreamDock\plugins\`, then create a directory junction from PowerShell in the repository folder:

```powershell
New-Item -ItemType Junction -Path "$env:APPDATA\HotSpot\StreamDock\plugins\com.mcristoni.windows-shortcuts.sdPlugin" -Target (Resolve-Path .\com.mcristoni.windows-shortcuts.sdPlugin)
```

Start the app again. After changing code, run `npm run build` and `npm run reload` (or keep `npm run watch` running). The app relaunches the plugin within a few seconds.

Things to know about these hosts:

- They ship **Node.js 20** (`node\node20.exe` in the install folder). Keep `"Nodejs": { "Version": "20" }` in the manifest; asking for another version makes the app silently fail to start the plugin.
- They do not run `streamdeck` CLI commands; `npx streamdeck restart` would open the Elgato app instead.
- The app log in `%APPDATA%\HotSpot\StreamDock\logs\` shows whether the plugin connected.
- Folders copied out of OneDrive can keep the read-only attribute, which blocks deleting them. Clear it with `attrib -r /s /d <folder>`.

## Debugging

- **Plugin logs** are written to `com.mcristoni.windows-shortcuts.sdPlugin/logs/` (via the link, this is the folder in the repository). Use `streamDeck.logger` in code.
- **The worker can be tested on its own**, without any host app:

  ```bash
  powershell -NoProfile -ExecutionPolicy Bypass -File src/windows/dnd-worker.ps1
  ```

  Wait for `ready`, then type `get`, `toggle`, `on` or `off` followed by Enter. Close it with `Ctrl+C`.
- **Attaching a debugger** (Elgato Stream Deck): set `"Nodejs": { "Version": "20", "Debug": "enabled" }` in the manifest during development and use the *Attach to Plugin* configuration in `.vscode/launch.json`. Do not ship this setting, and do not use it with StreamDock-based hosts.

## Images

All images are PNG files with a transparent background, provided at a base size and as `@2x`.

| Image | Files | Base size | How it is maintained |
| --- | --- | --- | --- |
| Plugin icon | `imgs/plugin/marketplace.png`, `@2x` | 256 px | Generated from `icons/plugin.svg` with `npm run icons` |
| Category icon | `imgs/plugin/category-icon.png`, `@2x` | 28 px | Generated from `icons/category.svg` with `npm run icons` |
| Action list icon | `imgs/actions/dnd/action.png`, `@2x` | 20 px | Edited by hand |
| Key, Do Not Disturb off | `imgs/actions/dnd/dnd-off.png`, `@2x` | 72 px | Edited by hand |
| Key, Do Not Disturb on | `imgs/actions/dnd/dnd-on.png`, `@2x` | 72 px | Edited by hand |

The images in `imgs/actions/` are the source of truth: edit them directly in an image editor, and no script overwrites them. After changing a key image, run `npm run doc-images` so the previews in the documentation match. The previews add a dark key background, because white icons on a transparent background are invisible on GitHub's light theme.

These are the sizes required by the [Elgato Marketplace guidelines](https://docs.elgato.com/guidelines/stream-deck/plugins/). Action and category icons must be monochrome white (`#FFFFFF`) on a transparent background. The [Mirabox Space style guide](https://sdk.key123.vip/en/guide/style-guide.html) suggests larger images (40 px action, 48 px category, 128 px keys); StreamDock-based apps scale the Elgato sizes without problems.

## Adding a new action

1. Create a class in `src/actions/` decorated with `@action({ UUID: "com.mcristoni.windows-shortcuts.<name>" })`.
2. Register it in `src/plugin.ts`.
3. Add the action to `manifest.json` with the same UUID, and put its PNG images (transparent background, base size and `@2x`) in `imgs/actions/<name>/`.
4. Run `npm run build` and validate with `npx streamdeck validate com.mcristoni.windows-shortcuts.sdPlugin`.

Action UUIDs cannot change once the plugin is published, because users' saved profiles reference them.
