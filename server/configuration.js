export const setEnvironment = () => {
    const productionGraphqlEndpoint = 'https://tray.io/graphql';
    const stagingGraphqlEndpoint = 'https://staging.tray.io/graphql';

    const appUrlStaging = 'https://app.staging.tray.io';
    const appUrlProd = 'https://app.tray.io';

    switch (process.env.TRAY_ENDPOINT) {
        case 'stg':
        case 'staging':
            console.log(`ENDPOINT passed as Staging`);
            process.env.TRAY_ENDPOINT = stagingGraphqlEndpoint;
            process.env.TRAY_APP_URL = appUrlStaging;
            break;
        case 'prod':
        case 'production':
            console.log(`ENDPOINT passed as Production`);
            process.env.TRAY_ENDPOINT = productionGraphqlEndpoint;
            process.env.TRAY_APP_URL = appUrlProd;
            break;
        default:
            console.log(`No valid ENDPOINT was passed. Defaulting to Prod ${productionGraphqlEndpoint}`);
            process.env.TRAY_ENDPOINT = productionGraphqlEndpoint;
            process.env.TRAY_APP_URL = appUrlProd;
            break;
    }

    //Make sure user has passed all required ENV variables before we start server
    if (!process.env.TRAY_MASTER_TOKEN || !process.env.TRAY_PARTNER) {
        console.error('\x1b[35m',
            `\nOne or both of following required env parameters are missing:
            TRAY_MASTER_TOKEN (Partner Master Key)
            TRAY_PARTNER (Partner NAME)
            Make sure they are defined as env variables and start API again.
            NOTE: Make sure the names use the TRAY_ prefix e.g. TRAY_MASTER_TOKEN as opposed to MASTER_TOKEN\n`
        );
        process.exit(-1);
    }

}
