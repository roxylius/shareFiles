const config = {
    screens: {
        signup: {
            path: 'signup/:params',
            parse: {
                name: params => `${params}`,
            },
        },
        home: {
            path: 'home/:params',
            parse: {
                name: params => `${params}`,
            },
        }
    }
};

const linking = {
    prefixes: ['com.roxylius.fileshare://expo-development-client'],
    config,
};

export default linking;