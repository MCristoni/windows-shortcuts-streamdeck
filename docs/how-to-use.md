# How to use

This guide covers installing the plugin, putting the Do Not Disturb toggle on a key, and fixing common problems.

## Requirements

- Windows 11 (Windows 10 is untested).
- One of these host apps:
  - **Elgato Stream Deck** 7.1 or newer, with any Elgato Stream Deck device.
  - **Fifine Control Deck** (Fifine AmpliGame decks), **Mirabox StreamDock** or another StreamDock-based app.
- Windows PowerShell 5.1, which ships with Windows. The plugin does not need administrator rights.

## Install

### Elgato Stream Deck

**From the Elgato Marketplace (recommended):** open the [Shortcuts for Windows page](https://marketplace.elgato.com/product/shortcuts-for-windows-9ac4f217-bfaa-49c2-bcff-eca3f61d9ca3), click **Get** and follow the prompts. Stream Deck installs the plugin.

**Manually:**

1. Download `com.mcristoni.windows-shortcuts.streamDeckPlugin` from the [latest release](https://github.com/MCristoni/windows-shortcuts-streamdeck/releases/latest).
2. Double-click the file. Stream Deck opens and asks to install the plugin.

### Fifine AmpliGame (Fifine Control Deck) / StreamDock

These apps do not install `.streamDeckPlugin` files by double-click, so the plugin is installed by copying its folder.

1. Download `com.mcristoni.windows-shortcuts.sdPlugin.zip` from the [latest release](https://github.com/MCristoni/windows-shortcuts-streamdeck/releases/latest).
2. Close the app (also from the system tray).
3. Open `%APPDATA%\HotSpot\StreamDock\plugins\` in File Explorer (paste the path into the address bar).
4. Extract the zip there. You should end up with:
   ```
   %APPDATA%\HotSpot\StreamDock\plugins\com.mcristoni.windows-shortcuts.sdPlugin\manifest.json
   ```
   If you see `...sdPlugin\com.mcristoni.windows-shortcuts.sdPlugin\manifest.json`, move the inner folder up one level.
5. Start the app again.

## Add the key

1. In the host app, find the **Shortcuts for Windows** category in the action list.
2. Drag **Do Not Disturb Toggle** onto a key.
3. The key immediately shows the current Windows state.

| Key | Meaning |
| --- | --- |
| <img src="images/dnd-off.png" width="72" alt="Bell"> | Do Not Disturb is **off**: notifications show normally. |
| <img src="images/dnd-on.png" width="72" alt="Bell with a z"> | Do Not Disturb is **on**: notification banners are silenced. |

## Use it

- **Press the key** to switch Do Not Disturb on or off. The taskbar bell next to the clock changes at the same time.
- **Change it anywhere else** (Notification Center or *Settings → System → Notifications*) and the key follows within about 2 seconds.
- **Several keys** with this action, on any page or device, always show the same state.

### What "on" means

Turning Do Not Disturb on selects the Windows **Priority only** profile, which is the same thing the Do Not Disturb button in the Windows 11 Notification Center does. Calls, reminders and apps you marked as priority in *Settings → System → Notifications → Set priority notifications* can still get through.

Turning it off selects the normal (unrestricted) profile.

## Troubleshooting

### The key shows a warning icon when pressed

The plugin could not talk to Windows. Check the plugin log (see [Logs](#logs)) for a line starting with `Failed to toggle Do Not Disturb`. Common causes:

- **PowerShell is restricted by your organization.** Managed PCs sometimes block PowerShell or run it in *Constrained Language Mode*, which prevents the plugin's small helper script from loading. The plugin cannot work around that policy.
- **A Windows update changed the Do Not Disturb internals.** The plugin relies on an internal Windows interface (see [How it works](how-it-works.md#limitations)). Please [open an issue](https://github.com/MCristoni/windows-shortcuts-streamdeck/issues) with your Windows version (`winver`).

### The key does not appear or never reacts (Fifine Control Deck / StreamDock)

- Make sure the folder is extracted correctly (step 4 of the install).
- Check the app log in `%APPDATA%\HotSpot\StreamDock\logs\`. A healthy start contains:
  ```
  Plugin ... com.mcristoni.windows-shortcuts.sdPlugin is now connected
  ```
  If you only see `restartPlugin` lines for this plugin every minute, the app cannot start it. Restart the app, and reinstall the plugin if the problem persists.

### The key shows the wrong state

The key is updated every 2 seconds from the real Windows setting. Do Not Disturb that Windows turns on by itself through automatic rules (for example while gaming, duplicating your display or during scheduled hours) may not be reflected, because those rules don't change the profile you selected. Press the key to take manual control.

### Logs

| Host app | Plugin log folder |
| --- | --- |
| Elgato Stream Deck | `%APPDATA%\Elgato\StreamDeck\Plugins\com.mcristoni.windows-shortcuts.sdPlugin\logs\` |
| Fifine Control Deck / StreamDock | `%APPDATA%\HotSpot\StreamDock\plugins\com.mcristoni.windows-shortcuts.sdPlugin\logs\` |

When reporting a problem, attach the newest `com.mcristoni.windows-shortcuts.0.log`.

## Uninstall

- **Elgato Stream Deck**: open *Preferences → Plugins*, select **Shortcuts for Windows** and uninstall it.
- **Fifine Control Deck / StreamDock**: close the app and delete the `com.mcristoni.windows-shortcuts.sdPlugin` folder from `%APPDATA%\HotSpot\StreamDock\plugins\`.

Uninstalling does not change your Windows Do Not Disturb setting.
