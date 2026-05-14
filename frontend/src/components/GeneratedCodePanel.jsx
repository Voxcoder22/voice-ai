import { useState } from 'react';
import {
  BsCode,
  BsClipboard,
  BsClipboardCheck,
  BsDownload,
  BsArrowRepeat,
  BsCheckCircleFill,
  BsExclamationTriangleFill,
  BsFileCode,
  BsPlayFill,
} from 'react-icons/bs';
import './GeneratedCodePanel.css';

/** Mock generated code blocks (simulating multi-file output) */
// const GENERATED_FILES = [
//   {
//     id: 'f1',
//     filename: 'app.py',
//     language: 'python',
//     status: 'generated',
//     lines: 48,
//     code: `from flask import Flask, jsonify, request
// import datetime

// app = Flask(__name__)

// # ── Health endpoint ──────────────────────────
// @app.route('/health', methods=['GET'])
// def health_check():
//     return jsonify({
//         "status": "ok",
//         "timestamp": datetime.datetime.utcnow().isoformat(),
//         "version": "1.0.0",
//         "service": "voice-poc-api"
//     }), 200

// # ── Generate endpoint ────────────────────────
// @app.route('/generate', methods=['POST'])
// def generate():
//     data = request.get_json()
//     if not data or 'prompt' not in data:
//         return jsonify({"error": "Missing 'prompt' field"}), 400

//     prompt = data['prompt']
//     # TODO: Replace with real LLM integration
//     response = f"[AI] Response to: '{prompt[:60]}'"

//     return jsonify({
//         "status": "success",
//         "prompt": prompt,
//         "response": response,
//         "model": "mock-v1",
//         "timestamp": datetime.datetime.utcnow().isoformat()
//     }), 200

// if __name__ == '__main__':
//     app.run(debug=True, port=5000)`,
//   },
//   {
//     id: 'f2',
//     filename: 'requirements.txt',
//     language: 'text',
//     status: 'generated',
//     lines: 4,
//     code: `flask==3.0.2
// flask-cors==4.0.0
// python-dotenv==1.0.1
// gunicorn==21.2.0`,
//   },
//   {
//     id: 'f3',
//     filename: 'README.md',
//     language: 'markdown',
//     status: 'modified',
//     lines: 22,
//     code: `# Voice POC — Flask API

// ## Setup
// \`\`\`bash
// pip install -r requirements.txt
// python app.py
// \`\`\`

// ## Endpoints
// | Method | Path        | Description        |
// |--------|-------------|--------------------|
// | GET    | /health     | Server status      |
// | POST   | /generate   | Generate AI output |`,
//   },
// ];

// const GENERATED_FILES = (code, language) => [
//   {
//     id: 'f1',
//     filename:
//       language === 'python'
//         ? 'generated.py'
//         : language === 'javascript'
//         ? 'generated.js'
//         : 'generated.txt',

//     language: language || 'text',
//     status: 'generated',
//     lines: code ? code.split('\n').length : 0,
//     code: code || 'No generated code yet...',
//   },
// ];


export default function GeneratedCodePanel({ files = [] }) {
  const [activeFile, setActiveFile] = useState(null);
  const [copied, setCopied]           = useState(false);
  const [isRegenerating, setIsRegen]  = useState(false);

  const currentFile =
  files.find(f => f.id === activeFile) || files[0];

  const handleCopy = async () => {
    await navigator.clipboard.writeText(currentFile.code).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = () => {
    setIsRegen(true);
    setTimeout(() => setIsRegen(false), 1600);
  };

  return (
    <div className="code-panel">
      {/* Header */}
      <div className="code-panel__header">
        <div className="code-panel__title-row">
          <BsCode size={14} style={{ color: 'var(--accent-primary)' }} />
          <span className="code-panel__title">Generated Code</span>
          <span className="code-panel__file-count">{files.length} file</span>
        </div>

        {/* Activity indicator */}
        <div className="code-panel__activity">
          <span className="code-panel__activity-dot" />
          <span className="code-panel__activity-label">
            {isRegenerating ? 'Generating…' : 'Up to date'}
          </span>
        </div>
      </div>

      {/* File tabs */}
      <div className="code-panel__tabs">
        {files.map(file =>  (
          <button
            key={file.id}
            className={`code-panel__tab ${file.id === activeFile ? 'active' : ''}`}
            onClick={() => setActiveFile(file.id)}
          >
            <BsFileCode size={11} />
            <span>{file.filename}</span>
            <span className={`code-panel__tab-status code-panel__tab-status--${file.status}`}>
              {file.status === 'generated' && <BsCheckCircleFill size={9} />}
              {file.status === 'modified'  && <BsExclamationTriangleFill size={9} />}
            </span>
          </button>
        ))}
      </div>

      {/* Code toolbar */}
      <div className="code-panel__toolbar">
        <span className="code-panel__lang">{currentFile?.language}</span>
        <span className="code-panel__lines">{currentFile?.lines} lines</span>
        <div className="code-panel__toolbar-actions">
          <button
            className="code-panel__tool-btn"
            onClick={handleRegenerate}
            title="Regenerate"
          >
            <BsArrowRepeat
              size={12}
              style={{ animation: isRegenerating ? 'spin 0.7s linear infinite' : 'none' }}
            />
          </button>
          <button className="code-panel__tool-btn" title="Download">
            <BsDownload size={12} />
          </button>
          <button
            className="code-panel__tool-btn"
            onClick={handleCopy}
            title="Copy"
          >
            {copied ? <BsClipboardCheck size={12} /> : <BsClipboard size={12} />}
          </button>
        </div>
      </div>

      {/* Code display */}
      <div className="code-panel__body">
        <pre className="code-panel__code">
          {currentFile?.code.split('\n').map((line, i) => (
            <div key={i} className="code-panel__line">
              <span className="code-panel__line-num">{i + 1}</span>
              <code className="code-panel__line-content">{line}</code>
            </div>
          ))}
        </pre>
      </div>

      {/* Execution status */}
      <div className="code-panel__exec">
        <div className="code-panel__exec-header">
          <BsPlayFill size={11} />
          <span>Execution Status</span>
        </div>
        <div className="code-panel__exec-rows">
          <div className="code-panel__exec-row">
            <span className="exec-label">Syntax</span>
            <span className="exec-badge exec-badge--ok">✓ Valid</span>
          </div>
          <div className="code-panel__exec-row">
            <span className="exec-label">Runtime</span>
            <span className="exec-badge exec-badge--idle">Not run</span>
          </div>
          <div className="code-panel__exec-row">
            <span className="exec-label">Last update</span>
            <span className="exec-badge exec-badge--info">10:43:08</span>
          </div>
        </div>
      </div>
    </div>
  );
}
