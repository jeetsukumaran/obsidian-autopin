import { App, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, TFile, View, FileView } from 'obsidian';

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
            if (this.shouldPin(leaf)) {
                leaf.setPinned(true);
            }
        });
    }

    unpinAllOpen() {
        this.app.workspace.iterateAllLeaves((leaf: WorkspaceLeaf) => {
            leaf.setPinned(false);
        });
    }

    handleLayoutChange() {
        if (this.settings.defaultAutoPin) {
            this.app.workspace.iterateAllLeaves((leaf: WorkspaceLeaf) => {
                if (this.shouldPin(leaf)) {
                    leaf.setPinned(true);
                }
            });
        }
    }

    shouldPin(leaf: WorkspaceLeaf): boolean {
        if (!(leaf.view instanceof FileView)) {
            return false;
        }

        // const viewType = leaf.view.getViewType();

        // if (viewType === "empty") {
        //     return false;
        // }

        // if (viewType === "markdown") {
        //     const file = leaf.view.file;
        //     return file instanceof TFile && file.stat.size > 0;
        // }

        // Add any other conditions for pinning here
        // For example, you might want to check other view types

        return true;
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
