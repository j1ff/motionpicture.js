(function($){
  $.fn.motionpicure = function(options){
    var $window = $(window);
    //
    // Animate each animation on scroll.
    // TODO: implement system that allows end user what events trigger animation progression.
    $window.on('scroll', function(e) {
      animations.map(function(item) {
        item.setSprite();
      });
    });

    // Adjust the start/end points for animations whenever it the window is resized.
    $(window).on('resize', function(e) {
      animations.map(function(item) {
        item.calibrate();
      });
    });

    function animationFactory($el, config) {
      var defaults = {
        startlogic: -1000,
        endLogic: -1000,
        dynamicPlacement: false,
        reverseAnimation: false,
        useWindowFront: false
      };
      var animationConfig = $.extend(defaults, config);
      var animObj = {
        self: this,
        step: 0,
        count: 0,
        el: $el,
        baseClass: $el.data('animation-class'),
        steps: $el.data('animation-steps'),
        hidden: false,
        startLogic: animationConfig.startLogic,
        endLogic: animationConfig.endLogic,
        dynamicPlacement: animationConfig.dynamicPlacement,



        getEnd: function() {
          return (typeof this.endLogic === 'function') ? this.endLogic() : this.endLogic;
        },
        getStart: function() {
          return (typeof this.startLogic === 'function') ? this.startLogic() : this.startLogic;
        },

        setSprite: function() {
          // TODO: is there any way we can avoid this?? It's resource intensive.
          if (this.dynamicPlacement) {
            this.calibrate();
          }

          var $el = this.el,
          
            focalPoint = this.useWindowFront ? $(window).scrollLeft() + $(window).width() : $el.offset().left + $el.width(),
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

        calibrate: function() {
          var $el = this.el;
          $el.data('animation-start', this.getStart()).data('animation-end', this.getEnd());
        },

        setAnimationStep: function(step) {
          var stepInt = parseInt(step);
          this.step = stepInt > 9 ? stepInt : "0" + stepInt;
          this.el.attr('class', '');
          this.el.addClass(this.baseClass + this.step);
          if (this.step < 1 || this.step > this.steps) {
            this.hide();
          }
          else {
            this.unhide();
          }
        },
        addClass: function(newClass) {
          this.el.addClass(newClass);
        },
        hide: function() {
          this.el.addClass('animation-hidden');
        },
        unhide: function() {
          this.el.removeClass('animation-hidden');
        }
      };
      animObj.calibrate();
      return animObj;
    }

    // Put all animations into a single animations array.
    function lcmPreparedAnimations() {
      var animations = [];

      // All Aboard animation.
      animations.push(
        animationFactory($('#allaboard-animation'), {
          startLogic: function() {
            return $(window).width() / 2 - 50;
          },
          endLogic: function() {
            return $('#pane-home').offset().left + $('#pane-home').width();
          }
        })
      );

      // Bird animation.
      animations.push(
        animationFactory($('#bird-animation'), {
          startLogic: function() {
            return $(window).scrollLeft();
          },
          endLogic: function() {
            return $(window).scrollLeft() + $(window).width();
          },
          dynamicPlacement: true,
          reverseAnimation: true
        })
      );

      // Jump animation.
      animations.push(
        animationFactory($('#jump-animation'), {
          startLogic: function() {
            // This is pretty much the ideal point to get the guy to be
            // at the apex of the jump when viewing the blog.
            return $(window).scrollLeft() - 500;
          },
          endLogic: function() {
            return $(window).scrollLeft() + $(window).width();
          },
          dynamicPlacement: true,
          reverseAnimation: true
        })
      );

      // Dog animation.
      animations.push(
        animationFactory($('#dog-animation'), {
          startLogic: function() {
            return $(window).scrollLeft();
          },
          endLogic: function() {
            return $(window).scrollLeft() + $(window).width();
          },
          dynamicPlacement: true,
          reverseAnimation: true
        })
      );
      return animations;
    }
  }
})(jQuery);