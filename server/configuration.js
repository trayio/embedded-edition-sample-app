export const setEnvironment = () => {
    const productionGraphqlEndpoint = 'https://tray.io/graphql';
    const stagingGraphqlEndpoint = 'https://staging.tray.io/graphql';

    const appUrlStaging = 'https://app-staging.tray.io';
    const appUrlProd = 'https://app.tray.io';

    switch (process.env.ENDPOINT) {
        case undefined:
            console.log(`ENDPOINT was not passed. Defaulting to Prod ${productionGraphqlEndpoint}`);
            process.env.ENDPOINT = productionGraphqlEndpoint;
            process.env.APP_URL = productionGraphqlEndpoint;
            break;
        case 'stg':
            console.log(`ENDPOINT passed as Staging`);
            process.env.ENDPOINT = stagingGraphqlEndpoint
            process.env.APP_URL = appUrlStaging;
            break;
        case 'staging':
            console.log(`ENDPOINT passed as Staging`);
            process.env.ENDPOINT = stagingGraphqlEndpoint
            process.env.APP_URL = appUrlStaging;
            break;
        case 'prod':
            console.log(`ENDPOINT passed as Production`);
            process.env.ENDPOINT = productionGraphqlEndpoint
            process.env.APP_URL = appUrlProd;
            break;
        case 'production':
            console.log(`ENDPOINT passed as Production`);
            process.env.ENDPOINT = productionGraphqlEndpoint
            process.env.APP_URL = appUrlProd;
            break;
        default:
            throw new Error(`The defined values for Graphql ${process.env.ENDPOINT} is not a valid URL alias (use 'stg' or 'prod')`);
            break;
    }

}
