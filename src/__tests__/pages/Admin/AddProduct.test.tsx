import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { vi } from 'vitest';
import AddProduct from '@/pages/Admin/AddProduct';
import { useCreateProduct, useUploadProductImage, useUpdateProduct, useProduct } from '@/services/productService';
import { useToast } from '@/hooks/use-toast';

vi.mock('@/services/productService');
vi.mock('@/hooks/use-toast');

describe('AddProduct', () => {
  it('test_create_new_product_success', async () => {
    const createProductMock = vi.fn().mockResolvedValue({ id: '123' });
    const uploadImageMock = vi.fn().mockResolvedValue('http://image.url');
    const updateProductMock = vi.fn().mockResolvedValue({});
    const toastMock = vi.fn();
    const productMock = { 
      name: '', 
      description: '', 
      price: 0, 
      stock: 0, 
      category: '', 
      image_url: null, 
      shipping_fee: 0 
    };

    (useCreateProduct as unknown as jest.Mock).mockReturnValue({ 
      mutateAsync: createProductMock, 
      isPending: false 
    });
    (useUploadProductImage as unknown as jest.Mock).mockReturnValue({ 
      mutateAsync: uploadImageMock, 
      isPending: false 
    });
    (useUpdateProduct as unknown as jest.Mock).mockReturnValue({ 
      mutateAsync: updateProductMock, 
      isPending: false 
    });
    (useToast as unknown as jest.Mock).mockReturnValue({ 
      toast: toastMock 
    });
    (useProduct as unknown as jest.Mock).mockReturnValue({ 
      data: productMock, 
      isLoading: false 
    });

    render(
      <BrowserRouter>
        <AddProduct />
      </BrowserRouter>
    );

    // Simulate user input
    fireEvent.change(screen.getByLabelText(/Product Name/i), { 
      target: { value: 'Test Product' } 
    });
    fireEvent.change(screen.getByLabelText(/Category/i), { 
      target: { value: 'Body Care' } 
    });
    fireEvent.change(screen.getByLabelText(/Price/i), { 
      target: { value: '100' } 
    });
    fireEvent.change(screen.getByLabelText(/Stock Quantity/i), { 
      target: { value: '10' } 
    });
    fireEvent.change(screen.getByLabelText(/Product Description/i), { 
      target: { value: 'Test Description' } 
    });

    const file = new File(['image'], 'product.jpg', { type: 'image/jpeg' });
    fireEvent.change(screen.getByLabelText(/Product Image/i), { target: { files: [file] } });

    // Get the form by its class name since it doesn't have a form role
    const form = screen.getByTestId('add-product-form');
    
    // Submit the form by clicking the submit button
    fireEvent.click(screen.getByRole('button', { name: /Add Product/i }));

    // Verify createProduct was called with expected data

    // Verify createProduct was called with expected data
    await waitFor(() => {
      expect(createProductMock).toHaveBeenCalledWith({
        name: 'Test Product',
        description: 'Test Description',
        price: 100,
        stock: 10,
        category: 'Body Care',
        image_url: null,
        shipping_fee: 0
      });
    }, { timeout: 3000 });

    await waitFor(() => {
      expect(uploadImageMock).toHaveBeenCalledWith({ 
        productId: '123', 
        imageFile: file 
      });
    });

    await waitFor(() => {
      expect(updateProductMock).toHaveBeenCalledWith({ 
        id: '123', 
        product: { 
          image_url: 'http://image.url' 
        } 
      });
    });

    await waitFor(() => {
      expect(toastMock).toHaveBeenCalledWith({
        title: 'Success!',
        description: 'Product created successfully.',
      });
    }, { timeout: 3000 });
  });
});