import { useEffect, useRef, useState } from 'react';
import { Background } from '@/components/Background';
import { Header } from '@/components/Header';
import { Welcome } from '@/components/Welcome';
import { ChatMessage } from '@/components/ChatMessage';
import { ChatInput } from '@/components/ChatInput';
import { FeaturesDrawer } from '@/components/FeaturesDrawer';
import { getAction } from '@/config/actions';
import { generateStudyContent } from '@/lib/ai';
import type { ActionId, ChatMessage as ChatMsg } from '@/types';

function uid() {
  return Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function App() {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState('');
  const [activeAction, setActiveAction] = useState<ActionId>('explain');
  const [loading, setLoading] = useState(false);
  const [toolsOpen, setToolsOpen] = useState(false);

  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  }, [messages]);

  async function handleSend() {
    const topic = input.trim();
    if (!topic || loading) return;

    const action = getAction(activeAction);
    const userMsg: ChatMsg = { id: uid(), role: 'user', content: topic };
    const assistantMsg: ChatMsg = {
      id: uid(),
      role: 'assistant',
      content: '',
      actionLabel: action.label,
      loading: true,
    };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput('');
    setLoading(true);

    try {
      const result = await generateStudyContent({
        action: activeAction,
        topic,
      });
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, content: result.text, loading: false }
            : m,
        ),
      );
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Unexpected error.';
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantMsg.id
            ? { ...m, error: message, loading: false }
            : m,
        ),
      );
    } finally {
      setLoading(false);
    }
  }

  function handleNewChat() {
    setMessages([]);
    setInput('');
  }

  function handlePickSuggestion(topic: string, action: ActionId) {
    setActiveAction(action);
    setInput(topic);
  }

  const hasMessages = messages.length > 0;

  return (
    <div className="relative flex h-screen flex-col overflow-hidden">
      <Background />

      <Header
        onNewChat={handleNewChat}
        hasMessages={hasMessages}
        onOpenTools={() => setToolsOpen(true)}
      />

      <main className="relative z-10 flex-1 overflow-y-auto">
        {!hasMessages ? (
          <Welcome
            onPickSuggestion={handlePickSuggestion}
            onOpenPlanner={() => setToolsOpen(true)}
          />
        ) : (
          <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6 sm:px-6">
            {messages.map((m) => (
              <ChatMessage
                key={m.id}
                role={m.role}
                content={m.content}
                loading={m.loading}
                error={m.error}
                actionLabel={m.actionLabel}
              />
            ))}
            <div ref={bottomRef} />
          </div>
        )}
      </main>

      <div className="relative z-10">
        <ChatInput
          value={input}
          onChange={setInput}
          onSubmit={handleSend}
          loading={loading}
          activeAction={activeAction}
          onActionChange={setActiveAction}
          onOpenPlanner={() => setToolsOpen(true)}
        />
      </div>

      <FeaturesDrawer open={toolsOpen} onClose={() => setToolsOpen(false)} />
    </div>
  );
}

export default App;