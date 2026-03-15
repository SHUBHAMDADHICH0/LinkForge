import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tag, Plus, X, Check } from "lucide-react";
import { useState } from "react";

const TAG_COLORS = [
  "bg-primary/15 text-primary border-primary/30",
  "bg-accent/15 text-accent border-accent/30",
  "bg-warning/15 text-warning border-warning/30",
  "bg-destructive/15 text-destructive border-destructive/30",
  "bg-success/15 text-success border-success/30",
];

export function getTagColor(tag: string) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = tag.charCodeAt(i) + ((hash << 5) - hash);
  return TAG_COLORS[Math.abs(hash) % TAG_COLORS.length];
}

interface TagFilterProps {
  allTags: string[];
  activeTags: Set<string>;
  onToggleTag: (tag: string) => void;
}

export function TagFilter({ allTags, activeTags, onToggleTag }: TagFilterProps) {
  if (allTags.length === 0) return null;
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Tag className="h-4 w-4 text-muted-foreground shrink-0" />
      {allTags.map((tag) => (
        <Badge
          key={tag}
          variant="outline"
          className={`cursor-pointer text-xs transition-all ${activeTags.has(tag) ? getTagColor(tag) + " ring-1 ring-ring" : "opacity-60 hover:opacity-100"}`}
          onClick={() => onToggleTag(tag)}
        >
          {tag}
        </Badge>
      ))}
      {activeTags.size > 0 && (
        <Button variant="ghost" size="sm" className="h-5 px-1.5 text-[10px] text-muted-foreground" onClick={() => { for (const t of activeTags) onToggleTag(t); }}>
          Clear
        </Button>
      )}
    </div>
  );
}

interface LinkTagsProps {
  tags: string[];
  onRemove?: (tag: string) => void;
}

export function LinkTags({ tags, onRemove }: LinkTagsProps) {
  if (!tags.length) return null;
  return (
    <div className="flex items-center gap-1 flex-wrap mt-1">
      {tags.map((tag) => (
        <Badge key={tag} variant="outline" className={`text-[10px] px-1.5 py-0 ${getTagColor(tag)}`}>
          {tag}
          {onRemove && (
            <X className="h-2 w-2 ml-0.5 cursor-pointer" onClick={(e) => { e.stopPropagation(); onRemove(tag); }} />
          )}
        </Badge>
      ))}
    </div>
  );
}

interface InlineTagPickerProps {
  allTags: string[];
  assignedTags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  onCreateAndAdd: (name: string) => void;
}

export function InlineTagPicker({ allTags, assignedTags, onAdd, onRemove, onCreateAndAdd }: InlineTagPickerProps) {
  const [newTag, setNewTag] = useState("");
  const [open, setOpen] = useState(false);

  const handleCreate = () => {
    const t = newTag.trim().toLowerCase();
    if (!t) return;
    onCreateAndAdd(t);
    setNewTag("");
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8" title="Manage tags">
          <Tag className="h-3.5 w-3.5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-52 p-2 space-y-2" align="end" onClick={(e) => e.stopPropagation()}>
        <p className="text-xs font-medium text-muted-foreground px-1">Tags</p>
        {allTags.length > 0 && (
          <div className="space-y-0.5 max-h-32 overflow-y-auto">
            {allTags.map((tag) => {
              const assigned = assignedTags.includes(tag);
              return (
                <button
                  key={tag}
                  className="flex items-center gap-2 w-full rounded px-2 py-1 text-xs hover:bg-muted transition-colors text-left"
                  onClick={() => assigned ? onRemove(tag) : onAdd(tag)}
                >
                  <div className={`h-3.5 w-3.5 rounded border flex items-center justify-center ${assigned ? "bg-primary border-primary" : "border-input"}`}>
                    {assigned && <Check className="h-2.5 w-2.5 text-primary-foreground" />}
                  </div>
                  <span>{tag}</span>
                </button>
              );
            })}
          </div>
        )}
        <div className="flex gap-1 pt-1 border-t">
          <Input
            className="h-6 text-xs"
            placeholder="New tag..."
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleCreate()}
          />
          <Button size="sm" className="h-6 px-2" onClick={handleCreate} disabled={!newTag.trim()}>
            <Plus className="h-3 w-3" />
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
