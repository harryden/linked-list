import { expect, test } from "@playwright/test";
import { TEXT } from "../src/constants/text";
import {
  mockSupabase,
  type MockEvent,
  type MockUser,
} from "./support/supabase";

const selectedEventDate = "15";

const organizer: MockUser = {
  id: "user-organizer",
  email: "organizer@example.com",
  name: "Ada Lovelace",
  headline: "Community Builder",
  linkedin_id: "ada-lovelace",
};

const attendee: MockUser = {
  id: "user-attendee",
  email: "attendee@example.com",
  name: "Grace Hopper",
  headline: "Compiler Pioneer",
  linkedin_id: "grace-hopper",
};

const hostedEvent: MockEvent = {
  id: "00000000-0000-4000-8000-000000000101",
  slug: "founder-breakfast",
  name: "Founder Breakfast",
  organizer_id: organizer.id,
  short_code: "FB2025",
  location: "Gothenburg",
  starts_at: "2026-05-01T08:00:00.000Z",
  ends_at: "2026-05-01T10:00:00.000Z",
};

const attendedEvent: MockEvent = {
  id: "00000000-0000-4000-8000-000000000102",
  slug: "community-dinner",
  name: "Community Dinner",
  organizer_id: organizer.id,
  short_code: "CD2025",
  location: "Stockholm",
  starts_at: "2026-05-03T18:00:00.000Z",
  ends_at: "2026-05-03T20:00:00.000Z",
};

test.describe("Critical release flows", () => {
  test("redirects unauthenticated dashboard visits to sign-in", async ({
    page,
  }) => {
    await mockSupabase(page);

    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/auth\?next=%2Fdashboard$/);
    await expect(
      page.getByRole("button", { name: TEXT.auth.card.buttonIdle }),
    ).toBeVisible();
  });

  test("keeps an authenticated dashboard session across reloads", async ({
    page,
  }) => {
    await mockSupabase(page, {
      sessionUser: organizer,
      users: [attendee],
      events: [hostedEvent, attendedEvent],
      attendances: [
        {
          event_id: attendedEvent.id,
          user_id: organizer.id,
          created_at: "2026-05-03T18:15:00.000Z",
        },
      ],
    });

    await page.goto("/dashboard");

    await expect(
      page.getByRole("link", { name: /Founder Breakfast/ }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Community Dinner/ }).first(),
    ).toBeVisible();

    await page.reload();

    await expect(page).toHaveURL("/dashboard");
    await expect(
      page.getByRole("link", { name: /Founder Breakfast/ }).first(),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Community Dinner/ }).first(),
    ).toBeVisible();
  });

  test("creates an event successfully", async ({ page }) => {
    await mockSupabase(page, {
      sessionUser: organizer,
      events: [],
    });

    await page.goto("/create-event");

    await page
      .getByLabel(TEXT.createEvent.form.fields.nameLabel)
      .fill("Launch Week Mixer");
    await page
      .getByRole("button", { name: TEXT.createEvent.form.fields.dateLabel })
      .click();
    await page.getByRole("gridcell", { name: selectedEventDate }).click();
    await page
      .getByLabel(TEXT.createEvent.form.fields.startTimeLabel)
      .fill("18:00");
    await page
      .getByLabel(TEXT.createEvent.form.fields.endTimeLabel)
      .fill("20:00");

    await page
      .getByRole("button", { name: TEXT.createEvent.form.submitIdle })
      .click();

    await expect(page).toHaveURL(
      /\/event-success\/launch-week-mixer-[a-z0-9]+$/,
    );
    await expect(page.getByText(/^EVENT CREATED ·/)).toBeVisible();
    await expect(page.getByText("Launch Week Mixer")).toBeVisible();
  });

  test("checks an attendee into an event and reveals the roster", async ({
    page,
  }) => {
    await mockSupabase(page, {
      sessionUser: attendee,
      users: [organizer],
      events: [hostedEvent],
      attendances: [],
    });

    await page.goto(`/event/${hostedEvent.slug}`);

    await page
      .getByRole("button", { name: TEXT.event.attendButton.checkIn })
      .click();

    await expect(
      page.getByText(TEXT.event.page.checkInSuccessBanner),
    ).toBeVisible();
    await expect(page.getByText("Grace Hopper")).toBeVisible();
    await expect(page.getByText(/\(you\)/)).toBeVisible();
  });

  test("exports the attendee roster for organizers", async ({ page }) => {
    await mockSupabase(page, {
      sessionUser: organizer,
      users: [attendee],
      events: [hostedEvent],
      attendances: [
        {
          event_id: hostedEvent.id,
          user_id: attendee.id,
          created_at: "2026-05-01T08:15:00.000Z",
        },
      ],
    });

    await page.goto(`/event/${hostedEvent.slug}`);

    await page.getByRole("button", { name: TEXT.event.header.options }).click();

    const downloadPromise = page.waitForEvent("download");
    await page
      .getByRole("menuitem", { name: TEXT.event.attendeeList.exportCsv })
      .click();

    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe(
      "founder_breakfast-attendees.csv",
    );
    await expect(
      page.getByText(TEXT.event.toast.exportSuccess, { exact: true }).first(),
    ).toBeVisible();
  });
});
