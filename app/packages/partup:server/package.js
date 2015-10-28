Package.describe({
    name: 'partup:server',
    version: '0.0.1',
    summary: '',
    git: '',
    documentation: null
});

Package.onUse(function(api) {
    api.use('check');

    api.use([
        'accounts-base',
        'stevezhu:lodash',
        'email',
        'http',
        'iron:router',
        'mongo',
        'partup:lib',
        'percolate:synced-cron',
        'reywood:publish-composite',
        'service-configuration',
        'splendido:accounts-meld',
        'percolate:migrations',
        'tap:i18n',
        'lifely:mout',
        'meteorhacks:picker',
        'meteorhacks:ssr',
        'meteorhacks:fast-render',
        'dsyko:meteor-node-csv',
        'random',
        'peerlibrary:aws-sdk',
        'simple:rest',
        'simple:json-routes'
    ], ['server']);

    api.addFiles([
        'private/emails/header.en.html',
        'private/emails/header.nl.html',
        'private/emails/footer.en.html',
        'private/emails/footer.nl.html',
        'private/emails/reset_password.en.html',
        'private/emails/reset_password.nl.html',
        'private/emails/verify_account.en.html',
        'private/emails/verify_account.nl.html',
        'private/emails/invite_upper_to_partup.en.html',
        'private/emails/invite_upper_to_partup.nl.html',
        'private/emails/invite_upper_to_partup_activity.en.html',
        'private/emails/invite_upper_to_partup_activity.nl.html',
        'private/emails/invite_email_address_to_partup.en.html',
        'private/emails/invite_email_address_to_partup.nl.html',
        'private/emails/invite_email_address_to_partup_activity.en.html',
        'private/emails/invite_email_address_to_partup_activity.nl.html',
        'private/emails/invite_upper_to_network.en.html',
        'private/emails/invite_upper_to_network.nl.html',
        'private/emails/invite_email_address_to_network.en.html',
        'private/emails/invite_email_address_to_network.nl.html',
        'private/emails/dailydigest.en.html',
        'private/emails/dailydigest.nl.html',
        'private/emails/custom.en.html',
        'private/emails/custom.nl.html',
        'private/emails/upper_mentioned_in_partup.en.html',
        'private/emails/upper_mentioned_in_partup.nl.html',
        'private/emails/partup_created_in_network.en.html',
        'private/emails/partup_created_in_network.nl.html',
        'private/emails/partups_networks_new_pending_upper.en.html',
        'private/emails/partups_networks_new_pending_upper.nl.html',
        'private/emails/partups_networks_accepted.en.html',
        'private/emails/partups_networks_accepted.nl.html',
        'private/templates/seo/partup.html',
        'private/templates/seo/profile.html',
        'private/templates/seo/network.html',
        'private/templates/seo/home.html'
    ], ['server'], {isAsset: true});

    api.addFiles([
        'logger.js',
        'namespace.js',
        'constants.js',
        'bootstrap.js',
        'compile_email_templates.js',
        'accounts.js',
        'accounts_email_configuration.js',
        'helpers/collection.js',
        'event.js',
        'collection_hooks.js',
        'factories/updates_factory.js',
        'services/cache_service.js',
        'services/notifications_service.js',
        'services/system_messages_service.js',
        'services/email_service.js',
        'services/images_service.js',
        'services/google_service.js',
        'services/matching_service.js',
        'services/slugify_service.js',
        'services/participation_calculator_service.js',
        'services/partup_progress_calculator_service.js',
        'services/shared_count_service.js',
        'services/language_service.js',
        'services/locale_service.js',
        'services/meurs_service.js',
        'seo/routes.js',
        'fast-render_routes.js',
        'event_handlers/any_handler.js',
        'event_handlers/partups/partups_handler.js',
        'event_handlers/partups/partups_supporters_handler.js',
        'event_handlers/partups/partups_uppers_handler.js',
        'event_handlers/partups/partups_invited_handler.js',
        'event_handlers/partups/partups_name_changed_handler.js',
        'event_handlers/partups/partups_description_changed_handler.js',
        'event_handlers/partups/partups_budget_changed_handler.js',
        'event_handlers/partups/partups_location_changed_handler.js',
        'event_handlers/partups/partups_tags_changed_handler.js',
        'event_handlers/partups/partups_end_date_changed_handler.js',
        'event_handlers/partups/partups_image_changed_handler.js',
        'event_handlers/partups/partups_language_handler.js',
        'event_handlers/users/users_settings_handler.js',
        'event_handlers/activities/activities_handler.js',
        'event_handlers/contributions/contributions_handler.js',
        'event_handlers/ratings/ratings_handler.js',
        'event_handlers/updates/updates_handler.js',
        'event_handlers/updates/updates_comments_handler.js',
        'event_handlers/updates/updates_messages_handler.js',
        'event_handlers/networks/networks_handler.js',
        'event_handlers/invites/activities_invites_handler.js',
        'event_handlers/invites/networks_invites_handler.js',
        'fixtures/users.js',
        'fixtures/partups.js',
        'fixtures/updates.js',
        'fixtures/activities.js',
        'fixtures/contributions.js',
        'fixtures/ratings.js',
        'fixtures/tags.js',
        'fixtures/notifications.js',
        'fixtures/networks.js',
        'fixtures/invites.js',
        'fixtures/images.js',
        'publications/activities.js',
        'publications/partups.js',
        'publications/images.js',
        'publications/updates.js',
        'publications/users.js',
        'publications/networks.js',
        'publications/languages.js',
        'routes/hooks.js',
        'routes/middleware.js',
        'routes/csv/csv_routes.js',
        'routes/images/images_routes.js',
        'routes/partups/partups_routes.js',
        'methods/updates/updates_comments_methods.js',
        'methods/updates/updates_messages_methods.js',
        'methods/activities/activities_methods.js',
        'methods/contributions/contributions_methods.js',
        'methods/ratings/ratings_methods.js',
        'methods/partups/partups_methods.js',
        'methods/partups/partups_analytics_methods.js',
        'methods/partups/partups_supporters_methods.js',
        'methods/users/users_methods.js',
        'methods/users/tiles_methods.js',
        'methods/services/flickr_methods.js',
        'methods/services/splashbase_methods.js',
        'methods/services/google_methods.js',
        'methods/settings/settings_methods.js',
        'methods/images/images_methods.js',
        'methods/networks/networks_methods.js',
        'methods/tags/tags_methods.js',
        'methods/notifications/notifications_methods.js',
        'methods/uploads/uploads_methods.js',
        'cron/reset_clicks_per_hour.js',
        'cron/calculate_partup_participation_score_for_users.js',
        'cron/calculate_partup_progress_score_for_partups.js',
        'cron/send_ratings_reminder_notification.js',
        'cron/send_daily_digest_users.js',
        'cron/update_shared_count.js',
        'migrations.js',
        'package-tap.i18n'
    ], ['server']);

    api.addFiles([
        'methods/latencycompensation.js',
    ], ['client']);

    api.export('Log', ['server']);
});

Npm.depends({
    'busboy': '0.2.11',
    'colors': '1.0.3',
    'country-language': '0.1.7',
    'debug': '2.2.0',
    'deeper': '1.0.2',
    'eventemitter2': '0.4.14',
    'node-flickr': '0.0.3',
    'pluralize': '1.1.2',
    'slug': '0.9.1',
    'winston': '0.9.0',
    'gm': '1.20.0'
});
