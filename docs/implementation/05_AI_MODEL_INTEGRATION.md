# AI Model Integration Guide

## 1. Model Selection and Setup

### Model Requirements
```python
# Required model capabilities
- Code understanding and generation
- Context-aware responses
- Stream token generation
- Multi-language support
- Memory efficiency

# Recommended base models
- CodeLlama-34b
- StarCoder-15b
- GPT-Neo-2.7b
```

### Model Configuration
```python
# app/core/model_config.py
from pydantic import BaseSettings

class ModelConfig(BaseSettings):
    MODEL_NAME: str = "codellama/CodeLlama-34b-Instruct-hf"
    DEVICE: str = "cuda"  # or "cpu"
    DTYPE: str = "float16"
    
    # Generation parameters
    MAX_NEW_TOKENS: int = 2048
    TEMPERATURE: float = 0.7
    TOP_P: float = 0.95
    TOP_K: int = 50
    
    # Memory management
    BATCH_SIZE: int = 1
    OFFLOAD_FOLDER: str = "offload"
    USE_FLASH_ATTENTION: bool = True
```

## 2. Model Management

### Model Loading Strategy
```python
# app/services/model_loader.py
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

class ModelLoader:
    def __init__(self, config: ModelConfig):
        self.config = config
        self._model = None
        self._tokenizer = None
    
    async def load(self):
        if not self._model:
            self._model = AutoModelForCausalLM.from_pretrained(
                self.config.MODEL_NAME,
                device_map="auto",
                torch_dtype=torch.float16 if self.config.DTYPE == "float16" else torch.float32,
                offload_folder=self.config.OFFLOAD_FOLDER if self.config.DEVICE == "cuda" else None,
                use_flash_attention=self.config.USE_FLASH_ATTENTION,
            )
            self._tokenizer = AutoTokenizer.from_pretrained(
                self.config.MODEL_NAME
            )
        return self._model, self._tokenizer
```

### Memory Management
```python
# app/services/memory_manager.py
import torch
import gc
from typing import Optional

class MemoryManager:
    def __init__(self, threshold_mb: int = 1000):
        self.threshold_mb = threshold_mb
        self.current_allocated = 0
    
    def check_memory(self) -> bool:
        if torch.cuda.is_available():
            current = torch.cuda.memory_allocated() / 1024**2
            if current > self.threshold_mb:
                self.cleanup()
                return False
        return True
    
    def cleanup(self):
        gc.collect()
        if torch.cuda.is_available():
            torch.cuda.empty_cache()
```

## 3. Generation Pipeline

### Base Generator
```python
# app/services/generator.py
from typing import AsyncGenerator, Optional
import torch

class Generator:
    def __init__(
        self,
        model_loader: ModelLoader,
        memory_manager: MemoryManager
    ):
        self.model_loader = model_loader
        self.memory_manager = memory_manager
    
    async def generate(
        self,
        prompt: str,
        max_new_tokens: Optional[int] = None,
        temperature: Optional[float] = None,
    ) -> AsyncGenerator[str, None]:
        model, tokenizer = await self.model_loader.load()
        
        inputs = tokenizer(prompt, return_tensors="pt").to(model.device)
        
        generated_ids = await self._generate_tokens(
            model,
            inputs["input_ids"],
            max_new_tokens,
            temperature
        )
        
        for token_ids in generated_ids:
            token = tokenizer.decode(token_ids, skip_special_tokens=True)
            if token:
                yield token
    
    async def _generate_tokens(self, model, input_ids, max_new_tokens, temperature):
        # Implementation of token generation
        pass
```

### Code-Specific Generation
```python
# app/services/code_generator.py
from typing import Dict, Any

class CodeGenerator(Generator):
    async def _generate_tokens(
        self,
        model,
        input_ids,
        max_new_tokens,
        temperature
    ):
        generation_config = {
            "max_new_tokens": max_new_tokens or self.model_loader.config.MAX_NEW_TOKENS,
            "temperature": temperature or self.model_loader.config.TEMPERATURE,
            "top_p": self.model_loader.config.TOP_P,
            "top_k": self.model_loader.config.TOP_K,
            "do_sample": True,
            "pad_token_id": model.config.eos_token_id,
        }
        
        outputs = model.generate(
            input_ids,
            **generation_config,
            return_dict_in_generate=True,
            output_scores=True,
            streaming=True
        )
        
        async for token_ids in outputs.sequences:
            yield token_ids[-1:]
```

## 4. Prompt Engineering

### System Messages
```python
# app/core/prompts.py
SYSTEM_PROMPT = """You are CodeFace, an AI programming assistant. You help with:
- Writing and explaining code
- Debugging and fixing issues
- Best practices and optimizations
- Language-specific guidance

Format code blocks with proper syntax highlighting using:
```language
code here
```

Keep responses focused and concise."""

def create_chat_prompt(messages: list[dict]) -> str:
    prompt = SYSTEM_PROMPT + "\n\n"
    for msg in messages:
        role = "Assistant" if msg["role"] == "assistant" else "User"
        prompt += f"{role}: {msg['content']}\n\n"
    return prompt
```

### Code Formatting
```python
# app/services/code_formatter.py
import re
from typing import Tuple, Optional

class CodeFormatter:
    @staticmethod
    def extract_code_blocks(text: str) -> list[Tuple[str, str]]:
        pattern = r"```(\w+)?\n(.*?)\n```"
        matches = re.finditer(pattern, text, re.DOTALL)
        return [(m.group(1) or "", m.group(2)) for m in matches]
    
    @staticmethod
    def format_code(code: str, language: str) -> str:
        # Implementation of code formatting
        pass
```

## 5. Performance Optimization

### Batch Processing
```python
# app/services/batch_processor.py
from typing import List, Dict
import torch

class BatchProcessor:
    def __init__(self, model_loader: ModelLoader):
        self.model_loader = model_loader
    
    async def process_batch(
        self,
        prompts: List[str],
        max_length: int
    ) -> List[str]:
        model, tokenizer = await self.model_loader.load()
        
        # Tokenize all prompts
        encodings = tokenizer(
            prompts,
            padding=True,
            truncation=True,
            max_length=max_length,
            return_tensors="pt"
        ).to(model.device)
        
        # Generate responses in batch
        outputs = model.generate(
            encodings["input_ids"],
            max_new_tokens=self.model_loader.config.MAX_NEW_TOKENS,
            pad_token_id=tokenizer.pad_token_id,
            attention_mask=encodings["attention_mask"],
            do_sample=True
        )
        
        return tokenizer.batch_decode(outputs, skip_special_tokens=True)
```

### Caching System
```python
# app/services/response_cache.py
from typing import Optional
import hashlib
import json

class ResponseCache:
    def __init__(self, redis_client):
        self.redis = redis_client
        self.ttl = 3600  # 1 hour
    
    def _generate_key(self, prompt: str, params: dict) -> str:
        data = json.dumps({"prompt": prompt, "params": params}, sort_keys=True)
        return f"response:{hashlib.sha256(data.encode()).hexdigest()}"
    
    async def get(self, prompt: str, params: dict) -> Optional[str]:
        key = self._generate_key(prompt, params)
        return await self.redis.get(key)
    
    async def set(self, prompt: str, params: dict, response: str):
        key = self._generate_key(prompt, params)
        await self.redis.setex(key, self.ttl, response)
```

## 6. Monitoring and Analytics

### Model Performance Metrics
```python
# app/services/model_metrics.py
from prometheus_client import Histogram, Counter
import time

class ModelMetrics:
    def __init__(self):
        self.generation_time = Histogram(
            'model_generation_seconds',
            'Time spent generating responses'
        )
        self.token_count = Counter(
            'generated_tokens_total',
            'Total number of tokens generated'
        )
        self.error_count = Counter(
            'model_errors_total',
            'Total number of model errors',
            ['error_type']
        )
    
    def track_generation(self, tokens: int, duration: float):
        self.generation_time.observe(duration)
        self.token_count.inc(tokens)
    
    def track_error(self, error_type: str):
        self.error_count.labels(error_type=error_type).inc()
```

### Usage Analytics
```python
# app/services/analytics.py
from typing import Dict, Any
import json

class ModelAnalytics:
    def __init__(self, logger):
        self.logger = logger
    
    def log_request(
        self,
        prompt: str,
        response: str,
        metadata: Dict[str, Any]
    ):
        self.logger.info(
            "model_request",
            extra={
                "prompt_length": len(prompt),
                "response_length": len(response),
                "generation_time": metadata.get("generation_time"),
                "model_name": metadata.get("model_name"),
                "temperature": metadata.get("temperature"),
            }
        )
```

