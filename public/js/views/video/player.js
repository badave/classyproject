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
			return jade.render('video/player', context);
		},

		onRender: function() {
			var self = this;
			setTimeout(function() {
				self.video(function(video) {
					self.play();
					
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
		}
	});
});
