(function($){
  $.fn.motionPicture = function(options){
    animationFactory(this, options);
    // Make an object responsible for keeping track of the sprite status.
    function animationFactory($el, config) {
      var animObj = {
        self: this,
        el: $el,
        startLogic: function() {
          return $(window).height()
        },
        endLogic: function() {
          return $('html').height() - 1;
        },
        focalPoint: function() {
          return $(window).scrollTop() + $(window).height();
        },
        loop: false,
        hideOnComplete: true,
        step: 0,
        steps: 0,
        baseClass: 'motionpicture',
        hidden: false,
        dynamicPlacement: false,
        events: [{'event': 'scroll', 'target': $(window)}],
        currentClass: '',

        onLoad: function() {
          $.extend(this, config);
          this.addEvents(this.el).calibrate();
          return this;
        },

        // Get the startpoint for the animation.
        getStart: function() {
          return (typeof this.startLogic === 'function') ? this.startLogic() : this.startLogic;
        },

        // Get the endpoint for the animation.
        getEnd: function() {
          return (typeof this.endLogic === 'function') ? this.endLogic() : this.endLogic;
        },

        getFocal: function() {
          return (typeof this.focalPoint === 'function') ? this.focalPoint() : this.focalpoint;
        },
        // Logic to determine which class should be applied to the element.
        setSprite: function() {
          if (this.dynamicPlacement) {
            this.calibrate();
          }

          var $el = this.el,
            focalPoint = this.getFocal(),
            animStart = $el.data('animation-start'),
            animEnd = $el.data('animation-end'),
            animWidth = animEnd - animStart;

          if (this.loop == true) {
            var loopFocal = (focalPoint - animStart) % animWidth,
              step = Math.round((loopFocal / animWidth) * ( this.steps));
            this.setAnimationStep(step);
          }
          else if ((animStart <= focalPoint) && (animEnd >= focalPoint)) {
            var offset = focalPoint - animStart,
              step = Math.round((offset / animWidth) * this.steps);
            this.setAnimationStep(step);
          }
          else if (focalPoint < animStart  ) {
            this.setAnimationStep(0);
          }
          else {
            this.setAnimationStep(animEnd + 1);
          }
          return this;
        },

        // Set this element to compute the sprite position any time that one of
        // the defined events triggers on one of the defined targets.
        addEvents: function(el) {
          var self = this;
          $.each(self.events, function() {
            $(this.target).on(this.event, function() {
              self.setSprite();
            });
          });
          return this;
        },

        // Get relevant coordinates for calculating spriteStep.
        calibrate: function() {
          var $el = this.el;
          $el.data('animation-start', this.getStart()).data('animation-end', this.getEnd());
          return this;
        },

        // Logic for manipulating dom so sprite is at the correct point.
        setAnimationStep: function(step) {
          var stepInt = parseInt(step);
          this.step = stepInt > 9 ? stepInt : "0" + stepInt;
          this.el.attr('class', '');
          this.addClass(this.baseClass + this.step);
          if (this.hideOnComplete) {
            if (this.step < 1 || this.step > this.steps) {
              this.hide();
            }
            else {
              this.unhide();
            }
          }
          return this;
        },

        // Helper method for adding a class.
        addClass: function(newClass) {
          this.el.addClass(newClass);
          this.currentClass = newClass;
          return this;
        },

        // Helper function for hiding an element.
        hide: function() {
          this.el.hide();
          this.el.removeClass(this.currentClass);
          this.currentClass = '';
          return this;
        },

        // Helper function for showing an element.
        unhide: function() {
          this.el.show();
        }
      };

      return animObj.onLoad();
    }
  }
})(jQuery);
