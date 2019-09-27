import React from 'react';
import card from '@/style/card.less';

export default props => {
  const { 
    renderListCardHeader,
    renderListCardBody,
    renderListCardExtra, 
    renderListCardFooter,
    renderListCardFlag,
    onCardClick,
    item,
    className = ''
  } = props;
  return (
    <div className={`${card.cardItem} ${className}`}>
      {
        renderListCardFlag ? 
        <div className={card.flag}>{renderListCardFlag(item)}</div> : 
        null
      }
      <div onClick={() => onCardClick && onCardClick(item)}>
        <div className={card.cardItemHeader}>
          { renderListCardHeader(item) }
        </div>
        <div className={card.cardItemBody}>
          { renderListCardBody(item) }
        </div>
        {
          renderListCardExtra ? 
          <div className={card.cardItemExtra}>{ renderListCardExtra(item) }</div> :
          null
        }
      </div>
      { 
        renderListCardFooter && renderListCardFooter(item)
      }
    </div>
  )
}