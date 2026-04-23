import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { ChatHistoryProvider, useChatHistory } from "./ChatHistoryContext";

const clearHistoryMock = vi.fn();
const syncHistoryMock = vi.fn();

vi.mock("./AuthContext", () => ({
  useAuth: () => ({
    user: { id: "u1" },
    token: "tok",
  }),
}));

vi.mock("../services/api", () => ({
  chatService: {
    clearHistory: (...args: unknown[]) => clearHistoryMock(...args),
    syncHistory: (...args: unknown[]) => syncHistoryMock(...args),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ChatHistoryProvider>{children}</ChatHistoryProvider>
);

describe("ChatHistoryContext", () => {
  beforeEach(() => {
    localStorage.clear();
    clearHistoryMock.mockReset();
    syncHistoryMock.mockReset();
    syncHistoryMock.mockResolvedValue({ success: true });
    vi.spyOn(window, "confirm").mockReturnValue(true);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("starts conversation and appends messages", async () => {
    const { result } = renderHook(() => useChatHistory(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let id = "";
    act(() => {
      id = result.current.startNewConversation();
    });
    expect(id).toMatch(/^conv_/);
    expect(result.current.getConversationCount()).toBeGreaterThanOrEqual(1);

    act(() => {
      result.current.addMessage({
        id: "m1",
        text: "hello eve",
        sender: "user",
        timestamp: new Date(),
      });
    });

    expect(result.current.getTotalMessages()).toBe(1);
    expect(result.current.currentConversation?.messages[0].text).toBe("hello eve");
  });

  it("exports history and clears all data", async () => {
    const createObjectURL = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:url");
    const revokeObjectURL = vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    const clickMock = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
      if (tagName.toLowerCase() === "a") {
        const anchor = originalCreateElement("a");
        anchor.click = clickMock;
        return anchor;
      }
      return originalCreateElement(tagName);
    });

    const { result } = renderHook(() => useChatHistory(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.startNewConversation();
      result.current.addMessage({
        id: "m1",
        text: "message",
        sender: "user",
        timestamp: new Date(),
      });
      result.current.exportHistory();
    });

    expect(createObjectURL).toHaveBeenCalled();
    expect(clickMock).toHaveBeenCalled();

    clearHistoryMock.mockResolvedValue({ success: true });
    await act(async () => {
      result.current.clearAllHistory();
    });
    expect(result.current.getConversationCount()).toBe(0);
    expect(localStorage.getItem("virida_chat_history")).toBeNull();
  });

  it("deletes a specific conversation", async () => {
    const { result } = renderHook(() => useChatHistory(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    let id = "";
    act(() => {
      id = result.current.startNewConversation();
    });
    expect(result.current.getConversation(id)).toBeDefined();

    act(() => {
      result.current.deleteConversation(id);
    });
    expect(result.current.getConversation(id)).toBeUndefined();
  });

  it("loads existing history from localStorage", async () => {
    localStorage.setItem(
      "virida_chat_history",
      JSON.stringify([
        {
          id: "conv_1",
          createdAt: "2026-01-01T00:00:00.000Z",
          updatedAt: "2026-01-01T00:00:00.000Z",
          messages: [
            {
              id: "m1",
              text: "hi",
              sender: "user",
              timestamp: "2026-01-01T00:00:00.000Z",
            },
          ],
        },
      ])
    );

    const { result } = renderHook(() => useChatHistory(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.getConversationCount()).toBe(1);
    expect(result.current.getTotalMessages()).toBe(1);
    expect(result.current.currentConversation?.id).toBe("conv_1");
  });

  it("does not clear history when confirmation is declined", async () => {
    vi.spyOn(window, "confirm").mockReturnValue(false);
    const { result } = renderHook(() => useChatHistory(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.startNewConversation();
      result.current.addMessage({
        id: "m1",
        text: "message",
        sender: "user",
        timestamp: new Date(),
      });
      result.current.clearAllHistory();
    });

    expect(result.current.getConversationCount()).toBeGreaterThanOrEqual(1);
  });

  it("keeps working when localStorage save fails", async () => {
    const setItemSpy = vi
      .spyOn(window.localStorage.__proto__, "setItem")
      .mockImplementationOnce(() => {
        throw new Error("quota exceeded");
      });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const { result } = renderHook(() => useChatHistory(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.startNewConversation();
      result.current.addMessage({
        id: "m-storage",
        text: "persist me",
        sender: "user",
        timestamp: new Date(),
      });
    });

    await waitFor(() =>
      expect(result.current.getConversationCount()).toBeGreaterThanOrEqual(1)
    );
    expect(errorSpy).toHaveBeenCalled();
    setItemSpy.mockRestore();
    errorSpy.mockRestore();
  });

  it("exports metadata-rich conversation payload", async () => {
    const createUrlSpy = vi.spyOn(URL, "createObjectURL").mockReturnValue("blob:url");
    vi.spyOn(URL, "revokeObjectURL").mockImplementation(() => undefined);
    const clickMock = vi.fn();
    const originalCreateElement = document.createElement.bind(document);
    vi.spyOn(document, "createElement").mockImplementation((tagName: string) => {
      if (tagName.toLowerCase() === "a") {
        const anchor = originalCreateElement("a");
        anchor.click = clickMock;
        return anchor;
      }
      return originalCreateElement(tagName);
    });

    const { result } = renderHook(() => useChatHistory(), { wrapper });
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    act(() => {
      result.current.startNewConversation();
      result.current.addMessage({
        id: "m-user",
        text: "first user message for generated title",
        sender: "user",
        timestamp: new Date("2026-01-01T00:00:00.000Z"),
        metadata: {
          method: "rag",
          processingTime: 42,
          ragUsed: true,
          sources: [{ title: "doc" }],
        },
      });
    });

    await waitFor(() =>
      expect(result.current.getTotalMessages()).toBeGreaterThanOrEqual(1)
    );

    act(() => {
      result.current.exportHistory();
    });

    expect(clickMock).toHaveBeenCalled();
    const blobArg = createUrlSpy.mock.calls[0]?.[0] as Blob;
    const capturedJson = await blobArg.text();
    expect(capturedJson).toContain('"messagesCount": 1');
    expect(capturedJson).toContain('"processingTime": 42');
    expect(capturedJson).toContain('"sources"');
  });
});
