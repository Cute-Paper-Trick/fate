'use client';

import { useClerk } from '@clerk/nextjs';
import { Button, Card, Checkbox, Input, List, Modal, Progress, Space, Tag } from 'antd';
import { Clock, Edit, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'high' | 'medium' | 'low';
  dueDate?: string;
}

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Complete project documentation',
    description: 'Write comprehensive documentation for the new API endpoints',
    completed: false,
    priority: 'high',
    dueDate: '2025-11-05',
  },
  {
    id: '2',
    title: 'Code review for PR #123',
    description: 'Review and provide feedback on the authentication module PR',
    completed: false,
    priority: 'high',
    dueDate: '2025-11-02',
  },
  {
    id: '3',
    title: 'Update dependencies',
    description: 'Update all npm packages to their latest stable versions',
    completed: true,
    priority: 'medium',
    dueDate: '2025-10-30',
  },
  {
    id: '4',
    title: 'Design system updates',
    description: 'Update component library with new design tokens',
    completed: false,
    priority: 'medium',
    dueDate: '2025-11-10',
  },
  {
    id: '5',
    title: 'Performance optimization',
    description: 'Optimize database queries in the user service',
    completed: true,
    priority: 'low',
    dueDate: '2025-10-28',
  },
];

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': {
      return 'red';
    }
    case 'medium': {
      return 'orange';
    }
    case 'low': {
      return 'green';
    }
    default: {
      return 'default';
    }
  }
};

export default function TaskPage() {
  const { openSignIn } = useClerk();

  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const completedTasks = tasks.filter((task) => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const handleToggleTask = (taskId: string) => {
    setTasks(
      tasks.map((task) => (task.id === taskId ? { ...task, completed: !task.completed } : task)),
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(tasks.filter((task) => task.id !== taskId));
  };

  const handleAddTask = () => {
    if (newTaskTitle.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        title: newTaskTitle,
        description: '',
        completed: false,
        priority: 'medium',
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setIsModalVisible(false);
    }
  };

  const activeTasks = tasks.filter((task) => !task.completed);
  const completedTasksList = tasks.filter((task) => task.completed);

  return (
    <div style={{ padding: '24px', background: '#f0f2f5', minHeight: '100vh' }}>
      <Button onClick={() => openSignIn()}>Sign In</Button>
      <div
        style={{
          marginBottom: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <h1 style={{ margin: 0 }}>Task Management</h1>
        <Button icon={<Plus size={16} />} onClick={() => setIsModalVisible(true)} type="primary">
          Add Task
        </Button>
      </div>

      <Card style={{ marginBottom: '24px' }}>
        <div style={{ marginBottom: '8px' }}>
          <strong>Overall Progress</strong>
        </div>
        <Progress
          percent={progressPercent}
          status={progressPercent === 100 ? 'success' : 'active'}
        />
        <div style={{ marginTop: '8px', color: '#666' }}>
          {completedTasks} of {totalTasks} tasks completed
        </div>
      </Card>

      <Card style={{ marginBottom: '24px' }} title="Active Tasks">
        <List
          dataSource={activeTasks}
          locale={{ emptyText: 'No active tasks' }}
          renderItem={(task) => (
            <List.Item
              actions={[
                <Button icon={<Edit size={16} />} key="edit" type="text" />,
                <Button
                  danger
                  icon={<Trash2 size={16} />}
                  key="delete"
                  onClick={() => handleDeleteTask(task.id)}
                  type="text"
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Checkbox checked={task.completed} onChange={() => handleToggleTask(task.id)} />
                }
                description={
                  <Space direction="vertical" size="small">
                    <div>{task.description}</div>
                    {task.dueDate && (
                      <div
                        style={{
                          color: '#999',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px',
                        }}
                      >
                        <Clock size={14} /> Due: {task.dueDate}
                      </div>
                    )}
                  </Space>
                }
                title={
                  <Space>
                    {task.title}
                    <Tag color={getPriorityColor(task.priority)}>{task.priority.toUpperCase()}</Tag>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Card title="Completed Tasks">
        <List
          dataSource={completedTasksList}
          locale={{ emptyText: 'No completed tasks' }}
          renderItem={(task) => (
            <List.Item
              actions={[
                <Button
                  danger
                  icon={<Trash2 size={16} />}
                  key="delete"
                  onClick={() => handleDeleteTask(task.id)}
                  type="text"
                />,
              ]}
            >
              <List.Item.Meta
                avatar={
                  <Checkbox checked={task.completed} onChange={() => handleToggleTask(task.id)} />
                }
                description={
                  <span style={{ textDecoration: 'line-through', color: '#999' }}>
                    {task.description}
                  </span>
                }
                title={
                  <Space>
                    <span style={{ textDecoration: 'line-through', color: '#999' }}>
                      {task.title}
                    </span>
                    <Tag color={getPriorityColor(task.priority)}>{task.priority.toUpperCase()}</Tag>
                  </Space>
                }
              />
            </List.Item>
          )}
        />
      </Card>

      <Modal
        cancelText="Cancel"
        okText="Add"
        onCancel={() => {
          setIsModalVisible(false);
          setNewTaskTitle('');
        }}
        onOk={handleAddTask}
        open={isModalVisible}
        title="Add New Task"
      >
        <Input
          onChange={(e) => setNewTaskTitle(e.target.value)}
          onPressEnter={handleAddTask}
          placeholder="Enter task title"
          value={newTaskTitle}
        />
      </Modal>
    </div>
  );
}
