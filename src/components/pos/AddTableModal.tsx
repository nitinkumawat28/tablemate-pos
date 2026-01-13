import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

interface AddTableModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (tableName: string, sectionId: string) => void;
    sections: { id: string; name: string }[];
}

export function AddTableModal({ open, onOpenChange, onSubmit, sections }: AddTableModalProps) {
    const [tableName, setTableName] = useState('');
    const [selectedSection, setSelectedSection] = useState(sections[0]?.id || '');

    const handleSubmit = () => {
        if (!tableName || !selectedSection) return;
        onSubmit(tableName, selectedSection);
        setTableName('');
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add New Table</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Table Name</Label>
                        <Input
                            id="name"
                            value={tableName}
                            onChange={(e) => setTableName(e.target.value)}
                            placeholder="e.g. T-12"
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="section">Section</Label>
                        <Select value={selectedSection} onValueChange={setSelectedSection}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select section" />
                            </SelectTrigger>
                            <SelectContent>
                                {sections.map((section) => (
                                    <SelectItem key={section.id} value={section.id}>
                                        {section.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} disabled={!tableName}>Add Table</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
