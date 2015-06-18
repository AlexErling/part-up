Template.ReactiveTile.onRendered(function() {
    var template = this;
    if (typeof this.data.onTileRender === 'function') {
        this.data.onTileRender();
    }
    $(template.find('li.pu-reactivetile')).addClass('pu-reactivetile-rendered');
});
Template.ReactiveTile.helpers({
    templateName: function() {
        return Template.instance().data.templateName;
    },
    templateData: function() {
        return Template.instance().data.templateData;
    }
});
