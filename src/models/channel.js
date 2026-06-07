// Создаёт объект канала с единым набором полей модели.
export function createChannel({
    id,
    sourceId,
    name,
    url,    
    group,
    extinf,
    groupId
}) {
  return {
    id,
    sourceId,
    name,
    url,
    group,
    extinf,
    groupId
  };
}
