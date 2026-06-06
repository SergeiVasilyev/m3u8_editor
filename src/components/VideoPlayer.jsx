import {
  useEffect,
  useRef,
  useState
} from "react";

// Воспроизводит HLS-поток нативно или через динамически загруженный hls.js.
export default function VideoPlayer({
  name,
  url
}) {
  const videoRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    // Подключает поток к video и освобождает HLS-ресурсы при закрытии.
    const video = videoRef.current;

    if (!video || !url) return undefined;

    if (
      video.canPlayType(
        "application/vnd.apple.mpegurl"
      )
    ) {
      video.src = url;
      return undefined;
    }

    let hls;
    let cancelled = false;

    import("hls.js").then(module => {
      if (cancelled) return;

      const Hls = module.default;

      if (!Hls.isSupported()) {
        setError(
          "Этот браузер не поддерживает HLS-видео."
        );
        return;
      }

      hls = new Hls();
      hls.loadSource(url);
      hls.attachMedia(video);
      hls.on(Hls.Events.ERROR, (
        _event,
        data
      ) => {
        if (data.fatal) {
          setError(
            "Не удалось загрузить поток. Возможно, сервер запрещает доступ из браузера (CORS)."
          );
        }
      });
    });

    return () => {
      cancelled = true;
      hls?.destroy();
    };
  }, [url]);

  return (
    <main
      style={{
        padding: "20px"
      }}
    >
      <h1>{name || "Просмотр канала"}</h1>

      <video
        ref={videoRef}
        controls
        autoPlay
        muted
        playsInline
        style={{
          display: "block",
          width: "100%",
          maxHeight: "75vh",
          background: "#000"
        }}
      />

      {error && (
        <p
          role="alert"
          style={{
            marginTop: "12px",
            color: "#dc2626"
          }}
        >
          {error}
        </p>
      )}
    </main>
  );
}
