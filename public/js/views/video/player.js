define(function(require) {
	var Woodhouse = require('woodhouse');
	var videojs = require('videojs');

	return Woodhouse.View.extend({
		initialize: function() {
			this.model = this.collection.first();
			this.model.set('playing', false);
			this.template.bind(this);

			this.bindKeyboardEvents();
		},

		template: function(context) {
			return jade.render('video/player', context);
		},

		onRender: function() {
			var self = this;
			setTimeout(function() {
				self.video(function(video) {
					video.on('play', function() {
						self.model.set('playing', true);
					});

					video.on('pause', function() {
						self.model.set('playing', false);
					});
				});
			}.bind(this));
		},

		// Calls back with context of this.callback(video), where this is the view
		video: function(callback) {
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
			this.video(function(video) {
				video.play();
				this.model.set('playing', true);
			}.bind(this));
		},

		pause: function() {
			this.video(function(video) {
				video.pause();
				this.model.set('playing', false);
			}.bind(this))
		},

		next: function() {
			this.collection.shift();
			this.model = this.collection.first();

			this.render();
		},

		like: function() {
			this.model.set('like', true);
			this.model.set('dislike', false);
		},

		dislike: function() {
			this.model.set('like', false);
			this.model.set('dislike', true);
		},

		save: function() {

		},

		bindKeyboardEvents: function() {
			$('body').keydown(function(e) {
				if(e.which === 39) { // RIGHT ARROW
					this.next();
				}
			}.bind(this));
		}
	});
});
