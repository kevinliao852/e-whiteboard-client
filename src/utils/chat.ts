export function isOwnChatMessage(
  senderId: number,
  senderName: string,
  currentUserId: number | null,
  currentUserName: string | null,
) {
  if (senderId === 0) {
    if (!currentUserName) {
      return false;
    }

    return (
      senderName.trim().toLowerCase() ===
      currentUserName.trim().toLowerCase()
    );
  }

  return currentUserId != null && senderId === currentUserId;
}
