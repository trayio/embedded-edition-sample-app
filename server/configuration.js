export const setEnvironment = () => {
    const productionGraphqlEndpoint = 'https://tray.io/graphql';
    const stagingGraphqlEndpoint = 'https://staging.tray.io/graphql';

    switch (process.env.ENDPOINT) {
        case undefined:
            console.log(`ENDPOINT was not passed. Defaulting to Prod ${productionGraphqlEndpoint}`);
            process.env.ENDPOINT = productionGraphqlEndpoint;
            break;
        case 'stg':
            console.log(`ENDPOINT passed as Staging`);
            process.env.ENDPOINT = stagingGraphqlEndpoint
            break;
        case 'staging':
            console.log(`ENDPOINT passed as Staging`);
            process.env.ENDPOINT = stagingGraphqlEndpoint
            break;
        case 'prod':
            console.log(`ENDPOINT passed as Production`);
            process.env.ENDPOINT = productionGraphqlEndpoint
            break;
        case 'production':
            console.log(`ENDPOINT passed as Production`);
            process.env.ENDPOINT = productionGraphqlEndpoint
            break;
        default:
            if (isValidUrl(process.env.ENDPOINT)) {
                console.log(`Using custom Graphql endpoint ${process.env.ENDPOINT}`)
            }
            else {
                throw new Error(`The defined values for Graphql ${process.env.ENDPOINT} is not a valid URL or alias.`);
            }
            break;
    }

}

const isValidUrl = url => {
    var urlRegex = /[-a-zA-Z0-9@:%_\+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_\+.~#?&//=]*)?/gi;
    var regex = new RegExp(urlRegex);
    return url.match(regex);
}

