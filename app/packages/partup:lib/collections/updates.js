/**
 * Partup model
 * @ignore
 */
var Update = function(document) {
    _.extend(this, document);
};

/**
 * Check if given updates last comment is system message
 *
 * @return {Boolean}
 */
Update.prototype.lastCommentIsSystemMessage = function() {
    if (!this.comments) return false;
    if (this.comments.length < 1) return false;
    return !!mout.array.last(this.comments).system;
};

/**
 * Get the last comment
 *
 * @return {Object}
 */
Update.prototype.getLastComment = function() {
    if (!this.comments) return false;
    if (this.comments.length < 1) return false;
    return mout.array.last(this.comments);
};

/**
 * Check if update is related to an activity
 *
 * @return {Boolean}
 */
Update.prototype.isActivityUpdate = function() {
    return /^partups_activities/.test(this.type) || (
        this.type === 'partups_comments_added' &&
        !this.type_data.contribution_id
    );
};

/**
 * Check if update is related to a contribution
 *
 * @return {Boolean}
 */
Update.prototype.isContributionUpdate = function() {
    return /^partups_(contributions|ratings)/.test(this.type) || (
        this.type === 'partups_comments_added' &&
        this.type_data.contribution_id
    );
};

/**
 * @namespace Updates
 * @memberOf Collection
 */
Updates = new Mongo.Collection('updates', {
    transform: function(document) {
        return new Update(document);
    }
});

/**
 * Find updates for an activity
 *
 * @memberOf Updates
 * @param {Activity} activity
 * @return {Mongo.Cursor}
 */
Updates.findForActivity = function(activity) {
    return Updates.find({_id: activity.update_id}, {limit: 1});
};

/**
 * Find updates for partup
 *
 * @memberOf Updates
 * @param {Partup} partup
 * @param {Object} options
 * @param {Number} options.limit
 * @param {String} options.filter
 * @return {Mongo.Cursor}
 */
Updates.findForPartup = function(partup, options) {
    var self = this;

    if (!partup) return;

    var options = options || {};
    var limit = options.limit || 10;
    var filter = options.filter || 'default';

    var selector = {partup_id: partup._id};

    if (filter === 'my-updates') {
        selector.upper_id = self.userId;
    } else if (filter === 'activities') {
        selector.type = {$regex: '.*activities.*'};
    } else if (filter === 'partup-changes') {
        var regex = '.*(tags|end_date|name|description|image|budget).*';
        selector.type = {$regex: regex};
    } else if (filter === 'messages') {
        selector.type = {$regex: '.*message.*'};
    } else if (filter === 'contributions') {
        selector.type = {$regex: '.*contributions.*'};
    }

    return this.find(selector, {limit: limit, sort: {updated_at: -1}});
};
