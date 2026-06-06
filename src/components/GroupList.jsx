import { useState } from "react";

// Отображает группы и предоставляет создание, выбор и переименование.
export default function GroupList({
  groups,
  groupCounts,
  selectedGroup,
  onCreateGroup,
  onRenameGroup,
  onSelectGroup
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

  // Отправляет введённое имя для создания новой группы.
  const createGroup = event => {
    event.preventDefault();

    if (onCreateGroup(groupName)) {
      setGroupName("");
    }
  };

  // Включает режим редактирования выбранной группы.
  const startEditing = group => {
    setEditingGroup(group);
    setEditingName(group);
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
          editingGroup === group;

        return (
          <div
            key={group}
            onClick={() =>
              onSelectGroup(group)
            }
            style={{
              padding: "8px",
              cursor: "pointer",
              borderRadius: "4px",
              marginBottom: "4px",
              background:
                selectedGroup === group
                  ? "#dbeafe"
                  : "transparent"
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
                    `Новое название группы ${group}`
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
                  {group || "Без группы"}{" "}
                  (
                  {groupCounts.get(group) ||
                    0}
                  )
                </span>

                <button
                  type="button"
                  aria-label={
                    `Редактировать группу ${group}`
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
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
