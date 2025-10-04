import { renderWithProviders } from '@/test-utils/render';
import { Route, Routes } from 'react-router-dom';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CreateEvent from '@/pages/CreateEvent';
import { TEXT } from '@/constants/text';

const renderCreateEvent = () =>
  renderWithProviders(
    <Routes>
      <Route path="/create-event" element={<CreateEvent />} />
      <Route path="/event-success/:slug" element={<div />} />
    </Routes>,
    { route: '/create-event' },
  );

describe('CreateEvent smoke', () => {
  it('submits when form is valid and surfaces the success toast', async () => {
    const user = userEvent.setup();
    renderCreateEvent();

    await user.type(screen.getByLabelText(/event name/i), 'Weekend MVP Launch');
    await user.type(screen.getByLabelText(/location/i), 'Gothenburg, Sweden');
    await user.type(screen.getByLabelText(/event date/i), '2025-05-10');
    await user.type(screen.getByLabelText(/start time/i), '10:00');
    await user.type(screen.getByLabelText(/end time/i), '12:00');

    await user.click(
      screen.getByRole('button', { name: /create event & generate qr code/i }),
    );

    expect(
      await screen.findByText(TEXT.createEvent.toast.success),
    ).toBeInTheDocument();
  });

  it('surfaces validation feedback when the time range is invalid', async () => {
    const user = userEvent.setup();
    renderCreateEvent();

    await user.type(screen.getByLabelText(/event name/i), 'Weekend MVP Launch');
    await user.type(screen.getByLabelText(/event date/i), '2025-05-10');
    await user.type(screen.getByLabelText(/start time/i), '12:00');
    await user.type(screen.getByLabelText(/end time/i), '12:00');

    await user.click(
      screen.getByRole('button', { name: /create event & generate qr code/i }),
    );

    expect(
      await screen.findByText(TEXT.createEvent.toast.invalidTimeRange),
    ).toBeInTheDocument();
  });
});
