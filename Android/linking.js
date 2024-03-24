const config = {
    screens: {
        signup: {
            path: 'signup/:params',
            parse: {
                name: params => `${params}`,
            },
        },
        // Add more screens here if needed
    },
};

const linking = {
    prefixes: ['com.roxylius.fileshare://expo-development-client'],
    config,
};

export default linking;