define(function(require) {
	var Woodhouse = require('woodhouse');
	var videojs = require('videojs');

	return Woodhouse.View.extend({
		initialize: function() {
			this.model = this.collection.first();
			this.model.set('playing', true);
			this.template.bind(this);

			this.bindKeyboardEvents();
		},

		template: function(context) {
			var height = $(window).height() * 0.75;
			return jade.render('video/player', _.extend(context, {
				height: height + "px"
			}));
		},

		onRender: function() {
			setTimeout(function() {
				this.prepareVideo(function(video) {
					this.video = video;
					this.play();
					this.bindVideoEvents(video);
				}.bind(this));
			}.bind(this));
		},

		// Calls back with context of this.callback(video), where this is the view
		prepareVideo: function(callback) {
			var self;
			videojs(this.videoId()).ready(function() {
				if(callback) {
					callback.call(self, this);
				}
			});
		},
		
		videoId: function() {
			return 'video_' + this.model.id;
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
		},

		dislike: function() {
			this.model.set('like', '');
			this.model.set('dislike', 'disliked');
		},

		save: function() {
			this.model.set('saved', 'saved');
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

		onWindowResize: function(e) {
			var height = $(window).height() * 0.75;
			this.model.set('height', height + "px");
		},

		bindWindowEvents: function() {
			// call to set height
			this.onWindowResize();
			$(window).resize(this.onWindowResize.bind(this));
		}
	});
});
