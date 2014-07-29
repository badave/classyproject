define(function(require) {
	var Woodhouse = require('woodhouse');
	var videojs = require('videojs');

	var APP = require('../../constants');
	var Video = require('../../models/video');
	var Feel = require('../../models/feel');
	require('videojs-youtube');

	var HEIGHT_PERCENT = 0.75;

	return Woodhouse.View.extend({
		initialize: function() {
			this.model = this.collection.first();

			if(!this.model) {
				this.model = new Video();
			}

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
			if(this.collection.length > 1) {
				this.collection.shift();
				this.model = this.collection.first();
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

			$(window).on(APP.EVENTS.PAUSE_VIDEO, function(e) {
				this.pause();
			}.bind(this));
		}
	});
});
