(function($){
  $.fn.motionPicture = function(options){
    var $window = $(window),
      animations = []

    var assembled = animationFactory(this, options);
    animations.push(assembled);
    return this;

    // Make an object responsible for keeping track of the sprite status.
    function animationFactory($el, config) {
      var defaults = {
        startLogic: $(window).height(),
        endLogic: $('html').height() - 1,
        focalPoint: $(window).scrollTop() + $(window).height(),
        loop: false,
        hideOnComplete: true
      };
      var animationConfig = $.extend(defaults, config);
      var animObj = {
        self: this,
        step: 0,
        count: 0,
        el: $el,
        baseClass: animationConfig.baseClass,
        steps: animationConfig.steps,
        hidden: false,
        startLogic: animationConfig.startLogic,
        endLogic: animationConfig.endLogic,
        dynamicPlacement: animationConfig.dynamicPlacement,
        events: [{'event': 'scroll', 'target': $(window)}],
        currentClass: '',
        hideOnComplete: animationConfig.hideOnComplete,
        loop: animationConfig.loop,

        // Get the startpoint for the animation.
        getStart: function() {
          return (typeof this.startLogic === 'function') ? this.startLogic() : this.startLogic;
        },

        // Get the endpoint for the animation.
        getEnd: function() {
          return (typeof this.endLogic === 'function') ? this.endLogic() : this.endLogic;
        },

        // Logic to determine which class should be applied to the element.
        setSprite: function() {
          if (this.dynamicPlacement) {
            this.calibrate();
          }

          var $el = this.el,
            focalPoint = $(window).scrollTop() + $(window).height(),
            animStart = $el.data('animation-start'),
            animEnd = $el.data('animation-end'),
            animWidth = animEnd - animStart;

          // todo: this might be able to be looped into the standard logic as part of the if else statement.
          if (this.loop == true) {
            var loopFocal = (focalPoint - animStart) % animWidth,
            step = Math.round((loopFocal / animWidth) * ( this.steps));

            this.setAnimationStep(step);
          }
          else if ((animStart <= focalPoint) && (animEnd >= focalPoint)) {
            var offset = focalPoint - animStart;
            if (this.reverseAnimation) {
              var step = this.steps - Math.round((offset / animWidth) * this.steps);
            }
            else {
              var step = Math.round((offset / animWidth) * this.steps);
            }
            this.setAnimationStep(step);
          }
          else if (focalPoint < animStart  ) {
            this.setAnimationStep(0);
          }
          else {
            this.setAnimationStep(animEnd + 1);
          }
        },

        // Set this element to compute the sprite position any time that one of
        // the defined events triggers on one of the defined targets.
        addEvents: function(el) {
          self = this;
          $.each(self.events, function() {
            $(this.target).on(this.event, function() {
              self.setSprite();
            });
          });
        },

        // Get relevant coordinates for calculating spriteStep.
        calibrate: function() {
          var $el = this.el;
          $el.data('animation-start', this.getStart()).data('animation-end', this.getEnd());
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
        },

        // Helper method for adding a class.
        addClass: function(newClass) {
          this.el.addClass(newClass);
          this.currentClass = newClass;
        },

        // Helper function for hiding an element.
        hide: function() {
          this.el.hide();
          this.el.removeClass(this.currentClass);
          this.currentClass = '';
        },

        // Helper function for showing an element.
        unhide: function() {
          this.el.show();
        }
      };


      // Initialization.
      animObj.calibrate();
      animObj.addEvents(animObj.el);
      return animObj;
    }
  }
})(jQuery);
