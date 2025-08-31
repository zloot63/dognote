import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { Modal } from '@/components/ui/Modal';

describe('Modal Component', () => {
  it('renders modal when open is true', () => {
    render(
      <Modal open={true} onClose={vi.fn()}>
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('does not render modal when open is false', () => {
    render(
      <Modal open={false} onClose={vi.fn()}>
        <div>Modal content</div>
      </Modal>
    );
    
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('calls onClose when backdrop is clicked', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Modal open={true} onClose={onClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    // Click on backdrop (overlay)
    const overlay = screen.getByRole('dialog').parentElement;
    await user.click(overlay!);
    
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'backdropClick');
  });

  it('calls onClose when escape key is pressed', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Modal open={true} onClose={onClose}>
        <div>Modal content</div>
      </Modal>
    );
    
    await user.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalledWith(expect.anything(), 'escapeKeyDown');
  });

  it('applies fullScreen styles correctly', () => {
    render(
      <Modal open={true} onClose={vi.fn()} fullScreen>
        <div>Fullscreen modal</div>
      </Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('h-full');
  });

  it('applies maxWidth correctly', () => {
    render(
      <Modal open={true} onClose={vi.fn()} maxWidth="sm">
        <div>Small modal</div>
      </Modal>
    );
    
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveClass('max-w-sm');
  });

  it('respects closeOnBackdropClick prop', async () => {
    const onClose = vi.fn();
    const user = userEvent.setup();
    
    render(
      <Modal open={true} onClose={onClose} closeOnBackdropClick={false}>
        <div>Modal content</div>
      </Modal>
    );
    
    const overlay = screen.getByRole('dialog').parentElement;
    await user.click(overlay!);
    
    expect(onClose).not.toHaveBeenCalled();
  });
});
