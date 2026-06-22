import { isOwnChatMessage } from "./chat";

describe("isOwnChatMessage", () => {
  it("matches registered users by sender id", () => {
    expect(isOwnChatMessage(12, "Old Name", 12, "Current Name")).toBe(true);
    expect(isOwnChatMessage(13, "Current Name", 12, "Current Name")).toBe(false);
  });

  it("matches guest messages by name when sender ids are zero", () => {
    expect(isOwnChatMessage(0, "Guest-a1b2", 0, "Guest-a1b2")).toBe(true);
    expect(isOwnChatMessage(0, "Guest-c3d4", 0, "Guest-a1b2")).toBe(false);
  });

  it("normalizes guest name casing and surrounding whitespace", () => {
    expect(isOwnChatMessage(0, " guest-a1b2 ", 0, "Guest-A1B2")).toBe(true);
  });
});
