import { renderWithProviders } from '@/test-utils/render';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import AttendButton from '@/pages/event/components/AttendButton';

describe('AttendButton smoke', () => {
  it('invokes the provided callback when a signed-in attendee checks in', async () => {
    const user = userEvent.setup();
    const onCheckIn = vi.fn();

    renderWithProviders(
      <AttendButton
        currentUserId="user_test"
        isOrganizer={false}
        isAttending={false}
        onCheckIn={onCheckIn}
        isLoading={false}
        mode="primary"
      />,
    );

    await user.click(screen.getByRole('button', { name: /check in/i }));
    expect(onCheckIn).toHaveBeenCalledTimes(1);
  });

  it('hides the button when the attendee is already checked in', () => {
    renderWithProviders(
      <AttendButton
        currentUserId="user_test"
        isOrganizer={false}
        isAttending={true}
        onCheckIn={vi.fn()}
        isLoading={false}
      />,
    );

    expect(screen.queryByRole('button', { name: /check in/i })).not.toBeInTheDocument();
  });

  it('routes to auth with the provided redirect path when not signed in', () => {
    renderWithProviders(
      <AttendButton
        currentUserId={null}
        isOrganizer={false}
        isAttending={false}
        onCheckIn={vi.fn()}
        isLoading={false}
        mode="linkedin"
        redirectPath="/event/test-event"
      />,
    );

    const link = screen.getByRole('link', {
      name: /check in with linkedin/i,
    });

    expect(link).toHaveAttribute('href', '/auth?redirect=%2Fevent%2Ftest-event');
  });
});
