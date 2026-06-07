import { useState } from "react";

// Отображает группы и предоставляет создание, выбор и переименование.
export default function GroupList({
  groups,
  groupCounts,
  selectedGroup,
  onCreateGroup,
  onRenameGroup,
  onSelectGroup,
  onDeleteGroup,
  onReorderGroup
}) {
  const [groupName, setGroupName] =
    useState("");
  const [
    editingGroup,
    setEditingGroup
  ] = useState(null);
  const [
    editingName,
    setEditingName
  ] = useState("");

  const [
    draggedGroupId,
    setDraggedGroupId
  ] = useState(null);
  const [
    dragTargetGroupId,
    setDragTargetGroupId
  ] = useState(null);

  const startDraggingGroup = (event, groupId) => {
    setDraggedGroupId(groupId);
    event.dataTransfer.effectAllowed = "move";
    event.dataTransfer.setData("text/plain", groupId);
  };

  const dropGroup = (event, targetId) => {
    event.preventDefault();

    const sourceId =
      draggedGroupId || event.dataTransfer.getData("text/plain");

    if (sourceId && onReorderGroup) {
      onReorderGroup(sourceId, targetId);
    }

    setDraggedGroupId(null);
    setDragTargetGroupId(null);
  };

  // Отправляет введённое имя для создания новой группы.
  const createGroup = event => {
    event.preventDefault();

    if (onCreateGroup(groupName)) {
      setGroupName("");
    }
  };

  const deleteGroup = group => {
    if (onDeleteGroup(group)) {
      if (group === selectedGroup) {
        onSelectGroup(null);
      }
    }
  };

  // Включает режим редактирования выбранной группы.
  const startEditing = group => {
    setEditingGroup(group);
    setEditingName(group.name);
  };

  // Закрывает форму переименования без сохранения.
  const cancelEditing = () => {
    setEditingGroup(null);
    setEditingName("");
  };

  // Сохраняет новое имя группы, если оно прошло проверку.
  const renameGroup = event => {
    event.preventDefault();

    if (
      onRenameGroup(
        editingGroup,
        editingName
      )
    ) {
      cancelEditing();
    }
  };

  return (
    <div
      style={{
        textAlign: "left"
      }}
    >
      <h3>Группы</h3>

      <form
        onSubmit={createGroup}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          marginBottom: "12px"
        }}
      >
        <input
          type="text"
          value={groupName}
          placeholder="Название группы"
          aria-label="Название новой группы"
          onChange={event =>
            setGroupName(
              event.target.value
            )
          }
        />

        <button
          type="submit"
          disabled={!groupName.trim()}
        >
          Создать группу
        </button>
      </form>

      {groups.map(group => {
        const isEditing =
          editingGroup?.id === group.id;

        return (
          <div
            key={group.id}
            draggable
            onDragStart={event =>
              startDraggingGroup(event, group.id)
            }
            onDragOver={event => {
              event.preventDefault();
              event.dataTransfer.dropEffect = "move";
              setDragTargetGroupId(group.id);
            }}
            onDragLeave={() =>
              setDragTargetGroupId(current =>
                current === group.id ? null : current
              )
            }
            onDrop={event =>
              dropGroup(event, group.id)
            }
            onDragEnd={() => {
              setDraggedGroupId(null);
              setDragTargetGroupId(null);
            }}
            onClick={() =>
              onSelectGroup(group)
            }
            style={{
              padding: "8px",
              cursor: "pointer",
              borderRadius: "4px",
              marginBottom: "4px",
              background:
                selectedGroup?.id === group.id
                  ? "#dbeafe"
                  : "transparent",
              borderTop:
                dragTargetGroupId === group.id
                  ? "2px solid #3b82f6"
                  : "2px solid transparent",
              opacity:
                draggedGroupId === group.id
                  ? 0.5
                  : 1
            }}
          >
            {isEditing ? (
              <form
                onSubmit={renameGroup}
                onClick={event =>
                  event.stopPropagation()
                }
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "6px"
                }}
              >
                <input
                  type="text"
                  value={editingName}
                  aria-label={
                    `Новое название группы ${group.name}`
                  }
                  onChange={event =>
                    setEditingName(
                      event.target.value
                    )
                  }
                  autoFocus
                />

                <button
                  type="submit"
                  disabled={
                    !editingName.trim()
                  }
                >
                  Сохранить
                </button>

                <button
                  type="button"
                  onClick={cancelEditing}
                >
                  Отмена
                </button>
              </form>
            ) : (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent:
                    "space-between",
                  gap: "8px"
                }}
              >
                <span>
                  {group.name || "Без группы"}{" "}
                  (
                  {groupCounts.get(group.id) ||
                    0}
                  )
                </span>
                <div
                  style={{ 
                    display: "flex",
                    gap: "4px"
                  }}
                  >
                  <button
                    type="button"
                    aria-label={
                      `Редактировать группу ${group.name}`
                    }
                    title="Редактировать"
                    onClick={event => {
                      event.stopPropagation();
                      startEditing(group);
                    }}
                    style={{
                      width: "28px",
                      height: "28px",
                      padding: "5px",
                      flexShrink: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M12 20h9" />
                      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    aria-label={
                      `Удалить группу ${group.name}`
                    }
                    title="Удалить"
                    onClick={event => {
                      event.stopPropagation();
                      deleteGroup(group);
                    }}
                    style={{
                      width: "28px",
                      height: "28px",
                      padding: "5px",
                      flexShrink: 0,
                      display: "inline-flex",
                      alignItems: "center",
                      justifyContent: "center"
                    }}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      width="16"
                      height="16"
                      aria-hidden="true"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M3 6h18" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      <line x1="10" y1="11" x2="10" y2="17" />
                      <line x1="14" y1="11" x2="14" y2="17" />
                    </svg>
                  </button>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
