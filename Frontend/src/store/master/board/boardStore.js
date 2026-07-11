import { create } from "zustand";
import { boardApi } from "../../../api/master/board/boardApi";
import toast from "react-hot-toast";

export const useBoardStore = create((set, get) => ({
    boards: [],
    loading: false,
    submitLoading: false,
    selectedBoard: null,

    fetchBoards: async () => {
        try {
            set({ loading: true });

            const res = await boardApi.getAll();

            set({
                boards: res.data?.data || [],
            });
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to fetch boards"
            );
        } finally {
            set({ loading: false });
        }
    },

    createBoard: async (formData) => {
        try {
            set({ submitLoading: true });

            const res = await boardApi.create(formData);

            set({
                boards: [res.data.data, ...get().boards],
            });

            toast.success(
                res.data?.message || "Board created successfully"
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to create board"
            );
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    updateBoard: async (slug, formData) => {
        try {
            set({ submitLoading: true });

            const res = await boardApi.update(slug, formData);

            set({
                boards: get().boards.map((board) =>
                    board.slug === slug ? res.data.data : board
                ),
            });

            toast.success(
                res.data?.message || "Board updated successfully"
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to update board"
            );
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    deleteBoard: async (slug) => {
        try {
            set({ submitLoading: true });

            const res = await boardApi.delete(slug);

            set({
                boards: get().boards.filter(
                    (board) => board.slug !== slug
                ),
            });

            toast.success(
                res.data?.message || "Board deleted successfully"
            );

            return true;
        } catch (error) {
            toast.error(
                error?.response?.data?.message || "Failed to delete board"
            );
            return false;
        } finally {
            set({ submitLoading: false });
        }
    },

    setSelectedBoard: (board) => {
        set({ selectedBoard: board });
    },

    clearSelectedBoard: () => {
        set({ selectedBoard: null });
    },
}));