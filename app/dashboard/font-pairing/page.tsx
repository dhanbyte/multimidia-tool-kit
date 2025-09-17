'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { RefreshCw, Type } from 'lucide-react';

export default function FontPairing() {
  const [currentPair, setCurrentPair] = useState(0);

  const fontPairs = [
    { heading: 'Playfair Display', body: 'Source Sans Pro' },
    { heading: 'Montserrat', body: 'Open Sans' },
    { heading: 'Oswald', body: 'Lato' },
    { heading: 'Roboto Slab', body: 'Roboto' },
    { heading: 'Merriweather', body: 'Lato' },
    { heading: 'Poppins', body: 'Inter' }
  ];

  const nextPair = () => {
    setCurrentPair((prev) => (prev + 1) % fontPairs.length);
  };

  const pair = fontPairs[currentPair];

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Font Pairing Tool</h1>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Font Combinations
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm text-muted-foreground">Heading: {pair.heading}</div>
              <div className="text-sm text-muted-foreground">Body: {pair.body}</div>
            </div>
            <Button onClick={nextPair} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Next Pair
            </Button>
          </div>

          <div className="p-6 border rounded-lg">
            <h1 
              className="text-4xl font-bold mb-4"
              style={{ fontFamily: pair.heading }}
            >
              Beautiful Typography
            </h1>
            <h2 
              className="text-2xl font-semibold mb-4"
              style={{ fontFamily: pair.heading }}
            >
              Subheading Example
            </h2>
            <p 
              className="text-base mb-4 leading-relaxed"
              style={{ fontFamily: pair.body }}
            >
              This is an example of body text using the paired font. Good typography 
              creates hierarchy and improves readability. The combination of these 
              fonts creates a harmonious and professional appearance.
            </p>
            <p 
              className="text-sm text-muted-foreground"
              style={{ fontFamily: pair.body }}
            >
              Small text example for captions and footnotes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {fontPairs.map((fp, index) => (
              <Button
                key={index}
                variant={index === currentPair ? 'default' : 'outline'}
                onClick={() => setCurrentPair(index)}
                className="h-auto p-4 flex flex-col items-start"
              >
                <div className="font-semibold">{fp.heading}</div>
                <div className="text-sm text-muted-foreground">+ {fp.body}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}