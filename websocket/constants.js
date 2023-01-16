const ACTION_NAMES = new Map([
  ['spotCandle1mData', 'spotCandle1mData'],
  ['spotCandle5mData', 'spotCandle5mData'],
  ['spotCandle1hData', 'spotCandle1hData'],
  ['spotLimitOrders', 'spotLimitOrders'],

  ['futuresCandle1mData', 'futuresCandle1mData'],
  ['futuresCandle5mData', 'futuresCandle5mData'],
  ['futuresCandle1hData', 'futuresCandle1hData'],
  ['futuresLimitOrders', 'futuresLimitOrders'],

  ['futuresBookTicker', 'futuresBookTicker'],
]);

module.exports = {
  ACTION_NAMES,
};
