# Windows Shortcuts for Stream Deck & StreamDock

[![License: MIT](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Latest release](https://img.shields.io/github/v/release/MCristoni/windows-shortcuts-streamdeck)](https://github.com/MCristoni/windows-shortcuts-streamdeck/releases/latest)

A native plugin that puts Windows shortcuts on your deck. The first action is a **Do Not Disturb toggle for Windows 11**: press the key to turn Do Not Disturb on or off, and the key always shows the real state.

<p>
  <img src="docs/images/dnd-off.png" width="96" alt="Key image when Do Not Disturb is off">
  &nbsp;
  <img src="docs/images/dnd-on.png" width="96" alt="Key image when Do Not Disturb is on">
</p>

> 🇧🇷 [Leia em português](README.pt-BR.md)

## Features

- **One-press toggle** for Windows Do Not Disturb.
- **Always in sync**: the key reads the actual Windows state, so it stays correct when you change Do Not Disturb from the Notification Center or the Settings app (picked up within ~2 seconds).
- **Multiple keys** on different pages or devices update together.
- **Clear failure feedback**: if Windows refuses the change, the key shows the host app's alert icon instead of silently lying about the state.
- **No admin rights, no network access, no registry hacks.**

## Compatibility

| | Status |
| --- | --- |
| Windows 11 (tested on 25H2, build 26200) | ✅ Supported |
| Windows 10 | ⚠️ Untested (should drive Focus Assist "Priority only") |
| macOS | ❌ Not supported (the action uses Windows-only APIs) |
| Fifine Control Deck 3.10 (Fifine D6) | ✅ Tested |
| Mirabox StreamDock and other StreamDock-based apps | ⚠️ Expected to work (same host as Fifine Control Deck) |
| Elgato Stream Deck 7.1+ | ⚠️ Built with the official Elgato SDK, not yet tested on Elgato hardware |

## Installation

Download the latest files from the [Releases page](https://github.com/MCristoni/windows-shortcuts-streamdeck/releases/latest).

- **Elgato Stream Deck**: download `com.mcristoni.windows-shortcuts.streamDeckPlugin` and double-click it.
- **Fifine Control Deck / StreamDock**: download `com.mcristoni.windows-shortcuts.sdPlugin.zip`, extract it into `%APPDATA%\HotSpot\StreamDock\plugins\`, and restart the app.

Step-by-step instructions, including uninstalling and troubleshooting, are in [How to use](docs/how-to-use.md).

## Documentation

| Document | What's inside |
| --- | --- |
| [How to use](docs/how-to-use.md) | Installing, adding the key, what each state means, troubleshooting |
| [How it works](docs/how-it-works.md) | Architecture, the Windows API behind the toggle, design decisions and known limitations |
| [Development](docs/development.md) | Building from source, project layout, scripts, debugging |
| [Publishing](docs/publishing.md) | Release checklist and how to submit to the Elgato Marketplace and Mirabox Space |
| [Changelog](CHANGELOG.md) | Version history |

## Building from source

Requires Windows and Node.js 20 or newer.

```bash
npm install
npm run pack
```

The installers are written to `dist/`. See [Development](docs/development.md) for the full workflow.

## License

[MIT](LICENSE). The plugin and category icons are based on [Lucide](https://lucide.dev) (ISC); see [Third-party notices](THIRD_PARTY_NOTICES.md).

This project is not affiliated with or endorsed by Microsoft, Elgato (Corsair), Mirabox or Fifine.
