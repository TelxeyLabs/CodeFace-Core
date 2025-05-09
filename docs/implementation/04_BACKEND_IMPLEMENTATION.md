# Backend Implementation Guide

## 1. FastAPI Setup and Architecture

### Initial Setup
```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # Unix
# or
.\venv\Scripts\activate  # Windows

# Install dependencies
pip install fastapi[all] uvicorn python-jose[cryptography] passlib[bcrypt]
pip install pydantic sqlalchemy alembic python-dotenv
```

### Project Structure
```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py
│   ├── core/
│   │   ├── config.py     # Environment configuration
│   │   ├── security.py   # Authentication/Authorization
│   │   └── logging.py    # Logging configuration
│   ├── api/
│   │   ├── v1/
│   │   │   ├── chat.py   # Chat endpoints
│   │   │   └── stream.py # Streaming endpoints
│   │   └── deps.py       # Dependencies
│   ├── models/
│   │   ├── conversation.py
│   │   └── message.py
│   └── services/
│       ├── ai_service.py  # AI model integration
│       └── chat_service.py # Chat business logic
└── tests/
    ├── conftest.py
    └── test_chat.py
```

## 2. Core Components

### Base Configuration
```python
# app/core/config.py
from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "CodeFace API"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # Database
    DATABASE_URL: str
    
    # Security
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    
    # AI Model
    MODEL_PATH: str
    TEMPERATURE: float = 0.7
    MAX_TOKENS: int = 1000
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### Database Models
```python
# app/models/base.py
from sqlalchemy import Column, DateTime, func
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class TimestampedModel:
    created_at = Column(DateTime, default=func.now(), nullable=False)
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now(), nullable=False)

# app/models/conversation.py
from sqlalchemy import Column, String, UUID
from uuid import uuid4

class Conversation(Base, TimestampedModel):
    __tablename__ = "conversations"
    
    id = Column(UUID, primary_key=True, default=uuid4)
    title = Column(String, nullable=False)
```

## 3. AI Model Integration

### Model Manager
```python
# app/services/model_manager.py
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

class ModelManager:
    def __init__(self, model_path: str):
        self.model_path = model_path
        self.model = None
        self.tokenizer = None
        
    async def load_model(self):
        if not self.model:
            self.model = AutoModelForCausalLM.from_pretrained(
                self.model_path,
                device_map="auto",
                torch_dtype=torch.float16
            )
            self.tokenizer = AutoTokenizer.from_pretrained(self.model_path)
    
    async def generate(
        self,
        prompt: str,
        max_tokens: int = 1000,
        temperature: float = 0.7
    ) -> str:
        await self.load_model()
        
        inputs = self.tokenizer(prompt, return_tensors="pt")
        outputs = self.model.generate(
            inputs["input_ids"],
            max_length=max_tokens,
            temperature=temperature,
            do_sample=True,
            pad_token_id=self.tokenizer.eos_token_id
        )
        
        return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
```

### Streaming Implementation
```python
# app/api/v1/stream.py
from fastapi import APIRouter, BackgroundTasks
from sse_starlette.sse import EventSourceResponse
from typing import AsyncGenerator

router = APIRouter()

async def generate_tokens(prompt: str) -> AsyncGenerator[str, None]:
    model_manager = ModelManager(settings.MODEL_PATH)
    async for token in model_manager.generate_stream(prompt):
        yield token

@router.get("/stream/{conversation_id}")
async def stream_response(
    conversation_id: str,
    background_tasks: BackgroundTasks
) -> EventSourceResponse:
    return EventSourceResponse(generate_tokens(conversation_id))
```

## 4. API Endpoints

### Chat Endpoints
```python
# app/api/v1/chat.py
from fastapi import APIRouter, Depends, HTTPException
from app.services.chat_service import ChatService
from app.core.security import get_current_user

router = APIRouter()

@router.post("/chat")
async def create_chat_message(
    message: str,
    current_user = Depends(get_current_user),
    chat_service: ChatService = Depends()
):
    try:
        response = await chat_service.process_message(message, current_user)
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
```

## 5. Error Handling and Middleware

### Error Handler
```python
# app/core/errors.py
from fastapi import Request, status
from fastapi.responses import JSONResponse

async def http_error_handler(request: Request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "code": exc.status_code,
            "message": exc.detail,
            "path": request.url.path
        }
    )

# app/main.py
app.add_exception_handler(HTTPException, http_error_handler)
```

### Rate Limiting
```python
# app/core/middleware.py
from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
import time

class RateLimitMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        if await self.is_rate_limited(request):
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests"}
            )
        return await call_next(request)
```

## 6. Testing

### Unit Tests
```python
# tests/test_chat.py
import pytest
from httpx import AsyncClient
from app.main import app

@pytest.mark.asyncio
async def test_chat_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.post(
            "/api/v1/chat",
            json={"message": "Hello"}
        )
        assert response.status_code == 200
```

### Integration Tests
```python
# tests/test_integration.py
import pytest
from app.services.ai_service import AIService
from app.services.model_manager import ModelManager

@pytest.mark.asyncio
async def test_model_generation():
    model_manager = ModelManager("test-model")
    response = await model_manager.generate("Test prompt")
    assert isinstance(response, str)
    assert len(response) > 0
```

## 7. Deployment

### Docker Configuration
```dockerfile
FROM python:3.9-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Environment Variables
```env
# .env
DATABASE_URL=postgresql://user:password@localhost:5432/codeface
SECRET_KEY=your-secret-key
MODEL_PATH=/path/to/model
TEMPERATURE=0.7
MAX_TOKENS=1000
```

## 8. Monitoring and Logging

### Logging Configuration
```python
# app/core/logging.py
import logging
from logging.handlers import RotatingFileHandler

def setup_logging():
    logger = logging.getLogger("app")
    logger.setLevel(logging.INFO)
    
    handler = RotatingFileHandler(
        "app.log",
        maxBytes=10000000,
        backupCount=5
    )
    
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    handler.setFormatter(formatter)
    logger.addHandler(handler)
    
    return logger
```

### Performance Monitoring
```python
# app/core/monitoring.py
from prometheus_client import Counter, Histogram
import time

request_count = Counter(
    'http_requests_total',
    'Total HTTP requests'
)

request_latency = Histogram(
    'http_request_duration_seconds',
    'HTTP request latency'
)

class MetricsMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        response = await call_next(request)
        duration = time.time() - start_time
        
        request_count.inc()
        request_latency.observe(duration)
        
        return response
```

