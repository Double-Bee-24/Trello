import React from 'react';
import './progressBar.scss';
import { IProgressBar } from '../../../../common/interfaces/IProgressBar';

export function ProgressBar({ progress }: IProgressBar): JSX.Element {
  return (
    <div>
      <div className="dark-bg" />
      <div className="progress-bar">
        <div className="filler" style={{ width: `${progress - 3}%` }}>
          {progress}%
        </div>
      </div>
    </div>
  );
}
