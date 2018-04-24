Template.modal_profile_settings_advanced.onCreated(function() {
    this.submitting = new ReactiveVar(false);
});

Template.modal_profile_settings_advanced.helpers({
	submitting: function() {
        return Template.instance().submitting.get();
    }
});
/*************************************************************/
/* Page events */
/*************************************************************/
Template.modal_profile_settings_advanced.events({
    'click [data-delete-account]': function(event, template) {
    	console.log("deleting")
    	template.submitting.set(true);

        Partup.client.prompt.confirm({
            title: TAPi18n.__('modal-profilesettings-advanced-delete-title'),
            message: TAPi18n.__('modal-profilesettings-advanced-delete-message'),
            confirmButton: TAPi18n.__('modal-profilesettings-advanced-delete-confirm-button'),
            cancelButton: TAPi18n.__('modal-profilesettings-advanced-delete-cancel-button'),
            onConfirm: function() {
                Meteor.call('users.delete', function(error) {
                    if (error) {
                        Partup.client.notify.error(error.reason);
                        return;
                    }    
                });
            }
        });
    	template.submitting.set(false);
    }
});
