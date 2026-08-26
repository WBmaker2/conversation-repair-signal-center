import { render, screen } from '@testing-library/react';
import { App } from './App';

it('renders the Korean service name and the learning promise', () => {
  render(<App />);
  expect(screen.getByRole('heading', { name: '대화 수리 신호센터' })).toBeVisible();
  expect(screen.getByText('못 알아들은 순간은 대화를 이어 가는 신호예요.')).toBeVisible();
});
