import { App, Plugin, PluginSettingTab, Setting, WorkspaceLeaf } from 'obsidian';

interface AutoPinPluginSettings {
    defaultAutoPin: boolean;
}

const DEFAULT_SETTINGS: AutoPinPluginSettings = {
    defaultAutoPin: false
}

export default class AutoPinPlugin extends Plugin {
    settings: AutoPinPluginSettings;

    async onload() {
        await this.loadSettings();

        this.addSettingTab(new AutoPinSettingTab(this.app, this));

        this.addCommand({
            id: 'activate-autopin',
            name: 'Activate AutoPin',
            callback: () => this.activateAutoPin()
        });

        this.addCommand({
            id: 'deactivate-autopin',
            name: 'Deactivate AutoPin',
            callback: () => this.deactivateAutoPin()
        });

        this.addCommand({
            id: 'toggle-autopin',
            name: 'Toggle AutoPin',
            callback: () => this.toggleAutoPin()
        });

        this.addCommand({
            id: 'pin-all-open',
            name: 'Pin All Open',
            callback: () => this.pinAllOpen()
        });

        this.addCommand({
            id: 'unpin-all-open',
            name: 'Unpin All Open',
            callback: () => this.unpinAllOpen()
        });

        if (this.settings.defaultAutoPin) {
            this.activateAutoPin();
        }

        this.registerEvent(
            this.app.workspace.on('layout-change', () => {
                this.handleLayoutChange();
            })
        );
    }

    async loadSettings() {
        this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
    }

    async saveSettings() {
        await this.saveData(this.settings);
    }

    activateAutoPin() {
        this.settings.defaultAutoPin = true;
        this.saveSettings();
    }

    deactivateAutoPin() {
        this.settings.defaultAutoPin = false;
        this.saveSettings();
    }

    toggleAutoPin() {
        this.settings.defaultAutoPin = !this.settings.defaultAutoPin;
        this.saveSettings();
    }

    pinAllOpen() {
        this.app.workspace.iterateAllLeaves((leaf: WorkspaceLeaf) => {
            if (!this.isLeafPinned(leaf)) {
                leaf.setPinned(true);
            }
        });
    }

    unpinAllOpen() {
        this.app.workspace.iterateAllLeaves((leaf: WorkspaceLeaf) => {
            if (this.isLeafPinned(leaf)) {
                leaf.setPinned(false);
            }
        });
    }

    handleLayoutChange() {
        if (this.settings.defaultAutoPin) {
            this.app.workspace.iterateAllLeaves((leaf: WorkspaceLeaf) => {
                if (!this.isLeafPinned(leaf) && this.shouldAutoPin(leaf)) {
                    leaf.setPinned(true);
                }
            });
        }
    }

    isLeafPinned(leaf: WorkspaceLeaf): boolean {
        // Since there's no direct method to check if a leaf is pinned,
        // we can try to infer it from the leaf's state or properties
        // This is a placeholder implementation and may need adjustment
        return (leaf as any).pinned === true;
    }

    shouldAutoPin(leaf: WorkspaceLeaf): boolean {
        // Implement logic to determine if a leaf should be auto-pinned
        // This could involve checking the leaf type, content, or other criteria
        return true; // Placeholder implementation
    }
}

class AutoPinSettingTab extends PluginSettingTab {
    plugin: AutoPinPlugin;

    constructor(app: App, plugin: AutoPinPlugin) {
        super(app, plugin);
        this.plugin = plugin;
    }

    display(): void {
        const {containerEl} = this;

        containerEl.empty();

        new Setting(containerEl)
            .setName('AutoPin by default')
            .setDesc('Enable AutoPin for new tabs by default')
            .addToggle(toggle => toggle
                .setValue(this.plugin.settings.defaultAutoPin)
                .onChange(async (value) => {
                    this.plugin.settings.defaultAutoPin = value;
                    await this.plugin.saveSettings();
                }));
    }
}
