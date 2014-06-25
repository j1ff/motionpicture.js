(function($){
  $.fn.motionPicture = function(options){
    this.each(function() {
      animationFactory($(this), options)
    });

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
        dynamicPlacement: false,
        animationEvents: [{'event': 'scroll', 'target': $(window)}],
        calibrationEvents: [{'event': 'resize', 'target': $(window)}],
        currentClass: '',
        pictureMethod: 'class',
        stepOffsets: {},

        onLoad: function() {
          $.extend(this, config);
          this.addEvents(this.el).calibrate();
          return this;
        },
        get: function(option) {
          return (typeof this[option] === 'function') ? this[option]() : this[option];
        },

        // Logic to determine which class should be applied to the element.
        setSprite: function() {
          if (this.get('dynamicPlacement')) {
            this.calibrate();
          }

          var $el = this.el,
            focalPoint = this.get('focalPoint'),
            animStart = $el.data('animation-start'),
            animEnd = $el.data('animation-end'),
            animWidth = animEnd - animStart;

          if (this.get('loop') == true) {
            var loopFocal = (focalPoint - animStart) % animWidth,
              step = Math.round((loopFocal / animWidth) * ( this.get('steps')));
            this.setAnimationStep(step);
          }
          else if ((animStart <= focalPoint) && (animEnd >= focalPoint)) {
            var offset = focalPoint - animStart,
              step = Math.round((offset / animWidth) * this.get('steps'));
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
          $.each(self.get('animationEvents'), function() {
            $(this.target).on(this.event, function() {
              self.setSprite();
            });
          });

          $.each(self.get('calibrationEvents'), function() {
            $(this.target).on(this.event, function() {
              self.calibrate();
            });
          });
          return this;
        },

        // Get relevant coordinates for calculating spriteStep.
        calibrate: function() {
          var $el = this.el;
          $el.data('animation-start', this.get('startLogic')).data('animation-end', this.get('endLogic'));
          return this;
        },

        // Logic for manipulating dom so sprite is at the correct point.
        setAnimationStep: function(step) {
          var stepInt = parseInt(step);
          this.step = stepInt > 9 ? stepInt : "0" + stepInt;
          this.el.attr('class', '');
          if (this.get('pictureMethod') == 'class') {
            this.addClass(this.get('baseClass') + this.step);
          }
          else if (this.get('pictureMethod') == 'offset') {
            var leftOffset = this.stepOffset.left,
              topOffset = this.stepOffset.top;
            this.setOffset({left: leftOffset, top: topOffset}, this.step);
          }

          if (!$.isEmptyObject(this.get('stepOffsets')) && this.stepOffsets[step]) {
            this.setOffset(this.get('stepOffsets')[step]);
          }

          if (this.get('hideOnComplete')) {
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

        setOffset: function(stepOffset, multiplier) {
          multiplier = typeof multiplier === 'undefined' ? 1 : multiplier;
          this.el.css('background-position', -stepOffset.left * multiplier + 'px ' + stepOffset.top * multiplier + 'px');
        },

        // Helper function for hiding an element.
        hide: function() {
          this.el.css('visibility', 'hidden');
          this.el.removeClass(this.get('currentClass'));
          this.currentClass = '';
          return this;
        },

        // Helper function for showing an element.
        unhide: function() {
          this.el.css('visibility', 'visible');
        }
      };
      return animObj.onLoad();
    }
  }
})(jQuery);
