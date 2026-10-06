import React from "react";
import { ArrowLeft, Eye, Save } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";

import FieldPalette from "../../components/FormBuilder/FieldPalette";
import BuilderCanvas from "../../components/FormBuilder/BuilderCanvas";
import FieldEditor from "../../components/FormBuilder/FieldEditor";

import type { FormFieldConfig } from "../../components/FormBuilder/FormField";

type FormStatus = "draft" | "published" | "archived";

interface CreateFormData {
  title: string;
  description: string;
  slug: string;
  coverImage: string;
  logo: string;
  status: FormStatus;
}
const CreateFormPage = () => {
  const navigate = useNavigate();

  const [form, setForm] = React.useState<CreateFormData>({
    title: "",
    description: "",
    slug: "",
    coverImage: "",
    logo: "",
    status: "draft",
  });
  const [fields, setFields] = React.useState<FormFieldConfig[]>([]);

  const [selectedFieldId, setSelectedFieldId] = React.useState<string | null>(
    null,
  );

  const [saving, setSaving] = React.useState(false);

  const selectedField =
    fields.find((field) => (field._id ?? field.name) === selectedFieldId) ??
    null;

  const updateForm = (updates: Partial<CreateFormData>) => {
    setForm((current) => ({
      ...current,
      ...updates,
    }));
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  };

  const handleTitleChange = (title: string) => {
    setForm((current) => ({
      ...current,
      title,
      slug: current.slug || generateSlug(title),
    }));
  };

  const createField = (type: string): FormFieldConfig => {
    const fieldNumber = fields.length + 1;

    const baseField: FormFieldConfig = {
      type,
      name: `${type}_${fieldNumber}`,
      label: getDefaultLabel(type),
      placeholder: getDefaultPlaceholder(type),
      description: "",
      defaultValue: getDefaultValue(type),
      required: false,
      disabled: false,
      readOnly: false,
      hidden: false,
      searchable: true,
      order: fieldNumber,
      options: getDefaultOptions(type),
      validation: {},
      ui: {
        width: "100%",
      },
    };

    return baseField;
  };

  const handleAddField = (type: string) => {
    const newField = createField(type);

    setFields((current) => [...current, newField]);

    setSelectedFieldId(newField.name);
  };

  const handleUpdateField = (
    fieldId: string,
    updates: Partial<FormFieldConfig>,
  ) => {
    setFields((current) =>
      current.map((field) => {
        const currentId = field._id ?? field.name;

        if (currentId !== fieldId) {
          return field;
        }

        return {
          ...field,
          ...updates,
        };
      }),
    );
  };

  const handleDeleteField = (fieldId: string) => {
    setFields((current) =>
      current.filter((field) => {
        const currentId = field._id ?? field.name;

        return currentId !== fieldId;
      }),
    );

    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
    }
  };

  const handleDuplicateField = (fieldId: string) => {
    const sourceIndex = fields.findIndex(
      (field) => (field._id ?? field.name) === fieldId,
    );

    if (sourceIndex === -1) {
      return;
    }

    const source = fields[sourceIndex];

    const duplicate: FormFieldConfig = {
      ...source,
      _id: undefined,
      name: `${source.name}_copy`,
      label: `${source.label} Copy`,
      order: fields.length + 1,
    };

    setFields((current) => [...current, duplicate]);

    setSelectedFieldId(duplicate.name);
  };

  const handleSave = async () => {
    if (!form.title.trim()) {
      return;
    }

    try {
      setSaving(true);

      const payload = {
        ...form,
        fields,
      };

      console.log("CREATE FORM PAYLOAD", payload);

      /*
       * Connect your API here:
       *
       * const response =
       *   await createForm(payload);
       *
       * navigate(
       *   `/forms/${response.data.form._id}/edit`
       * );
       */

      await new Promise((resolve) => setTimeout(resolve, 500));

      navigate("/forms");
    } catch (error) {
      console.error("Failed to create form:", error);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4">
        <div className="flex min-w-0 items-center gap-4">
          <Button variant="ghost" size="icon">
            <Link to="/forms">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div className="min-w-0">
            <Input
              value={form.title}
              onChange={(event: any) => handleTitleChange(event.target.value)}
              className="h-8 w-[260px] border-transparent px-2 text-base font-semibold shadow-none focus-visible:border-input focus-visible:ring-0"
              placeholder="Untitled Form"
            />

            <p className="px-2 text-xs text-muted-foreground">
              {fields.length} {fields.length === 1 ? "field" : "fields"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button type="button" variant="outline">
            <Eye className="mr-2 h-4 w-4" />
            Preview
          </Button>

          <Button
            type="button"
            disabled={saving || !form.title.trim()}
            onClick={handleSave}
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Form"}
          </Button>
        </div>
      </header>

      {/* Builder */}
      <div className="flex min-h-0 flex-1">
        {/* Left */}
        <FieldPalette onAddField={handleAddField} />

        {/* Center */}
        <BuilderCanvas
          fields={fields}
          selectedFieldId={selectedFieldId}
          onSelectField={setSelectedFieldId}
          onDeleteField={handleDeleteField}
          onDuplicateField={handleDuplicateField}
          onAddField={() => {
            handleAddField("text");
          }}
        />

        {/* Right */}
        <FieldEditor
          field={selectedField}
          fields={fields}
          open={true}
          onClose={() => setSelectedFieldId(null)}
          onUpdateField={handleUpdateField}
        />
      </div>
    </div>
  );
};

const getDefaultLabel = (type: string) => {
  const labels: Record<string, string> = {
    text: "Short Text",
    textarea: "Long Text",
    email: "Email",
    password: "Password",
    number: "Number",
    phone: "Phone",
    url: "Website",
    date: "Date",
    time: "Time",
    "datetime-local": "Date & Time",
    month: "Month",
    week: "Week",
    select: "Dropdown",
    multiselect: "Multi Select",
    radio: "Radio",
    checkbox: "Checkbox",
    file: "File Upload",
    image: "Image Upload",
    rating: "Rating",
    range: "Range",
    color: "Color",
    toggle: "Toggle",
    switch: "Switch",
    tags: "Tags",
    hidden: "Hidden Field",
  };

  return labels[type] ?? "New Field";
};

const getDefaultPlaceholder = (type: string) => {
  const placeholders: Record<string, string> = {
    text: "Enter text...",
    textarea: "Enter your answer...",
    email: "Enter your email...",
    password: "Enter your password...",
    number: "Enter a number...",
    phone: "Enter phone number...",
    url: "https://example.com",
    select: "Select an option...",
    multiselect: "Select options...",
    radio: "Select an option...",
    checkbox: "Select options...",
    tags: "Add tags...",
  };

  return placeholders[type] ?? "";
};

const getDefaultValue = (type: string): unknown => {
  if (type === "checkbox" || type === "multiselect" || type === "tags") {
    return [];
  }

  if (type === "toggle" || type === "switch") {
    return false;
  }

  if (type === "number" || type === "range" || type === "rating") {
    return 0;
  }

  if (type === "color") {
    return "#000000";
  }

  return "";
};

const getDefaultOptions = (type: string) => {
  const optionTypes = ["select", "multiselect", "radio", "checkbox"];

  if (!optionTypes.includes(type)) {
    return [];
  }

  return [
    {
      label: "Option 1",
      value: "option_1",
      disabled: false,
    },
    {
      label: "Option 2",
      value: "option_2",
      disabled: false,
    },
  ];
};

export default CreateFormPage;
