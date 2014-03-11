/**
 * @module Skritter
 * @submodule Views
 * @param templateRdng
 * @param Prompt
 * @author Joshua McFarland
 */
define([
    'require.text!templates/prompt-rdng.html',
    'views/prompts/Prompt'
], function(templateRdng, Prompt) {
    /**
     * @class PromptDefn
     */
    var Rdng = Prompt.extend({
        /**
         * @method initialize
         */
        initialize: function() {
            Prompt.prototype.initialize.call(this);
        },
        /**
         * @method render
         * @returns {Backbone.View}
         */
        render: function() {
            this.$el.html(templateRdng);
            this.$('#input-container').hammer().on('tap', _.bind(this.handleTap, this));
            Prompt.prototype.render.call(this);
        },
        /**
         * @method handleTap
         * @returns {undefined}
         */
        handleTap: function(event) {
            Prompt.gradingButtons.show();
            event.preventDefault();
        },
        /**
         * @method resize
         * @param {Backbone.Model} settings
         */
        resize: function(settings) {
            settings = settings ? settings : skritter.settings;
            if (settings.orientation() === 'landscape') {
                this.$('#input-container').height(settings.height());
                this.$('#input-container').width(settings.height());
            } else {
                this.$('#input-container').height(settings.width());
                this.$('#input-container').width(settings.width());
            }
            Prompt.prototype.resize.call(this, settings);
        },
        display: function() {
            this.showWriting();
            this.showDefinition();
            this.showSentence();
        },
        /**
         * @method show
         */
        show: function() {
            this.$('.prompt-writing-input').html(Prompt.review.vocab().writing());
            this.$('.prompt-question').html("What's the reading?");
            this.showWriting();
            this.showDefinition();
            this.showSentence();
        }
    });
    
    return Rdng;
});