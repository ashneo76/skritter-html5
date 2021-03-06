/**
 * @module Skritter
 * @submodule View
 * @param templateHomeLoggedIn
 * @param templateHomeLoggedOut
 * @author Joshua McFarland
 */
define([
    'require.text!template/home-logged-in.html',
    'require.text!template/home-logged-out.html'
], function(templateHomeLoggedIn, templateHomeLoggedOut) {
    /**
     * @class Home
     */
    var Home = Backbone.View.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            this.languageCode = skritter.settings.getLanguageCode();
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            if (skritter.user.isLoggedIn()) {
                document.title = "Skritter - " + skritter.user.settings.get('name');
                this.$el.html(templateHomeLoggedIn);
                this.$('#user-avatar').html(skritter.user.settings.getAvatar('img-thumbnail'));
                this.$('#user-due-count').text(skritter.user.scheduler.getDueCount(true));
                this.$('#user-id').text(skritter.user.settings.get('name'));
                if (skritter.user.sync.syncing) {
                    this.toggleSyncButton(true);
                }
            } else {
                document.title = "Skritter - Learn to Write Chinese and Japanese Characters";
                this.$el.html(templateHomeLoggedOut);
                if (this.languageCode) {
                    this.$('#language-text').text(this.languageCode === 'zh' ? '中文' : '日本語');
                }
            }
            this.listenTo(skritter.user.scheduler, 'schedule:sorted', _.bind(this.updateDueCount, this));
            this.listenTo(skritter.user.sync, 'sync', this.toggleSyncButton);
            return this;
        },
        /**
         * @property {Object} events
         */
        events: {
            'click .button-existing-user': 'navigateLogin',
            'click .button-new-user': 'navigateNewUser',
            'click .button-lists': 'navigateLists',
            'click .button-logout': 'logout',
            'click .button-study': 'navigateStudy',
            'click .button-sync': 'startSync'
        },
        /**
         * @method logout
         * @param {Object} event
         */
        logout: function(event) {
            skritter.modal.show('logout');
            skritter.modal.element('.modal-footer').hide();
            skritter.modal.element('.modal-button-logout').on('vclick', function() {
                skritter.modal.element('.modal-footer').show();
                skritter.modal.element(':input').prop('disabled', true);
                skritter.modal.element('.message').addClass('text-info');
                skritter.modal.element('.message').html("<i class='fa fa-spin fa-spinner'></i> Logging Out");
                skritter.user.logout();
            });
            event.preventDefault();
        },
        /**
         * @method toggleSyncButton
         * @param {Boolean} syncing
         */
        toggleSyncButton: function(syncing) {
            if (syncing) {
                this.$('.button-sync i').addClass('fa-spin');
            } else {
                this.$('.button-sync i').removeClass('fa-spin');
            }
        },
        /**
         * @method navigateLists
         * @param {Object} event
         */
        navigateLists: function(event) {
            skritter.router.navigate('vocab/list', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method navigateLogin
         * @param {Object} event
         */
        navigateLogin: function(event) {
            skritter.router.navigate('login', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method navigateNewUser
         * @param {Object} event
         */
        navigateNewUser: function(event) {
            skritter.router.navigate('user/new', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method navigateStudy
         * @param {Object} event
         */
        navigateStudy: function(event) {
            skritter.router.navigate('study', {replace: true, trigger: true});
            event.preventDefault();
        },
        /**
         * @method remove
         */
        remove: function() {
            this.stopListening();
            this.undelegateEvents();
            this.$el.empty();
        },
        /**
         * @method startSync
         */
        startSync: function() {
            if (!skritter.user.sync.syncing) {
                skritter.modal.show('download')
                        .set('.modal-title', 'SYNCING')
                        .progress(100);
                skritter.user.sync.changedItems(function() {
                    skritter.modal.hide();
                });
            }
        },
        /**
         * @method updateDueCount
         */
        updateDueCount: function() {
            this.$('#user-due-count').text(skritter.user.scheduler.getDueCount());
        }
    });
    
    return Home;
});