# Technical Stack and Implementation Details

## 1. Frontend Core Stack

### Next.js + React Setup
```bash
# Core packages
next@latest react@latest react-dom@latest typescript@latest
@emotion/react @emotion/styled framer-motion
```

### State Management Strategy
- React Context for global state
- Local state for component-specific data
- Custom hooks for reusable logic

### Type System
```typescript
// Core types
interface Theme {
  mode: 'light' | 'dark';
  colors: ThemeColors;
  transitions: ThemeTransitions;
}

interface Message {
  id: string;
  content: string;
  role: 'user' | 'assistant';
  timestamp: Date;
  codeBlocks?: CodeBlock[];
}

interface CodeBlock {
  id: string;
  language: string;
  content: string;
}
```

## 2. Backend Infrastructure

### FastAPI Setup
```python
# Core dependencies
fastapi==0.70.0
uvicorn[standard]==0.15.0
python-jose[cryptography]==3.3.0
passlib[bcrypt]==1.7.4
```

### AI Model Integration
```python
# Model handling
class ModelManager:
    def __init__(self):
        self.models = {}
        self.tokenizers = {}
        
    async def get_model(self, model_id: str):
        if model_id not in self.models:
            # Load model
            pass
        return self.models[model_id]
```

## 3. Database Schema

### PostgreSQL Tables
```sql
-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY,
    title VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY,
    conversation_id UUID REFERENCES conversations(id),
    role VARCHAR(50),
    content TEXT,
    created_at TIMESTAMP WITH TIME ZONE
);
```

## 4. API Routes Structure

### Frontend API Routes
```typescript
// pages/api/chat.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    // Handle chat messages
  }
}

// pages/api/stream.ts
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  res.setHeader('Content-Type', 'text/event-stream');
  // Handle streaming
}
```

### Backend API Routes
```python
@router.post("/chat")
async def chat_endpoint(
    message: Message,
    background_tasks: BackgroundTasks
):
    # Handle chat logic
    pass

@router.get("/stream/{conversation_id}")
async def stream_endpoint(
    conversation_id: str,
    background_tasks: BackgroundTasks
):
    # Handle streaming
    pass
```

## 5. Component Architecture

### Layout Components
```typescript
// components/layout/AppContainer.tsx
export const AppContainer: React.FC = ({ children }) => {
  const { theme } = useTheme();
  return (
    <div className={`app-container ${theme}`}>
      <Sidebar />
      <MainContent>{children}</MainContent>
    </div>
  );
};
```

### Feature Components
```typescript
// components/features/CodeBlock/CodeBlock.tsx
export const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language,
}) => {
  const copyCode = useCallback(() => {
    // Copy implementation
  }, [code]);

  return (
    <pre>
      <CopyButton onClick={copyCode} />
      <code>{code}</code>
    </pre>
  );
};
```

## 6. State Management Implementation

### Theme Context
```typescript
export const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC = ({ children }) => {
  const [theme, setTheme] = useState<Theme>('light');

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### Chat Context
```typescript
export const ChatContext = createContext<ChatContextType>({
  messages: [],
  sendMessage: () => Promise.resolve(),
});

export const ChatProvider: React.FC = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = useCallback(async (content: string) => {
    // Message handling logic
  }, []);

  return (
    <ChatContext.Provider value={{ messages, sendMessage }}>
      {children}
    </ChatContext.Provider>
  );
};
```

## 7. Testing Strategy

### Frontend Tests
```typescript
// components/CodeBlock/CodeBlock.test.tsx
describe('CodeBlock', () => {
  it('renders code content', () => {
    // Test implementation
  });

  it('copies code to clipboard', () => {
    // Test implementation
  });
});
```

### Backend Tests
```python
# tests/test_chat.py
def test_chat_endpoint():
    response = client.post(
        "/chat",
        json={"message": "test"}
    )
    assert response.status_code == 200
```

## 8. Deployment Configuration

### Docker Setup
```dockerfile
# Frontend
FROM node:16-alpine AS frontend
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Backend
FROM python:3.9-slim AS backend
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
```

### Environment Variables
```env
# Frontend
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_PUBLIC_WS_URL=ws://localhost:8000

# Backend
DATABASE_URL=postgresql://user:pass@localhost:5432/db
MODEL_PATH=/path/to/model
```

