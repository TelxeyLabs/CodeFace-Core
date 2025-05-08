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
    
    // Fetch available models from LM Studio API
    const fetchModels = async () => {
        setIsLoadingModels(true);
        setError(null);
        
        try {
            const response = await fetch('http://localhost:1234/v1/models');
            
            if (!response.ok) {
                throw new Error(`Error fetching models: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            // Filter out embedding models
            const chatModels = data.data.filter(model => !model.id.includes('embed'));
            
            setAvailableModels(chatModels);
            
            // Set first model as selected if available
            if (chatModels.length > 0 && !selectedModel) {
                setSelectedModel(chatModels[0].id);
            }
        } catch (error) {
            setError(`Could not connect to CodeFace API: ${error.message}`);
            console.error('Error fetching models:', error);
        } finally {
            setIsLoadingModels(false);
        }
    };
    
    // Create a new conversation
    const createNewConversation = () => {
        const newId = Date.now().toString();
        const newConversation = {
            id: newId,
            title: 'New Chat',
            messages: []
        };
        
        setConversations([newConversation, ...conversations]);
        setActiveConversationId(newId);
        setMessages([]);
        setError(null);
        setIsSidebarOpen(false);
    };
    
    // Select a conversation
    const selectConversation = (id) => {
        setActiveConversationId(id);
        const conversation = conversations.find(c => c.id === id);
        if (conversation) {
            setMessages(conversation.messages || []);
        }
        setError(null);
        setIsSidebarOpen(false);
    };
    
    // Update conversation title based on first user message
    const updateConversationTitle = (id, userMessage) => {
        setConversations(conversations.map(conv => {
            if (conv.id === id) {
                // Extract first ~30 characters for the title
                const title = userMessage.length > 30 
                    ? userMessage.substring(0, 30) + '...' 
                    : userMessage;
                return { ...conv, title };
            }
            return conv;
        }));
    };
    
    // Send message to AI
    const sendMessage = async () => {
        if (!inputValue.trim() || isWaitingForResponse) return;
        
        if (!selectedModel) {
            setError('Please select a model first');
            return;
        }
        
        const userMessage = inputValue.trim();
        setInputValue('');
        
        // Add user message to the UI
        const updatedMessages = [...messages, { role: 'user', content: userMessage }];
        setMessages(updatedMessages);
        
        // Update the current conversation's messages
        const updatedConversations = conversations.map(conv => {
            if (conv.id === activeConversationId) {
                return { ...conv, messages: updatedMessages };
            }
            return conv;
        });
        setConversations(updatedConversations);
        
        // Update conversation title if this is the first message
        if (messages.length === 0) {
            updateConversationTitle(activeConversationId, userMessage);
        }
        
        // Indicate waiting for response
        setIsWaitingForResponse(true);
        setError(null);
        
        try {
            // Prepare messages array including conversation history
            const apiMessages = [];
            
            // Add system message if provided
            if (systemPrompt.trim()) {
                apiMessages.push({
                    role: 'system',
                    content: systemPrompt.trim()
                });
            }
            
            // Add all previous messages plus the new one
            updatedMessages.forEach(msg => {
                apiMessages.push({
                    role: msg.role,
                    content: msg.content
                });
            });
            
            // Call the API
            const response = await fetch('http://localhost:1234/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    model: selectedModel,
                    messages: apiMessages,
                    temperature: temperature,
                    max_tokens: maxTokens
                })
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`API error: ${response.status} - ${errorText}`);
            }
            
            const data = await response.json();
            
            if (!data.choices || data.choices.length === 0) {
                throw new Error('Empty response from API');
            }
            
            // Extract AI response
            const aiResponse = data.choices[0].message.content;
            
            // Add AI message to the conversation
            const messagesWithResponse = [...updatedMessages, {
                role: 'assistant',
                content: aiResponse
            }];
            
            setMessages(messagesWithResponse);
            
            // Update conversation in the list
            const conversationsWithResponse = conversations.map(conv => {
                if (conv.id === activeConversationId) {
                    return { ...conv, messages: messagesWithResponse };
                }
                return conv;
            });
            
            setConversations(conversationsWithResponse);
            
        } catch (error) {
            console.error('Error calling API:', error);
            setError(`Error: ${error.message}`);
        } finally {
            setIsWaitingForResponse(false);
        }
    };
    
    // Copy message content to clipboard
    const copyMessageToClipboard = (content) => {
        navigator.clipboard.writeText(content).then(
            () => {
                // Flash some UI feedback (could be improved)
                const copySuccess = document.createElement('div');
                copySuccess.textContent = 'Copied to clipboard!';
                copySuccess.style.position = 'fixed';
                copySuccess.style.bottom = '20px';
                copySuccess.style.left = '50%';
                copySuccess.style.transform = 'translateX(-50%)';
                copySuccess.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
                copySuccess.style.color = 'white';
                copySuccess.style.padding = '10px 20px';
                copySuccess.style.borderRadius = '4px';
                copySuccess.style.zIndex = '1000';
                
                document.body.appendChild(copySuccess);
                
                setTimeout(() => {
                    copySuccess.remove();
                }, 2000);
            },
            (err) => {
                console.error('Could not copy text: ', err);
                setError('Failed to copy to clipboard');
            }
        );
    };
    
    // Toggle sidebar in mobile view
    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };
    
    // Render the app
    return (
        <>
            <Sidebar 
                conversations={conversations}
                activeConversationId={activeConversationId}
                onSelectConversation={selectConversation}
                onNewChat={createNewConversation}
                isSidebarOpen={isSidebarOpen}
                toggleSidebar={toggleSidebar}
            />
            
            <SidebarToggle 
                toggleSidebar={toggleSidebar}
                isSidebarOpen={isSidebarOpen}
            />
            
            <div className="main-content">
                <div className="chat-header">
                    <ThemeContext.Consumer>
                        {({ theme, toggleTheme }) => (
                            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
                        )}
                    </ThemeContext.Consumer>
                    <ModelSelector 
                        availableModels={availableModels}
                        selectedModel={selectedModel}
                        onModelChange={setSelectedModel}
                        isLoading={isLoadingModels}
                    />
                </div>
                
                <div className="chat-container" ref={chatContainerRef}>
                    {error && <ErrorMessage message={error} />}
                    
                    {messages.length === 0 ? (
                        <div className="message-group">
                            <div className="message ai-message">
                                <div className="avatar ai-avatar">CF</div>
                                <div className="message-content">
                                    Welcome to CodeFace Chat! I'm ready to assist you with your coding questions.
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="message-group">
                            {messages.map((message, index) => (
                                <Message 
                                    key={index}
                                    message={message}
                                    onCopy={copyMessageToClipboard}
                                />
                            ))}
                        </div>
                    )}
                    
                    {isWaitingForResponse && <ThinkingIndicator />}
                </div>
                
                <ChatInput 
                    inputValue={inputValue}
                    onInputChange={setInputValue}
                    onSendMessage={sendMessage}
                    isWaitingForResponse={isWaitingForResponse}
                    temperature={temperature}
                    onTemperatureChange={setTemperature}
                    maxTokens={maxTokens}
                    onMaxTokensChange={setMaxTokens}
                    systemPrompt={systemPrompt}
                    onSystemPromptChange={setSystemPrompt}
                />
            </div>
        </>
    );
};

// Set document title
document.title = "CodeFace Chat";

// Render the App to the DOM with ThemeProvider
ReactDOM.createRoot(document.getElementById('root')).render(
    <ThemeProvider>
        <App />
    </ThemeProvider>
);

