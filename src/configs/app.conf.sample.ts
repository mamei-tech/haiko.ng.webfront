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
    app: {
        scale: number                                   // integer conversion scale used in the backend e.g 100 | ❗ Has to be synced with scale number using in the backend
    }
}

function getConfig(): IConfig {
    return {
        server: {
            name:            'Haiko',
            current_version: 1,
            api:             'http://localhost:7000/',
            statics:         'http://localhost:7000/statics/'
        },
        auth:   {
            grand_type: 'password'
        },
        app: {
            scale: 100
        }
    }
}

const config = getConfig()
export default config
