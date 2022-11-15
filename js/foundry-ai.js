const MODULE_NAME = 'foundry-ai';
const SERVER_URL_SETTING = 'server_url';

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(MODULE_NAME);
});

Hooks.once('setup', async () => {
    FoundryAI.debug('Initializing');
    window.FoundryAI = FoundryAI;
    window.FoundryAI.registerSettings();
})

class FoundryAI {

    static debug(...args) {
	this.log(false, ...args);
    }

    static error(...args) {
	this.log(true, ...args);
    }

    static log(force, ...args) {
	const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(MODULE_NAME);

	if (shouldLog) {
	    console.log(MODULE_NAME, '|', ...args);
	}
    }

    static registerSettings() {
	game.settings.register(MODULE_NAME, SERVER_URL_SETTING, {
	    name: game.i18n.localize('foundry-ai.settings.server_url.name'),
	    hint: game.i18n.localize('foundry-ai.settings.server_url.hint'),
	    scope: 'client',
	    config: true,
	    requiresReload: true,
	    type: String,
	    default: ''
	});
    }
}
