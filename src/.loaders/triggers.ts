function onOpen(e: GoogleAppsScript.Events.SheetsOnOpen) {
    const { UI } = Constants;
    UI.createMenu('Qualifiers')
        .addItem('Authorize scripts', 'Authorization.authorize')
        .addSubMenu(
            UI.createMenu('API Key')
                .addItem('Add API key', 'OsuApiKeyManager.showKeyStoringPrompt')
                .addItem('Remove API key', 'OsuApiKeyManager.removeKeyStoringPrompt'),
        )
        .addSubMenu(
            UI.createMenu('Create group').addItem('Tier 1', 'Group.createTier1').addItem('Tier 2', 'Group.createTier2'),
        )
        .addSubMenu(
            UI.createMenu('User data')
                .addItem('Retrieve by user id', 'User.retrieveAllUserDataByUserId')
                .addItem('Retrieve by username', 'User.retrieveAllUserDataByUsername')
                .addItem('Calculate user stats', 'User.calculateUserStats')
                .addItem('Remove duplicate users', 'User.removeDuplicateUsers'),
        )
        .addSubMenu(
            UI.createMenu('Evaluation')
                .addItem('Tier 1', 'Evaluation.evaluateTier1')
                .addItem('Tier 2', 'Evaluation.evaluateTier2'),
        )
        .addItem('Generate teams', 'Team.create')
        .addItem('Extract all match data', 'MatchDataExtraction.extract')
        .addItem('Set HTTP delay', 'HttpDelayManager.showPrompt')
        .addItem('Debug', 'Debug.test')
        .addToUi();
}
