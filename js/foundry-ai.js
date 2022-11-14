Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(FoundryAI.ID);
});

Hooks.once('init', async function() {
    FoundryAI.log(false, "Hello from the local dev!");
});

class FoundryAI {
    static ID = 'foundry-ai';

    static log(force, ...args) {
	const shouldLog = force || game.modules.get('_dev-mode')?.api?.getPackageDebugValue(this.ID);

	if (shouldLog) {
	    console.log(this.ID, '|', ...args);
	}
    }
}
