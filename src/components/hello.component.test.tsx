import { render, screen } from 'test-utils';
import '@testing-library/jest-dom';
import Hello from './hello.component';

describe('Component: Hello', () => {
  test('Displays greeting', async () => {
    // ARRANGE
    render(<Hello name="user" />);

    // ACT

    // ASSERT
    expect(screen.getByText('Hello World and user!')).toBeInTheDocument();
  });
});
