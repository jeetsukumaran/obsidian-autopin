import { App, Plugin, PluginSettingTab, Setting, WorkspaceLeaf, TFile, View, FileView, TAbstractFile } from 'obsidian';

interface AutoPinPluginSettings {
    defaultAutoPin: boolean;
    cleanSlateOption: 'empty' | 'daily' | 'custom';
    customCleanSlateFile: string;
}

const DEFAULT_SETTINGS: AutoPinPluginSettings = {
    defaultAutoPin: false,
    cleanSlateOption: 'empty',
    customCleanSlateFile: ''
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

        this.addCommand({
            id: 'clean-slate',
            name: 'Clean Slate',
            callback: () => this.cleanSlate()
        });

        this.addCommand({
            id: 'clean-slate-and-reopen-current',
            name: 'Clean Slate and Reopen Current',
            callback: () => this.cleanSlateAndReopenCurrent()
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
        return true;
    }

    async cleanSlate() {
        // Get all leaves
        const leaves = (
                this.app.workspace.getLeavesOfType('markdown')
                    .concat(this.app.workspace.getLeavesOfType('pdf'))
        )

        // Close all leaves
        for (const leaf of leaves) {
            await leaf.detach();
        }

        // Wait a moment for Obsidian to process the closures
        await new Promise(resolve => setTimeout(resolve, 100));

    }

    async openDailyNote() {
    }

    async openCustomFile() {
        const file = this.app.vault.getAbstractFileByPath(this.settings.customCleanSlateFile);
        if (file instanceof TFile) {
            await this.app.workspace.getLeaf().openFile(file);
        } else {
            console.error("Custom file not found:", this.settings.customCleanSlateFile);
        }
    }

    async cleanSlateAndReopenCurrent() {
        const activeFile = this.app.workspace.getActiveFile();
        await this.cleanSlate();

        if (activeFile instanceof TFile) {
            await this.app.workspace.getLeaf().openFile(activeFile);
        }
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

        new Setting(containerEl)
            .setName('Clean Slate Option')
            .setDesc('Choose what to do after closing all tabs')
            .addDropdown(dropdown => dropdown
                .addOption('empty', 'Leave empty')
                .addOption('daily', 'Open daily note')
                .addOption('custom', 'Open custom file')
                .setValue(this.plugin.settings.cleanSlateOption)
                .onChange(async (value: AutoPinPluginSettings['cleanSlateOption']) => {
                    this.plugin.settings.cleanSlateOption = value;
                    await this.plugin.saveSettings();
                    this.display(); // Refresh to show/hide custom file setting
                }));

        if (this.plugin.settings.cleanSlateOption === 'custom') {
            new Setting(containerEl)
                .setName('Custom Clean Slate File')
                .setDesc('Specify the file to open after Clean Slate (use full path from vault root)')
                .addText(text => text
                    .setPlaceholder('Example: folder/file.md')
                    .setValue(this.plugin.settings.customCleanSlateFile)
                    .onChange(async (value) => {
                        this.plugin.settings.customCleanSlateFile = value;
                        await this.plugin.saveSettings();
                    }));
        }
    }
}
