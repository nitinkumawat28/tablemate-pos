import { Table as TableType } from '@/types/pos';
import { cn } from '@/lib/utils';
import { Clock, Printer } from 'lucide-react';

interface TableViewProps {
    tables: TableType[];
    onTableClick: (table: TableType) => void;
}

const statusConfig = {
    'blank': { label: 'Blank Table', color: 'bg-gray-100 border-gray-300', textColor: 'text-gray-600' },
    'running': { label: 'Running Table', color: 'bg-green-50 border-green-400', textColor: 'text-green-700' },
    'printed': { label: 'Printed', color: 'bg-blue-50 border-blue-400', textColor: 'text-blue-700' },
    'paid': { label: 'Paid Table', color: 'bg-purple-50 border-purple-400', textColor: 'text-purple-700' },
    'running-kot': { label: 'Running KOT', color: 'bg-yellow-100 border-yellow-500', textColor: 'text-yellow-800' },
};

export const TableView = ({ tables, onTableClick }: TableViewProps) => {
    return (
        <div className="flex flex-wrap gap-3">
            {tables.map((table) => {
                const config = statusConfig[table.status] || statusConfig['blank'];
                return (
                    <button
                        key={table.id}
                        onClick={() => onTableClick(table)}
                        className={cn(
                            'w-20 h-20 rounded-lg border-2 flex flex-col items-center justify-center transition-all hover:scale-105 hover:shadow-md',
                            config.color
                        )}
                    >
                        {table.status !== 'blank' && table.time !== undefined && (
                            <span className="text-[10px] text-muted-foreground">{table.time} Min</span>
                        )}
                        <span className={cn('font-semibold text-sm', config.textColor)}>
                            {table.number}
                        </span>
                        {table.amount !== undefined && table.amount > 0 && (
                            <span className={cn('text-xs font-medium', config.textColor)}>
                                ₹{table.amount.toLocaleString('en-IN')}
                            </span>
                        )}
                        {table.status === 'running-kot' && (
                            <div className="flex gap-1 mt-1">
                                <span className="w-4 h-4 rounded bg-white border flex items-center justify-center">
                                    <Printer className="h-2.5 w-2.5" />
                                </span>
                                <span className="w-4 h-4 rounded bg-white border flex items-center justify-center">
                                    <Clock className="h-2.5 w-2.5" />
                                </span>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};
