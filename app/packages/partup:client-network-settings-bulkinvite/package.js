Package.describe({
    name: 'partup:client-network-settings-bulkinvite',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'tap:i18n',
        'partup:lib',
        'meteorhacks:subs-manager'
    ], ['client', 'server']);

    api.use([
        'templating',
        'aldeed:autoform'
    ], 'client');

    api.addFiles([
        'package-tap.i18n',

        'NetworkSettingsBulkinvite.html',
        'NetworkSettingsBulkinvite.js',

        '../../i18n/phraseapp.en.i18n.json',
        '../../i18n/phraseapp.nl.i18n.json'
    ], 'client');

    api.addFiles([
        'package-tap.i18n',
        '../../i18n/phraseapp.en.i18n.json',
        '../../i18n/phraseapp.nl.i18n.json'
    ], 'server');
});
