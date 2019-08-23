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
    item 
  } = props;
  return (
    <div className={card.cardItem} style={{boxShadow: '0 3px 5px -5px rgba(0,0,0,.15)'}}>
      {renderListCardFlag ? <div className={card.flag}>{renderListCardFlag(item)}</div> : null}
      <div onClick={() => onCardClick && onCardClick(item)}>
        <div className={card.cardItemHeader}>
          { renderListCardHeader(item) }
        </div>
        <div className={card.cardItemBody}>
          { renderListCardBody(item) }
        </div>
        <div className={card.cardItemExtra}>
          { renderListCardExtra(item) }
        </div>
      </div>
      { 
        renderListCardFooter && renderListCardFooter(item)
      }
    </div>
  )
}