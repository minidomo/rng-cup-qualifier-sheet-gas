function onOpen(e: GoogleAppsScript.Events.SheetsOnOpen) {
    const { UI } = Constants;
    UI.createMenu('Qualifiers')
        .addItem('Authorize scripts', 'Authorization.authorize')
        .addSubMenu(
            UI.createMenu('API Key')
                .addItem('Add API key', 'OsuApiKeyManager.showKeyStoringPrompt')
                .addItem('Remove API key', 'OsuApiKeyManager.removeKeyStoringPrompt'),
        )
        // .addSubMenu(
        //     UI.createMenu('Create group').addItem('Tier 1', 'createGroupTier1').addItem('Tier 2', 'createGroupTier2'),
        // )
        // .addSubMenu(
        //     UI.createMenu('User data')
        //         .addItem('Retrieve by user id', 'retrieveAllUserDataByUserId')
        //         .addItem('Retrieve by username', 'retrieveAllUserDataByUsername')
        //         .addItem('Calculate user stats', 'calculateUserStats'),
        // )
        // .addSubMenu(UI.createMenu('Evaluation')
        //     .addItem('Tier 1', 'evaluateTier1')
        //     .addItem('Tier 2', 'evaluateTier2')
        // )
        // .addItem('Generate teams', 'createTeams')
        .addItem('Extract all match data', 'MatchDataExtraction.extract')
        .addItem('Debug', 'Debug.test')
        .addToUi();
}
