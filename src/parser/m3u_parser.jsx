import { createChannel } from "../models/channel";
import { createGroup } from "../models/group";

// Преобразует текст M3U/M3U8 в массив объектов каналов.
export function parseM3U(text) {
    const lines = text.split(/\r?\n/);

    const groups = [];
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

        let group = groups.find(
            g => g.name === currentGroup
            );

            if (!group) {
            group = createGroup({
                id: crypto.randomUUID(),
                name: currentGroup
            });

            groups.push(group);
        }

        channels.push(
        createChannel({
            id: crypto.randomUUID(),
            name,
            url: line,
            group: currentGroup,
            extinf: currentExtinf,
            groupId: group.id
        })
        );

        currentExtinf = null;
        currentGroup = null;
    }

    return { channels, groups };
}

// Преобразует текущий массив каналов обратно в текст формата M3U8.
export function unparseM3U(channels) {
    const lines = ["#EXTM3U"];

    for (const channel of channels) {
        const extinf =
            channel.extinf ||
            `#EXTINF:0,${channel.name || ""}`;

        lines.push(extinf);

        if (channel.group) {
            lines.push(`#EXTGRP:${channel.group}`);
        }

        lines.push(channel.url);
    }

    return `${lines.join("\r\n")}\r\n`;
}
