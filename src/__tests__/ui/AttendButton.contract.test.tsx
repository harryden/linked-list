import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import AttendButton from '@/pages/event/components/AttendButton';
import { TEXT } from '@/constants/text';

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe('AttendButton contract', () => {
  it('exposes an actionable primary button with the current label', () => {
    renderWithRouter(
      <AttendButton
        currentUserId="user_test"
        isOrganizer={false}
        isAttending={false}
        onCheckIn={vi.fn()}
        isLoading={false}
      />,
    );

    const button = screen.getByRole('button', {
      name: TEXT.event.attendButton.checkIn,
    });

    expect(button).toBeEnabled();
  });

  it('renders the LinkedIn variant with the expected accessible label and icon', () => {
    renderWithRouter(
      <AttendButton
        currentUserId="user_test"
        isOrganizer={false}
        isAttending={false}
        onCheckIn={vi.fn()}
        isLoading={false}
        mode="linkedin"
      />,
    );

    const button = screen.getByRole('button', {
      name: TEXT.event.attendButton.checkInLinkedIn,
    });

    expect(button.querySelector('svg')).toBeTruthy();
  });

  it('disables the control and shows the loading copy when the request is pending', () => {
    renderWithRouter(
      <AttendButton
        currentUserId="user_test"
        isOrganizer={false}
        isAttending={false}
        onCheckIn={vi.fn()}
        isLoading
      />,
    );

    const button = screen.getByRole('button', {
      name: TEXT.event.attendButton.checkingIn,
    });

    expect(button).toBeDisabled();
  });

  it('hides the attend action for organizers and attendees', () => {
    const { rerender } = renderWithRouter(
      <AttendButton
        currentUserId="user_test"
        isOrganizer
        isAttending={false}
        onCheckIn={vi.fn()}
        isLoading={false}
      />,
    );

    expect(
      screen.queryByRole('button', {
        name: /check in/i,
      }),
    ).not.toBeInTheDocument();

    rerender(
      <MemoryRouter>
        <AttendButton
          currentUserId="user_test"
          isOrganizer={false}
          isAttending
          onCheckIn={vi.fn()}
          isLoading={false}
        />
      </MemoryRouter>,
    );

    expect(
      screen.queryByRole('button', {
        name: /check in/i,
      }),
    ).not.toBeInTheDocument();
  });

  it('routes unauthenticated users through /auth with a sanitized redirect', () => {
    renderWithRouter(
      <AttendButton
        currentUserId={null}
        isOrganizer={false}
        isAttending={false}
        onCheckIn={vi.fn()}
        isLoading={false}
        redirectPath="javascript:alert('xss')"
        mode="linkedin"
      />,
    );

    const link = screen.getByRole('link', {
      name: TEXT.event.attendButton.checkInLinkedIn,
    });

    expect(link).toHaveAttribute('href', '/auth?redirect=%2F');
  });

  it('invokes the supplied check-in handler when the user is authenticated', async () => {
    const onCheckIn = vi.fn();
    const user = userEvent.setup();

    renderWithRouter(
      <AttendButton
        currentUserId="user_test"
        isOrganizer={false}
        isAttending={false}
        onCheckIn={onCheckIn}
        isLoading={false}
      />,
    );

    await user.click(
      screen.getByRole('button', {
        name: TEXT.event.attendButton.checkIn,
      }),
    );

    expect(onCheckIn).toHaveBeenCalledTimes(1);
  });
});
