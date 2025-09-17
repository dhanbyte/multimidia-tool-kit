'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Database } from 'lucide-react';
import { toast } from 'sonner';

export default function SQLFormatter() {
  const [sql, setSql] = useState('');
  const [formatted, setFormatted] = useState('');

  const formatSQL = () => {
    if (!sql.trim()) {
      toast.error('Please enter SQL to format');
      return;
    }

    let result = sql
      .replace(/\s+/g, ' ')
      .replace(/SELECT/gi, '\nSELECT')
      .replace(/FROM/gi, '\nFROM')
      .replace(/WHERE/gi, '\nWHERE')
      .replace(/AND/gi, '\n  AND')
      .replace(/OR/gi, '\n  OR')
      .replace(/ORDER BY/gi, '\nORDER BY')
      .replace(/GROUP BY/gi, '\nGROUP BY')
      .replace(/HAVING/gi, '\nHAVING')
      .replace(/INSERT INTO/gi, '\nINSERT INTO')
      .replace(/VALUES/gi, '\nVALUES')
      .replace(/UPDATE/gi, '\nUPDATE')
      .replace(/SET/gi, '\nSET')
      .replace(/DELETE FROM/gi, '\nDELETE FROM')
      .replace(/JOIN/gi, '\nJOIN')
      .replace(/LEFT JOIN/gi, '\nLEFT JOIN')
      .replace(/RIGHT JOIN/gi, '\nRIGHT JOIN')
      .replace(/INNER JOIN/gi, '\nINNER JOIN')
      .replace(/ON/gi, '\n  ON')
      .trim();

    setFormatted(result);
    toast.success('SQL formatted!');
  };

  const minifySQL = () => {
    if (!sql.trim()) {
      toast.error('Please enter SQL to minify');
      return;
    }

    const result = sql.replace(/\s+/g, ' ').trim();
    setFormatted(result);
    toast.success('SQL minified!');
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-8">SQL Formatter</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Format SQL Queries
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Input SQL</label>
              <Textarea
                placeholder="Paste your SQL query here..."
                value={sql}
                onChange={(e) => setSql(e.target.value)}
                rows={15}
                className="font-mono text-sm"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Formatted SQL</label>
              <Textarea
                value={formatted}
                readOnly
                rows={15}
                className="font-mono text-sm"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={formatSQL} className="flex-1">
              Format SQL
            </Button>
            <Button onClick={minifySQL} variant="outline" className="flex-1">
              Minify SQL
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}