(function($){
  $.fn.motionPicture = function(options){
    var $window = $(window),
      animations = []

    var assembled = animationFactory(this, options);
    animations.push(assembled);
    return this;

    function animationFactory($el, config) {
      var defaults = {
        startLogic: $(window).height(),
        endLogic: $('html').height() - 1,
        focalPoint: $(window).scrollTop() + $(window).height()
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
        hideOnComplete: true,

        getEnd: function() {
          return (typeof this.endLogic === 'function') ? this.endLogic() : this.endLogic;
        },
        getStart: function() {
          return (typeof this.startLogic === 'function') ? this.startLogic() : this.startLogic;
        },

        setSprite: function() {
          if (this.dynamicPlacement) {
            this.calibrate();
          }

          var $el = this.el,
            focalPoint = $(window).scrollTop() + $(window).height(),
            animStart = $el.data('animation-start'),
            animEnd = $el.data('animation-end');

          if ((animStart <= focalPoint) && (animEnd >= focalPoint)) {
            var offset = focalPoint - animStart;
            var animWidth = animEnd - animStart;
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

        addEvents: function(el) {
          self = this;
          $.each(self.events, function() {
            $(this.target).on(this.event, function() {
              self.setSprite();
            });
          });
        },

        calibrate: function() {
          var $el = this.el;
          $el.data('animation-start', this.getStart()).data('animation-end', this.getEnd());
        },

        setAnimationStep: function(step) {
          var stepInt = parseInt(step);
          this.step = stepInt > 9 ? stepInt : "0" + stepInt;
          this.el.attr('class', '');
          this.el.addClass(this.baseClass + this.step);
          if (this.hideOnComplete) {
            if (this.step < 1 || this.step > this.steps) {
              this.hide();
            }
            else {
              this.unhide();
            }
          }
        },
        addClass: function(newClass) {
          this.el.addClass(newClass);
        },
        hide: function() {
          this.el.hide();
        },
        unhide: function() {
          this.el.show();
        }
      };
      animObj.calibrate();

      // Configurable events
      animObj.addEvents(animObj.el);
      return animObj;
    }
  }
})(jQuery);
