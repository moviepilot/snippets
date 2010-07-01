/*  Unobstrusive Google Event and PageTracking Behavior
 *  (c) 2010 Moviepilot
 *
 *  This Script is based on Prototype and LowPro. 
 *
 *
 * 
 * Tracking via onClick
 * ====================
 *
 * To enable this behaviour, simply add an attribute to any
 * element with the tracking syntax found below. The name
 * of the attribute can be configured when activating the
 * behaviour.
 *
 * Example html:
 *   <a href="/some/url" data-analytics="trackEvent:/i/clicked/here">link</a>
 *
 * Activated by:
 *   Event.addBehavior({'a[data-analytics]' : MP_Analytics.OnClick('data-analytics') });
 *
 *
 * Tracking via onLoad
 * ===================
 *
 * Example html:
 *   <body data-analytics="trackPageView:/funnel/started">
 *
 * Activated by:
 *   Event.addBehavior({'body[data-analytics]' : MP_Analytics.OnLoad('data-analytics') });
 *
 *
 * Tracking page render time
 * =========================
 *
 * 
 * Tracking Syntax
 * ===============
 * 
 * Track Events
 * Tracking Events consist of 4 parameters:
 *
 * - <String> category (required) 
 * - <String> action (required)
 * - <String> label (optional)
 * - <Integer> value (optional)
 * 
 * Example:
 *  trackEvent:/<category>/<action>/<label>/<value>
 *  trackEvent:/movie/add-rating/consumption-bar
 *  trackEvent:/series/add-to-watchlist/toolbar
 *
 * if you don't want to set a label but a value, just leave the 
 * label empty (trackEvent:/<category>/<action>//<value>)
 *
 * Be sure to check Google Analytics first before adding new
 * categories/actions/labels (e.g. stick to the current ones,
 * don't invent new ones unless you're sure what you're doing).
 * 
 * 
 *
 * Tracking virtual pages is just an url
 *
 * - <String> url (required)
 * 
 * Example:
 *   trackPageView:/virtual/page/view
 *   trackPageView:/funnels/100_movies/start_page
 *
 * Please use non-existing urls and stick to existing paths
 * when tracking virtual page urls. This should only be used
 * for funnels (by using the /funnels-prefix). Everything else
 * should be tracked with trackEvent.
 
 * Authors: Benjamin Krause (benjamin@moviepilot.com) 
 *  and Andreas Bauer (andreasb@moviepilot.com)
 *
 *  This Script is freely distributable under the terms of an MIT-style license.
 *
 *--------------------------------------------------------------------------*/



var MP_Analytics = {};

MP_Analytics.Base = {
  callbacks: [],
  
  createCallbacks: function( attributeValue ){
    var callbacks = [];
    attributeValue.split(' ').each(function( token ){
      callbacks.push( this.createCallbackFromToken( token ) );
    }, this);
    return callbacks;
  },
  createCallbackFromToken: function( token ){
    methodToken = token.split(':/').first();
    if (methodToken == 'trackEvent') {
      return this.trackEventCallback( token.split(':').last() );
    } else if (methodToken == 'trackPageView') {
      return this.trackPageViewCallback( token.split(':').last() );
    } else {
      return null;
    }
  },
  trackEventCallback: function( eventData ){
    tokens = eventData.split('/');
    var c = tokens[1];
    var a = tokens[2];
    var l = tokens[3] || null;
    var v = parseInt(tokens[4]) || null;
    return GoogleAnalytics.trackEventCallback( { category: c, action: a, label: l, value: v } );
  },
  trackPageViewCallback: function( url ){
    return GoogleAnalytics.trackPageViewCallback(url, true).bind(this);
  },
  prepareCallbacks: function(attributeName){
    var attributeValue;
    if(this.element && (attributeValue = this.element.readAttribute(attributeName))) {
      this.callbacks = this.createCallbacks( attributeValue ).compact();
    }
  },
  executeCallbacks: function(){
    this.callbacks.each(function(callback){
      callback.call();
    });
  }
};


MP_Analytics.OnClick = Behavior.create(MP_Analytics.Base, {
  initialize: function( attributeName ) {
    this.prepareCallbacks(attributeName);
  },
  onmouseup: function(){
    this.executeCallbacks();
  }
});


MP_Analytics.OnLoad = Behavior.create(MP_Analytics.Base, {
  initialize: function( attributeName ) {
    this.prepareCallbacks(attributeName);
    this.executeCallbacks();
  }
});


MP_Analytics.TrackRenderTime = function( variableName ) {
  
}


Event.addBehavior({'a[data-analytics]'    : MP_Analytics.OnClick('data-analytics') });
Event.addBehavior({'body[data-analytics]' : MP_Analytics.OnLoad('data-analytics') });

Event.observe(window, 'load', MP_Analytics.TrackRenderTime);