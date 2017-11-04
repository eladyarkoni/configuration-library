const library = require('../index');

function init() {
    // make the app crash if there is unhandled rejection within promise 
    process.on('unhandledRejection', up => { throw up });

    library.init({ key: "12323454" }).then(() => {
        const isFeatureActivated = library.get("featureThatCauseCrash");
        if (isFeatureActivated) {
            // cause a crash
            undefinedFunction();
        }
    });
}

init();