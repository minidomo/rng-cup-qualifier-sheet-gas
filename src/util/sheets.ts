namespace SheetsUtil {
    const { SS } = Constants;

    export function getAllSheetNames() {
        return SS.getSheets().map(e => e.getSheetName());
    }
}
