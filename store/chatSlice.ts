import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { ChatMessage } from '../common/types/chat';
import type { AiFeedbackState } from '../common/types/aiFeedback';

export interface ChatState {
  messages: ChatMessage[];
  reactions: Record<string, string>;
  aiFeedback: Record<string, AiFeedbackState>;
  replyingTo: ChatMessage | null;
  draft: string;
}

const initialState: ChatState = {
  messages: [],
  reactions: {},
  aiFeedback: {},
  replyingTo: null,
  draft: '',
};

export const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    // Initialize messages (load from data)
    initializeMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },

    // Add a new user message
    addUserMessage: (state, action: PayloadAction<Omit<ChatMessage, 'id'>>) => {
      const newMessage: ChatMessage = {
        ...action.payload,
        id: `user-${Date.now()}`,
      };
      state.messages.push(newMessage);
      state.draft = '';
      state.replyingTo = null;
    },

    // Add a new AI message
    addAiMessage: (state, action: PayloadAction<Omit<ChatMessage, 'id'>>) => {
      const newMessage: ChatMessage = {
        ...action.payload,
        id: `ai-${Date.now()}`,
      };
      state.messages.push(newMessage);
    },

    // Update draft
    updateDraft: (state, action: PayloadAction<string>) => {
      state.draft = action.payload;
    },

    // Set replying to a specific message
    setReplyingTo: (state, action: PayloadAction<ChatMessage | null>) => {
      state.replyingTo = action.payload;
    },

    // Add or remove reaction
    setReaction: (state, action: PayloadAction<{ messageId: string; emoji: string }>) => {
      const { messageId, emoji } = action.payload;
      if (state.reactions[messageId] === emoji) {
        // Remove reaction if same emoji is clicked again
        delete state.reactions[messageId];
      } else {
        // Add/replace reaction
        state.reactions[messageId] = emoji;
      }
    },

    // Clear reaction for a message
    clearReaction: (state, action: PayloadAction<string>) => {
      delete state.reactions[action.payload];
    },

    // Set AI feedback (like/dislike)
    setAiFeedback: (
      state,
      action: PayloadAction<{
        messageId: string;
        feedback: AiFeedbackState | undefined;
      }>
    ) => {
      const { messageId, feedback } = action.payload;
      if (feedback) {
        state.aiFeedback[messageId] = feedback;
      } else {
        delete state.aiFeedback[messageId];
      }
    },

    // Clear all session data
    clearSession: (state) => {
      state.messages = [];
      state.reactions = {};
      state.aiFeedback = {};
      state.replyingTo = null;
      state.draft = '';
    },
  },
});

export const {
  initializeMessages,
  addUserMessage,
  addAiMessage,
  updateDraft,
  setReplyingTo,
  setReaction,
  clearReaction,
  setAiFeedback,
  clearSession,
} = chatSlice.actions;

export default chatSlice.reducer;
