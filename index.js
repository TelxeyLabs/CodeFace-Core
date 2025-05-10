// Core CodeFace Functionality
// This file provides the main entry point for the open-source version of CodeFace

// Import dependencies
import React from 'react';
import ReactDOM from 'react-dom';
import { marked } from 'marked';
import PropTypes from 'prop-types';

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
            <button 
                className="new-chat-btn" 
                onClick={onNewChat}
                aria-label="Create new chat"
            >
                <i className="fas fa-plus" aria-hidden="true"></i> New Chat
            </button>
            <div className="conversation-list">
                {conversations.map(conv => (
                    <div 
                        key={conv.id} 
                        className={`conversation-item ${conv.id === activeConversationId ? 'active' : ''}`}
                        onClick={() => onSelectConversation(conv.id)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault();
                                onSelectConversation(conv.id);
                            }
                        }}
                        tabIndex="0"
                        role="button"
                        aria-pressed={conv.id === activeConversationId}
                    >
                        <i className="fas fa-message conversation-icon" aria-hidden="true"></i>
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
        <button 
            className="sidebar-toggle" 
            onClick={toggleSidebar}
            aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            aria-expanded={isSidebarOpen}
        >
            <i className={`fas ${isSidebarOpen ? 'fa-times' : 'fa-bars'}`} aria-hidden="true"></i>
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
                <button 
                    className="copy-btn" 
                    onClick={copyMessage}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            copyMessage();
                        }
                    }}
                    aria-label="Copy message to clipboard"
                    tabIndex="0"
                >
                    <i className="fas fa-copy" aria-hidden="true"></i>
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
                        aria-label="Send message"
                    >
                        <i className="fas fa-paper-plane" aria-hidden="true"></i>
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
    React.useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [messages]);
    
    // Fetch available models function
    const fetchModels = async () => {
        setIsLoadingModels(true);
        try {
            // This would be a real API call in a production app
            // Simulating a fetch request with some default models
            const mockModels = [
                { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo' },
                { id: 'gpt-4', name: 'GPT-4' },
                { id: 'codellama', name: 'Code Llama' }
            ];
            setAvailableModels(mockModels);
            setSelectedModel(mockModels[0].id);
        } catch (err) {
            console.error('Failed to fetch models:', err);
            setError('Failed to load AI models. Please try again later.');
        } finally {
            setIsLoadingModels(false);
        }
    };
    
    // Create a new chat
    const handleNewChat = React.useCallback(() => {
        const newConversation = {
            id: Date.now().toString(),
            title: 'New Conversation',
            messages: []
        };
        
        setConversations(prevConversations => [newConversation, ...prevConversations]);
        setActiveConversationId(newConversation.id);
        setMessages([]);
        setError(null);
    }, []);
    
    // Select a conversation
    const handleSelectConversation = React.useCallback((conversationId) => {
        setActiveConversationId(conversationId);
        const conversation = conversations.find(c => c.id === conversationId);
        if (conversation) {
            setMessages(conversation.messages || []);
            setError(null);
        }
        
        // Close sidebar on mobile after selection
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
        }
    }, [conversations]);
    
    // Send a message
    const handleSendMessage = React.useCallback(async () => {
        if (!inputValue.trim() || isWaitingForResponse) return;
        
        const userMessage = {
            role: 'user',
            content: inputValue
        };
        
        // Update conversation with user message
        const updatedMessages = [...messages, userMessage];
        setMessages(updatedMessages);
        setInputValue('');
        setIsWaitingForResponse(true);
        setError(null);
        
        try {
            // This would call a real API in a production app
            // Simulating API response delay
            setTimeout(() => {
                const aiResponse = {
                    role: 'assistant',
                    content: 'This is a placeholder response from the AI. In a real implementation, this would connect to an actual language model API.'
                };
                
                const newMessages = [...updatedMessages, aiResponse];
                setMessages(newMessages);
                
                // Update conversation in state
                const updatedConversations = conversations.map(c => {
                    if (c.id === activeConversationId) {
                        // Update conversation title if this is the first message
                        let title = c.title;
                        if (c.messages.length === 0) {
                            // Use first few words of first message as title
                            title = inputValue.split(' ').slice(0, 3).join(' ') + '...';
                        }
                        return {
                            ...c,
                            title,
                            messages: newMessages
                        };
                    }
                    return c;
                });
                
                setConversations(updatedConversations);
                setIsWaitingForResponse(false);
            }, 1000);
        } catch (err) {
            console.error('Error sending message:', err);
            setError('Failed to get AI response. Please try again.');
            setIsWaitingForResponse(false);
        }
    }, [messages, activeConversationId, conversations, inputValue]);
    
    // Copy message to clipboard
    const handleCopyMessage = React.useCallback((content) => {
        navigator.clipboard.writeText(content)
            .then(() => {
                // Could show a toast notification here
                console.log('Message copied to clipboard');
            })
            .catch(err => {
                console.error('Failed to copy message:', err);
            });
    }, []);
    
    // Toggle sidebar for mobile
    const toggleSidebar = React.useCallback(() => {
        setIsSidebarOpen(prevState => !prevState);
    }, []);
    
    // Get active conversation title
    const activeConversationTitle = React.useMemo(() => {
        const activeConversation = conversations.find(c => c.id === activeConversationId);
        return activeConversation ? activeConversation.title : 'CodeFace Chat';
    }, [activeConversationId, conversations]);
    
    // Access the theme context
    const { theme, toggleTheme } = React.useContext(ThemeContext);
    
    return (
        <div className={`app-container ${theme}`}>
            <Sidebar 
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={handleSelectConversation}
                onNewChat={handleNewChat}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            
            <div className="main-content">
                <div className="main-header">
                    <SidebarToggle 
                        toggleSidebar={toggleSidebar} 
                        isSidebarOpen={isSidebarOpen} 
                    />
                    <div className="conversation-title">
                        {activeConversationTitle}
                    </div>
                    <div className="header-actions">
                        <ModelSelector 
                            availableModels={availableModels}
                            selectedModel={selectedModel}
                            onModelChange={setSelectedModel}
                            isLoading={isLoadingModels}
                        />
                        <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                    </div>
                </div>
                
                <div className="chat-container" ref={chatContainerRef}>
                    {activeConversationId ? (
                        <div className="messages">
                            {messages.map((message, index) => (
                                <Message 
                                    key={index} 
                                    message={message} 
                                    onCopy={handleCopyMessage} 
                                />
                            ))}
                            {isWaitingForResponse && <ThinkingIndicator />}
                            {error && <ErrorMessage message={error} />}
                        </div>
                    ) : (
                        <div className="welcome-screen">
                            <h1>Welcome to CodeFace</h1>
                            <p>Start a new conversation to begin chatting with the AI.</p>
                            <button 
                                className="welcome-btn" 
                                onClick={handleNewChat}
                                aria-label="Start new chat"
                            >
                                <i className="fas fa-plus" aria-hidden="true"></i> New Chat
                            </button>
                        </div>
                    )}
                </div>
                
                {activeConversationId && (
                    <ChatInput 
                        inputValue={inputValue}
                        onInputChange={setInputValue}
                        onSendMessage={handleSendMessage}
                        isWaitingForResponse={isWaitingForResponse}
                        temperature={temperature}
                        onTemperatureChange={setTemperature}
                        maxTokens={maxTokens}
                        onMaxTokensChange={setMaxTokens}
                        systemPrompt={systemPrompt}
                        onSystemPromptChange={setSystemPrompt}
                    />
                )}
            </div>
        </div>
    );
};

export default App;

// PropTypes definitions
Sidebar.propTypes = {
    conversations: PropTypes.array.isRequired,
    activeConversationId: PropTypes.string,
    onSelectConversation: PropTypes.func.isRequired,
    onNewChat: PropTypes.func.isRequired,
    isSidebarOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired
};

SidebarToggle.propTypes = {
    toggleSidebar: PropTypes.func.isRequired,
    isSidebarOpen: PropTypes.bool.isRequired
};

ThemeToggle.propTypes = {
    theme: PropTypes.oneOf(['light', 'dark']).isRequired,
    toggleTheme: PropTypes.func.isRequired
};

ModelSelector.propTypes = {
    availableModels: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.string.isRequired,
            name: PropTypes.string
        })
    ).isRequired,
    selectedModel: PropTypes.string,
    onModelChange: PropTypes.func.isRequired,
    isLoading: PropTypes.bool
};

Message.propTypes = {
    message: PropTypes.shape({
        role: PropTypes.oneOf(['user', 'assistant', 'system']).isRequired,
        content: PropTypes.string.isRequired
    }).isRequired,
    onCopy: PropTypes.func.isRequired
};

ThinkingIndicator.propTypes = {};

ErrorMessage.propTypes = {
    message: PropTypes.string.isRequired
};

ChatInput.propTypes = {
    inputValue: PropTypes.string.isRequired,
    onInputChange: PropTypes.func.isRequired,
    onSendMessage: PropTypes.func.isRequired,
    isWaitingForResponse: PropTypes.bool.isRequired,
    temperature: PropTypes.number.isRequired,
    onTemperatureChange: PropTypes.func.isRequired,
    maxTokens: PropTypes.number.isRequired,
    onMaxTokensChange: PropTypes.func.isRequired,
    systemPrompt: PropTypes.string.isRequired,
    onSystemPromptChange: PropTypes.func.isRequired
};
