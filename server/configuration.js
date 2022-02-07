export const setEnvironment = () => {
    const productionGraphqlEndpoint = 'https://tray.io/graphql';
    const productionEuGraphqlEndpoint = "https://eu1.tray.io/graphql";
    const productionApGraphqlEndpoint = "https://ap1.tray.io/graphql";
    const stagingGraphqlEndpoint = 'https://staging.tray.io/graphql';
    const frontendStagingGraphqlEndpoint = 'https://frontend-staging.tray.io/graphql';

    const appUrlProd = 'https://embedded.tray.io';
    const appEuUrlProd = "https://embedded.eu1.tray.io";
    const appApUrlProd = "https://embedded.ap1.tray.io";
    const appUrlStaging = 'https://embedded.staging.tray.io';
    const appUrlFrontendStaging = 'https://embedded.frontend-staging.tray.io';

    switch (process.env.TRAY_ENDPOINT) {
        case 'stg':
        case 'staging':
            console.log(`ENDPOINT passed as staging`);
            process.env.TRAY_ENDPOINT = stagingGraphqlEndpoint;
            process.env.TRAY_APP_URL = appUrlStaging;
            break;
        case 'prod':
        case 'production':
            console.log(`ENDPOINT passed as production`);
            process.env.TRAY_ENDPOINT = productionGraphqlEndpoint;
            process.env.TRAY_APP_URL = appUrlProd;
            break;
        case 'eu1-prod':
        case 'eu1-production':
            process.env.TRAY_ENDPOINT = productionEuGraphqlEndpoint;
            process.env.TRAY_APP_URL = appEuUrlProd;
            break;
        case 'ap1-prod':
        case 'ap1-production':
            process.env.TRAY_ENDPOINT = productionApGraphqlEndpoint;
            process.env.TRAY_APP_URL = appApUrlProd;
            break;
        case 'fe-stg':
        case 'frontend-staging':
            console.log(`ENDPOINT passed as frontend-staging`);
            process.env.TRAY_ENDPOINT = frontendStagingGraphqlEndpoint;
            process.env.TRAY_APP_URL = appUrlFrontendStaging;
            break;
        default:
            console.log(`No valid ENDPOINT was passed. Defaulting to production ${productionGraphqlEndpoint}`);
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
