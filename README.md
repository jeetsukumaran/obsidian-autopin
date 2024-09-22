# Obsidian AutoPin plugin

## Overview

The Obsidian AutoPin plugin enhances your note-taking experience by automatically pinning new tabs, windows, or split workspace leaves in Obsidian. This plugin is perfect for users who frequently work with multiple notes simultaneously and want to keep their workspace organized.

## Features

- **Auto-pin functionality**: Automatically pin new tabs, windows, or split workspace leaves based on your settings.
- **Toggle auto-pin**: Easily turn the auto-pin feature on or off with a single command.
- **Bulk pin/unpin**: Pin or unpin all open leaves with one command.
- **Customizable settings**: Choose whether auto-pin is enabled by default through the settings page.
- **Command palette integration**: Access all plugin functions through Obsidian's command palette.

## Installation

### Community plugin store (recommended)

Once this plugin is approved and added to the Obsidian Community Plugin Store, you can install it directly from within Obsidian:

1. Open Obsidian and go to Settings.
2. Navigate to "Community plugins" and disable Safe Mode if necessary.
3. Click "Browse" and search for "AutoPin".
4. Click "Install", then "Enable" to activate the plugin.

### Manual installation from GitHub

If you want to install the plugin before it's available in the Community Plugin Store, follow these steps:

1. Download the latest release from the GitHub repository.
2. Extract the zip file.
3. Copy the extracted folder to your Obsidian vault's plugins folder:
   - On Windows: `%APPDATA%\Obsidian\plugins\`
   - On macOS: `~/Library/Application Support/obsidian/plugins/`
   - On Linux: `~/.var/app/md.obsidian.Obsidian/config/obsidian/plugins/`
4. Rename the folder to `obsidian-autopin` if it's not already named that.
5. Restart Obsidian or refresh the plugins.
6. Go to Settings > Community plugins, find "AutoPin" in the list, and enable it.

## Usage

After installation and activation, the AutoPin plugin will work based on your settings. Here's how to use its features:

### Commands

Access these commands through the Command Palette (Ctrl/Cmd + P):

- **Activate AutoPin**: Turn on the auto-pinning feature.
- **Deactivate AutoPin**: Turn off the auto-pinning feature.
- **Toggle AutoPin**: Switch between activated and deactivated states.
- **Pin all open**: Pin all currently open leaves.
- **Unpin all open**: Unpin all currently pinned leaves.

### Settings

To customize the plugin's behavior:

1. Go to Settings > Community plugins.
2. Find "AutoPin" in the list and click on the gear icon.
3. In the settings page, you can:
   - Toggle "AutoPin by default" to determine if new leaves should be automatically pinned when created.

## How it works

The AutoPin plugin uses Obsidian's API to detect when new leaves (tabs, windows, or splits) are created. When AutoPin is active, it automatically pins these new leaves based on your settings and custom criteria (if implemented).

The plugin also provides commands to manually control pinning behavior, giving you flexibility in managing your workspace.

## Compatibility

This plugin is compatible with Obsidian v0.15.0 and above. It has been tested on Windows, macOS, and Linux.

## Troubleshooting

If you encounter any issues:

1. Ensure you're running the latest version of Obsidian and the AutoPin plugin.
2. Try disabling other plugins to check for conflicts.
3. If the problem persists, please check the existing issues on the GitHub repository or create a new one.

## Contributing

Contributions are welcome! If you'd like to contribute:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and test thoroughly.
4. Submit a pull request with a clear description of your changes.

## Support

If you need help or have questions:

- Check the [Discussions](https://github.com/jeetsukumaran/obsidian-autopin/discussions) section on GitHub.
- For bug reports, use the [Issues](https://github.com/jeetsukumaran/obsidian-autopin/issues) section on GitHub.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- Thanks to the Obsidian team for creating an amazing platform and providing the API that makes this plugin possible.
- Gratitude to all contributors and users who help improve this plugin.

---

Enjoy using AutoPin! We hope it enhances your Obsidian experience and helps keep your workspace organized.
