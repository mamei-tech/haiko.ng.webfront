// file that acts like template for adapting the app to the running environment

interface IConfig {
    server: {
        name: string;                                   // name of the web app
        current_version: number;                        // version of the web app
        api: string;                                    // base url of the REST API
        statics: string;                                // base url for the statics files
    };
    auth: {
        grand_type: string;                             // authentication grants type | Oauth2 flow
    };
}

function getConfig (): IConfig {
    return {
        server: {
            name: 'Un2x3',
            current_version: 1,
            api: 'http://localhost:7000/',
            statics: 'http://localhost:7000/statics/'
        },
        auth: {
            grand_type: 'password',                         // Oauth2 flow
        },
    };
}

const config = getConfig();
export default config;
