import { useState } from "react";

const PAGE_SIZE = 50;

export default function ChannelList({
  channels,
  groups,
  onCopyChannel,
  onMoveChannel,
  onDeleteChannel
}) {
  const [targetGroups, setTargetGroups] =
    useState({});
  const [page, setPage] = useState(0);

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

  const selectTargetGroup = (
    channelId,
    group
  ) => {
    setTargetGroups(current => ({
      ...current,
      [channelId]: group
    }));
  };

  const copyChannel = channel => {
    const targetGroup =
      targetGroups[channel.id];

    if (!targetGroup) return;

    onCopyChannel(
      channel.id,
      targetGroup
    );
  };

  const moveChannel = channel => {
    const targetGroup =
      targetGroups[channel.id];

    if (!targetGroup) return;

    onMoveChannel(
      channel.id,
      targetGroup
    );
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
            style={{
              padding: "8px",
              borderBottom:
                "1px solid #ddd"
            }}
          >
            <strong>
              {channel.name}
            </strong>

            <div
              style={{
                fontSize: "12px",
                color: "#666"
              }}
            >
              {channel.url}
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
