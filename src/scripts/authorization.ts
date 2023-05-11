namespace Authorization {
    const { UI } = Constants;

    // The first time you run a menu function it doesn't actually execute the body
    // after authorizing your Google account, you have to run it again to get the intended effect
    // Many people get confused by this so I made this function
    export function authorize() {
        // Assuming this is the very first menu function you ever run on this
        // sheet, you'll have to authorize and the body isn't executed
        // Otherwise, the body *is* going to be run and tell you you're alraedy authorized
        UI.alert("You're already authorized");
    }
}
