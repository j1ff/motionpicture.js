$(document).ready(function() {
  var $squirtleScrollWrap = $('#squirtle-scroll-wrap');
  var $squirtleScroll = $('#squirtle-scroll');
  $('#squirtle').motionPicture({
    steps: function() {
      $('#animation-steps').text(38);
      return 38;
    },
    focalPoint: function() {
      var focal = $squirtleScrollWrap.scrollLeft();
      getCurrentStep = function() {
        return Math.round(focal / ($squirtleScroll.width() - $squirtleScrollWrap.width()) * 38);
      }
      $('#current-step').text(getCurrentStep());
      $('#focal-point').text(focal);
      return focal;
    },
    startLogic: function() {
      $('#start-logic').text(0);
      return 0;
    },
    endLogic: function() {
      var endPoint = $squirtleScroll.width() - $squirtleScrollWrap.width();
      $('#end-logic').text(endPoint);
      return $squirtleScroll.width() - $squirtleScrollWrap.width();
    },
    animationEvents: [{event: 'scroll', target: $squirtleScrollWrap}],
    baseClass: 'squirtle-squirtle'
  });
});