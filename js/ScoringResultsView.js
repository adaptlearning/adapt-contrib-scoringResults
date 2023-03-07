import Adapt from 'core/js/adapt';
import Notify from 'core/js/notify';
import ComponentView from 'core/js/views/componentView';

class ScoringResultsView extends ComponentView {

  events() {
    return {
      'click .js-set-retry-btn': 'onRetryClicked'
    };
  }

  /**
   * @todo: Do we need the `_isVisible` locking? Should this be in the model `setVisibility`?
   */
  preRender() {
    this.model.setLocking('_isVisible', false);
    this.listenTo(Adapt.parentView, 'preRemove', () => this.model.unsetLocking('_isVisible'));
    this.listenTo(Adapt, `setRetry:confirm:${this.model.get('_id')}`, this.onRetryConfirm);
    this.listenTo(this.model, 'change:_feedbackBand', this._addClassesToArticle);

  }

  postRender() {
    this.model.checkIfSetComplete();
    this.setReadyStatus();
    this.setupInviewCompletion('.component__inner', this.model.checkCompletion.bind(this.model));
  }

  /**
   * If there are classes specified for the feedback band, apply them to the containing article
   * This allows for custom styling based on the band the user's score falls into
   */
  _addClassesToArticle(model, value) {
    if (!value?._classes) return;
    this.$el.parents('.article').addClass(value._classes);
  }

  onRetryClicked() {
    const promptConfig = this.model.get('_retry')?._confirmationPrompt;

    if (promptConfig?._isEnabled) {
      const buttonsConfig = promptConfig._buttons;

      Notify.prompt({
        _classes: 'is-retry',
        title: promptConfig.title,
        body: promptConfig.body,
        _prompts: [
          {
            promptText: buttonsConfig.yes,
            _callbackEvent: `setRetry:confirm:${this.model.get('_id')}`
          },
          {
            promptText: buttonsConfig.no,
            _callbackEvent: 'setRetry:cancel'
          }
        ]
      });
    } else {
      this.onRetryConfirm();
    }
  }

  onRetryConfirm() {
    this.model.resetScoringSets();
  }

}

ScoringResultsView.template = 'scoringResults.jsx';

export default ScoringResultsView;
