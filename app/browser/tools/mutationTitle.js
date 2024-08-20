let config;

class MutationObserverTitle {

	init(newConfig) {
		config = newConfig;
		if (config.useMutationTitleLogic) {
			console.debug('MutationObserverTitle enabled');
			window.addEventListener('DOMContentLoaded', this._applyMutationToTitleLogic);
		}
	}

	_applyMutationToTitleLogic() {
		console.debug('Appliying MutationObserverTitle logic');
		const observer = new window.MutationObserver(
			() => {
				observer.disconnect();
				console.debug(`detected title changed to ${window.document.title}`);
				if (config.appTitle != 'Microsoft Teams') {
					console.debug(`adding config.appTitle ${config.appTitle} to title`);
					window.document.title = window.document.title.replace(/Microsoft Teams/i, config.appTitle);
				}
				const regex = /^\((\d+)\)/;
				const match = regex.exec(window.document.title);
				const number = match ? match[1] : 0;
				const event = new CustomEvent('unread-count', { detail: { number: number } });
				window.dispatchEvent(event);
				observer.observe(window.document.querySelector('title'),{ childList: true });
			}
		);
		observer.observe(window.document.querySelector('title'),{ childList: true });
		console.debug('MutationObserverTitle logic applied');
	}
}

exports = module.exports = new MutationObserverTitle();