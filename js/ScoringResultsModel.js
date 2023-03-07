import Adapt from 'core/js/adapt';
import Logging from 'core/js/logging';
import ComponentModel from 'core/js/models/componentModel';
import Scoring, {
  getSubsetById,
  getSubsetsByQuery,
  getScaledScoreFromMinMax
} from 'extensions/adapt-contrib-scoring/js/adapt-contrib-scoring';

export default class ScoringResultsModel extends ComponentModel {

  init(...args) {
    // save the original body text so we can restore it when the test is reset
    this.set('originalBody', this.get('body'));

    this.listenTo(Adapt, {
      'scoring:set:complete scoring:complete': this.onSetComplete,
      'scoring:set:reset scoring:reset': this.onSetReset
    });

    super.init(...args);
  }

  checkIfSetComplete() {
    const set = this.getScoringSet();
    if (!set) return;
    if (set.isComplete) this.onSetComplete(set);
    this._setVisibility(set);
  }

  checkCompletion() {
    if (this.get('_setCompletionOn') === 'pass' && !this.get('isPass')) return;
    this.setCompletionStatus();
  }

  getScoringSet() {
    const id = this.get('_setId');
    return id ? getSubsetById(id) : Scoring;
  }

  getScoringSets() {
    let query = this.get('_subsetsQuery');
    if (!query) return [this.getScoringSet()];
    const id = this.get('_setId');
    if (id) query = `#${id} ${query}`;
    return getSubsetsByQuery(query);
  }

  resetScoringSets() {
    const sets = this.getScoringSets();
    sets.forEach(set => set.canReset && set.reset());
  }

  reset(...args) {
    const wasReset = super.reset(...args);
    if (!wasReset) return;

    this.set({
      body: this.get('originalBody'),
      _feedbackBand: null,
      feedback: '',
      _isRetryEnabled: false,
      retryFeedback: ''
    });
  }

  _setFeedback() {
    const set = this.getScoringSet();
    const isScaled = this.get('_isBandsScoreScaled') ?? set?.passmark?.isScaled ?? true;
    const score = isScaled ? this.get('scaledScore') : this.get('score');
    const bands = this.get('_bands').sort((a, b) => b._score - a._score);
    //const band = bands.find(band => score >= band._score) ?? bands.slice().pop();
    const band = bands.find(band => score >= band._score);
    if (!band) Logging.warn(`A _band could not be found for a score of ${score} in ${this.get('_id')}`);
    // ensure any handlebars expressions in the `feedback` are handled
    const feedback = band ? Handlebars.compile(band.feedback)(this.toJSON()) : '';

    this.set({
      _feedbackBand: band,
      feedback: feedback,
      body: this.get('_completionBody')
    });
  }

  _setRetryEnabled() {
    const feedbackBand = this.get('_feedbackBand');
    if (!feedbackBand) return;
    const isRetryEnabled = feedbackBand?._allowRetry ?? true;
    this.set('_isRetryEnabled', isRetryEnabled);
    const retryFeedback = this.get('_retry')?.feedback;
    if (retryFeedback) this.set('retryFeedback', isRetryEnabled ? retryFeedback : '');
  }

  _setVisibility() {
    const set = this.getScoringSet();
    const isVisibleBeforeCompletion = this.get('_isVisibleBeforeCompletion') ?? false;
    const isVisible = isVisibleBeforeCompletion || set.isComplete;
    this.set('_isVisible', isVisible, { pluginName: 'scoringResults' });
  }

  onSetComplete(set) {
    if (this.get('_setId') !== (set.id || '') || !this.get('_isRendered')) return;
    const sets = this.getScoringSets();
    const score = sets.reduce((score, set) => score + set.score, 0);
    const minScore = sets.reduce((score, set) => score + set.minScore, 0);
    const maxScore = sets.reduce((score, set) => score + set.maxScore, 0);
    const scaledScore = getScaledScoreFromMinMax(score, minScore, maxScore);
    const canReset = sets.every(set => set?.canReset);
    const attempts = set?.attempts;

    const data = {
      score: score,
      maxScore: maxScore,
      scaledScore: scaledScore,
      isPass: set.isPassed
    };

    if (attempts) {
      Object.assign(data, {
        attempts: attempts?.limit,
        attemptsSpent: attempts?.used,
        attemptsLeft: attempts?.remaining
      });
    }

    this.set(data);
    this._setFeedback();
    if (canReset) this._setRetryEnabled();
    this._setVisibility();
    this.checkCompletion();
  }

  onSetReset(set) {
    if (this.get('_setId') !== (set.id || '')) return;
    let resetType = this.get('_resetType');
    if (!resetType || resetType === 'inherit') resetType = set?.resetConfig?._nonScoringType ?? 'hard';
    this.reset(resetType, true);
    this._setVisibility();
  }

}
