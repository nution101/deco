import Ember from 'ember';
import config from '../config/environment';
import accountUtils from '../utils/account';

/**
 * Ember Welcome Route
 */
export default Ember.Route.extend({
    activeConnection: Ember.computed.alias('application.activeConnection'),
    /**
     * Get all accounts, set them as model
     */
    model: function () {
        return this.store.findAll('account');
    },

    /**
     * AfterModel: Track PageView
     */
    afterModel: function () {
        appInsights.trackPageView('Welcome');
    },

    setupController: function (controller, model) {
        controller.set('model', model);
        controller.set('dnsSuffixContent', config.dnsSuffixContent);

        if (!model || !model.content || model.content.length < 1) {
            return;
        }

        accountUtils.getActiveAccount(this.store).then(activeAccount => {
            if (activeAccount && activeAccount.get('id')) {
                controller.set('selectedEditAccount', activeAccount.get('id'));
                controller.set('selectedAccount', activeAccount.get('id'));
            }
        }).catch(() => {
            // default back to the first account
            controller.set('selectedEditAccount', model.content[0].id);
            controller.set('selectedAccount', model.content[0].id);
        });
    },

    /**
     * When we transition to the explorer view, let's do some housekeeping
     * @param  {Ember.Controller}  controller
     * @param  {Boolean} isExiting
     */
    resetController: function (controller, isExiting) {
        if (isExiting) {
            controller.set('loading', false);
            controller.set('addNewUi', false);
            controller.set('editUi', false);
        }
    },

    actions: {
        /**
         * Setup Materialize's dumb <select>
         */
        selectize: function () {
            Ember.run.scheduleOnce('afterRender', this, function () {
                Ember.$('select').material_select();
            });
        },

        /**
         * Setup Materialize's dumb <select>
         */
        didTransition: function () {
            this.controller.send('selectize');
            this.controller.set('loading', false);
        },

        /**
         * Refresh the current model
         */
        refresh: function () {
            return this.refresh();
        }
    }
});
