import React from 'react';
import './boardPreview.scss';
import { IBoardPreview } from '../../../../common/interfaces/IBoardPreview';

export function BoardPreview({ title, background }: IBoardPreview): JSX.Element {
  return (
    <div className="board-preview-item" style={{ backgroundColor: background }}>
      {title}
    </div>
  );
}
