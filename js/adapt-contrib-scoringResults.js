import components from 'core/js/components';
import ScoringResultsModel from './ScoringResultsModel';
import ScoringResultsView from './ScoringResultsView';

export default components.register('scoringResults', {
  model: ScoringResultsModel,
  view: ScoringResultsView
});
