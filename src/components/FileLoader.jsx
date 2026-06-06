// Показывает выбор M3U/M3U8-файла и передаёт его содержимое приложению.
export default function FileLoader({ onLoad }) {
  // Читает выбранный файл как текст вместе с его исходным именем.
  const handleFile = async (event) => {
    const file = event.target.files[0];

    if (!file) return;

    const text = await file.text();

    onLoad(text, file.name);
  };

  return (
    <input
      type="file"
      accept=".m3u,.m3u8"
      onChange={handleFile}
    />
  );
}
