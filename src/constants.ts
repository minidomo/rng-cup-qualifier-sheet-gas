namespace Constants {
    export const SS = SpreadsheetApp.getActiveSpreadsheet();
    export const UI = SpreadsheetApp.getUi();
    export const CACHE = CacheService.getDocumentCache();
    export const PROPERTIES = PropertiesService.getScriptProperties();

    export namespace Sheets {
        export const API_EXTRACTION_SHEET = SS.getSheetByName('API Extraction');
    }
}
