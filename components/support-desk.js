// app/admin/support/page.jsx
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { MessageCircle, Mail, Archive, AlertTriangle, Clock, Search, Paperclip, RefreshCw } from 'lucide-react';

export default function SupportDesk() {
  const [activeTab, setActiveTab] = useState('open');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [message, setMessage] = useState('');
  const [cannedReplies, setCannedReplies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample ticket data
  const tickets = {
    open: [
      {
        id: 'TKT-1001',
        subject: 'Payment issue',
        user: { name: 'John Doe', email: 'john@example.com' },
        status: 'open',
        priority: 'high',
        createdAt: '2023-07-25T10:30:00Z',
        updatedAt: '2023-07-25T11:45:00Z',
        sla: '2h remaining',
        assignedTo: 'You'
      },
      {
        id: 'TKT-1002',
        subject: 'Account verification',
        user: { name: 'Jane Smith', email: 'jane@example.com' },
        status: 'open',
        priority: 'medium',
        createdAt: '2023-07-24T14:15:00Z',
        updatedAt: '2023-07-25T09:30:00Z',
        sla: '6h remaining',
        assignedTo: 'Team'
      }
    ],
    mine: [
      {
        id: 'TKT-1001',
        subject: 'Payment issue',
        user: { name: 'John Doe', email: 'john@example.com' },
        status: 'open',
        priority: 'high',
        createdAt: '2023-07-25T10:30:00Z',
        updatedAt: '2023-07-25T11:45:00Z',
        sla: '2h remaining',
        assignedTo: 'You'
      }
    ],
    sla: [
      {
        id: 'TKT-1001',
        subject: 'Payment issue',
        user: { name: 'John Doe', email: 'john@example.com' },
        status: 'open',
        priority: 'high',
        createdAt: '2023-07-25T10:30:00Z',
        updatedAt: '2023-07-25T11:45:00Z',
        sla: '2h remaining',
        assignedTo: 'You'
      }
    ]
  };

  // Sample conversation data
  const conversations = {
    'TKT-1001': [
      {
        id: '1',
        sender: 'user',
        text: 'Hello, I have an issue with my payment',
        timestamp: '2023-07-25T10:30:00Z',
        attachments: []
      },
      {
        id: '2',
        sender: 'admin',
        text: 'Can you provide more details about the issue?',
        timestamp: '2023-07-25T10:45:00Z',
        attachments: []
      },
      {
        id: '3',
        sender: 'user',
        text: "I tried to deposit ₹1000 but it's not reflecting in my wallet",
        timestamp: '2023-07-25T11:00:00Z',
        attachments: [
          { name: 'payment_screenshot.png', type: 'image', url: '#' }
        ]
      }
    ]
  };

  // Load canned replies
  useEffect(() => {
    // In a real app, this would fetch from your API
    setCannedReplies([
      { id: '1', title: 'Payment issue', text: 'We are looking into your payment issue and will update you shortly.' },
      { id: '2', title: 'Account verification', text: 'Your account verification is in process and will be completed within 24 hours.' },
      { id: '3', title: 'Technical issue', text: 'Our technical team is working on resolving this issue. We appreciate your patience.' }
    ]);
  }, []);

  const handleSendMessage = () => {
    if (!message.trim()) return;
    // In a real app, this would send to your API
    console.log('Message sent:', message);
    setMessage('');
  };

  const handleCannedReply = (text) => {
    setMessage(text);
  };

  const handleEscalate = (ticketId) => {
    // In a real app, this would call your API
    alert(`Ticket ${ticketId} escalated to Problem Center`);
  };

  const filteredTickets = tickets[activeTab].filter(ticket =>
    ticket.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ticket.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Support Desk</h1>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search tickets..."
              className="pl-10 w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Ticket List */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid grid-cols-3">
                <TabsTrigger value="open">Open</TabsTrigger>
                <TabsTrigger value="mine">Mine</TabsTrigger>
                <TabsTrigger value="sla">SLA</TabsTrigger>
              </TabsList>
            </Tabs>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Ticket</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTickets.map((ticket) => (
                  <TableRow
                    key={ticket.id}
                    className={`cursor-pointer ${selectedTicket?.id === ticket.id ? 'bg-muted' : ''}`}
                    onClick={() => setSelectedTicket(ticket)}
                  >
                    <TableCell>
                      <div className="font-medium">{ticket.id}</div>
                      <div className="text-sm text-muted-foreground">{ticket.subject}</div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{ticket.user.name}</div>
                      <div className="text-sm text-muted-foreground">{ticket.user.email}</div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          ticket.priority === 'high'
                            ? 'destructive'
                            : ticket.priority === 'medium'
                            ? 'warning'
                            : 'default'
                        }
                      >
                        {ticket.priority}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Conversation View */}
        {selectedTicket ? (
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{selectedTicket.subject}</CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Archive className="mr-2 h-4 w-4" />
                    Archive
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleEscalate(selectedTicket.id)}
                  >
                    <AlertTriangle className="mr-2 h-4 w-4" />
                    Escalate
                  </Button>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="mr-1 h-4 w-4" />
                  {selectedTicket.sla}
                </div>
                <div>Assigned to: {selectedTicket.assignedTo}</div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col h-[500px]">
                {/* Messages */}
                <ScrollArea className="flex-1 rounded-md border p-4 mb-4">
                  <div className="space-y-4">
                    {conversations[selectedTicket.id]?.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                      >
                        <div
                          className={`max-w-[80%] rounded-lg px-4 py-2 ${message.sender === 'user' ? 'bg-muted' : 'bg-primary text-primary-foreground'}`}
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src="" />
                              <AvatarFallback>
                                {message.sender === 'user'
                                  ? selectedTicket.user.name.charAt(0)
                                  : 'A'}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-sm font-medium">
                              {message.sender === 'user'
                                ? selectedTicket.user.name
                                : 'Admin'}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {new Date(message.timestamp).toLocaleTimeString()}
                            </span>
                          </div>
                          <p>{message.text}</p>
                          {message.attachments.length > 0 && (
                            <div className="mt-2 space-y-1">
                              {message.attachments.map((file, index) => (
                                <div
                                  key={index}
                                  className="flex items-center gap-2 text-sm text-blue-600 hover:underline"
                                >
                                  <Paperclip className="h-3 w-3" />
                                  <a href={file.url} target="_blank" rel="noopener noreferrer">
                                    {file.name}
                                  </a>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>

                {/* Message input */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Mail className="mr-2 h-4 w-4" />
                          Canned Replies
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[300px] p-2">
                        <div className="space-y-2">
                          {cannedReplies.map((reply) => (
                            <Button
                              key={reply.id}
                              variant="ghost"
                              className="w-full justify-start text-left h-auto py-2"
                              onClick={() => handleCannedReply(reply.text)}
                            >
                              <div>
                                <div className="font-medium">{reply.title}</div>
                                <div className="text-xs text-muted-foreground line-clamp-1">
                                  {reply.text}
                                </div>
                              </div>
                            </Button>
                          ))}
                        </div>
                      </PopoverContent>
                    </Popover>
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-4 w-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Textarea
                      placeholder="Type your message..."
                      className="flex-1"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                    <Button onClick={handleSendMessage}>
                      <MessageCircle className="mr-2 h-4 w-4" />
                      Send
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="lg:col-span-2 flex items-center justify-center">
            <CardContent className="text-center py-12">
              <MessageCircle className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-4 text-lg font-medium">No ticket selected</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Select a ticket from the list to view the conversation
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}