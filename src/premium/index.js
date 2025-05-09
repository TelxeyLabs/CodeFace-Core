// Premium CodeFace Functionality
// This file provides the main entry point for the premium version of CodeFace
// Premium features are only available to sponsors

// Import dependencies
import React from 'react';
import ReactDOM from 'react-dom';

// Import core functionality to extend
import * as CoreCodeFace from '../core/index.js';
import { ThemeContext, ThemeProvider } from '../theme-context.js';

// Premium Components
// These components extend or enhance the core components

// Premium Sidebar with enhanced features
const PremiumSidebar = ({ conversations, activeConversationId, onSelectConversation, onNewChat, isSidebarOpen, toggleSidebar }) => {
    return (
        <div className={`sidebar premium-sidebar ${isSidebarOpen ? 'open' : ''}`}>
            <div className="sidebar-header premium">
                <div className="logo-container">
                    <img 
                        src="public/logos/premium-logo.png" 
                        alt="CodeFace Premium Logo" 
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
                            fallback.textContent = 'CF+';
                            fallback.style.width = '40px';
                            fallback.style.height = '40px';
                            fallback.style.background = 'linear-gradient(135deg, #ffd700, #ff8c00)';
                            fallback.style.display = 'flex';
                            fallback.style.alignItems = 'center';
                            fallback.style.justifyContent = 'center';
                            fallback.style.color = 'white';
                            fallback.style.fontWeight = 'bold';
                            fallback.style.marginRight = '8px';
                            e.target.parentNode.appendChild(fallback);
                        }}
                    />
                    <div className="sidebar-title premium">CODE<span>FACE</span><sup className="premium-badge">PRO</sup></div>
                </div>
            </div>
            <button className="new-chat-btn premium-btn" onClick={onNewChat}>
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
                        {/* Premium feature: Add conversation management options */}
                        <div className="conversation-actions">
                            <button className="edit-btn" onClick={(e) => { e.stopPropagation(); /* Edit conversation */ }}>
                                <i className="fas fa-pencil"></i>
                            </button>
                            <button className="delete-btn" onClick={(e) => { e.stopPropagation(); /* Delete conversation */ }}>
                                <i className="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
            <div className="sidebar-footer premium">
                <div>CodeFace Pro - Premium AI Chat Experience</div>
                <div className="premium-features">
                    <span className="feature-tag">Premium</span>
                    <span className="feature-tag">Sponsor</span>
                </div>
            </div>
        </div>
    );
};

// Enhanced Model Selector with premium models
const PremiumModelSelector = ({ availableModels, selectedModel, onModelChange, isLoading }) => {
    // Filter premium models or add premium indicators
    const enhancedModels = availableModels.map(model => ({
        ...model,
        isPremium: model.id.includes('gpt-4') || model.id.includes('claude') || model.id.includes('-pro')
    }));
    
    return (
        <div className="model-selector premium-selector">
            <select 
                value={selectedModel} 
                onChange={(e) => onModelChange(e.target.value)}
                disabled={isLoading}
                className="premium-select"
            >
                {isLoading ? (
                    <option value="">Loading models...</option>
                ) : enhancedModels.length === 0 ? (
                    <option value="">No models available</option>
                ) : (
                    enhancedModels.map(model => (
                        <option key={model.id} value={model.id}>
                            {model.id} {model.isPremium ? '✨' : ''}
                        </option>
                    ))
                )}
            </select>
        </div>
    );
};

// Enhanced Message Component with premium features
const PremiumMessage = ({ message, onCopy, onEdit, onDelete }) => {
    const isUser = message.role === 'user';
    
    const copyMessage = () => {
        onCopy(message.content);
    };
    
    return (
        <div className={`message ${isUser ? 'user-message' : 'ai-message'} premium-message`}>
            <div className={`avatar ${isUser ? 'user-avatar' : 'ai-avatar'} premium`}>
                {isUser ? 'You' : 'CF+'}
            </div>
            <div 
                className="message-content premium-content" 
                dangerouslySetInnerHTML={{ __html: CoreCodeFace.marked.parse(message.content) }} 
            />
            <div className="message-actions premium-actions">
                <button className="copy-btn" onClick={copyMessage}>
                    <i className="fas fa-copy"></i>
                </button>
                {/* Premium feature: Message editing */}
                {isUser && (
                    <button className="edit-btn" onClick={() => onEdit(message)}>
                        <i className="fas fa-pencil"></i>
                    </button>
                )}
                {/* Premium feature: Message deletion */}
                <button className="delete-btn" onClick={() => onDelete(message)}>
                    <i className="fas fa-trash"></i>
                </button>
            </div>
        </div>
    );
};

// Enhanced Chat Input with premium features
const PremiumChatInput = ({ 
    inputValue, 
    onInputChange, 
    onSendMessage, 
    isWaitingForResponse,
    temperature,
    onTemperatureChange,
    maxTokens,
    onMaxTokensChange,
    systemPrompt,
    onSystemPromptChange,
    // Premium-specific props
    enableVoiceInput = true,
    onVoiceInput,
    enableFilePaste = true,
    onFilePaste
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
    
    // Premium feature: Voice input
    const handleVoiceInput = () => {
        if (onVoiceInput) {
            onVoiceInput();
        }
    };
    
    // Premium feature: File/code paste
    const handleFilePaste = () => {
        if (onFilePaste) {
            onFilePaste();
        }
    };
    
    return (
        <div className="input-area premium-input-area">
            <div className="input-container premium-container">
                <div className="textarea-container premium">
                    <textarea 
                        className="input-textarea premium" 
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
                    
                    {/* Premium feature: Voice input button */}
                    {enableVoiceInput && (
                        <button 
                            className="voice-btn premium-feature-btn" 
                            onClick={handleVoiceInput}
                            disabled={isWaitingForResponse}
                        >
                            <i className="fas fa-microphone"></i>
                        </button>
                    )}
                    
                    {/* Premium feature: File/code paste button */}
                    {enableFilePaste && (
                        <button 
                            className="file-btn premium-feature-btn" 
                            onClick={handleFilePaste}
                            disabled={isWaitingForResponse}
                        >
                            <i className="fas fa-file-code"></i>
                        </button>
                    )}
                    
                    <button 
                        className="send-btn premium-send-btn" 
                        onClick={onSendMessage}
                        disabled={isWaitingForResponse || !inputValue.trim()}
                    >
                        <i className="fas fa-paper-plane"></i>
                    </button>
                </div>
                
                <div className="controls premium-controls">
                    <div className="parameters premium-parameters">
                        <div className="param-group">
                            <label htmlFor="temperature">Temperature:</label>
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
                                max="8000" 
                                step="50" 
                                value={maxTokens} 
                                onChange={(e) => onMaxTokensChange(parseInt(e.target.value))}
                                disabled={isWaitingForResponse}
                            />
                        </div>
                    </div>
                </div>
                
                <div className="system-prompt premium-system-prompt">
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

// Export both core components and premium components
export {
    // Re-export core components
    CoreCodeFace,
    
    // Export premium components
    PremiumSidebar,
    PremiumModelSelector,
    PremiumMessage,
    PremiumChatInput
};

// Premium App version that uses all premium components
export const PremiumApp = () => {
    // Use the core App functionality with premium components
    // Implementation details would depend on how the app is structured
    return (
        <ThemeProvider>
            <div className="premium-app">
                {/* Premium App Implementation */}
                <div className="premium-badge">PREMIUM</div>
            </div>
        </ThemeProvider>
    );
};

// Default export for direct importing
export default {
    ...CoreCodeFace,
    PremiumSidebar,
    PremiumModelSelector,
    PremiumMessage,
    PremiumChatInput,
    PremiumApp
};

