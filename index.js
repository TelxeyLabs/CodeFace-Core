// Core CodeFace Functionality
// This file provides the main entry point for the open-source version of CodeFace

// Import dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import { marked } from 'marked';

// Import theme context
import { ThemeContext, ThemeProvider } from '../theme-context.js';

// Core Components
// These components will be moved to separate files in a more structured implementation

// Sidebar Component
const Sidebar = ({ conversations, activeConversationId, onSelectConversation, onNewChat, isSidebarOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="logo-container">
                    <img 
                        src="public/logos/logo.png" 
                        alt="CodeFace Logo" 
                        className="logo" 
                        style={{ 
                            width: '40px',
                            height: '40px', 
                            objectFit: 'contain',
                            marginRight: '8px'
                        }} 
                        onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                            const fallback = document.createElement('div');
                            fallback.textContent = 'CF';
                            fallback.style.width = '40px';
                            fallback.style.height = '40px';
                            fallback.style.background = 'linear-gradient(135deg, #06b6d4, #a855f7)';
                            fallback.style.display = 'flex';
                            fallback.style.alignItems = 'center';
                            fallback.style.justifyContent = 'center';
                            fallback.style.color = 'white';
                            fallback.style.fontWeight = 'bold';
                            fallback.style.marginRight = '8px';
                            e.target.parentNode.appendChild(fallback);
                        }}
                    />
                    <div className="sidebar-title">CODE<span>FACE</span></div>
                </div>
            </div>
            <button className="new-chat-btn" onClick={onNewChat}>
                <i className="fas fa-plus"></i> New Chat
            </button>
            <div className="conversation-list">
                {conversations.map(conv => (
                    <div 
                        key={conv.id} 
                        className={`conversation-item ${conv.id === activeConversationId ? 'active' : ''}`}
                        onClick={() => onSelectConversation(conv.id)}
                    >
                        <i className="fas fa-message conversation-icon"></i>
                        <div className="conversation-title">{conv.title}</div>
                    </div>
                ))}
            </div>
            <div className="sidebar-footer">
                <div>CodeFace - Modern AI Chat Interface</div>
            </div>
        </div>
    );
};

// Main content toggle button for mobile
const SidebarToggle = ({ toggleSidebar, isSidebarOpen }) => {
    return (
        <button className="sidebar-toggle" onClick={toggleSidebar}>
            <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>
    );
};

// Theme Toggle Component
const ThemeToggle = ({ theme, toggleTheme }) => {
    return (
        <button 
            className="theme-toggle" 
            onClick={toggleTheme}
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
            {theme === 'light' ? (
                <i className="fas fa-moon"></i>
            ) : (
                <i className="fas fa-sun"></i>
            )}
        </button>
    );
};

// Model Selector Component
const ModelSelector = ({ availableModels, selectedModel, onModelChange, isLoading }) => {
    return (
        <div className="model-selector">
            <select 
                value={selectedModel} 
                onChange={(e) => onModelChange(e.target.value)}
                disabled={isLoading}
            >
                {isLoading ? (
                    <option value="">Loading models...</option>
                ) : availableModels.length === 0 ? (
                    <option value="">No models available</option>
                ) : (
                    availableModels.map(model => (
                        <option key={model.id} value={model.id}>
                            {model.id}
                        </option>
                    ))
                )}
            </select>
        </div>
    );
};

// Message Component
const Message = ({ message, onCopy }) => {
    const isUser = message.role === 'user';
    
    const copyMessage = () => {
        onCopy(message.content);
    };
    
    return (
        <div className={`message ${isUser ? 'user-message' : 'ai-message'}`}>
            <div className={`avatar ${isUser ? 'user-avatar' : 'ai-avatar'}`}>
                {isUser ? 'You' : 'CF'}
            </div>
            <div 
                className="message-content" 
                dangerouslySetInnerHTML={{ __html: marked.parse(message.content) }} 
            />
            <div className="message-actions">
                <button className="copy-btn" onClick={copyMessage}>
                    <i className="fas fa-copy"></i>
                </button>
            </div>
        </div>
    );
};

// Thinking Indicator Component
const ThinkingIndicator = () => {
    return (
        <div className="message ai-message thinking">
            <div className="avatar ai-avatar">CF</div>
            <div className="message-content">
                Thinking
                <div className="thinking-dots">
                    <div className="dot"></div>
                    <div className="dot"></div>
                    <div className="dot"></div>
                </div>
            </div>
        </div>
    );
};

// Error Message Component
const ErrorMessage = ({ message }) => {
    return (
        <div className="error-message">
            <i className="fas fa-exclamation-circle"></i>
            {message}
        </div>
    );
};

// Chat Input Component
const ChatInput = ({ 
    inputValue, 
    onInputChange, 
    onSendMessage, 
    isWaitingForResponse,
    temperature,
    onTemperatureChange,
    maxTokens,
    onMaxTokensChange,
    systemPrompt,
    onSystemPromptChange
}) => {
    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            onSendMessage();
        }
    };
    
    const autoGrow = (e) => {
        const textarea = e.target;
        textarea.style.height = 'auto';
        textarea.style.height = (textarea.scrollHeight) + 'px';
    };
    
    return (
        <div className="input-area">
            <div className="input-container">
                <div className="textarea-container">
                    <textarea 
                        className="input-textarea" 
                        value={inputValue} 
                        onChange={(e) => {
                            onInputChange(e.target.value);
                            autoGrow(e);
                        }}
                        onKeyDown={handleKeyDown}
                        placeholder="Type your message here..."
                        disabled={isWaitingForResponse}
                        rows="1"
                    ></textarea>
                    <button 
                        className="send-btn" 
                        onClick={onSendMessage}
                        disabled={isWaitingForResponse || !inputValue.trim()}
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
                
                <div className="controls">
                    <div className="parameters">
                        <div className="param-group">
                            <label htmlFor="temperature">Temp:</label>
                            <input 
                                id="temperature"
                                type="number" 
                                min="0" 
                                max="2" 
                                step="0.1" 
                                value={temperature} 
                                onChange={(e) => onTemperatureChange(parseFloat(e.target.value))}
                                disabled={isWaitingForResponse}
                            />
                        </div>
                        <div className="param-group">
                            <label htmlFor="max-tokens">Max Tokens:</label>
                            <input 
                                id="max-tokens"
                                type="number" 
                                min="50" 
                                max="4000" 
                                step="50" 
                                value={maxTokens} 
                                onChange={(e) => onMaxTokensChange(parseInt(e.target.value))}
                                disabled={isWaitingForResponse}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="system-prompt">
                    <input 
                        type="text" 
                        placeholder="Optional system instructions to the AI..."
                        value={systemPrompt}
                        onChange={(e) => onSystemPromptChange(e.target.value)}
                        disabled={isWaitingForResponse}
                    />
                </div>
            </div>
        </div>
    );
};

// Main App Component
const App = () => {
    // State for available models
    const [availableModels, setAvailableModels] = React.useState([]);
    const [selectedModel, setSelectedModel] = React.useState('');
    const [isLoadingModels, setIsLoadingModels] = React.useState(true);
    
    // State for conversations
    const [conversations, setConversations] = React.useState([]);
    const [activeConversationId, setActiveConversationId] = React.useState(null);
    
    // State for current conversation
    const [messages, setMessages] = React.useState([]);
    const [inputValue, setInputValue] = React.useState('');
    const [isWaitingForResponse, setIsWaitingForResponse] = React.useState(false);
    const [error, setError] = React.useState(null);
    
    // State for parameters
    const [temperature, setTemperature] = React.useState(0.7);
    const [maxTokens, setMaxTokens] = React.useState(1000);
    const [systemPrompt, setSystemPrompt] = React.useState('You are CodeFace, a helpful AI coding assistant that provides clear and efficient solutions to programming questions.');
    
    // State for mobile sidebar
    const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
    
    // Chat container ref for scrolling
    const chatContainerRef = React.useRef(null);
    
    // Initialize app
    React.useEffect(() => {
        // Load conversations from localStorage
        const savedConversations = localStorage.getItem('codeface-conversations');
        if (savedConversations) {
            const parsedConversations = JSON.parse(savedConversations);
            setConversations(parsedConversations);
            
            // Set last active conversation if available
            const lastActiveId = localStorage.getItem('codeface-active-conversation');
            if (lastActiveId && parsedConversations.find(c => c.id === lastActiveId)) {
                setActiveConversationId(lastActiveId);
                // Load messages for this conversation
                const convo = parsedConversations.find(c => c.id === lastActiveId);
                if (convo) {
                    setMessages(convo.messages || []);
                }
            } else if (parsedConversations.length > 0) {
                // Set first conversation as active if no last active
                setActiveConversationId(parsedConversations[0].id);
                setMessages(parsedConversations[0].messages || []);
            }
        }
        
        // Fetch available models
        fetchModels();
    }, []);
    
    // Save conversations to localStorage when they change
    React.useEffect(() => {
        if (conversations.length > 0) {
            localStorage.setItem('codeface-conversations', JSON.stringify(conversations));
        }
    }, [conversations]);
    
    // Save active conversation ID when it changes
    React.useEffect(() => {
        if (activeConversationId) {
            localStorage.setItem('codeface-active-conversation', activeConversationId);
        }
    }, [activeConversationId]);
    
    // Scroll to bottom when messages change
    React.useEffect(()

