Template.FeaturedNetworks.onCreated(function() {
    var tpl = this;
    tpl.selectedSlug = new ReactiveVar('');
    Meteor.autorun(function() {
        var language = Partup.client.language.current.get();
        if (!language) return;

        tpl.featuredSubscription = tpl.subscribe('networks.featured_all', language, {
            onReady: function() {
                var network = Networks.findFeatured(language).fetch().pop();
                if (!network) return;

                tpl.selectedSlug.set(networks.slug);
            }
        });
    });
});

Template.FeaturedNetworks.helpers({
    networks: function() {
        var language = Partup.client.language.current.get();
        return Networks.findFeatured(language);
    },
    selectedNetwork: function() {
        var slug = Template.instance().selectedSlug.get();
        return Networks.findOne({slug: slug});
    },
    networkFeaturedByUser: function() {
        if (!this.featured) return;

        return Meteor.users.findOne(this.featured.by_upper._id);
    },
});

Template.FeaturedNetworks.events({
    'click [data-select]': function(event, template) {
        var slug = $(event.currentTarget).data('select');
        template.selectedSlug.set(slug);
    }
});