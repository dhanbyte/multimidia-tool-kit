'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DollarSign, Trash2, Download, PieChart, TrendingUp, Calendar, Plus } from 'lucide-react';
import { toast } from 'sonner';

interface Expense {
  id: number;
  amount: number;
  category: string;
  description: string;
  date: string;
  timestamp: number;
}

const STORAGE_KEY = 'expense-tracker-data';

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');

  const categories = ['Food', 'Transport', 'Shopping', 'Bills', 'Entertainment', 'Health', 'Education', 'Travel', 'Other'];

  // Load data from localStorage on component mount
  useEffect(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setExpenses(parsedData);
      } catch (error) {
        console.error('Error loading expense data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever expenses change
  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(expenses));
    }
  }, [expenses]);

  const addExpense = () => {
    if (!amount || !category || !description) {
      toast.error('Please fill all fields');
      return;
    }

    const expenseAmount = parseFloat(amount);
    if (isNaN(expenseAmount) || expenseAmount <= 0) {
      toast.error('Please enter a valid amount');
      return;
    }

    const expense: Expense = {
      id: Date.now(),
      amount: expenseAmount,
      category,
      description: description.trim(),
      date: new Date().toLocaleDateString(),
      timestamp: Date.now()
    };
    
    const updatedExpenses = [expense, ...expenses];
    setExpenses(updatedExpenses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedExpenses));
    
    setAmount('');
    setCategory('');
    setDescription('');
    toast.success('Expense added successfully!');
  };

  const deleteExpense = (id: number) => {
    const updatedExpenses = expenses.filter(expense => expense.id !== id);
    setExpenses(updatedExpenses);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedExpenses));
    toast.success('Expense deleted!');
  };

  const clearAllExpenses = () => {
    setExpenses([]);
    localStorage.removeItem(STORAGE_KEY);
    toast.success('All expenses cleared!');
  };

  const getFilteredExpenses = () => {
    let filtered = expenses;
    
    if (filterCategory !== 'all') {
      filtered = filtered.filter(expense => expense.category === filterCategory);
    }
    
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(expense => expense.timestamp >= filterDate.getTime());
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(expense => expense.timestamp >= filterDate.getTime());
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(expense => expense.timestamp >= filterDate.getTime());
          break;
      }
    }
    
    return filtered;
  };

  const filteredExpenses = getFilteredExpenses();
  const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  const getCategoryStats = () => {
    const stats: { [key: string]: { amount: number; count: number } } = {};
    
    filteredExpenses.forEach(expense => {
      if (!stats[expense.category]) {
        stats[expense.category] = { amount: 0, count: 0 };
      }
      stats[expense.category].amount += expense.amount;
      stats[expense.category].count += 1;
    });
    
    return Object.entries(stats)
      .map(([category, data]) => ({ category, ...data }))
      .sort((a, b) => b.amount - a.amount);
  };

  const downloadExpenses = () => {
    const data = {
      exportDate: new Date().toISOString(),
      totalExpenses: expenses.length,
      totalAmount: expenses.reduce((sum, expense) => sum + expense.amount, 0),
      expenses: expenses.map(expense => ({
        date: expense.date,
        category: expense.category,
        description: expense.description,
        amount: expense.amount
      }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `expenses-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success('Expenses exported!');
  };

  const categoryStats = getCategoryStats();

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Personal Expense Tracker</h1>
        <p className="text-muted-foreground">
          Track your daily expenses, analyze spending patterns, and manage your budget effectively
        </p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Add Expense Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Add New Expense
              </CardTitle>
              <CardDescription>
                Record your expenses with detailed categorization
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Amount ($)</label>
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    step="0.01"
                    min="0"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map(cat => (
                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">Description</label>
                  <Input
                    placeholder="What did you buy?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addExpense()}
                  />
                </div>
              </div>
              <Button onClick={addExpense} className="w-full" size="lg">
                <DollarSign className="h-4 w-4 mr-2" />
                Add Expense
              </Button>
            </CardContent>
          </Card>

          {/* Expense List */}
          <Card className="mt-6">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Expense History</CardTitle>
                  <CardDescription>
                    Total: ${totalExpenses.toFixed(2)} ({filteredExpenses.length} expenses)
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  {expenses.length > 0 && (
                    <>
                      <Button variant="outline" size="sm" onClick={downloadExpenses}>
                        <Download className="h-4 w-4 mr-2" />
                        Export
                      </Button>
                      <Button variant="outline" size="sm" onClick={clearAllExpenses}>
                        <Trash2 className="h-4 w-4 mr-2" />
                        Clear All
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex gap-4 mb-4">
                <Select value={filterCategory} onValueChange={setFilterCategory}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(cat => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                
                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Time</SelectItem>
                    <SelectItem value="today">Today</SelectItem>
                    <SelectItem value="week">This Week</SelectItem>
                    <SelectItem value="month">This Month</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredExpenses.map(expense => (
                  <div key={expense.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex-1">
                      <div className="font-medium">{expense.description}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="secondary" className="text-xs">
                          {expense.category}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {expense.date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-lg">${expense.amount.toFixed(2)}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteExpense(expense.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {filteredExpenses.length === 0 && (
                  <div className="text-center text-muted-foreground py-12">
                    <DollarSign className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg mb-2">No expenses found</p>
                    <p className="text-sm">
                      {expenses.length === 0 
                        ? "Start by adding your first expense above" 
                        : "Try adjusting your filters"}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Statistics Panel */}
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Summary
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">
                  ${totalExpenses.toFixed(2)}
                </div>
                <p className="text-sm text-muted-foreground">Total Expenses</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <div className="text-xl font-semibold">{filteredExpenses.length}</div>
                  <p className="text-xs text-muted-foreground">Transactions</p>
                </div>
                <div>
                  <div className="text-xl font-semibold">
                    ${filteredExpenses.length > 0 ? (totalExpenses / filteredExpenses.length).toFixed(2) : '0.00'}
                  </div>
                  <p className="text-xs text-muted-foreground">Average</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Category Breakdown */}
          {categoryStats.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  Category Breakdown
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {categoryStats.map(({ category, amount, count }) => {
                    const percentage = totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0;
                    return (
                      <div key={category} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">{category}</span>
                          <div className="text-right">
                            <div className="text-sm font-semibold">${amount.toFixed(2)}</div>
                            <div className="text-xs text-muted-foreground">{count} items</div>
                          </div>
                        </div>
                        <div className="w-full bg-muted rounded-full h-2">
                          <div 
                            className="bg-primary h-2 rounded-full transition-all duration-300" 
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                        <div className="text-xs text-muted-foreground text-right">
                          {percentage.toFixed(1)}%
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Usage Guide */}
      <Card className="mt-8">
        <CardHeader>
          <CardTitle>How to Use Expense Tracker</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs defaultValue="guide" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="guide">Quick Guide</TabsTrigger>
              <TabsTrigger value="features">Features</TabsTrigger>
              <TabsTrigger value="tips">Tips</TabsTrigger>
            </TabsList>
            
            <TabsContent value="guide" className="space-y-4">
              <h3 className="text-lg font-semibold">Getting Started</h3>
              <ol className="list-decimal list-inside space-y-2 text-sm">
                <li><strong>Add Expenses:</strong> Enter amount, select category, and add description</li>
                <li><strong>Track Spending:</strong> View all expenses in the history section</li>
                <li><strong>Filter Data:</strong> Use category and date filters to analyze specific periods</li>
                <li><strong>View Statistics:</strong> Check category breakdown and spending patterns</li>
                <li><strong>Export Data:</strong> Download your expense data for external analysis</li>
              </ol>
            </TabsContent>
            
            <TabsContent value="features" className="space-y-4">
              <h3 className="text-lg font-semibold">Key Features</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Local Storage:</strong> All data saved securely in your browser</li>
                <li><strong>Category Tracking:</strong> 9 predefined categories for easy organization</li>
                <li><strong>Smart Filtering:</strong> Filter by category and time period</li>
                <li><strong>Visual Analytics:</strong> Category breakdown with percentage charts</li>
                <li><strong>Data Export:</strong> Download expenses as JSON for backup</li>
                <li><strong>Responsive Design:</strong> Works perfectly on mobile and desktop</li>
              </ul>
            </TabsContent>
            
            <TabsContent value="tips" className="space-y-4">
              <h3 className="text-lg font-semibold">Pro Tips</h3>
              <ul className="list-disc list-inside space-y-1 text-sm">
                <li><strong>Be Consistent:</strong> Add expenses immediately after purchases</li>
                <li><strong>Use Descriptive Names:</strong> Clear descriptions help with future analysis</li>
                <li><strong>Regular Reviews:</strong> Check your spending patterns weekly</li>
                <li><strong>Set Categories:</strong> Use appropriate categories for better insights</li>
                <li><strong>Export Regularly:</strong> Backup your data monthly</li>
                <li><strong>Mobile Friendly:</strong> Add expenses on-the-go using your phone</li>
              </ul>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}