# adapt-contrib-scoringResults

A *presentation component* used to display banded feedback for a scoring set.

Any registered [scoring set](https://github.com/adaptlearning/adapt-contrib-scoring#scoring-sets) can be included in the results, and can additionally be filtered by a subset query, to evaluate user performance for a specific intersection of scoring sets.

Depending on configuration, scoring sets with the ability to reset can be retried in an attempt to improve performance.

## Usage

**Important note:** if being used to display the results of an [assessment](https://github.com/adaptlearning/adapt-contrib-scoringAssessment) scoring set, do not put the results component in the same article as the assessment itself, as it will be included in the sets model collection for completion.

Apart from the above, the component can exist anywhere in the course structure, and does not need to be within the same page as the associated scoring set. Authors should however take into account whether the results can/should be accessed before the relevant scoring set is completed.

Whilst results will only display upon completion of the specified `_setId`, the feedback is not restricted to an overall score for that set. Feedback can be tailored to specific subsets via `_subsetsQuery`. For example, an assessment may evaluate intersecting subsets of a specific type or ID, to provide more focussed feedback to those areas. See https://github.com/adaptlearning/adapt-contrib-scoring/pull/3 for details regarding query syntax, noting that `_setId` will be automatically prepended to the query.

## Attributes

The attributes listed below are used in *components.json* to configure the component, and are properly formatted as JSON in [*example.json*](https://github.com/adaptlearning/adapt-contrib-scoringResults/blob/master/example.json).

[**core model attributes**](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes): These are inherited by every Adapt component. [Read more](https://github.com/adaptlearning/adapt_framework/wiki/Core-model-attributes).

**\_component** (string): This value must be: `"scoringResults"`.

**\_classes** (string): CSS classes to be applied to the containing element. The classes must be predefined in one of the LESS files. Separate multiple classes with a space.

**\_layout** (string): This defines the horizontal position of the component in the block. Values can be `"full"`, `"left"` or `"right"`.

**instruction** (string): This optional text appears above the component. It is frequently used to guide the learner’s interaction with the component.

**\_setId** (string): The scoring set ID to check for completion. Leave empty to use the [Scoring API](https://github.com/adaptlearning/adapt-contrib-scoring) instead.

**\_subsetsQuery** (string): A query used to additionally filter scoring subsets into the results. The `_setId` will be automatically prepended to the query, so this value should only include subsets. Leave empty if additional filtering is not required.

**\_isVisibleBeforeCompletion** (boolean): Determines whether this component will be visible or hidden prior to the associated scoring set having been completed. The default is `false`.

**\_setCompletionOn** (string): Can be set to `"inview"` or `"pass"`. A a setting of `"inview"` will cause the component to be marked as completed when it has been viewed regardless of whether or not the scoring set was passed, whereas a setting of `"pass"` will cause the component to be set to completed when this component has been viewed and the scoring set has been passed. This setting can be very useful if you have further content on the page that's hidden by trickle which you don't want the user to be able to access until they have passed the assessment. The default is `"inview"`.

**\_resetType** (string): Determines whether this component does a `"soft"` or `"hard"` reset when the associated scoring set is reset. A `"soft"` reset will reset everything except component completion. A `"hard"` reset will also require the component to be completed again. Use `"inherit"` to have the same reset behaviour as the associated scoring set scoring set. Valid values are `"hard"`, `"soft"` and `"inherit"`. The default is `"inherit"`.

**\_retry** (object): The settings used to configure the reset display. Contains the following attributes:

 * **button** (string): Text that appears on the retry button.

 * **feedback** (string): This text is displayed only when every filtered scoring set can be reset. You can use the following variables: `{{{score}}}`, `{{{maxScore}}}`, `{{{scaledScore}}}`. If the associated scoring set contains attempts logic, `{{attemptsSpent}}`, `{{attempts}}`, `{{attemptsLeft}}` can also be used.

 * **\_confirmationPrompt** (object): The settings used to configure the reset confirmation prompt. Contains the following attributes:

   * **\_isEnabled** (boolean): Determines whether to show a confirmation prompt before resetting. The default is `false`.

   * **title** (string): The text used as the popup title. Leave empty if no title is required.

   * **body** (string): The text used as confirmaation that the user wishes to reset. More appropriate if the filtered scoring sets will action a `"hard"` reset and require interactions to be completed again.

**\_completionBody** (string): This text overwrites the standard `body` attribute upon completion of the scoring set. It can use the following variables: `{{{score}}}`, `{{{maxScore}}}`, `{{{scaledScore}}}`. If the associated scoring set contains attempts logic, `{{attemptsSpent}}`, `{{attempts}}`, `{{attemptsLeft}}` can also be used. The variable `{{{feedback}}}`, representing the feedback assigned to the appropriate band, is also allowed.

**\_isBandsScoreScaled** (boolean): Determines whether `feedback bands scoring is to be used as raw or percentage values.

**\_bands** (array): Each item represents the feedback and opportunity to retry for the appropriate range of scores, and contains the following attributes:

 * **\_score** (number): Represents the raw or percentage score that indicates the low end or start of the range. The range continues to the next highest value of another band.

 * **feedback** (string): This text will be displayed to the learner when the learner's score falls within this band's range. It replaces the `{{{feedback}}}` variable when used within `_completionBody`.

 * **\_allowRetry** (boolean): Determines whether the learner will be allowed to retry the scoring set. This setting will be ignored if any filtered scoring set used in `_subsetsQuery` cannot be reset.

 * **\_classes** (string): Classes that will be applied to the containing article if the user's score falls into this band. Allows for custom styling based on the feedback band.

----------------------------
**Version number:** 0.0.1 (pre-release)<br>
**Framework versions:** 5.20+<br>
**Author / maintainer:** Adapt Core Team with [contributors](https://github.com/adaptlearning/adapt-contrib-scoringResults/graphs/contributors)
**Accessibility support:** WAI AA<br>
**RTL support:** Yes<br>
**Plugin dependenies:** [adapt-contrib-scoring](https://github.com/adaptlearning/adapt-contrib-scoring): ">=0.0.1"
