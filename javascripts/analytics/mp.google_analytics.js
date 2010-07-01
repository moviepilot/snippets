/*  Simple Google Analytics wrapper and callback creator object
 *  (c) 2010 Moviepilot
 *
 *  There's not much to tell you .. 
 * 
 * 
 *  Author: Benjamin Krause (benjamin@moviepilot.com) 
 *
 *  This Script is freely distributable under the terms of an MIT-style license.
 *
 *--------------------------------------------------------------------------*/


var GoogleAnalytics = {
  trackPageView: function(url) {
    this.trackPageViewCallback(url)();
  },
  
  trackPageViewCallback: function( url, track_only_once ){
    return function(){
      if (!this.event_tracked){
        _gaq.push(['_trackPageview', url]);
        if (track_only_once) {
          this.event_tracked = true;
        }
      }
    };
  },
  
  trackEventCallback: function( eventParameters ){
    return function(){
      _gaq.push(['_trackEvent', eventParameters.category, eventParameters.action, eventParameters.label, eventParameters.value]);
    };
  }
};
