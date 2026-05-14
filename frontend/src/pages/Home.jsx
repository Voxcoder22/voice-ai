import { useState, useCallback, useRef } from 'react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import ChatContainer from '../components/ChatContainer';
import GeneratedCodePanel from '../components/GeneratedCodePanel';
import SessionLogPanel from '../components/SessionLogPanel';
import PromptInput from '../components/PromptInput';
import StatusBar from '../components/StatusBar';
import { generateAIResponse } from '../services/api';
import './Home.css';

/**
 * Home page — root layout orchestrating all panels
 * Manages global state: recording, processing, messages, active session
 * This is the single source of truth for the POC workspace
 */

/** Simulate an AI response with a delay (replace with Flask API call later) */
// function generateMockAIResponse(userPrompt) {
//   const responses = [
//     {
//       content: `Here's a solution for "${userPrompt}". I've analyzed your request and generated the appropriate code. Check the code panel on the right for the full implementation.`,
//       codeSnippet: `# Generated for: ${userPrompt}
// def solution():
//     # TODO: Implement via backend
//     return {"status": "generated", "prompt": "${userPrompt.slice(0, 30)}..."}`,
//       language: 'python',
//     },
//     {
//       content: `Great question! I've written the code for "${userPrompt}". The implementation follows best practices and includes error handling.`,
//       codeSnippet: `// Generated code
// function solution(input) {
//   // Processing: ${userPrompt.slice(0, 40)}
//   return { result: "success", input };
// }`,
//       language: 'javascript',
//     },
//     {
//       content: `I've prepared a response to your request. The code has been generated and added to the code panel. You can copy it or request modifications.`,
//     },
//   ];
//   return responses[Math.floor(Math.random() * responses.length)];
// }



export default function Home() {
  const [isRecording,  setIsRecording]  = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isTyping,     setIsTyping]     = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      role: 'ai',
      content:
        'Hello! I am VoxCoder. Describe the application you want to build.',
      timestamp: new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      origin: 'text',
      state: 'complete',
    },
  ]);
  const [activeSession, setActiveSession] = useState('s1');
  const [sessions, setSessions] = useState([
    {
      id: 's1',
      title: 'New Session',
      timestamp: 'Just now',
      mode: 'text',
      messages: 1,
      status: 'active',
    },
  ]);
  const [rightPanel, setRightPanel]     = useState('code'); // 'code' | 'logs'
  const msgIdRef = useRef(100);
  const [generatedFiles, setGeneratedFiles] = useState([]);

  const nextId = () => `m${++msgIdRef.current}`;

  const timestamp = () =>
    new Date().toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  const extractFiles = (text) => {
    const regex =
      /FILE:\s*(.+?)\n\s*<CODE_BLOCK_START>\s*\n(\w+)\n([\s\S]*?)<CODE_BLOCK_END>/g;

    const matches = [...text.matchAll(regex)];

    if (!matches.length) return [];

    return matches.map((match, index) => ({
      id: `f${index + 1}`,
      filename: match[1].trim(),
      language: match[2].trim(),
      code: match[3].trim(),
      status: 'generated',
      lines: match[3].split('\n').length,
    }));
  };
  
  /** Called when user submits a prompt (text or voice) */
  // const handleSend = useCallback(async (promptText, origin = 'text') => {
  //   if (!promptText.trim()) return;

  //   // 1. Add user message
  //   const userMsg = {
  //     id: nextId(),
  //     role: 'user',
  //     content: promptText,
  //     timestamp: timestamp(),
  //     origin,
  //     state: 'complete',
  //   };
  //   setNewMessage(userMsg);

  //   // 2. Show typing indicator
  //   setIsTyping(true);
  //   setIsProcessing(true);

  //   // 3. Simulate AI response delay (replace with fetch('/api/generate') later)
  //   // await new Promise(r => setTimeout(r, 1400 + Math.random() * 800));
  //   const aiResponse = await generateAIResponse(promptText);

  //   const extracted = extractCodeBlock(aiResponse);

  //   if (extracted) {
  //     setGeneratedCode(extracted.code);
  //     setCodeLanguage(extracted.language);
  //   }

  //   // 4. Add AI response
  //   // const aiData = generateMockAIResponse(promptText);
  //   const aiMsg = {
  //     id: nextId(),
  //     role: 'ai',
  //     content: aiResponse,
  //     timestamp: timestamp(),
  //     origin: 'text',
  //     state: 'complete',
  //   };

  //   setIsTyping(false);
  //   setNewMessage(aiMsg);
  //   setIsProcessing(false);
  // }, []);

  const handleSend = useCallback(async (promptText, origin = 'text') => {
    if (!promptText.trim()) return;

    // 1. Add user message
    const userMsg = {
      id: nextId(),
      role: 'user',
      content: promptText,
      timestamp: timestamp(),
      origin,
      state: 'complete',
    };

    setMessages(prev => [...prev, userMsg]);

    // 2. Show typing indicator
    setIsTyping(true);
    setIsProcessing(true);

    // 3. Get AI response
    const aiResponse = await generateAIResponse(promptText);

    // 4. Extract generated files
    const extractedFiles = extractFiles(aiResponse);

    setGeneratedFiles(extractedFiles);

    // 5. Add AI response to chat
    const aiMsg = {
      id: nextId(),
      role: 'ai',
      content: aiResponse,
      timestamp: timestamp(),
      origin: 'text',
      state: 'complete',
    };

    setIsTyping(false);
    setMessages(prev => [...prev, aiMsg]);
    setIsProcessing(false);

  }, []);

  const recognitionRef = useRef(null);

  const handleRecordingStart = () => {
    setIsRecording(true);

    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;

      handleSend(transcript, 'voice');
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognitionRef.current = recognition;

    recognition.start();
  };

  const handleRecordingStop = () => {
    setIsRecording(false);

    recognitionRef.current?.stop();
  };

  const handleNewSession = () => {
    const newSession = {
      id: `s${Date.now()}`,
      title: 'New Session',
      timestamp: 'Just now',
      mode: 'text',
      messages: 1,
      status: 'active',
    };

    setSessions(prev => [newSession, ...prev]);

    setActiveSession(newSession.id);

    setMessages([
      {
        id: 'welcome',
        role: 'ai',
        content:
          'Hello! I am VoxCoder. Describe the application you want to build.',
        timestamp: timestamp(),
        origin: 'text',
        state: 'complete',
      },
    ]);

    setGeneratedFiles([]);
  };
  const handleDeleteSession = (sessionId) => {
    const updatedSessions = sessions.filter(
      session => session.id !== sessionId
    );

    setSessions(updatedSessions);

    // If active session deleted
    if (activeSession === sessionId) {
      if (updatedSessions.length > 0) {
        setActiveSession(updatedSessions[0].id);
      } else {
        handleNewSession();
      }
    }
  };

  

  return (
    <div className="home">
      {/* Background grid overlay */}
      <div className="grid-bg" />

      {/* Navbar */}
      <Navbar isRecording={isRecording} isProcessing={isProcessing} />

      {/* Main workspace */}
      <div className="home__workspace">

        {/* ── Left sidebar ── */}
        <Sidebar
          sessions={sessions}
          onNewSession={handleNewSession}
          onDeleteSession={handleDeleteSession}
          onSelectSession={setActiveSession}
          activeSessionId={activeSession}
        />

        {/* ── Center column: chat + input ── */}
        <div className="home__center">
          <ChatContainer
            messages={messages}
            isTyping={isTyping}
          />

          <PromptInput
            onSend={handleSend}
            onRecordingStart={handleRecordingStart}
            onRecordingStop={handleRecordingStop}
            isProcessing={isProcessing}
          />
        </div>

        {/* ── Right panel: code / logs toggle ── */}
        <div className="home__right">
          {/* Panel toggle tabs */}
          <div className="home__right-tabs">
            <button
              className={`home__right-tab ${rightPanel === 'code' ? 'active' : ''}`}
              onClick={() => setRightPanel('code')}
            >
              Code
            </button>
            <button
              className={`home__right-tab ${rightPanel === 'logs' ? 'active' : ''}`}
              onClick={() => setRightPanel('logs')}
            >
              Logs
            </button>
          </div>

          <div className="home__right-content">
            {rightPanel === 'code'
              ? <GeneratedCodePanel files={generatedFiles}/>
              : <SessionLogPanel />
            }
          </div>
        </div>
      </div>

      {/* Status bar */}
      <StatusBar isRecording={isRecording} isProcessing={isProcessing} />
    </div>
  );
}
