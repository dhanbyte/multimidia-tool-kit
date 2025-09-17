'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowUpDown, Calculator } from 'lucide-react';
import { toast } from 'sonner';

export default function UnitConverter() {
  const [inputValue, setInputValue] = useState('');
  const [fromUnit, setFromUnit] = useState('');
  const [toUnit, setToUnit] = useState('');
  const [result, setResult] = useState('');
  const [activeCategory, setActiveCategory] = useState('length');

  const conversions = {
    length: {
      name: 'Length',
      units: {
        mm: { name: 'Millimeter', factor: 1 },
        cm: { name: 'Centimeter', factor: 10 },
        m: { name: 'Meter', factor: 1000 },
        km: { name: 'Kilometer', factor: 1000000 },
        in: { name: 'Inch', factor: 25.4 },
        ft: { name: 'Foot', factor: 304.8 },
        yd: { name: 'Yard', factor: 914.4 },
        mi: { name: 'Mile', factor: 1609344 }
      }
    },
    weight: {
      name: 'Weight',
      units: {
        mg: { name: 'Milligram', factor: 1 },
        g: { name: 'Gram', factor: 1000 },
        kg: { name: 'Kilogram', factor: 1000000 },
        oz: { name: 'Ounce', factor: 28349.5 },
        lb: { name: 'Pound', factor: 453592 },
        ton: { name: 'Ton', factor: 1000000000 }
      }
    },
    temperature: {
      name: 'Temperature',
      units: {
        c: { name: 'Celsius', factor: 1 },
        f: { name: 'Fahrenheit', factor: 1 },
        k: { name: 'Kelvin', factor: 1 }
      }
    },
    area: {
      name: 'Area',
      units: {
        sqmm: { name: 'Square Millimeter', factor: 1 },
        sqcm: { name: 'Square Centimeter', factor: 100 },
        sqm: { name: 'Square Meter', factor: 1000000 },
        sqkm: { name: 'Square Kilometer', factor: 1000000000000 },
        sqin: { name: 'Square Inch', factor: 645.16 },
        sqft: { name: 'Square Foot', factor: 92903 },
        acre: { name: 'Acre', factor: 4046856422.4 }
      }
    },
    volume: {
      name: 'Volume',
      units: {
        ml: { name: 'Milliliter', factor: 1 },
        l: { name: 'Liter', factor: 1000 },
        gal: { name: 'Gallon (US)', factor: 3785.41 },
        qt: { name: 'Quart (US)', factor: 946.353 },
        pt: { name: 'Pint (US)', factor: 473.176 },
        cup: { name: 'Cup (US)', factor: 236.588 },
        floz: { name: 'Fluid Ounce (US)', factor: 29.5735 }
      }
    }
  };

  const convertTemperature = (value: number, from: string, to: string) => {
    let celsius = value;
    
    // Convert to Celsius first
    if (from === 'f') {
      celsius = (value - 32) * 5/9;
    } else if (from === 'k') {
      celsius = value - 273.15;
    }
    
    // Convert from Celsius to target
    if (to === 'f') {
      return celsius * 9/5 + 32;
    } else if (to === 'k') {
      return celsius + 273.15;
    }
    
    return celsius;
  };

  const convertUnits = () => {
    if (!inputValue || !fromUnit || !toUnit) {
      toast.error('Please fill in all fields');
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      toast.error('Please enter a valid number');
      return;
    }

    const category = conversions[activeCategory as keyof typeof conversions];
    
    if (activeCategory === 'temperature') {
      const converted = convertTemperature(value, fromUnit, toUnit);
      setResult(converted.toFixed(6).replace(/\.?0+$/, ''));
    } else {
      const fromFactor = category.units[fromUnit as keyof typeof category.units]?.factor;
      const toFactor = category.units[toUnit as keyof typeof category.units]?.factor;
      
      if (!fromFactor || !toFactor) {
        toast.error('Invalid units selected');
        return;
      }
      
      const baseValue = value * fromFactor;
      const converted = baseValue / toFactor;
      setResult(converted.toFixed(6).replace(/\.?0+$/, ''));
    }
    
    toast.success('Conversion completed!');
  };

  const swapUnits = () => {
    const temp = fromUnit;
    setFromUnit(toUnit);
    setToUnit(temp);
    if (result && inputValue) {
      setInputValue(result);
      setResult(inputValue);
    }
  };

  const clearAll = () => {
    setInputValue('');
    setResult('');
    setFromUnit('');
    setToUnit('');
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Unit Converter</h1>
        <p className="text-muted-foreground">
          Convert between different units of measurement
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Unit Converter
          </CardTitle>
          <CardDescription>
            Select a category and convert between different units
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={activeCategory} onValueChange={setActiveCategory}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="length">Length</TabsTrigger>
              <TabsTrigger value="weight">Weight</TabsTrigger>
              <TabsTrigger value="temperature">Temperature</TabsTrigger>
              <TabsTrigger value="area">Area</TabsTrigger>
              <TabsTrigger value="volume">Volume</TabsTrigger>
            </TabsList>
            
            {Object.entries(conversions).map(([key, category]) => (
              <TabsContent key={key} value={key} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From</label>
                    <div className="space-y-2">
                      <Input
                        type="number"
                        placeholder="Enter value"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                      />
                      <Select value={fromUnit} onValueChange={setFromUnit}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(category.units).map(([unitKey, unit]) => (
                            <SelectItem key={unitKey} value={unitKey}>
                              {unit.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">To</label>
                    <div className="space-y-2">
                      <Input
                        type="text"
                        placeholder="Result"
                        value={result}
                        readOnly
                        className="bg-muted"
                      />
                      <Select value={toUnit} onValueChange={setToUnit}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select unit" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(category.units).map(([unitKey, unit]) => (
                            <SelectItem key={unitKey} value={unitKey}>
                              {unit.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={convertUnits} className="flex-1">
                    Convert
                  </Button>
                  <Button variant="outline" onClick={swapUnits}>
                    <ArrowUpDown className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" onClick={clearAll}>
                    Clear
                  </Button>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}