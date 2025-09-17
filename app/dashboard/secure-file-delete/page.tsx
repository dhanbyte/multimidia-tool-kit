'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Trash2, Shield, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

export default function SecureFileDelete() {
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [progress, setProgress] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files);
  };

  const secureDelete = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('Please select files to delete');
      return;
    }

    setIsDeleting(true);
    setProgress(0);

    // Simulate secure deletion process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setProgress(i);
    }

    setIsDeleting(false);
    setProgress(0);
    setSelectedFiles(null);
    toast.success('Files securely deleted!');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Secure File Delete</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            Secure File Deletion
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-600">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm font-medium">Warning</span>
            </div>
            <p className="text-sm text-yellow-600 mt-1">
              This is a demo tool. Files are not actually deleted from your system.
            </p>
          </div>

          <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
            <input
              type="file"
              multiple
              onChange={handleFileSelect}
              className="hidden"
              id="file-input"
            />
            <label htmlFor="file-input" className="cursor-pointer">
              <Trash2 className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                {selectedFiles && selectedFiles.length > 0
                  ? `${selectedFiles.length} file(s) selected`
                  : 'Click to select files for secure deletion'
                }
              </p>
            </label>
          </div>

          {selectedFiles && selectedFiles.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium">Selected Files:</h3>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {Array.from(selectedFiles).map((file, index) => (
                  <div key={index} className="text-sm p-2 bg-muted rounded">
                    {file.name} ({(file.size / 1024).toFixed(1)} KB)
                  </div>
                ))}
              </div>
            </div>
          )}

          {isDeleting && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Securely deleting files...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )}

          <Button 
            onClick={secureDelete} 
            disabled={!selectedFiles || isDeleting}
            className="w-full"
            variant="destructive"
          >
            <Shield className="h-4 w-4 mr-2" />
            {isDeleting ? 'Deleting...' : 'Secure Delete'}
          </Button>

          <div className="text-xs text-muted-foreground">
            Secure deletion overwrites file data multiple times to prevent recovery.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}