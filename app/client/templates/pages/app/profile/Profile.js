/*************************************************************/
/* Page helpers */
/*************************************************************/
Template.PagesProfile.helpers({
    profileId: function(){
        return Router.current().params._id;
    }
});


/*************************************************************/
/* Page events */
/*************************************************************/
Template.PagesProfile.events({
    //
});