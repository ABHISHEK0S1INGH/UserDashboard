import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import Modal from '../../components/Modal';
import ConfirmDialog from '../../components/ConfirmDialog';
import LoadingSpinner from '../../components/LoadingSpinner';

describe('Modal Component', () => {
  it('should render modal when isOpen is true', () => {
    render(
      <Modal isOpen={true} onClose={() => {}} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.getByText('Test Modal')).toBeInTheDocument();
    expect(screen.getByText('Modal Content')).toBeInTheDocument();
  });

  it('should not render modal when isOpen is false', () => {
    render(
      <Modal isOpen={false} onClose={() => {}} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );

    expect(screen.queryByText('Modal Content')).not.toBeInTheDocument();
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(
      <Modal isOpen={true} onClose={onClose} title="Test Modal">
        <p>Modal Content</p>
      </Modal>
    );

    const closeButton = screen.getByRole('button');
    closeButton.click();

    expect(onClose).toHaveBeenCalled();
  });
});

describe('ConfirmDialog Component', () => {
  it('should render confirmation dialog', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Confirm Action"
        message="Are you sure?"
      />
    );

    expect(screen.getByText('Confirm Action')).toBeInTheDocument();
    expect(screen.getByText('Are you sure?')).toBeInTheDocument();
  });

  it('should call onConfirm when confirm button is clicked', () => {
    const onConfirm = vi.fn();
    const onClose = vi.fn();
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={onClose}
        onConfirm={onConfirm}
        title="Confirm"
        message="Proceed?"
        confirmText="Yes"
        cancelText="No"
      />
    );

    const confirmButton = screen.getByRole('button', { name: /yes/i });
    confirmButton.click();

    expect(onConfirm).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it('should display custom button text', () => {
    render(
      <ConfirmDialog
        isOpen={true}
        onClose={() => {}}
        onConfirm={() => {}}
        title="Confirm"
        message="Proceed?"
        confirmText="Delete"
        cancelText="Keep"
      />
    );

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /keep/i })).toBeInTheDocument();
  });
});

describe('LoadingSpinner Component', () => {
  it('should render spinner', () => {
    const { container } = render(<LoadingSpinner />);

    expect(container.querySelector('.spinner')).toBeInTheDocument();
  });

  it('should display message when provided', () => {
    render(<LoadingSpinner message="Loading..." />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('should apply size class', () => {
    const { container } = render(<LoadingSpinner size="large" />);

    expect(container.querySelector('.spinner-large')).toBeInTheDocument();
  });

  it('should support different sizes', () => {
    const { container: smallContainer } = render(<LoadingSpinner size="small" />);
    expect(smallContainer.querySelector('.spinner-small')).toBeInTheDocument();

    const { container: mediumContainer } = render(<LoadingSpinner size="medium" />);
    expect(mediumContainer.querySelector('.spinner-medium')).toBeInTheDocument();

    const { container: largeContainer } = render(<LoadingSpinner size="large" />);
    expect(largeContainer.querySelector('.spinner-large')).toBeInTheDocument();
  });
});
