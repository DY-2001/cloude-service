import { useState } from "react";
import "./App.css";

function App() {
  const [githubUrl, setGithubUrl] = useState("");
  const [dockerfilePath, setDockerfilePath] = useState("");
  const [loading, setLoading] = useState(false);
  const [deploymentUrl, setDeploymentUrl] = useState("");
  const [error, setError] = useState("");
  const [port, setPort] = useState("");

  const [envVariables, setEnvVariables] = useState([{ key: "", value: "" }]);

  const deploy = async () => {
    setLoading(true);
    setDeploymentUrl("");
    setError("");

    try {
      const filteredEnvVariables = envVariables.filter(
        (env) => env.key.trim() && env.value.trim(),
      );

      const res = await fetch("http://localhost:5000/deploy", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          githubUrl,
          dockerfilePath,
          port,
          envVariables: filteredEnvVariables,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setDeploymentUrl(data.publicUrl);

        setGithubUrl("");
        setDockerfilePath("");
        setPort("");
        setEnvVariables([{ key: "", value: "" }]);
      } else {
        setError(data.message);
      }
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <div className="card">
        <h1 className="title">☁️ Cloud Service</h1>
        <p className="subtitle">Deploy your backend in seconds</p>

        <div className="form">
          <label className="label">
            GitHub Repository URL <span className="required">*</span>
          </label>

          <input
            className="input"
            type="text"
            placeholder="https://github.com/user/repository"
            value={githubUrl}
            onChange={(e) => setGithubUrl(e.target.value)}
            required
          />

          <label className="label">
            Application Port <span className="required">*</span>
          </label>

          <input
            className="input"
            type="number"
            placeholder="3000"
            value={port}
            onChange={(e) => setPort(e.target.value)}
            required
          />

          <label className="label">Dockerfile Path (Optional)</label>

          <input
            className="input"
            type="text"
            placeholder="backend or app/backend"
            value={dockerfilePath}
            onChange={(e) => setDockerfilePath(e.target.value)}
          />

          <label className="label">Environment Variables</label>

          {envVariables.map((env, index) => (
            <div className="env-row" key={index}>
              <input
                className="env-input"
                type="text"
                placeholder="KEY"
                value={env.key}
                onChange={(e) => {
                  const updated = [...envVariables];
                  updated[index].key = e.target.value;
                  setEnvVariables(updated);
                }}
              />

              <input
                className="env-input"
                type="text"
                placeholder="VALUE"
                value={env.value}
                onChange={(e) => {
                  const updated = [...envVariables];
                  updated[index].value = e.target.value;
                  setEnvVariables(updated);
                }}
              />

              {envVariables.length > 1 && (
                <button
                  type="button"
                  className="remove-env-btn"
                  onClick={() =>
                    setEnvVariables(envVariables.filter((_, i) => i !== index))
                  }
                >
                  ×
                </button>
              )}
            </div>
          ))}

          <button
            type="button"
            className="add-env-btn"
            onClick={() =>
              setEnvVariables([...envVariables, { key: "", value: "" }])
            }
          >
            + Add Variable
          </button>

          <button
            className="deploy-btn"
            onClick={deploy}
            disabled={loading || !githubUrl || !port}
          >
            {loading ? "⏳ Deploying..." : "Deploy Application"}
          </button>

          {deploymentUrl && (
            <div className="deployment-url">
              <a href={deploymentUrl} target="_blank" rel="noopener noreferrer">
                {deploymentUrl}
              </a>

              <button
                className="copy-btn"
                onClick={() => navigator.clipboard.writeText(deploymentUrl)}
                title="Copy URL"
              >
                📋
              </button>
            </div>
          )}

          {error && <div className="error-box">{error}</div>}
        </div>
      </div>
    </div>
  );
}

export default App;
