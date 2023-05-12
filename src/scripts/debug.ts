namespace Debug {
    const { UI } = Constants;

    export function test() {
        const data = GroupData.getGroup('4');
        UI.alert(JSON.stringify(data, null, 4));
    }
}
