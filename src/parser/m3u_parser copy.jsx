import { createChannel } from "../models/channel";

export function parseM3U(text) {
    const lines = text.split(/\r?\n/);

    const channels = [];
    let currentExtinf = null;
    let currentGroup = null;

    for (const rawLine of lines) {
        const line = rawLine.trim();
        if (!line) continue;

        if (line.startsWith("#EXTINF")) {
            currentExtinf = line;
            continue;
        }

        if (line.startsWith("#EXTGRP")) {
            currentGroup = line.replace("#EXTGRP:", "");
            continue;
        }

        if (line.startsWith("#")) continue;

        const name =
        currentExtinf?.split(",").pop() || "";

        channels.push(
        createChannel({
            id: crypto.randomUUID(),
            name,
            url: line,
            group: currentGroup,
            extinf: currentExtinf
        })
        );

        currentExtinf = null;
        currentGroup = null;
    }

    return channels;
}