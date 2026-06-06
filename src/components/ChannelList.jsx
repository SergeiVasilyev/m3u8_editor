import { useState } from "react";

const PAGE_SIZE = 50;

// Отображает каналы группы и действия над ними с постраничной навигацией.
export default function ChannelList({
  channels,
  groups,
  onCopyChannel,
  onMoveChannel,
  onReorderChannel,
  onDeleteChannel
}) {
  const [targetGroups, setTargetGroups] =
    useState({});
  const [page, setPage] = useState(0);
  const [
    copiedChannelId,
    setCopiedChannelId
  ] = useState(null);
  const [
    draggedChannelId,
    setDraggedChannelId
  ] = useState(null);
  const [
    dragTargetId,
    setDragTargetId
  ] = useState(null);

  const pageCount = Math.ceil(
    channels.length / PAGE_SIZE
  );
  const currentPage = Math.min(
    page,
    Math.max(pageCount - 1, 0)
  );
  const visibleChannels =
    channels.slice(
      currentPage * PAGE_SIZE,
      (currentPage + 1) * PAGE_SIZE
    );

  // Запоминает целевую группу для выбранного канала.
  const selectTargetGroup = (
    channelId,
    group
  ) => {
    setTargetGroups(current => ({
      ...current,
      [channelId]: group
    }));
  };

  // Копирует канал в выбранную целевую группу.
  const copyChannel = channel => {
    const targetGroup =
      targetGroups[channel.id];

    if (!targetGroup) return;

    onCopyChannel(
      channel.id,
      targetGroup
    );
  };

  // Перемещает канал в выбранную целевую группу.
  const moveChannel = channel => {
    const targetGroup =
      targetGroups[channel.id];

    if (!targetGroup) return;

    onMoveChannel(
      channel.id,
      targetGroup
    );
  };

  // Копирует URL канала в буфер и временно показывает подтверждение.
  const copyUrl = async channel => {
    try {
      await navigator.clipboard.writeText(
        channel.url
      );
      setCopiedChannelId(channel.id);

      window.setTimeout(() => {
        setCopiedChannelId(current =>
          current === channel.id
            ? null
            : current
        );
      }, 2000);
    } catch {
      setCopiedChannelId(null);
    }
  };

  // Начинает перетаскивание канала и сохраняет его идентификатор.
  const startDragging = (
    event,
    channelId
  ) => {
    setDraggedChannelId(channelId);
    event.dataTransfer.effectAllowed =
      "move";
    event.dataTransfer.setData(
      "text/plain",
      channelId
    );
  };

  // Завершает перетаскивание и передаёт новый порядок в приложение.
  const dropChannel = (
    event,
    targetId
  ) => {
    event.preventDefault();

    const sourceId =
      draggedChannelId ||
      event.dataTransfer.getData(
        "text/plain"
      );

    if (sourceId) {
      onReorderChannel(
        sourceId,
        targetId
      );
    }

    setDraggedChannelId(null);
    setDragTargetId(null);
  };

  return (
    <div>
      <h3>Каналы</h3>

      <div
        style={{
          marginBottom: "12px"
        }}
      >
        Показано{" "}
        {channels.length === 0
          ? 0
          : currentPage * PAGE_SIZE + 1}
        -
        {Math.min(
          (currentPage + 1) * PAGE_SIZE,
          channels.length
        )}{" "}
        из {channels.length}
      </div>

      {visibleChannels.map(channel => {
        const availableGroups =
          groups.filter(
            group =>
              group !== channel.group
          );
        const targetGroup =
          targetGroups[channel.id] || "";

        return (
          <div
            key={channel.id}
            draggable
            onDragStart={event =>
              startDragging(
                event,
                channel.id
              )
            }
            onDragOver={event => {
              event.preventDefault();
              event.dataTransfer.dropEffect =
                "move";
              setDragTargetId(channel.id);
            }}
            onDragLeave={() =>
              setDragTargetId(current =>
                current === channel.id
                  ? null
                  : current
              )
            }
            onDrop={event =>
              dropChannel(
                event,
                channel.id
              )
            }
            onDragEnd={() => {
              setDraggedChannelId(null);
              setDragTargetId(null);
            }}
            style={{
              padding: "8px",
              borderBottom:
                "1px solid #ddd",
              borderTop:
                dragTargetId === channel.id
                  ? "2px solid #3b82f6"
                  : "2px solid transparent",
              opacity:
                draggedChannelId ===
                channel.id
                  ? 0.5
                  : 1,
              cursor: "grab"
            }}
          >
            <strong>
              <a
                href={`?stream=${encodeURIComponent(
                  channel.url
                )}&name=${encodeURIComponent(
                  channel.name
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                title="Открыть видео в новой вкладке"
                style={{
                  color: "inherit"
                }}
              >
                {channel.name}
              </a>
            </strong>

            {copiedChannelId ===
              channel.id && (
              <span
                role="status"
                style={{
                  marginLeft: "8px",
                  fontSize: "12px"
                }}
              >
                Скопировано
              </span>
            )}

            <div
              style={{
                fontSize: "12px",
                marginTop: "2px"
              }}
            >
              <button
                type="button"
                title="Копировать ссылку канала"
                onClick={() =>
                  copyUrl(channel)
                }
                style={{
                  padding: 0,
                  border: 0,
                  background: "transparent",
                  color: "#666",
                  font: "inherit",
                  textDecoration: "underline",
                  cursor: "pointer"
                }}
              >
                {channel.url}
              </button>
            </div>

            <div
              style={{
                display: "flex",
                gap: "8px",
                marginTop: "8px"
              }}
            >
              <select
                aria-label={
                  `Группа для копии ${channel.name}`
                }
                value={targetGroup}
                onChange={event =>
                  selectTargetGroup(
                    channel.id,
                    event.target.value
                  )
                }
                disabled={
                  availableGroups.length === 0
                }
              >
                <option value="">
                  Выберите группу
                </option>
                {availableGroups.map(
                  group => (
                    <option
                      key={group}
                      value={group}
                    >
                      {group}
                    </option>
                  )
                )}
              </select>

              <button
                type="button"
                onClick={() =>
                  moveChannel(channel)
                }
                disabled={!targetGroup}
              >
                Переместить
              </button>

              <button
                type="button"
                onClick={() =>
                  copyChannel(channel)
                }
                disabled={!targetGroup}
              >
                Копировать
              </button>

              <button
                type="button"
                onClick={() =>
                  onDeleteChannel(channel.id)
                }
              >
                Удалить
              </button>
            </div>
          </div>
        );
      })}

      {pageCount > 1 && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "12px",
            marginTop: "16px"
          }}
        >
          <button
            type="button"
            disabled={currentPage === 0}
            onClick={() =>
              setPage(current =>
                Math.max(current - 1, 0)
              )
            }
          >
            Назад
          </button>

          <span>
            Страница {currentPage + 1} из{" "}
            {pageCount}
          </span>

          <button
            type="button"
            disabled={
              currentPage ===
              pageCount - 1
            }
            onClick={() =>
              setPage(
                currentPage + 1
              )
            }
          >
            Далее
          </button>
        </div>
      )}
    </div>
  );
}
