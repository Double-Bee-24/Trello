import type { JSX } from 'react';
import type { IBoardPreview } from '@interfaces';
import styles from './BoardPreview.module.scss';

export function BoardPreview({ title, background }: IBoardPreview): JSX.Element {
  return (
    <div className={styles.board_preview_item} style={{ backgroundColor: background }}>
      {title}
    </div>
  );
}
