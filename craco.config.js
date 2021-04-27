const CracoLessPlugin = require('craco-less');

module.exports = {
    plugins: [
        {
            plugin: CracoLessPlugin,
            options: {
                lessLoaderOptions: {
                    lessOptions: {
                        modifyVars: {'@primary-color': '#1eb6a7', dark: true},
                        javascriptEnabled: true,
                    },
                },
            },
        },
    ],
};
