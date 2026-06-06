// Создаёт объект группы и при необходимости связывает его с родителем.
export function createGroup({
  id,
  name,
  parentId = null
}) {
  return {
    id,
    name,
    parentId
  };
}
