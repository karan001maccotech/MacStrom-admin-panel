// app/admin/ads/page.jsx
'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Progress } from '@/components/ui/progress';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { CalendarIcon, Upload, Trash2, RefreshCw, BarChart2, Edit } from 'lucide-react';
import { format } from 'date-fns';

export default function SponsorAds() {
  const [activeTab, setActiveTab] = useState('upload');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [adType, setAdType] = useState('banner');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000));
  const fileInputRef = useRef(null);

  // Sample ad schedule data
  const adSchedule = [
    {
      id: '1',
      name: 'Summer Sale',
      type: 'banner',
      start: '2023-07-25T00:00:00Z',
      end: '2023-08-01T23:59:59Z',
      impressions: 12543,
      clicks: 423,
      ctr: '3.37%',
      status: 'active'
    },
    {
      id: '2',
      name: 'New Tournament',
      type: 'interstitial',
      start: '2023-07-20T00:00:00Z',
      end: '2023-07-27T23:59:59Z',
      impressions: 8765,
      clicks: 210,
      ctr: '2.40%',
      status: 'ended'
    }
  ];

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Simulate upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          return 100;
        }
        return prev + 10;
      });
    }, 300);
  };

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Sponsor Ads</h1>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
          <Button>
            <BarChart2 className="mr-2 h-4 w-4" />
            View Full Stats
          </Button>
        </div>
      </div>

      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="upload">Upload Ads</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="stats">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="upload">
          <Card>
            <CardHeader>
              <CardTitle>Upload New Ad</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="adName">Ad Name</Label>
                    <Input id="adName" placeholder="Enter ad campaign name" />
                  </div>

                  <div className="space-y-2">
                    <Label>Ad Type</Label>
                    <Select value={adType} onValueChange={setAdType}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select ad type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="banner">Banner</SelectItem>
                        <SelectItem value="interstitial">Interstitial</SelectItem>
                        <SelectItem value="preroll">Pre-roll Video</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Campaign Dates</Label>
                    <div className="grid grid-cols-2 gap-4">
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {startDate ? format(startDate, 'PPP') : <span>Start date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={startDate}
                            onSelect={setStartDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="justify-start text-left font-normal"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {endDate ? format(endDate, 'PPP') : <span>End date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={endDate}
                            onSelect={setEndDate}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Upload Media</Label>
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept={adType === 'preroll' ? 'video/*' : 'image/*'}
                    />
                    <div className="flex items-center gap-4">
                      <Button
                        variant="outline"
                        onClick={handleUploadClick}
                        disabled={isUploading}
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        Select File
                      </Button>
                      {isUploading && (
                        <span className="text-sm text-muted-foreground">
                          {uploadProgress}% complete
                        </span>
                      )}
                    </div>
                    {isUploading && (
                      <Progress value={uploadProgress} className="h-2" />
                    )}
                    <p className="text-sm text-muted-foreground">
                      {adType === 'preroll'
                        ? 'MP4, WebM or MOV. Max 30 seconds.'
                        : 'JPG, PNG or GIF. Recommended size: 1200x628px'}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Target URL</Label>
                    <Input placeholder="https://example.com/promo" />
                  </div>

                  <Separator />

                  <div className="flex justify-end">
                    <Button disabled={isUploading}>
                      Save Ad Campaign
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle>Ad Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ad Name</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Start Date</TableHead>
                      <TableHead>End Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adSchedule.map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell className="font-medium">{ad.name}</TableCell>
                        <TableCell>
                          <span className="capitalize">{ad.type}</span>
                        </TableCell>
                        <TableCell>
                          {format(new Date(ad.start), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          {format(new Date(ad.end), 'MMM d, yyyy')}
                        </TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            ad.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {ad.status}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="stats">
          <Card>
            <CardHeader>
              <CardTitle>Ad Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Ad Name</TableHead>
                      <TableHead>Impressions</TableHead>
                      <TableHead>Clicks</TableHead>
                      <TableHead>CTR</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {adSchedule.map((ad) => (
                      <TableRow key={ad.id}>
                        <TableCell className="font-medium">{ad.name}</TableCell>
                        <TableCell>{ad.impressions.toLocaleString()}</TableCell>
                        <TableCell>{ad.clicks.toLocaleString()}</TableCell>
                        <TableCell>{ad.ctr}</TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon">
                            <BarChart2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}