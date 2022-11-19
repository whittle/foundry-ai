const MODULE_NAME = 'foundry-ai';
const SETTING_SERVER_URL = 'server_url';

Hooks.once('devModeReady', ({ registerPackageDebugFlag }) => {
    registerPackageDebugFlag(MODULE_NAME);
});

Hooks.once('setup', async () => {
    Log.debug('Initializing');
    FoundryAI.registerSettings();
    const serverUrl = FoundryAI.getServerUrl();
    window.foundryAI = new FoundryAI(serverUrl);
});

Hooks.once('ready', async () => {
    Log.debug('Pinging WebSocket server.');
    window.foundryAI.ping();
});

Hooks.once('canvasReady', async (canvas) => {
    Log.debug('Sending canvas to server.');
    window.foundryAI.sendCanvas(canvas);
});

class FoundryAI {

    constructor(serverUrl) {
	if (!serverUrl) {
	    Log.error(SETTING_SERVER_URL+' setting is blank: not connecting to server.');
	} else {
	    this.serverUrl = serverUrl
	    Log.debug('Opening new WebSocket to '+this.serverUrl);
	    this.initWebSocket(this.serverUrl);
	}
    }

    static registerSettings() {
	game.settings.register(MODULE_NAME, SETTING_SERVER_URL, {
	    name: game.i18n.localize('foundry-ai.settings.server_url.name'),
	    hint: game.i18n.localize('foundry-ai.settings.server_url.hint'),
	    scope: 'client',
	    config: true,
	    requiresReload: true,
	    type: String,
	    default: ''
	});
    }

    static getServerUrl() {
	return game.settings.get(MODULE_NAME, SETTING_SERVER_URL);
    }

    initWebSocket(serverUrl) {
	this.socket = new WebSocket(serverUrl);

	this.socket.addEventListener('open', (socketEvent) => {
	    Log.debug('WebSocket opened: ', socketEvent);
	    Log.debug('WebSocket ready state: ', this.socket.readyState);
	});

	this.socket.addEventListener('message', (socketEvent) => {
	    Log.debug('Message received: ', socketEvent.data);
	});
    }

    ping() {
	this.socket.send("Ping");
    }

    sendCanvas(canvas) {
	Log.debug(canvas);
	const cp = {
	    dimensions: canvas.dimensions
	};
	this.socket.send(JSON.stringify(cp));
    }
}

class Log {
    static debug(...args) {
	if (game.modules.get('_dev-mode')?.api?.getPackageDebugValue(MODULE_NAME)) {
	    console.log(MODULE_NAME, '|', ...args);
	}
    }

    static error(...args) {
	console.log(MODULE_NAME, '|', ...args);
    }
}
