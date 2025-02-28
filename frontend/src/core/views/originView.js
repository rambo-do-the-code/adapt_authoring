define(['require', 'backbone', 'core/origin', 'modules/user/models/sessionModel'], function(require, Backbone, Origin, SessionModel) {
  // get  token  from url
  const token = Origin.getTokenFromUrl();


  if (token) {
    if (!Origin.sessionModel) {
      // init sessionModel
      Origin.sessionModel = new SessionModel();
    }
    // force logout make sure we log in correct account
    Origin.sessionModel.forceLogout();
    // sso logic
    Origin.sessionModel.authenticateWithToken(token, function(userData) {
      console.log("authenticateWithToken success")
      Origin.sessionModel.ssoLogin(userData); // sso logic for user
    });
  } else {
    console.log("Not find token in url. login in normal mode manual");
  }

  var OriginView = Backbone.View.extend({
    settings: {
      autoRender: true,
      preferencesKey: ''
    },

    initialize: function(options) {
      this.preRender(options);
      if (this.constructor.template) {
        Origin.trigger(this.constructor.template + ':preRender', this);
      }
      if (this.settings.autoRender) {
        this.render();
      }
      this.listenTo(Origin, 'remove:views', this.remove);
    },

    preRender: function() {
    },

    render: function() {
      var data = this.model ? this.model.toJSON() : null;
      var template = Handlebars.templates[this.constructor.template];
      this.$el.html(template(data));
      _.defer(_.bind(function() {
        this.postRender();
        this.onReady();
        if (this.constructor.template) {
          Origin.trigger(this.constructor.template + ':postRender', this);
        }
      }, this));
      return this;
    },

    postRender: function() {
    },

    onReady: function() {
    },

    setViewToReady: function() {
      Origin.trigger('origin:hideLoading');
    },

    setUserPreference: function(key, value, sessionOnly) {
      if (this.settings.preferencesKey) {
        var preferences = (Origin.sessionModel.get(this.settings.preferencesKey) || {});
        preferences[key] = value;
        // Store in session model
        Origin.sessionModel.set(this.settings.preferencesKey, preferences);
        // set in browser storage
        var data = {};
        data[key] = value;
        Origin.browserStorage.set(this.settings.preferencesKey, data, sessionOnly || false, false);
      }
    },

    getUserPreferences: function() {
      if (this.settings.preferencesKey) {
        var saveData = Origin.browserStorage.get(this.settings.preferencesKey);
        return saveData || {};
      }
    },

    sortArrayByKey: function (arr, key) {
      return arr.sort(function(a, b){
        var keyA = a[key],
        keyB = b[key];
        if(keyA < keyB) return -1;
        if(keyA > keyB) return 1;
        return 0;
      });
    },

    remove: function() {
      if (this.form) {
        // remove ckeditor instances
        this.form.$( "textarea" ).each(function () {
          var editor = CKEDITOR.instances[this.id];
          try {
            // check editor is still in the dom (otherwise throws exception)
            if (editor && editor.window.getFrame()) {
              editor.destroy(true);
            }
          } catch (e) {
            // do nothing
          }
        });
        this.form.remove();
      }
      Backbone.View.prototype.remove.apply(this, arguments);
    }
  });

  return OriginView;
});
