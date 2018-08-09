export const setEnvironment = () => {
    const productionGraphqlEndpoint = 'https://tray.io/graphql';
    const stagingGraphqlEndpoint = 'https://staging.tray.io/graphql';

    const appUrlStaging = 'https://app-staging.tray.io';
    const appUrlProd = 'https://app.tray.io';

    switch (process.env.ENDPOINT) {
        case 'stg':
        case 'staging':
            console.log(`ENDPOINT passed as Staging`);
            process.env.ENDPOINT = stagingGraphqlEndpoint;
            process.env.APP_URL = appUrlStaging;
            break;
        case 'prod':
        case 'production':
            console.log(`ENDPOINT passed as Production`);
            process.env.ENDPOINT = productionGraphqlEndpoint;
            process.env.APP_URL = appUrlProd;
            break;
        default:
            console.log(`No valid ENDPOINT was passed. Defaulting to Prod ${productionGraphqlEndpoint}`);
            process.env.ENDPOINT = productionGraphqlEndpoint;
            process.env.APP_URL = appUrlProd;
            break;
    }
}
