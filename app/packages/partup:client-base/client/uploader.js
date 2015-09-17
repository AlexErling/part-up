// Settings
//
var MAX_IMAGE_WIDTH = 1500;
var MAX_IMAGE_HEIGHT = 1500;

Partup.client.uploader = {

    /**
     * Upload single image
     *
     * @memberOf Partup.client
     * @param {Object} file
     * @param {Function} callback
     */
    uploadImage: function(file, callback) {
        var img = document.createElement('img');
        var canvas = document.createElement('canvas');

        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = function(e) {
            img.src = e.target.result;
        };

        img.onload = function() {
            var width = img.naturalWidth;
            var height = img.naturalHeight;

            if (width > height) {
                if (width > MAX_IMAGE_WIDTH) {
                    height *= MAX_IMAGE_WIDTH / width;
                    width = MAX_IMAGE_WIDTH;
                }
            } else {
                if (height > MAX_IMAGE_HEIGHT) {
                    width *= MAX_IMAGE_HEIGHT / height;
                    height = MAX_IMAGE_HEIGHT;
                }
            }

            canvas.width = width;
            canvas.height = height;

            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, width, height);

            var dataUrl;
            if (img.src.indexOf('image/png') > -1) {
                dataUrl = canvas.toDataURL('image/png');
            } else {
                dataUrl = canvas.toDataURL('image/jpeg', 0.9);
            }

            Meteor.call('images.insertByDataUrl', dataUrl, function(error, dbImage) {
                if (error) return callback(error);
                Meteor.subscribe('images.one', dbImage._id);
                Meteor.autorun(function(computation) {
                    var image = Images.findOne({_id: dbImage._id});
                    if (image && image.isUploaded() && image.url()) {
                        computation.stop();
                        Tracker.nonreactive(function() {
                            callback(null, image);
                        });
                    }
                });
            });
        };
    },

    /**
     * Upload single image by url
     *
     * @memberOf Partup.client
     * @param {String} url
     * @param {Function} callback
     */
    uploadImageByUrl: function(url, callback) {
        Meteor.call('images.insertByUrl', url, function(error, output) {
            if (error || !output) return callback(error);

            Meteor.subscribe('images.one', output._id, function() {
                Meteor.autorun(function(computation) {
                    var image = Images.findOne({_id: output._id});
                    if (!image) return;
                    if (!image.isUploaded()) return;
                    if (!image.url()) return;
                    computation.stop();
                    Tracker.nonreactive(function() {
                        callback(null, image);
                    });
                });
            });
        });
    }

};
