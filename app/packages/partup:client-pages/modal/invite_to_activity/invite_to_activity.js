Template.modal_invite_to_activity.onCreated(function() {
    var template = this;
    var partupId = template.data.partupId;
    var activityId = template.data.activityId;

    template.userIds = new ReactiveVar([]);

    template.states = {
        loading_infinite_scroll: false,
        paging_end_reached: new ReactiveVar(false)
    };
    var PAGING_INCREMENT = 10;
    template.searchQuery = new ReactiveVar(undefined, function(prevQuery, query) {
        if (prevQuery !== query) {
            template.userIds.set([]);
            template.states.paging_end_reached.set(false);
            template.states.loading_infinite_scroll = false;
            _.defer(function() { template.page.set(0); });
        }
    });

    template.subscribe('partups.one', partupId);
    template.subscribe('activities.from_partup', partupId);
    // Submit filter form
    template.submitFilterForm = function() {
        Meteor.defer(function() {
            var form = template.find('form#suggestionsQuery');
            $(form).submit();
        });
    };

    template.page = new ReactiveVar(false, function(previousPage, page) {
        var query = template.searchQuery.get() || '';
        var options = {
            query: query,
            limit: PAGING_INCREMENT,
            skip: page * PAGING_INCREMENT
        };

        // this meteor call still needs to be created
        Meteor.call('activities.user_suggestions', activityId, options, function(error, userIds) {
            if (error) {
                return Partup.client.notify.error(TAPi18n.__('base-errors-' + error.reason));
            }
            if (!userIds || userIds.length === 0) {
                template.states.loading_infinite_scroll = false;
                template.states.paging_end_reached.set(true);
                return;
            }

            template.states.paging_end_reached.set(userIds.length < PAGING_INCREMENT);

            var existingUserIds = template.userIds.get();
            var newUserIds = existingUserIds.concat(userIds);
            template.userIds.set(newUserIds);

            template.states.loading_infinite_scroll = false;
        });
    });
    template.page.set(0);
});

Template.modal_invite_to_activity.helpers({
    data: function() {
        var template = Template.instance();
        return {
            suggestionIds: function() {
                return template.userIds.get();
            },
            textsearch: function() {
                return template.searchQuery.get() || '';
            },
            partupId: function() {
                return template.data.partupId;
            },
            activityId: function() {
                return template.data.activityId;
            }
        };
    },
    state: function() {
        var template = Template.instance();
        return {
            loading: function() {
                return template.loading.get();
            }
        };
    }
});

/*************************************************************/
/* Page events */
/*************************************************************/
Template.modal_invite_to_activity.events({
    'click [data-closepage]': function(event, template) {
        event.preventDefault();
        var partupId = template.data.partupId;
        var partup = Partups.findOne({_id: partupId});

        Intent.return('partup-activity-invite', {
            fallback_route: {
                name: 'partup',
                params: {
                    slug: partup.slug
                }
            }
        });
    },
    'submit form#suggestionsQuery': function(event, template) {
        event.preventDefault();
        var form = event.currentTarget;
        template.searchQuery.set(form.elements.search_query.value);
    },
    'click [data-reset-search-query-input]': function(event, template) {
        event.preventDefault();
        $('[data-search-query-input]').val('');
        template.submitFilterForm();
    },

    'keyup [data-search-query-input]': function(e, template) {
        template.submitFilterForm();
    }
});
