import { Input } from "@/components/ui/input";
import { CONFIG_CATEGORIES } from "../constants";

interface ConfigSidebarProps {
    searchQuery: string;
    onSearchChange: (q: string) => void;
    activeCategory: string;
    onCategoryChange: (cat: string) => void;
    viewMode: string;
    onViewModeChange: (mode: string) => void;
}

export function ConfigSidebar({
    searchQuery, onSearchChange, activeCategory, onCategoryChange, viewMode, onViewModeChange
}: ConfigSidebarProps) {
    return (
        <div>
            {/* Search */}
            <div className="p-3 border-b">
                <Input
                    placeholder="Search settings..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="bg-muted/50"
                />
            </div>

            {/* Tag Filters */}
            <div className="p-3 border-b">
                <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Tag Filters:</p>
                <select className="h-8 w-full rounded border bg-muted/50 px-2 text-xs">
                    <option>Add tags</option>
                </select>
            </div>

            {/* Category List */}
            <div className="divide-y">
                {CONFIG_CATEGORIES.map(cat => {
                    const Icon = cat.icon;
                    return (
                        <button
                            key={cat.id}
                            type="button"
                            onClick={() => onCategoryChange(cat.id)}
                            className={`flex w-full items-center gap-3 px-3 py-2.5 text-left text-sm transition-colors hover:bg-muted/50 ${activeCategory === cat.id ? "bg-muted border-l-2 border-l-primary text-primary font-medium" : ""
                                }`}
                        >
                            <Icon className="h-4 w-4" />
                            {cat.label}
                        </button>
                    );
                })}
            </div>

            {/* Form/Raw toggle */}
            <div className="p-3 border-t">
                <div className="flex rounded-lg overflow-hidden">
                    <button
                        type="button"
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${viewMode === "form" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                        onClick={() => onViewModeChange("form")}
                    >
                        Form
                    </button>
                    <button
                        type="button"
                        className={`flex-1 py-2 text-sm font-medium transition-colors ${viewMode === "raw" ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                        onClick={() => onViewModeChange("raw")}
                    >
                        Raw
                    </button>
                </div>
            </div>
        </div>
    );
}
