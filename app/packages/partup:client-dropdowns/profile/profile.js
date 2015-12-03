Template.DropdownProfile.onCreated(function() {
    var template = this;
    template.windowHeight = new ReactiveVar($(window).height());
    template.resizeHandler = function(e) {
        var windowHeight = $(window).height();
        template.windowHeight.set(windowHeight);
    };
    $(window).on('resize', template.resizeHandler);
    template.currentNetwork = new ReactiveVar();
    template.disableUp = new ReactiveVar(true);
    template.disableDown = new ReactiveVar(false);

    template.dropdownOpen = new ReactiveVar();

    var userId = Meteor.userId();

    if (typeof userId == 'string') {
        this.subscribe('users.one.upperpartups', {id: userId});
        this.subscribe('users.one.supporterpartups', {id: userId});
    }
    var oldJoinedNetworks;
    template.autorun(function() {
        var joinedNetworks = Meteor.user().networks || false;
        if (!joinedNetworks) return;

        Tracker.nonreactive(function() {
            if (joinedNetworks !== oldJoinedNetworks) {
                template.currentNetwork.set(undefined);
                oldJoinedNetworks = joinedNetworks;
            }
        });

    });

});

Template.DropdownProfile.onRendered(function() {
    var template = this;
    ClientDropdowns.addOutsideDropdownClickHandler(template, '[data-clickoutside-close]', '[data-toggle-menu=profile]');
    Router.onBeforeAction(function(req, res, next) {
        template.dropdownOpen.set(false);
        next();
    });
});

Template.DropdownProfile.onDestroyed(function() {
    var template = this;
    $(window).off('resize', template.resizeHandler);
    ClientDropdowns.removeOutsideDropdownClickHandler(template);
});

Template.DropdownProfile.events({
    'click [data-toggle-menu]': ClientDropdowns.dropdownClickHandler,
    'click [data-logout]': function eventClickLogout (event, template) {
        event.preventDefault();
        Meteor.logout();
    },
    'click [data-select-network]': function changeNetwork (event, template) {
        event.preventDefault();
        var networkId = $(event.currentTarget).data('select-network') || undefined;
        template.currentNetwork.set(networkId);
    },
    'click [data-settings]': function openSettings (event, template) {
        event.preventDefault();
        Intent.go({route: 'profile-settings', params:{_id: Meteor.userId()}});
    },
    'click [data-down]': function(event, template) {
        event.preventDefault();
        var list = $(template.find('[data-list]'));
        list.scrollTop(list.scrollTop() + 200);
        template.disableUp.set(false);
        if (list[0].scrollHeight - list.height() === list.scrollTop()) {
            template.disableDown.set(true);
        }
    },
    'click [data-up]': function(event, template) {
        event.preventDefault();
        var list = $(template.find('[data-list]'));
        list.scrollTop(list.scrollTop() - 200);
        template.disableDown.set(false);
        if (list.scrollTop() === 0) {
            template.disableUp.set(true);
        }
    }
});

Template.DropdownProfile.helpers({
    notifications: function() {
        return Notifications.findForUser(Meteor.user());
    },

    menuOpen: function() {
        return Template.instance().dropdownOpen.get();
    },

    upperPartups: function() {
        var networkId = Template.instance().currentNetwork.get() || undefined;
        var user = Meteor.user();
        if (!user) return [];
        var partups =  Partups.findUpperPartupsForUser(user, {
            network_id: networkId
        }).fetch();

        var sortedPartups = lodash.sortByOrder(partups, function(partup) {
            var upper_data = lodash.find(partup.upper_data, '_id', user._id);
            if (upper_data && upper_data.new_updates) {
                return upper_data.new_updates.length;
            } else {
                return 0;
            }
        }, ['desc']);

        return sortedPartups;
    },

    supporterPartups: function() {
        var networkId = Template.instance().currentNetwork.get() || undefined;
        var user = Meteor.user();
        if (!user) return [];

        var partups = Partups.findSupporterPartupsForUser(user, {
            network_id: networkId
        }).fetch();

        var sortedPartups = lodash.sortByOrder(partups, function(partup) {
            var upper_data = lodash.find(partup.upper_data, '_id', user._id);
            if (upper_data && upper_data.new_updates) {
                return upper_data.new_updates.length;
            } else {
                return 0;
            }
        }, ['desc']);

        return sortedPartups;
    },

    newUpdates: function() {
        if (!this.upper_data) return;

        var count = null;
        this.upper_data.forEach(function(upperData) {
            if (upperData._id === Meteor.userId()) {
                count = upperData.new_updates.length;
            }
        });
        return count;
    },

    user: function() {
        return Meteor.user();
    },

    networkId: function() {
        return Template.instance().currentNetwork.get();
    },

    networks: function() {
        var user = Meteor.user();
        if (!user) return [];

        return Networks.findForUser(user);
    },

    maxTabs: function() {
        var number = 8;
        var windowHeight = Template.instance().windowHeight.get();
        if (windowHeight < 610) {
            number = 5;
        }
        return number;
    },

    selectedNetwork: function() {
        var networkId = Template.instance().currentNetwork.get();
        var network = Networks.findOne({_id: networkId});
        return network;
    },
    disableUp: function() {
        return Template.instance().disableUp.get();
    },
    disableDown: function() {
        return Template.instance().disableDown.get();
    }
});
