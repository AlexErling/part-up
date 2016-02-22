Package.describe({
    name: 'partup:client-selectors',
    version: '0.0.1',
    summary: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use([
        'meteorhacks:subs-manager',
        'tap:i18n'
    ], ['client', 'server']);

    api.use([
        'templating',
        'partup:lib'
    ], 'client');

    api.addFiles([
        'package-tap.i18n',
        'BasicSelector.html',
        'BasicSelector.js',
        'NetworkSelector.html',
        'NetworkSelector.js',
        'LocationSelector.html',
        'LocationSelector.js',
        'LanguageSelector.html',
        'LanguageSelector.js',
        '../../i18n/phraseapp.en.i18n.json',
        '../../i18n/phraseapp.nl.i18n.json'
    ], 'client');

    api.addFiles([
        'package-tap.i18n',
        '../../i18n/phraseapp.en.i18n.json',
        '../../i18n/phraseapp.nl.i18n.json'
    ], 'server')
});
