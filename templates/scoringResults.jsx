import React from 'react';
import { templates, classes, compile } from 'core/js/reactHelpers';

export default function ScoringResults(props) {

  const {
    _isVisible,
    isPass,
    _isRetryEnabled,
    retryFeedback,
    _retry
  } = props;

  if (!_isVisible) return null;

  return (
    <div className='component__inner scoringresults__inner'>

      <templates.header {...props} />

      <div
        className={classes([
          'component__widget',
          'scoringresults__widget',
          isPass ? 'is-passed' : 'is-failed'
        ])}
      >

        {_isRetryEnabled &&
          <div className='component__feedback scoringresults__feedback'>
            <div className='component__feedback-inner scoringresults__feedback-inner'>

              {retryFeedback &&
                <div className='scoringresults__retry-feedback'>
                  <div
                    className='scoringresults__retry-feedback-inner'
                    dangerouslySetInnerHTML={{ __html: compile(retryFeedback) }}
                    >
                  </div>
                </div>
              }

              <button className='btn-text scoringresults__retry-btn js-set-retry-btn'>
                <span dangerouslySetInnerHTML={{ __html: _retry.button }}></span>
              </button>

            </div>
          </div>
        }

      </div>

    </div>
  );
}
