define(function(require) {
	var Woodhouse = require('woodhouse');
	var videojs = require('videojs');

	var APP = require('../../constants');
	var Video = require('../../models/video');
	var Feel = require('../../models/feel');
	var Feels =require('../../collections/feel');

	require('videojs-youtube');

	var HEIGHT_PERCENT = 0.75;

	return Woodhouse.View.extend({
		initialize: function() {
			this.collection_clone = this.collection.clone();
			this.model = this.collection.first();
			this.paging = this.collection.paging;

			if(!this.model) {
				this.model = new Video();
			}

			this.updateFeels();

			this.model.set('playing', true);
			this.template.bind(this);

			this.bindWindowEvents();
			this.bindKeyboardEvents();
		},

		templateContext: function() {
			return _.extend(Woodhouse.View.prototype.templateContext.apply(this, arguments), {
				'height': this.videoHeight() 
			});
		},

		template: function(context) {
			return jade.render('video/player', context);
		},

		onRender: function() {
			setTimeout(function() {
				this.prepareVideo(function(video) {
					this.video = video;
					this.video.height(this.videoHeight());
					this.play();
					this.bindVideoEvents(video);
				}.bind(this));
			}.bind(this));
		},

		// Calls back with context of this.callback(video), where this is the view
		prepareVideo: function(callback) {
			var self;

			videojs(this.videoId(), 
				this.videoSetup()).ready(function() {
				if(callback) {
					callback.call(self, this);
				}
			});
		},
		
		videoId: function() {
			return 'video_' + this.model.id;
		},

		videoSetup: function() {
			var obj = {
				"src": this.model.get('url')
			};

			if(this.model.get('url') && this.model.get('url').indexOf('youtube') >= 0) {
				obj['techOrder'] = ['youtube'];
			}

			return obj;
		},
		
		play: function() {
			this.video.play();
			this.model.set('playing', true);
		},

		pause: function() {
			this.video.pause();
			this.model.set('playing', false);
		},

		toggle: function() {
			if(this.model.get('playing')) {
				this.pause();
			} else {
				this.play();
			}
		},

		next: function() {	
			if(this.collection_clone.length > 1) {
				this.collection_clone.shift();
				this.model = this.collection_clone.first();
				this.updateFeels();
				this.render();
			}
		},

		like: function() {
			this.model.set('like', 'liked');
			this.model.set('dislike', '');

			var feel = new Feel({
				'object_id': this.model.id,
				'type': 'video',
				'score': 1,
				'feeling': 'like'
			});

			feel.save({}, {
				success: function() {
					console.log("Success saving feelings");
				},
				error: function(e) {
					console.log("Error saving feelings");
				}
			});
		},

		dislike: function() {
			this.model.set('like', '');
			this.model.set('dislike', 'disliked');


			var feel = new Feel({
				'object_id': this.model.id,
				'type': 'video',
				'score': -1,
				'feeling': 'dislike'
			});

			feel.save({}, {
				success: function() {
					console.log("Success saving feelings");
				},
				error: function(e) {
					console.log("Error saving feelings");
				}
			});
		},

		save: function() {
			if(this.model.get('saved')) {
				this.model.set('saved', '');
			} else {
				this.model.set('saved', 'saved');
			}

			var feel = new Feel({
				'object_id': this.model.id,
				'type': 'video',
				'score': 0,
				'feeling': 'save'
			});

			feel.save({}, {
				success: function() {
					console.log("Success saving feelings");
				},
				error: function(e) {
					console.log("Error saving feelings");
				}
			});
		},

		updateFeels: function() {
			this.feels = new Feels();
			this.feels.object_id = this.model.id;

			this.feels.fetch({
				success: function(feels) {
					feels.each(function(feel) {
						if(feel.get('feeling') === 'like') {
							this.model.set('like', 'liked');
							this.model.set('dislike', '');
						}
						if(feel.get('feeling') === 'dislike') {
							this.model.set('like', '');
							this.model.set('dislike', 'disliked');
						}
						if(feel.get('feeling') === 'save') {
							this.model.set('saved', 'saved');
						}
					}.bind(this));
				}.bind(this)
			});
		},

		bindKeyboardEvents: function() {
			$('body').keydown(function(e) {
				if(e.which === 39) { // RIGHT ARROW
					this.next();
				}
				if(e.which === 32) {
					this.toggle();
				}
			}.bind(this));
		},

		bindVideoEvents: function(video) {
			var self = this;

			video.on('play', function() {
				self.model.set('playing', true);
			});

			video.on('pause', function() {
				self.model.set('playing', false);
			});

			video.on('ended', function() {
				self.next();
			});
		},

		videoHeight: function() {
			return $(window).height() * HEIGHT_PERCENT + "px";
		},

		onWindowResize: function(e) {
			if(this.video) {
				this.video.height(this.videoHeight());
			}
		},

		bindWindowEvents: function() {
			// call to set height
			$(window).resize(this.onWindowResize.bind(this));

			$(window).on(APP.EVENTS.LOAD_VIDEO, function(e, model) {
				this.model = model;
				this.render();
			}.bind(this));

			$(window).on(APP.EVENTS.LOAD_VIDEOS, function(e, collection) {
				this.collection = collection;
				this.collection_clone = collection.clone();
				this.model = this.collection_clone.first();
				this.render();
			}.bind(this));


			$(window).on(APP.EVENTS.PAUSE_VIDEO, function(e) {
				this.pause();
			}.bind(this));
		}
	});
});
