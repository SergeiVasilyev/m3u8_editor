import { useState, useEffect } from "react";
import { parseM3U } from "./parser/m3u_parser";
import FileLoader from "./components/FileLoader";


function App() {
  const [content, setContent] = useState("");
  const [channels, setChannels] = useState([]);

  useEffect(() => {
    if (content) {
      setChannels(parseM3U(content));
    }
  }, [content]);
  
  return (
    <div style={{ padding: "20px" }}>
      <h1>M3U Editor</h1>

      <FileLoader onLoad={setContent} />

      <hr />

      <pre>
        {/* {content.slice(0, 1000)} */}
        {JSON.stringify(channels, null, 2)}
      </pre>
    </div>
  );
}

export default App;