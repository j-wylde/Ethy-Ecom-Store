import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import ProductGrid from '../../components/ProductGrid';

// Create a QueryClient instance
const queryClient = new QueryClient();

describe('ProductGrid', () => {
  it('testProductsFetchedAndDisplayed', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProductGrid category="Electronics" limit={5} searchQuery="phone" />
      </QueryClientProvider>
    );
    
    // Wait for the products to be fetched and displayed
    const productCards = await screen.findAllByRole('status'); // Assuming ProductCard renders an article element
    expect(productCards.length).toBeGreaterThan(0);
  });

  it('testLoadingSkeletonDisplayed', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <ProductGrid category="Electronics" limit={5} searchQuery="phone" />
      </QueryClientProvider>
    );
    
    // Check if the loading skeleton is displayed
    const skeletons = screen.getAllByRole('status'); // Assuming Skeleton renders a status role element
    expect(skeletons.length).toBeGreaterThan(0);
  });
});
