// react-copy-to-clipboard 모킹
const React = require('react');

module.exports = {
  CopyToClipboard: ({ text, onCopy, children }) => {
    return React.createElement(
      'button',
      {
        onClick: () => onCopy && onCopy(text),
        'data-testid': `copy-button-${text}`
      },
      children
    );
  }
};
