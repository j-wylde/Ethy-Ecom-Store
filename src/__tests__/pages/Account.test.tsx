import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { describe, it, vi } from 'vitest';
import Account from '@/pages/Account';
import { supabase } from '@/integrations/supabase/client';
import { AuthContext } from '@/hooks/useAuth';

describe('Account Page', () => {
  it('test_userProfileRetrieval', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    const mockProfile = {
      id: '123',
      first_name: 'John',
      last_name: 'Doe',
      avatar_url: null,
      updated_at: new Date().toISOString(),
    };

    supabase.from = vi.fn().mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockProfile, error: null }),
        }),
      }),
    });

    render(
      <AuthContext.Provider
        value={{
          user: mockUser,
          signOut: vi.fn(),
          session: null, // Add session property
          isLoading: false, // Add isLoading property
          signIn: vi.fn(), // Add signIn property
          signUp: vi.fn(), // Add signUp property
        }}
      >
        <Account />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
      expect(screen.getByText('test@example.com')).toBeInTheDocument();
    });
  });

  it('test_userProfileUpdate', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    const mockProfile = {
      id: '123',
      first_name: 'John',
      last_name: 'Doe',
      avatar_url: null,
      updated_at: new Date().toISOString(),
    };

    render(
      <AuthContext.Provider
        value={{
          user: mockUser,
          signOut: vi.fn(),
          session: null,
          isLoading: false,
          signIn: vi.fn(),
          signUp: vi.fn(),
        }}
      >
        <Account />
      </AuthContext.Provider>
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('John')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Doe')).toBeInTheDocument();
    });

    const firstNameInput = screen.getByLabelText('First Name');
    const lastNameInput = screen.getByLabelText('Last Name');
    const updateButton = screen.getByText('Update Profile');

    fireEvent.change(firstNameInput, { target: { value: 'Jane' } });
    fireEvent.change(lastNameInput, { target: { value: 'Smith' } });
    fireEvent.click(updateButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue('Jane')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Smith')).toBeInTheDocument();
    });
  });

  it('test_userLogout', async () => {
    const mockUser = {
      id: '123',
      email: 'test@example.com',
      last_sign_in_at: new Date().toISOString(),
      app_metadata: {},
      user_metadata: {},
      aud: 'authenticated',
      created_at: new Date().toISOString(),
    };

    const mockSignOut = vi.fn();

    render(
      <AuthContext.Provider
        value={{
          user: mockUser,
          signOut: mockSignOut,
          session: null,
          isLoading: false,
          signIn: vi.fn(),
          signUp: vi.fn(),
        }}
      >
        <Account />
      </AuthContext.Provider>
    );

    const signOutButton = screen.getByText('Sign Out');
    fireEvent.click(signOutButton);

    await waitFor(() => {
      expect(mockSignOut).toHaveBeenCalled();
    });
  });
});
