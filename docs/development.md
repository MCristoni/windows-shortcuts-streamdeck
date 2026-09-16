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
│   ├── imgs/                                   # PNG images (generated from icons/, committed)
│   └── scripts/dnd-worker.ps1                  # PowerShell worker that talks to Windows
├── src/
│   ├── plugin.ts                               # Entry point: registers actions and connects
│   ├── actions/do-not-disturb.ts               # The Do Not Disturb key
│   └── windows/do-not-disturb.ts               # Client for the PowerShell worker
├── icons/                                      # SVG sources for every image
├── tools/
│   ├── build-icons.mjs                         # SVG -> PNG (base + @2x)
│   ├── pack.mjs                                # Build + release artifacts in dist/
│   └── reload-plugin.ps1                       # Restart the running plugin
├── docs/                                       # Documentation
└── rollup.config.mjs                           # Bundles src/ into bin/plugin.js
```

## Scripts

| Command | What it does |
| --- | --- |
| `npm run build` | Bundles `src/` into `com.mcristoni.windows-shortcuts.sdPlugin/bin/plugin.js`. |
| `npm run watch` | Rebuilds on every change and runs `npm run reload` after each build. |
| `npm run reload` | Kills the running plugin process; the host app relaunches it with the new build. |
| `npm run icons` | Renders `icons/*.svg` into the PNGs referenced by the manifest. |
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
  powershell -NoProfile -ExecutionPolicy Bypass -File com.mcristoni.windows-shortcuts.sdPlugin/scripts/dnd-worker.ps1
  ```

  Wait for `ready`, then type `get`, `toggle`, `on` or `off` followed by Enter. Close it with `Ctrl+C`.
- **Attaching a debugger** (Elgato Stream Deck): set `"Nodejs": { "Version": "20", "Debug": "enabled" }` in the manifest during development and use the *Attach to Plugin* configuration in `.vscode/launch.json`. Do not ship this setting, and do not use it with StreamDock-based hosts.

## Images

All images are generated from the SVG files in `icons/`. Edit the SVG, then run `npm run icons`.

| Source | Output | Base size (@2x is double) |
| --- | --- | --- |
| `icons/plugin.svg` | `imgs/plugin/marketplace` | 256 px |
| `icons/category.svg` | `imgs/plugin/category-icon` | 48 px |
| `icons/action.svg` | `imgs/actions/dnd/action` | 40 px |
| `icons/dnd-off.svg` | `imgs/actions/dnd/dnd-off` | 144 px |
| `icons/dnd-on.svg` | `imgs/actions/dnd/dnd-on` | 144 px |

Sizes meet both the [Elgato Marketplace guidelines](https://docs.elgato.com/guidelines/stream-deck/plugins/) and the [Mirabox Space style guide](https://sdk.key123.vip/en/guide/style-guide.html). Action and category icons must stay monochrome white on a transparent background.

## Adding a new action

1. Create a class in `src/actions/` decorated with `@action({ UUID: "com.mcristoni.windows-shortcuts.<name>" })`.
2. Register it in `src/plugin.ts`.
3. Add the action to `manifest.json` with the same UUID, plus SVG sources in `icons/` and entries in `tools/build-icons.mjs`.
4. Run `npm run icons`, `npm run build`, and validate with `npx streamdeck validate com.mcristoni.windows-shortcuts.sdPlugin`.

Action UUIDs cannot change once the plugin is published, because users' saved profiles reference them.
