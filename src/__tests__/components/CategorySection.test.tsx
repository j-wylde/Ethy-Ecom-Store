import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom'; // Extends expect with DOM-related assertions
import { describe, it } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import CategorySection from '../../components/CategorySection';

describe('CategorySection', () => {
  it('testCategoriesDisplayCorrectly', () => {
    render(
      <BrowserRouter>
        <CategorySection />
      </BrowserRouter>
    );

    const categories = [
      { name: "BODY CARE", image: "/imgs/bodycare.jpg" },
      { name: "FACIAL CARE", image: "/imgs/facialcare.jpg" },
      { name: "LIP CARE", image: "/imgs/lipcare.jpg" },
      { name: "INTIMATE CARE", image: "/imgs/intimate.jpeg" },
      { name: "SKINCARE SETS", image: "/imgs/skincare.jpg" },
    ];

    categories.forEach(category => {
      const categoryName = screen.getByText(category.name);
      const categoryImage = screen.getByAltText(category.name);

      expect(categoryName).toBeInTheDocument();
      expect(categoryImage).toHaveAttribute('src', category.image);
    });
  });
});