// app/admin/reports/page.jsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Separator } from '@/components/ui/separator';
import { Checkbox } from '@/components/ui/checkbox';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { CalendarIcon, Download, Mail, RefreshCw, Edit, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

export default function ReportsPage() {
  const [reportType, setReportType] = useState('users');
  const [dateRange, setDateRange] = useState({
    from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
    to: new Date()
  });
  const [emailSchedule, setEmailSchedule] = useState({
    enabled: false,
    frequency: 'daily',
    recipients: '',
  });
  const [isGenerating, setIsGenerating] = useState(false);
  const [outputFormat, setOutputFormat] = useState('csv');

  const reportTemplates = [
    { id: 'users', name: 'Users List', description: 'Detailed list of all registered users' },
    { id: 'revenue', name: 'Revenue Report', description: 'Daily revenue breakdown' },
    { id: 'votes', name: 'Votes Breakdown', description: 'Voting statistics by state and national' },
    { id: 'sla', name: 'SLA Compliance', description: 'System uptime and incident response times' },
    { id: 'bets', name: 'Bet Liability', description: 'Current exposure across all betting markets' },
  ];

  const generateReport = () => {
    setIsGenerating(true);
    // Simulate report generation
    setTimeout(() => {
      setIsGenerating(false);
      alert(`Report generated successfully! Format: ${outputFormat.toUpperCase()}`);
    }, 2000);
  };

  const scheduleEmailReport = () => {
    alert(`Email report scheduled to ${emailSchedule.recipients} (${emailSchedule.frequency})`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Reports</h1>
        <Button variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-6">
              <div className="space-y-2">
                <Label>Report Template</Label>
                <Select value={reportType} onValueChange={setReportType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reportTemplates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-sm text-muted-foreground">
                  {reportTemplates.find(t => t.id === reportType)?.description}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Date Range</Label>
                <div className="grid grid-cols-2 gap-4">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateRange.from ? format(dateRange.from, 'PPP') : <span>Start date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange.from}
                        onSelect={(date) => setDateRange({ ...dateRange, from: date })}
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
                        {dateRange.to ? format(dateRange.to, 'PPP') : <span>End date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={dateRange.to}
                        onSelect={(date) => setDateRange({ ...dateRange, to: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Output Format</Label>
                <div className="flex gap-4">
                  <Button
                    variant={outputFormat === 'csv' ? 'default' : 'outline'}
                    onClick={() => setOutputFormat('csv')}
                  >
                    CSV
                  </Button>
                  <Button
                    variant={outputFormat === 'pdf' ? 'default' : 'outline'}
                    onClick={() => setOutputFormat('pdf')}
                  >
                    PDF
                  </Button>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="email-schedule"
                    checked={emailSchedule.enabled}
                    onCheckedChange={(checked) => setEmailSchedule({ ...emailSchedule, enabled: checked })}
                  />
                  <Label htmlFor="email-schedule">Schedule Email Report</Label>
                </div>

                {emailSchedule.enabled && (
                  <div className="space-y-4 pl-8">
                    <div className="space-y-2">
                      <Label>Frequency</Label>
                      <Select
                        value={emailSchedule.frequency}
                        onValueChange={(value) => setEmailSchedule({ ...emailSchedule, frequency: value })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select frequency" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly (Monday)</SelectItem>
                          <SelectItem value="monthly">Monthly (1st)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="recipients">Recipients</Label>
                      <Input
                        id="recipients"
                        placeholder="email1@example.com, email2@example.com"
                        value={emailSchedule.recipients}
                        onChange={(e) => setEmailSchedule({ ...emailSchedule, recipients: e.target.value })}
                      />
                    </div>

                    <Button onClick={scheduleEmailReport}>
                      <Mail className="mr-2 h-4 w-4" />
                      Save Schedule
                    </Button>
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-end gap-2">
                <Button variant="outline">Preview</Button>
                <Button onClick={generateReport} disabled={isGenerating}>
                  {isGenerating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Download className="mr-2 h-4 w-4" />
                      Generate Report
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Scheduled Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Report Type</TableHead>
                  <TableHead>Frequency</TableHead>
                  <TableHead>Recipients</TableHead>
                  <TableHead>Last Sent</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">Revenue Report</TableCell>
                  <TableCell>Daily</TableCell>
                  <TableCell>finance@example.com</TableCell>
                  <TableCell>{format(new Date(), 'MMM d, yyyy')}</TableCell>
                  <TableCell>PDF</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Users List</TableCell>
                  <TableCell>Weekly</TableCell>
                  <TableCell>admin@example.com</TableCell>
                  <TableCell>{format(new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 'MMM d, yyyy')}</TableCell>
                  <TableCell>CSV</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon">
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}