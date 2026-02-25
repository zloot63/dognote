// react-copy-to-clipboard 모킹
import React from 'react';

export const CopyToClipboard = ({ text, onCopy, children }) => {
  return React.createElement(
    'button',
    {
      onClick: () => onCopy && onCopy(text),
      'data-testid': `copy-button-${text}`,
    },
    children
  );
};
