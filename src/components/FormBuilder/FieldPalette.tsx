import React from "react";
import {
  AlignLeft,
  Calendar,
  Check,
  CircleDot,
  Clock,
  Code,
  File,
  Hash,
  Image,
  Link,
  List,
  Mail,
  Palette,
  Phone,
  Search,
  SlidersHorizontal,
  Sparkles,
  Star,
  Tags,
  ToggleLeft,
  Type,
  Upload,
  X as ClearIcon,
} from "lucide-react";

import FieldPaletteItem, {
  type FieldTypeConfig,
  CATEGORY_STYLES,
} from "./FieldPaletteItem";

interface FieldPaletteProps {
  onAddField: (type: string) => void;
  fieldCount?: number;
}

const FIELD_TYPES: FieldTypeConfig[] = [
  // Basic
  {
    type: "text",
    label: "Short Text",
    description: "Single line text input",
    icon: Type,
    category: "Basic",
  },
  {
    type: "textarea",
    label: "Long Text",
    description: "Multi-line text area",
    icon: AlignLeft,
    category: "Basic",
  },
  {
    type: "email",
    label: "Email Address",
    description: "Validated email input",
    icon: Mail,
    category: "Basic",
  },
  {
    type: "password",
    label: "Password",
    description: "Masked password field",
    icon: Code,
    category: "Basic",
  },
  {
    type: "number",
    label: "Number",
    description: "Numeric integer or decimal",
    icon: Hash,
    category: "Basic",
  },
  {
    type: "phone",
    label: "Phone Number",
    description: "Telephone number",
    icon: Phone,
    category: "Basic",
  },
  {
    type: "url",
    label: "Website URL",
    description: "Web address link",
    icon: Link,
    category: "Basic",
  },

  // Choice
  {
    type: "select",
    label: "Dropdown Select",
    description: "Single choice from menu",
    icon: List,
    category: "Choice",
  },
  {
    type: "multiselect",
    label: "Multi Select",
    description: "Multiple selectable tags",
    icon: Check,
    category: "Choice",
  },
  {
    type: "radio",
    label: "Multiple Choice",
    description: "Radio button list",
    icon: CircleDot,
    category: "Choice",
  },
  {
    type: "checkbox",
    label: "Checkboxes",
    description: "Select multiple options",
    icon: Check,
    category: "Choice",
  },
  {
    type: "toggle",
    label: "Toggle Switch",
    description: "Yes / No boolean switch",
    icon: ToggleLeft,
    category: "Choice",
  },
  {
    type: "switch",
    label: "Switch",
    description: "Alternate boolean toggle",
    icon: ToggleLeft,
    category: "Choice",
  },

  // Date & Time
  {
    type: "date",
    label: "Date Picker",
    description: "Standard calendar date",
    icon: Calendar,
    category: "Date & Time",
  },
  {
    type: "time",
    label: "Time Picker",
    description: "Time of day selector",
    icon: Clock,
    category: "Date & Time",
  },
  {
    type: "datetime-local",
    label: "Date & Time",
    description: "Combined date and time",
    icon: Calendar,
    category: "Date & Time",
  },
  {
    type: "month",
    label: "Month Picker",
    description: "Month and year selector",
    icon: Calendar,
    category: "Date & Time",
  },
  {
    type: "week",
    label: "Week Picker",
    description: "Calendar week selector",
    icon: Calendar,
    category: "Date & Time",
  },

  // Advanced
  {
    type: "file",
    label: "File Upload",
    description: "Upload docs and attachments",
    icon: Upload,
    category: "Advanced",
  },
  {
    type: "image",
    label: "Image Upload",
    description: "Image photo upload",
    icon: Image,
    category: "Advanced",
  },
  {
    type: "rating",
    label: "Star Rating",
    description: "Visual 1-5 star rating",
    icon: Star,
    category: "Advanced",
  },
  {
    type: "range",
    label: "Range Slider",
    description: "Custom numeric slider",
    icon: SlidersHorizontal,
    category: "Advanced",
  },
  {
    type: "color",
    label: "Color Picker",
    description: "HEX color selection",
    icon: Palette,
    category: "Advanced",
  },
  {
    type: "tags",
    label: "Tags Field",
    description: "Custom keyword tags",
    icon: Tags,
    category: "Advanced",
  },
];

const CATEGORIES = ["Basic", "Choice", "Date & Time", "Advanced"] as const;

const CATEGORY_COLORS: Record<string, string> = {
  All: "text-primary border-primary bg-primary/10",
  Basic: "text-blue-600 dark:text-blue-400 border-blue-500/30 bg-blue-500/10",
  Choice: "text-purple-600 dark:text-purple-400 border-purple-500/30 bg-purple-500/10",
  "Date & Time": "text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/10",
  Advanced: "text-amber-600 dark:text-amber-400 border-amber-500/30 bg-amber-500/10",
};

const FieldPalette = ({ onAddField, fieldCount }: FieldPaletteProps) => {
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("All");

  const filteredFields = React.useMemo(() => {
    return FIELD_TYPES.filter((f) => {
      const matchesSearch =
        search.trim() === "" ||
        f.label.toLowerCase().includes(search.toLowerCase()) ||
        f.type.toLowerCase().includes(search.toLowerCase()) ||
        (f.description &&
          f.description.toLowerCase().includes(search.toLowerCase()));

      const matchesCat =
        selectedCategory === "All" || f.category === selectedCategory;

      return matchesSearch && matchesCat;
    });
  }, [search, selectedCategory]);

  return (
    <aside className="flex h-full min-h-0 w-80 shrink-0 flex-col border-r bg-background shadow-xs">
      {/* Palette Header */}
      <div className="shrink-0 border-b px-4 py-3.5 space-y-3 bg-card/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h2 className="text-sm font-bold tracking-tight">Form Fields</h2>
              <p className="text-[11px] text-muted-foreground">
                Click any field to add to canvas
              </p>
            </div>
          </div>
          {fieldCount !== undefined && (
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-[11px] font-bold text-primary">
              {fieldCount} {fieldCount === 1 ? "field" : "fields"}
            </span>
          )}
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search fields (e.g. phone, rating)..."
            className="w-full rounded-lg border bg-muted/30 py-1.5 pl-8 pr-7 text-xs placeholder:text-muted-foreground/70 focus:bg-background focus:outline-none focus:ring-1 focus:ring-primary transition-all"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <ClearIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills (horizontally scrollable, distinct colors) */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs no-scrollbar">
          {["All", ...CATEGORIES].map((cat) => {
            const count =
              cat === "All"
                ? FIELD_TYPES.length
                : FIELD_TYPES.filter((f) => f.category === cat).length;
            const isSelected = selectedCategory === cat;

            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`shrink-0 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-semibold border transition-all duration-150 ${
                  isSelected
                    ? CATEGORY_COLORS[cat] || "bg-primary text-white border-primary"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted hover:text-foreground border-transparent"
                }`}
              >
                <span>{cat}</span>
                <span
                  className={`rounded-full px-1 py-0.2 text-[9px] ${
                    isSelected ? "bg-black/10 dark:bg-white/20" : "bg-muted-foreground/15"
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Fields List - FULLY SCROLLABLE with visible smooth scrollbar */}
      <div className="flex-1 min-h-0 overflow-y-auto p-3 space-y-4">
        {filteredFields.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <p className="text-xs font-semibold text-muted-foreground">
              No fields found
            </p>
            <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
              No field matches "{search}". Try searching for something else or reset the filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
              className="mt-2 text-xs text-primary font-semibold hover:underline"
            >
              Show all fields
            </button>
          </div>
        ) : selectedCategory === "All" && !search ? (
          /* Render by Category with headers */
          CATEGORIES.map((category) => {
            const categoryFields = FIELD_TYPES.filter(
              (f) => f.category === category
            );
            if (categoryFields.length === 0) return null;

            const categoryStyle = CATEGORY_STYLES[category] || CATEGORY_STYLES.Basic;

            return (
              <div key={category} className="space-y-2">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                    {category}
                  </h3>
                  <span
                    className={`rounded-full px-1.5 py-0.5 text-[10px] font-semibold border ${categoryStyle.badge}`}
                  >
                    {categoryFields.length}
                  </span>
                </div>

                <div className="space-y-1.5">
                  {categoryFields.map((field) => (
                    <FieldPaletteItem
                      key={field.type}
                      field={field}
                      onAdd={onAddField}
                    />
                  ))}
                </div>
              </div>
            );
          })
        ) : (
          /* Flat list for filtered or single category */
          <div className="space-y-1.5">
            {filteredFields.map((field) => (
              <FieldPaletteItem
                key={field.type}
                field={field}
                onAdd={onAddField}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default FieldPalette;

export { FIELD_TYPES, CATEGORIES };