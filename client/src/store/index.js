import { create } from "zustand"
import { createAuthSlice } from "./slices/auth"
import { createChatSlice } from "./slices/chat-slice";


export const useAppStore = create()((...a) => ({
    ...createAuthSlice(...a),
    ...createChatSlice(...a),
}));