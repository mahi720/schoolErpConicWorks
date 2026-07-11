import crypto from "crypto";
import {
    createStreamRepo,
    getStreamsRepo,
    getStreamBySlugRepo,
    findStreamByTitleRepo,
    updateStreamRepo,
    deleteStreamRepo,
    findBoardByTitleRepo,
    restoreStreamRepo,
    getStreamBySlugForRestoreRepo,
} from "../../../repositories/master/stream/stream.repository.js";

const generateSlug = () => crypto.randomUUID();

export const createStreamService = async (body, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) throw new Error("School not found for this user");
    if (!body.board) throw new Error("Board is required");
    if (!body.streamTitle) throw new Error("Stream title is required");

    const boardTitle = body.board.trim();
    const streamTitle = body.streamTitle.trim();

    const boardData = await findBoardByTitleRepo(schoolSlug, boardTitle);

    if (!boardData) {
        throw new Error("Board not found");
    }

    const existingStream = await findStreamByTitleRepo({
        schoolSlug,
        boardSlug: boardData.slug,
        streamTitle,
    });

    if (existingStream) throw new Error("Stream already exists");

    return createStreamRepo({
        slug: generateSlug(),
        schoolSlug,
        boardSlug: boardData.slug,
        streamTitle,
        status: body.status || "active",
    });
};

export const getStreamsService = async (query, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    return getStreamsRepo({
        schoolSlug,
        board: query.board,
    });
};

export const getStreamBySlugService = async (slug, user) => {
    const schoolSlug = user?.schoolSlug;

    const streamData = await getStreamBySlugRepo(slug, schoolSlug);

    if (!streamData) throw new Error("Stream not found");

    return streamData;
};

export const updateStreamService = async (slug, body, user) => {
    const schoolSlug = user?.schoolSlug;

    const streamData = await getStreamBySlugRepo(slug, schoolSlug);

    if (!streamData) throw new Error("Stream not found");

    const updateData = {};

    if (body.streamTitle) {
        updateData.streamTitle = body.streamTitle.trim();
    }

    if (body.board) {
        const boardData = await findBoardByTitleRepo(
            schoolSlug,
            body.board.trim()
        );

        if (!boardData) {
            throw new Error("Board not found");
        }

        updateData.boardSlug = boardData.slug;
    }

    if (body.status) {
        updateData.status = body.status;
    }

    return updateStreamRepo(streamData.id, updateData);
};

export const deleteStreamService = async (slug, user) => {
    const schoolSlug = user?.schoolSlug;

    const streamData = await getStreamBySlugRepo(slug, schoolSlug);

    if (!streamData) throw new Error("Stream not found");

    return deleteStreamRepo(streamData.id);
};

export const restoreStreamService = async (slug, user) => {
    const schoolSlug = user?.schoolSlug;

    if (!schoolSlug) {
        throw new Error("School not found for this user");
    }

    const streamData = await getStreamBySlugForRestoreRepo(slug, schoolSlug);

    if (!streamData) {
        throw new Error("Stream not found");
    }

    return restoreStreamRepo(streamData.id);
};