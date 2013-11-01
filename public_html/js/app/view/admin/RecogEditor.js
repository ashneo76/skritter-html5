/**
 * @module Skritter
 * @param RecogCanvas
 * @param templateRecogEditor
 * @author Joshua McFarland
 */
define([
    'model/CanvasStroke',
    'view/admin/RecogCanvas',
    'require.text!template/admin-recog-editor.html',
    'backbone'
], function(CanvasStroke, RecogCanvas, templateRecogEditor) {
    /**
     * @class RecogEditor
     */
    var Editor = Backbone.View.extend({
        initialize: function() {
            Editor.canvas = new RecogCanvas();
            Editor.strokes = Skritter.assets.getStrokeSpriteSheet();
        },
        render: function() {
            this.$el.html(templateRecogEditor);
            this.populateStrokeList();
            Editor.canvas.setElement(this.$('#canvas-container')).render();
            this.resize();
            return this;
        },
        events: {
            'click.Editor #stroke-list .panel-body': 'handleStrokeClick',
            'click.Editor #param-list .panel-body': 'handleParamClick'
        },
        handleParamClick: function(event) {
            var cid = event.target.id.replace('param-', '');
            if (cid)
                this.loadParam(cid);
        },
        handleStrokeClick: function(event) {
            var id = event.target.id.replace('stroke-', '');
            if (id)
                this.loadStroke(id);
        },
        loadParam: function(paramId) {
            var param = Skritter.study.params.get(paramId);
            Editor.canvas.drawParam(param);
        },
        loadStroke: function(strokeId) {
            Editor.canvas.drawRawStroke(new CanvasStroke().set('sprite', Skritter.assets.getStroke(strokeId)));
            this.populateParamList(strokeId);
        },
        populateParamList: function(strokeId) {
            this.$('#param-list .panel-body').html('');
            var params = Skritter.study.params.where({bitmapId: parseInt(strokeId, 10)});
            for (var p in params) {
                var param = params[p];
                this.$('#param-list .panel-body').append("<div id='param-" + param.cid + "'>" + param.cid + "</div>");
            }
        },
        populateStrokeList: function() {
            var strokeIds = Editor.strokes.getAnimations();
            for (var i in strokeIds) {
                strokeIds[i] = Skritter.fn.pad(strokeIds[i].replace('s', ''), 0, 4);
            }
            strokeIds.sort();
            for (i in strokeIds) {
                this.$('#stroke-list .panel-body').append("<div id='stroke-" + parseInt(strokeIds[i], 10) + "'>" + strokeIds[i] + "</div>");
            }
            
        },
        resize: function() {
            this.$('#canvas-container').width(Skritter.settings.get('canvasSize'));
            this.$('#stroke-list .panel-body').height(this.$el.height() - 100);
            this.$('#param-list .panel-body').height(this.$el.height() - 100);
        }
    });
    
    
    return Editor;
});