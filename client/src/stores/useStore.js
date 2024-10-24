import { create } from 'zustand';

const useStore = create((set) => ({
  dialogs: [],
  selectedDialog: null,
  messages: [],
  newMassageCreate: true,
  setNewMassageCreate: (value) => set({ newMassageCreate: value }),
  setDialogs: (dialogs) => set({ dialogs }),
  setSelectedDialog: (dialog) => set({ selectedDialog: dialog, messages: [] }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => {
      const existingMessageIds = new Set(state.messages.map((msg) => msg.id));
      const newMessages = message.filter(
        (msg) => !existingMessageIds.has(msg.id)
      );
      return { messages: [...state.messages, ...newMessages] };
    }),
}));

export default useStore;
