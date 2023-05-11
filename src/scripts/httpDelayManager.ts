namespace HttpDelayManager {
    const { PROPERTIES, UI } = Constants;

    export function showPrompt() {
        const result = UI.prompt('Enter the delay (ms) before making an HTTP request', UI.ButtonSet.OK_CANCEL);

        if (result.getSelectedButton() === UI.Button.OK) {
            const value = result.getResponseText().trim();
            if (isValidNumber(value)) {
                PROPERTIES.setProperty('httpDelay', value);
                UI.alert(`HTTP delay was set to ${value} ms`);
            }
        } else {
            const delay = getHttpDelay();
            UI.alert(`HTTP delay is currently ${delay} ms`);
        }
    }

    export function getHttpDelay() {
        const val = PROPERTIES.getProperty('httpDelay');

        if (val) {
            return parseInt(val);
        }

        return 500;
    }

    function isValidNumber(value: string) {
        return /^\d+$/.test(value);
    }
}
