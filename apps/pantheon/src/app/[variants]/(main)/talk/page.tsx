'use client';

import { Avatar, Button, Card, Input, List, Space } from 'antd';
import { Send, User } from 'lucide-react';
import { useState } from 'react';

const { TextArea } = Input;

interface Message {
  id: string;
  content: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
}

const initialMessages: Message[] = [
  {
    id: '1',
    content: 'Hello! How can I assist you today?',
    sender: 'assistant',
    timestamp: new Date(Date.now() - 60_000),
  },
  {
    id: '2',
    content: 'I need help with my project.',
    sender: 'user',
    timestamp: new Date(Date.now() - 30_000),
  },
  {
    id: '3',
    content: "I'd be happy to help! Could you please provide more details about your project?",
    sender: 'assistant',
    timestamp: new Date(Date.now() - 10_000),
  },
];

export default function TalkPage() {
  // const { t } = useTranslate();
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      const newMessage: Message = {
        id: Date.now().toString(),
        content: inputValue,
        sender: 'user',
        timestamp: new Date(),
      };
      setMessages([...messages, newMessage]);
      setInputValue('');

      // Simulate assistant response
      setTimeout(() => {
        const response: Message = {
          id: (Date.now() + 1).toString(),
          content: 'Thanks for your message! This is a demo response.',
          sender: 'assistant',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, response]);
      }, 1000);
    }
  };

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <h1 style={{ marginBottom: '24px' }}>Talk - AI Chat Assistant</h1>

      <Card
        style={{
          maxWidth: '900px',
          margin: '0 auto',
          height: 'calc(100vh - 150px)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <div style={{ flex: 1, overflowY: 'auto', marginBottom: '16px' }}>
          <List
            dataSource={messages}
            renderItem={(message) => (
              <List.Item
                style={{
                  border: 'none',
                  justifyContent: message.sender === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    flexDirection: message.sender === 'user' ? 'row-reverse' : 'row',
                    alignItems: 'flex-start',
                    gap: '8px',
                  }}
                >
                  <Avatar
                    icon={<User size={16} />}
                    style={{
                      backgroundColor: message.sender === 'user' ? '#1890ff' : '#87d068',
                    }}
                  />
                  <div
                    style={{
                      maxWidth: '500px',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      backgroundColor: message.sender === 'user' ? '#e6f7ff' : '#f0f0f0',
                    }}
                  >
                    <div>{message.content}</div>
                    <div
                      style={{
                        fontSize: '12px',
                        color: '#999',
                        marginTop: '4px',
                      }}
                    >
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </List.Item>
            )}
          />
        </div>

        <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '16px' }}>
          <Space.Compact style={{ width: '100%' }}>
            <TextArea
              autoSize={{ minRows: 1, maxRows: 4 }}
              onChange={(e) => setInputValue(e.target.value)}
              onPressEnter={(e) => {
                if (!e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message here..."
              value={inputValue}
            />
            <Button
              icon={<Send size={16} />}
              onClick={handleSend}
              style={{ height: 'auto' }}
              type="primary"
            >
              Send
            </Button>
          </Space.Compact>
        </div>
      </Card>
    </div>
  );
}
