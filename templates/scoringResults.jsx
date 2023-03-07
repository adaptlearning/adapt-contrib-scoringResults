import React from 'react';
import { templates, classes, html, compile } from 'core/js/reactHelpers';

export default function SetResults(props) {

  const {
    _isVisible,
    isPass,
    _isRetryEnabled,
    retryFeedback
  } = props;

  if (!_isVisible) return null;

  return (
    <div className='component__inner setresults__inner'>

      <templates.header {...props} />

      <div
        className={classes([
          'component__widget',
          'setresults__widget',
          isPass ? 'is-passed' : 'is-failed'
        ])}
      >

        {_isRetryEnabled &&
          <div className='component__feedback setresults__feedback'>
            <div className='component__feedback-inner setresults__feedback-inner'>

              {retryFeedback &&
                <div class="setresults__retry-feedback">
                  <div class="setresults__retry-feedback-inner">
                    {html(compile(retryFeedback))}
                  </div>
                </div>
              }

              <button class="btn-text setresults__retry-btn js-set-retry-btn">
                <span>{props._retry.button}</span>
              </button>

            </div>
          </div>
        }

      </div>

    </div>
  );
}
