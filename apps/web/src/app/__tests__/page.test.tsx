import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import LandingPage from '../page';

describe('LandingPage', () => {
  it('renders the MATHO tagline and CTA buttons', () => {
    render(<LandingPage />);
    expect(screen.getByText('MATHO')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /get started/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /browse marketplace/i })).toBeInTheDocument();
  });
});
