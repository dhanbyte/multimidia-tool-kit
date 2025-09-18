'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Trash2, Plus, Download, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
  completedAt?: string;
}

const STORAGE_KEY = 'todo-list-data';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('all');

  // Load todos from localStorage
  useEffect(() => {
    const savedTodos = localStorage.getItem(STORAGE_KEY);
    if (savedTodos) {
      try {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos);
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (todos.length >= 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos]);

  const addTodo = () => {
    if (!newTodo.trim()) {
      toast.error('Please enter a task');
      return;
    }
    
    const todo: Todo = {
      id: Date.now(),
      text: newTodo.trim(),
      completed: false,
      createdAt: new Date().toISOString()
    };
    
    const updatedTodos = [...todos, todo];
    setTodos(updatedTodos);
    setNewTodo('');
    toast.success('Task added!');
  };

  const toggleTodo = (id: number) => {
    const updatedTodos = todos.map(todo => {
      if (todo.id === id) {
        const updated = { 
          ...todo, 
          completed: !todo.completed,
          completedAt: !todo.completed ? new Date().toISOString() : undefined
        };
        return updated;
      }
      return todo;
    });
    setTodos(updatedTodos);
    
    const todo = todos.find(t => t.id === id);
    if (todo) {
      toast.success(todo.completed ? 'Task marked as incomplete' : 'Task completed!');
    }
  };

  const deleteTodo = (id: number) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
    toast.success('Task deleted!');
  };

  const clearCompleted = () => {
    const updatedTodos = todos.filter(todo => !todo.completed);
    setTodos(updatedTodos);
    toast.success('Completed tasks cleared!');
  };

  const exportTodos = () => {
    const data = {
      exportDate: new Date().toISOString(),
      totalTasks: todos.length,
      completedTasks: todos.filter(t => t.completed).length,
      todos: todos
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `todos-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Todos exported!');
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  const filteredTodos = getFilteredTodos();

  const completedCount = todos.filter(todo => todo.completed).length;
  const activeCount = todos.length - completedCount;

  return (
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Personal Todo List</h1>
        <p className="text-muted-foreground">
          Organize your tasks, track progress, and stay productive with persistent local storage
        </p>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                My Tasks
              </CardTitle>
              <CardDescription>
                {completedCount}/{todos.length} completed • {activeCount} remaining
              </CardDescription>
            </div>
            <div className="flex gap-2">
              {todos.length > 0 && (
                <>
                  <Button variant="outline" size="sm" onClick={exportTodos}>
                    <Download className="h-4 w-4 mr-2" />
                    Export
                  </Button>
                  {completedCount > 0 && (
                    <Button variant="outline" size="sm" onClick={clearCompleted}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      Clear Completed
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Add Todo */}
          <div className="flex gap-2">
            <Input
              placeholder="What needs to be done?"
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && addTodo()}
              className="flex-1"
            />
            <Button onClick={addTodo} size="lg">
              <Plus className="h-4 w-4 mr-2" />
              Add Task
            </Button>
          </div>

          {/* Filter Tabs */}
          {todos.length > 0 && (
            <div className="flex gap-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('all')}
              >
                All ({todos.length})
              </Button>
              <Button 
                variant={filter === 'active' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('active')}
              >
                Active ({activeCount})
              </Button>
              <Button 
                variant={filter === 'completed' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('completed')}
              >
                Completed ({completedCount})
              </Button>
            </div>
          )}

          {/* Todo List */}
          <div className="space-y-2">
            {filteredTodos.map(todo => (
              <div key={todo.id} className={`flex items-center gap-3 p-4 border rounded-lg transition-all hover:bg-muted/50 ${
                todo.completed ? 'bg-muted/30' : ''
              }`}>
                <Checkbox
                  checked={todo.completed}
                  onCheckedChange={() => toggleTodo(todo.id)}
                  className="mt-1"
                />
                <div className="flex-1">
                  <span className={`block ${todo.completed ? 'line-through text-muted-foreground' : 'font-medium'}`}>
                    {todo.text}
                  </span>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs">
                      {new Date(todo.createdAt).toLocaleDateString()}
                    </Badge>
                    {todo.completed && todo.completedAt && (
                      <Badge variant="secondary" className="text-xs">
                        Completed {new Date(todo.completedAt).toLocaleDateString()}
                      </Badge>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => deleteTodo(todo.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            
            {filteredTodos.length === 0 && todos.length > 0 && (
              <div className="text-center text-muted-foreground py-8">
                <CheckCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg mb-2">No {filter} tasks</p>
                <p className="text-sm">Try switching to a different filter</p>
              </div>
            )}
            
            {todos.length === 0 && (
              <div className="text-center text-muted-foreground py-12">
                <CheckCircle className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-xl mb-2">No tasks yet</p>
                <p className="text-sm">Add your first task above to get started!</p>
              </div>
            )}
          </div>

          {/* Progress Bar */}
          {todos.length > 0 && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Progress</span>
                <span>{completedCount}/{todos.length} ({Math.round((completedCount / todos.length) * 100)}%)</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${(completedCount / todos.length) * 100}%` }}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Usage Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use Todo List</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-2">✅ Getting Started</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li>Type your task in the input field</li>
                <li>Press Enter or click "Add Task" to save</li>
                <li>Click the checkbox to mark tasks as complete</li>
                <li>Use the delete button to remove tasks</li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">🔧 Features</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Local Storage:</strong> Tasks saved automatically in browser</li>
                <li><strong>Smart Filtering:</strong> View all, active, or completed tasks</li>
                <li><strong>Progress Tracking:</strong> Visual progress bar and statistics</li>
                <li><strong>Export Data:</strong> Download tasks as JSON backup</li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="font-semibold mb-2">💡 Pro Tips</h3>
            <ul className="list-disc list-inside space-y-1 text-sm">
              <li><strong>Keyboard Shortcut:</strong> Press Enter to quickly add tasks</li>
              <li><strong>Stay Organized:</strong> Use clear, specific task descriptions</li>
              <li><strong>Regular Cleanup:</strong> Clear completed tasks periodically</li>
              <li><strong>Data Backup:</strong> Export your tasks regularly for backup</li>
              <li><strong>Mobile Friendly:</strong> Access your todos on any device</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}