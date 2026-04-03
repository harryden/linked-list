import type { ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { renderHook, waitFor } from "@testing-library/react";
import { vi } from "vitest";
import {
  eventQueryKey,
  fetchEvents,
  useCreateEvent,
  useDeleteEvent,
} from "@/hooks/useEvents";
import { useJoinEvent, useLeaveEvent } from "@/hooks/useAttendances";
import { createQueryStub, supabaseStub } from "@/test-utils/supabase";

const createWrapper = () => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const wrapper = ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={client}>{children}</QueryClientProvider>
  );

  return { client, wrapper };
};

describe("supabase hooks", () => {
  it("fetches events with the organizer filter and descending order", async () => {
    const result = { data: [{ id: "event-1" }], error: null };
    const query = createQueryStub({ baseResult: result });
    query.select.mockReturnValue(query);
    query.eq.mockReturnValue(query);
    query.order.mockReturnValue(query);

    supabaseStub.from.mockImplementationOnce((table) => {
      expect(table).toBe("events");
      return query;
    });

    const data = await fetchEvents({ organizerId: "organizer-1" });

    expect(query.eq).toHaveBeenCalledWith("organizer_id", "organizer-1");
    expect(query.order).toHaveBeenCalledWith("created_at", {
      ascending: false,
    });
    expect(data).toEqual(result.data);
  });

  it("invalidates list queries after creating an event", async () => {
    const { client, wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");
    const inserted = {
      id: "event-1",
      slug: "launch-day",
      organizer_id: "organizer-1",
    };

    const query = createQueryStub({
      singleResult: { data: inserted, error: null },
    });
    query.insert.mockReturnValue(query);
    query.select.mockReturnValue(query);

    supabaseStub.from.mockImplementationOnce((table) => {
      expect(table).toBe("events");
      return query;
    });

    const { result } = renderHook(() => useCreateEvent(), { wrapper });

    await result.current.mutateAsync({
      name: "Launch Day",
      slug: "launch-day",
      organizer_id: "organizer-1",
    } as any);

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["events"] });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["my-events"] });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["my-events", "organizer-1"],
      });
    });

    invalidateSpy.mockRestore();
  });

  it("inserts attendance and invalidates caches when joining an event", async () => {
    const { client, wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");
    const query = createQueryStub({ baseResult: { data: null, error: null } });
    query.insert.mockReturnValue(query);

    supabaseStub.from.mockImplementationOnce((table) => {
      expect(table).toBe("attendances");
      return query;
    });

    const { result } = renderHook(() => useJoinEvent(), { wrapper });

    await result.current.mutateAsync({
      eventId: "event-42",
      userId: "user-99",
      source: "manual",
    });

    expect(query.insert).toHaveBeenCalledWith({
      event_id: "event-42",
      user_id: "user-99",
      source: "manual",
    });
    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["attendances"] });
    });

    invalidateSpy.mockRestore();
  });

  it("removes attendance and invalidates caches when leaving an event", async () => {
    const { client, wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");
    const query = createQueryStub({ baseResult: { data: null, error: null } });
    query.delete.mockReturnValue(query);
    query.eq.mockReturnValue(query);

    supabaseStub.from.mockImplementationOnce((table) => {
      expect(table).toBe("attendances");
      return query;
    });

    const { result } = renderHook(() => useLeaveEvent(), { wrapper });

    await result.current.mutateAsync({
      eventId: "event-42",
      userId: "user-99",
    });

    expect(query.eq).toHaveBeenNthCalledWith(1, "event_id", "event-42");
    expect(query.eq).toHaveBeenNthCalledWith(2, "user_id", "user-99");
    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["attendances"] });
    });

    invalidateSpy.mockRestore();
  });

  it("invalidates related caches after deleting an event", async () => {
    const { client, wrapper } = createWrapper();
    const invalidateSpy = vi.spyOn(client, "invalidateQueries");
    const query = createQueryStub({
      baseResult: { data: null, error: null },
      maybeSingleResult: { data: null, error: null },
    });
    query.delete.mockReturnValue(query);
    query.eq.mockReturnValue(query);

    supabaseStub.from.mockImplementationOnce((table) => {
      expect(table).toBe("events");
      return query;
    });

    const { result } = renderHook(() => useDeleteEvent(), { wrapper });

    await result.current.mutateAsync({
      eventId: "event-1",
      organizerId: "organizer-1",
      eventSlug: "launch-day",
    });

    expect(query.delete).toHaveBeenCalled();
    expect(query.eq).toHaveBeenCalledWith("id", "event-1");

    await waitFor(() => {
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["events"] });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["my-events"] });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: eventQueryKey({ id: "event-1" }),
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: eventQueryKey({ slug: "launch-day" }),
      });
      expect(invalidateSpy).toHaveBeenCalledWith({
        queryKey: ["my-events", "organizer-1"],
      });
      expect(invalidateSpy).toHaveBeenCalledWith({ queryKey: ["attendances"] });
    });

    invalidateSpy.mockRestore();
  });
});
