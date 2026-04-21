import React from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook, waitFor } from "@testing-library/react";
import { ChatHistoryProvider, useChatHistory } from "./ChatHistoryContext";

const clearHistoryMock = vi.fn();

vi.mock("./AuthContext", () => ({
  useAuth: () => ({
    user: { id: "u1" },
    token: "tok",
  }),
}));

vi.mock("../services/api", () => ({
  chatService: {
    clearHistory: (...args: unknown[]) => clearHistoryMock(...args),
  },
}));

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <ChatHistoryProvider>{children}</ChatHistoryProvider>
);

describe("ChatHistoryContext", () => {
  beforeEach(() => {
    localStorage.clear();
    clearHistoryMock.mockReset();
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
    expect(result.current.getConversationCount()).toBe(1);

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
});
