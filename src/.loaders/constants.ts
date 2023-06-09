// https://developers.google.com/apps-script/reference

namespace Constants {
    export const SS = SpreadsheetApp.getActiveSpreadsheet();
    export const UI = SpreadsheetApp.getUi();
    export const CACHE = CacheService.getDocumentCache();
    export const PROPERTIES = PropertiesService.getScriptProperties();

    export namespace Sheets {
        export const API_EXTRACTION_SHEET = Constants.SS.getSheetByName('API Extraction');
        export const USERS_SHEET = Constants.SS.getSheetByName('Users');
        export const EVALUATIONS_TEMPLATE_SHEET = Constants.SS.getSheetByName('Evaluations - Template');
        export const TEAMS_SHEET = Constants.SS.getSheetByName('Teams');
        export const GROUP_EVALUATION_TEMPLATE_SHEET = Constants.SS.getSheetByName('Group Evaluation - Template');
    }
}
