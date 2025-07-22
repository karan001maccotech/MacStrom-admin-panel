"use client"

// app/admin/notifications/page.tsx
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DataTable } from '@/components/ui/data-table';
import { columns } from './columns';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Send, Clock, Edit, Trash2, RefreshCw } from 'lucide-react';
import { format } from 'date-fns';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';

export default function NotificationCenter() {
  const [date, setDate] = useState();
  const [time, setTime] = useState('12:00');
  const [notification, setNotification] = useState({
    title: '',
    body: '',
    deeplink: '',
    audience: 'all',
    scheduled: false,
  });

  // Sample notification history data
  const notifications = [
    {
      id: '1',
      title: 'Tournament Reminder',
      status: 'delivered',
      audience: 'registered_users',
      sends: 12453,
      opens: 4231,
      clickRate: '34%',
      createdAt: '2023-07-25T14:30:00Z',
    },
    {
      id: '2',
      title: 'Match Results Published',
      status: 'failed',
      audience: 'match_123_participants',
      sends: 56,
      opens: 0,
      clickRate: '0%',
      createdAt: '2023-07-24T10:15:00Z',
    },
  ];

  const handleSend = () => {
    // API call to send notification
    console.log('Sending notification:', notification);
  };

  const handleSchedule = () => {
    // API call to schedule notification
    console.log('Scheduling notification:', { ...notification, date, time });
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Notification Center</h1>
      </div>

      <Tabs defaultValue="compose" className="w-full">
        <TabsList className="grid w-full grid-cols-2 max-w-xs">
          <TabsTrigger value="compose">Compose</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="compose">
          <Card>
            <CardHeader>
              <CardTitle>Create New Notification</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Notification Title</Label>
                    <Input
                      id="title"
                      placeholder="Enter notification title"
                      value={notification.title}
                      onChange={(e) => setNotification({ ...notification, title: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="body">Notification Body</Label>
                    <Textarea
                      id="body"
                      placeholder="Write your notification content here..."
                      className="min-h-[200px]"
                      value={notification.body}
                      onChange={(e) => setNotification({ ...notification, body: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="deeplink">Deeplink (optional)</Label>
                    <Input
                      id="deeplink"
                      placeholder="app://match/123"
                      value={notification.deeplink}
                      onChange={(e) => setNotification({ ...notification, deeplink: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label>Audience</Label>
                    <Select
                      value={notification.audience}
                      onValueChange={(value) => setNotification({ ...notification, audience: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Users</SelectItem>
                        <SelectItem value="registered_users">Registered Users</SelectItem>
                        <SelectItem value="premium_users">Premium Users</SelectItem>
                        <SelectItem value="state_players">State Players</SelectItem>
                        <SelectItem value="national_players">National Players</SelectItem>
                        <SelectItem value="custom">Custom Segment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Custom Filters</Label>
                    <div className="p-4 border rounded-md">
                      <p className="text-sm text-muted-foreground">
                        Add filters like state, game type, etc.
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label>Delivery Options</Label>
                    <div className="flex items-center gap-4">
                      <Button
                        variant={notification.scheduled ? 'default' : 'outline'}
                        onClick={() => setNotification({ ...notification, scheduled: !notification.scheduled })}
                      >
                        {notification.scheduled ? 'Scheduled' : 'Send Now'}
                      </Button>

                      {notification.scheduled && (
                        <>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className="justify-start text-left font-normal"
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? format(date, 'PPP') : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={setDate}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>

                          <Input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="max-w-[120px]"
                          />
                        </>
                      )}
                    </div>
                  </div>

                  <Separator />

                  <div className="flex justify-end gap-2">
                    {notification.scheduled ? (
                      <Button onClick={handleSchedule}>
                        <Clock className="mr-2 h-4 w-4" />
                        Schedule
                      </Button>
                    ) : (
                      <Button onClick={handleSend}>
                        <Send className="mr-2 h-4 w-4" />
                        Send Now
                      </Button>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground">
                    Rate limit: 100,000 notifications per minute
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Notification History</CardTitle>
            </CardHeader>
            <CardContent>
              <DataTable
                columns={columns}
                data={notifications}
                toolbar={
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      <RefreshCw className="mr-2 h-4 w-4" />
                      Refresh
                    </Button>
                    <Button variant="outline" size="sm">
                      Export CSV
                    </Button>
                    <Button variant="destructive" size="sm">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete Selected
                    </Button>
                  </div>
                }
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
