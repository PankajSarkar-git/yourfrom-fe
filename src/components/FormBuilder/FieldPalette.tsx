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
  SlidersHorizontal,
  Star,
  Tags,
  Text,
  ToggleLeft,
  Type,
  Upload,
} from "lucide-react";

import FieldPaletteItem, {
  type FieldTypeConfig,
} from "./FieldPaletteItem";

interface FieldPaletteProps {
  onAddField: (type: string) => void;
}

const FIELD_TYPES: FieldTypeConfig[] = [
  // Basic
  {
    type: "text",
    label: "Short Text",
    description: "Single line text",
    icon: Type,
    category: "Basic",
  },
  {
    type: "textarea",
    label: "Long Text",
    description: "Multi-line text",
    icon: AlignLeft,
    category: "Basic",
  },
  {
    type: "email",
    label: "Email",
    description: "Email address",
    icon: Mail,
    category: "Basic",
  },
  {
    type: "password",
    label: "Password",
    description: "Password input",
    icon: Code,
    category: "Basic",
  },
  {
    type: "number",
    label: "Number",
    description: "Numeric input",
    icon: Hash,
    category: "Basic",
  },
  {
    type: "phone",
    label: "Phone",
    description: "Phone number",
    icon: Phone,
    category: "Basic",
  },
  {
    type: "url",
    label: "URL",
    description: "Website URL",
    icon: Link,
    category: "Basic",
  },

  // Choice
  {
    type: "select",
    label: "Dropdown",
    description: "Select one option",
    icon: List,
    category: "Choice",
  },
  {
    type: "multiselect",
    label: "Multi Select",
    description: "Select multiple options",
    icon: Check,
    category: "Choice",
  },
  {
    type: "radio",
    label: "Radio",
    description: "Select one option",
    icon: CircleDot,
    category: "Choice",
  },
  {
    type: "checkbox",
    label: "Checkbox",
    description: "Select multiple options",
    icon: Check,
    category: "Choice",
  },
  {
    type: "toggle",
    label: "Toggle",
    description: "Boolean toggle",
    icon: ToggleLeft,
    category: "Choice",
  },
  {
    type: "switch",
    label: "Switch",
    description: "Boolean switch",
    icon: ToggleLeft,
    category: "Choice",
  },

  // Date & Time
  {
    type: "date",
    label: "Date",
    description: "Select a date",
    icon: Calendar,
    category: "Date & Time",
  },
  {
    type: "time",
    label: "Time",
    description: "Select a time",
    icon: Clock,
    category: "Date & Time",
  },
  {
    type: "datetime-local",
    label: "Date & Time",
    description: "Select date and time",
    icon: Calendar,
    category: "Date & Time",
  },
  {
    type: "month",
    label: "Month",
    description: "Select a month",
    icon: Calendar,
    category: "Date & Time",
  },
  {
    type: "week",
    label: "Week",
    description: "Select a week",
    icon: Calendar,
    category: "Date & Time",
  },

  // Advanced
  {
    type: "file",
    label: "File Upload",
    description: "Upload files",
    icon: Upload,
    category: "Advanced",
  },
  {
    type: "image",
    label: "Image Upload",
    description: "Upload an image",
    icon: Image,
    category: "Advanced",
  },
  {
    type: "rating",
    label: "Rating",
    description: "Star rating",
    icon: Star,
    category: "Advanced",
  },
  {
    type: "range",
    label: "Range",
    description: "Slider input",
    icon: SlidersHorizontal,
    category: "Advanced",
  },
  {
    type: "color",
    label: "Color",
    description: "Color picker",
    icon: Palette,
    category: "Advanced",
  },
  {
    type: "tags",
    label: "Tags",
    description: "Multiple tags",
    icon: Tags,
    category: "Advanced",
  },
];

const CATEGORIES = [
  "Basic",
  "Choice",
  "Date & Time",
  "Advanced",
];

const FieldPalette = ({
  onAddField,
}: FieldPaletteProps) => {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r bg-background">
      <div className="border-b px-4 py-4">
        <h2 className="text-sm font-semibold">
          Form Fields
        </h2>

        <p className="mt-1 text-xs text-muted-foreground">
          Click a field to add it
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-6">
          {CATEGORIES.map((category) => {
            const fields =
              FIELD_TYPES.filter(
                (field) =>
                  field.category ===
                  category
              );

            if (fields.length === 0) {
              return null;
            }

            return (
              <div
                key={category}
                className="space-y-2"
              >
                <h3 className="px-1 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  {category}
                </h3>

                <div className="space-y-2">
                  {fields.map(
                    (field) => (
                      <FieldPaletteItem
                        key={field.type}
                        field={field}
                        onAdd={
                          onAddField
                        }
                      />
                    )
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
};

export default FieldPalette;

export {
  FIELD_TYPES,
  CATEGORIES,
};