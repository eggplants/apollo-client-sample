import { useState } from "react";
import { URI } from "./constraints/config";
import ReactDOM from "react-dom";
import gql from "graphql-tag";
import "monaco-graphql";
import MonacoEditor from "react-monaco-editor";

import { getClient } from "./lib/query";

const App = () => {
  const [endpoint, setEndpoint] = useState(URI);
  const [inputValue, setInputValue] = useState(
    // eslint-disable-line @typescript-eslint/no-unused-vars
    `
query ($id: Int) {
  Media (id: $id, type: ANIME) {
    id
    title {
      romaji
      english
      native
    }
  }
}
  `.trim()
  );
  const [resultValue, setResultValue] = useState("");
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [status, setStatus] = useState("Ready!");

  const client = getClient(endpoint);

  const query = () => {
    setStatus("Loading...");
    setButtonDisabled(true);
    client
      .query({
        query: gql`
          ${inputValue}
        `,
      })
      .then((r) => {
        setResultValue(JSON.stringify(r, null, 2));
        setStatus("Successful!");
        setButtonDisabled(false);
      })
      .catch((err) => {
        alert(err);
        setStatus("Failed...");
        setButtonDisabled(true);
      });
  };
  return (
    <>
      <h1>Query form</h1>
      <div className="endpoint-input">
        <label>
          Endpoint:
          <input
            type="text"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          />
        </label>
      </div>
      <div className="query-io">
        <div className="query-input">
          <label>
            Query:
            <MonacoEditor
              value={inputValue}
              language="graphql"
              width="800"
              height="300"
              options={{ automaticLayout: true, scrollBeyondLastLine: false }}
            />
          </label>
          <button disabled={buttonDisabled} onClick={query}>
            {status}
          </button>
        </div>
        <div className="query-output">
          <label>
            Result:
            <MonacoEditor
              value={resultValue}
              width="800"
              height="300"
              language="graphql"
              options={{
                automaticLayout: true,
                readOnly: true,
                scrollBeyondLastLine: false,
              }}
            />
          </label>
        </div>
      </div>
    </>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
