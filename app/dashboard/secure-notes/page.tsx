'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Lock, Save, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { ShareButton } from '@/components/share-button';
import { ResultShare } from '@/components/result-share';

interface Note {
  id: string;
  title: string;
  content: string;
  encrypted: boolean;
}

export default function SecureNotes() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [password, setPassword] = useState('');
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem('secureNotes');
    if (saved) setNotes(JSON.parse(saved));
  }, []);

  const saveNote = () => {
    if (!title || !content) {
      toast.error('Please enter title and content');
      return;
    }

    const note: Note = {
      id: Date.now().toString(),
      title,
      content: password ? btoa(content) : content,
      encrypted: !!password
    };

    const newNotes = [...notes, note];
    setNotes(newNotes);
    localStorage.setItem('secureNotes', JSON.stringify(newNotes));
    
    setTitle('');
    setContent('');
    setPassword('');
    toast.success('Note saved!');
  };

  const deleteNote = (id: string) => {
    const newNotes = notes.filter(note => note.id !== id);
    setNotes(newNotes);
    localStorage.setItem('secureNotes', JSON.stringify(newNotes));
    setSelectedNote(null);
    toast.success('Note deleted!');
  };

  const viewNote = (note: Note) => {
    if (note.encrypted) {
      const pwd = prompt('Enter password to view note:');
      if (pwd) {
        try {
          const decrypted = atob(note.content);
          setSelectedNote({ ...note, content: decrypted });
        } catch {
          toast.error('Invalid password or corrupted note');
        }
      }
    } else {
      setSelectedNote(note);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">Secure Notes</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Create Note</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Input
              placeholder="Note title..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            
            <Textarea
              placeholder="Note content..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={8}
            />
            
            <Input
              type="password"
              placeholder="Password (optional for encryption)"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <Button onClick={saveNote} className="w-full">
              <Save className="h-4 w-4 mr-2" />Save Note
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Notes ({notes.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {notes.map(note => (
                <div key={note.id} className="flex items-center justify-between p-3 border rounded">
                  <div className="flex items-center gap-2 flex-1" onClick={() => viewNote(note)} role="button">
                    {note.encrypted && <Lock className="h-4 w-4" />}
                    <span className="font-medium">{note.title}</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteNote(note.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              {notes.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No notes yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {selectedNote && (
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{selectedNote.title}</CardTitle>
              <ResultShare 
                title="Secure Note"
                result={selectedNote}
                resultType="note"
                toolName="secure-notes"
              />
            </div>
          </CardHeader>
          <CardContent>
            <Textarea value={selectedNote.content} readOnly rows={10} />
          </CardContent>
        </Card>
      )}
    </div>
  );
}