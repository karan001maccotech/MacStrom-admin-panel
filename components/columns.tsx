// app/admin/notifications/columns.tsx
import { ColumnDef } from '@tanstack/react-table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Edit, Trash2 } from 'lucide-react';

export type Notification = {
  id: string;
  title: string;
  status: 'delivered' | 'failed' | 'pending';
  audience: string;
  sends: number;
  opens: number;
  clickRate: string;
  createdAt: string;
};

export const columns: ColumnDef<Notification>[] = [
  {
    accessorKey: 'title',
    header: 'Title',
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
      const status = row.getValue('status');
      return (
        <Badge
          variant={status === 'delivered' ? 'default' : 'destructive'}
        >
          {String(status)}
        </Badge>
      );
    },
  },
  {
    accessorKey: 'audience',
    header: 'Audience',
  },
  {
    accessorKey: 'sends',
    header: 'Sends',
  },
  {
    accessorKey: 'opens',
    header: 'Opens',
  },
  {
    accessorKey: 'clickRate',
    header: 'CTR',
  },
  {
    accessorKey: 'createdAt',
    header: 'Sent At',
    cell: ({ row }) => {
      const date = new Date(row.getValue('createdAt'));
      return date.toLocaleString();
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      const notification = row.original;

      return (
        <div className="flex space-x-2">
          <Button variant="ghost" size="icon">
            <Edit className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      );
    },
  },
];