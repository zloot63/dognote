// lucide-react 모킹
module.exports = {
  Check: function Check(props) {
    return {
      type: 'svg',
      props: {
        ...props,
        'data-testid': 'check-icon',
      },
      key: null,
      ref: null,
      $$typeof: Symbol.for('react.element'),
    };
  },
  Copy: function Copy(props) {
    return {
      type: 'svg',
      props: {
        ...props,
        'data-testid': 'copy-icon',
      },
      key: null,
      ref: null,
      $$typeof: Symbol.for('react.element'),
    };
  },
  // 필요한 다른 아이콘들도 여기에 추가
};
