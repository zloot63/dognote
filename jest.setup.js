// jest-dom은 DOM 노드에 대한 assertion을 추가합니다
import '@testing-library/jest-dom';

// 테스트 중 경고 메시지 무시 설정
const originalConsoleError = console.error;
console.error = (...args) => {
  if (
    /Warning: ReactDOM.render is no longer supported in React 18/.test(
      args[0]
    ) ||
    /Warning: useLayoutEffect does nothing on the server/.test(args[0])
  ) {
    return;
  }
  originalConsoleError(...args);
};
