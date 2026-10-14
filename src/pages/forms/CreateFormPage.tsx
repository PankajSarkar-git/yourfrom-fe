import React from "react";
import { ArrowLeft, Check, Eye, Loader2, Palette, Save, Sparkles } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { Badge } from "../../components/ui/badge";

import FieldPalette from "../../components/FormBuilder/FieldPalette";
import BuilderCanvas from "../../components/FormBuilder/BuilderCanvas";
import FieldEditor from "../../components/FormBuilder/FieldEditor";
import FormPreviewModal from "../../components/FormBuilder/FormPreviewModal";
import { THEME_COLOR_PRESETS } from "../../components/FormBuilder/FormHeaderCard";

import type { FormFieldConfig } from "../../components/FormBuilder/FormField";
import type { FormBasicData } from "../../components/FormBuilder/FormBasicSettings";
import { formsService, type FormStatus } from "../../services/forms.service";
import { showToast } from "../../components/toast";

interface CreateFormData extends FormBasicData {
  slug: string;
}

const CreateFormPage = () => {
  const navigate = useNavigate();
  const { id: formId } = useParams<{ id?: string }>();
  const isEditMode = Boolean(formId);

  const [form, setForm] = React.useState<CreateFormData>({
    title: "",
    description: "",
    slug: "",
    coverImage: "",
    logo: "",
    status: "draft",
    primaryColor: "#2563eb",
    collectEmail: false,
    allowMultipleResponses: true,
    showProgressBar: true,
    successMessage: "Your response has been submitted successfully.",
  });

  const [fields, setFields] = React.useState<FormFieldConfig[]>([]);
  const [selectedFieldId, setSelectedFieldId] = React.useState<string | null>(null);
  const [isFormHeaderSelected, setIsFormHeaderSelected] = React.useState(false);
  const [activeEditorTab, setActiveEditorTab] = React.useState<"field" | "form">("form");

  const [loading, setLoading] = React.useState<boolean>(isEditMode);
  const [saving, setSaving] = React.useState(false);
  const [previewOpen, setPreviewOpen] = React.useState(false);
  const [isDirty, setIsDirty] = React.useState(false);

  // Load existing form if in edit mode
  React.useEffect(() => {
    if (!formId) return;

    const loadExistingForm = async () => {
      try {
        setLoading(true);
        const { data } = await formsService.getFormById(formId);
        if (data.form) {
          const f = data.form;
          setForm({
            title: f.title || "",
            description: f.description || "",
            slug: f.slug || "",
            coverImage: f.coverImage || "",
            logo: f.logo || "",
            status: f.status || "draft",
            primaryColor: f.theme?.primaryColor || f.primaryColor || "#2563eb",
            collectEmail: f.settings?.collectEmail ?? false,
            allowMultipleResponses: f.settings?.allowMultipleResponses ?? true,
            showProgressBar: f.settings?.showProgressBar ?? true,
            successMessage:
              f.successPage?.message ||
              "Your response has been submitted successfully.",
          });
        }
        if (data.fields && Array.isArray(data.fields)) {
          setFields(data.fields);
          if (data.fields.length > 0) {
            setSelectedFieldId(data.fields[0]._id ?? data.fields[0].name);
            setActiveEditorTab("field");
          }
        }
      } catch (error) {
        console.error("Failed to load form for editing:", error);
        showToast.error("Failed to load form details");
      } finally {
        setLoading(false);
      }
    };

    loadExistingForm();
  }, [formId]);

  const selectedField =
    fields.find((field) => (field._id ?? field.name) === selectedFieldId) ??
    null;

  const updateForm = (updates: Partial<CreateFormData>) => {
    setIsDirty(true);
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
    setIsDirty(true);
    setForm((current) => ({
      ...current,
      title,
      slug: current.slug || generateSlug(title),
    }));
  };

  const handleDescriptionChange = (description: string) => {
    setIsDirty(true);
    setForm((current) => ({
      ...current,
      description,
    }));
  };

  const createField = (type: string): FormFieldConfig => {
    const uniqueId = `field_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const fieldNumber = fields.length + 1;

    const baseField: FormFieldConfig = {
      _id: uniqueId,
      type,
      name: `${type}_${fieldNumber}_${Math.random().toString(36).substring(2, 5)}`,
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

  const handleAddField = (type = "text") => {
    setIsDirty(true);
    const newField = createField(type);
    setFields((current) => [...current, newField]);

    // Select and switch to field tab
    setSelectedFieldId(newField._id ?? newField.name);
    setIsFormHeaderSelected(false);
    setActiveEditorTab("field");
    showToast.success(`Added ${newField.label}`);
  };

  const handleSelectField = (fieldId: string) => {
    setSelectedFieldId(fieldId);
    setIsFormHeaderSelected(false);
    setActiveEditorTab("field");
  };

  const handleSelectFormHeader = () => {
    setSelectedFieldId(null);
    setIsFormHeaderSelected(true);
    setActiveEditorTab("form");
  };

  const handleUpdateField = (
    fieldId: string,
    updates: Partial<FormFieldConfig>,
  ) => {
    setIsDirty(true);
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
    setIsDirty(true);
    setFields((current) => {
      const remaining = current.filter((field) => {
        const currentId = field._id ?? field.name;
        return currentId !== fieldId;
      });
      // Re-normalize order
      return remaining.map((f, i) => ({ ...f, order: i + 1 }));
    });

    if (selectedFieldId === fieldId) {
      setSelectedFieldId(null);
      setActiveEditorTab("form");
    }
    showToast.success("Field deleted");
  };

  const handleDuplicateField = (fieldId: string) => {
    setIsDirty(true);
    const sourceIndex = fields.findIndex(
      (field) => (field._id ?? field.name) === fieldId,
    );

    if (sourceIndex === -1) {
      return;
    }

    const source = fields[sourceIndex];
    const newId = `field_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

    const duplicate: FormFieldConfig = {
      ...source,
      _id: newId,
      name: `${source.name}_copy_${Math.random().toString(36).substring(2, 5)}`,
      label: `${source.label} (Copy)`,
      order: sourceIndex + 2,
    };

    const nextFields = [...fields];
    nextFields.splice(sourceIndex + 1, 0, duplicate);

    // Reassign orders
    const reordered = nextFields.map((f, idx) => ({ ...f, order: idx + 1 }));
    setFields(reordered);

    setSelectedFieldId(newId);
    setIsFormHeaderSelected(false);
    setActiveEditorTab("field");
    showToast.success("Field duplicated");
  };

  const handleMoveField = (fieldId: string, direction: "up" | "down") => {
    setIsDirty(true);
    const index = fields.findIndex(
      (f) => (f._id ?? f.name) === fieldId,
    );
    if (index === -1) return;

    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= fields.length) return;

    const nextFields = [...fields];
    const [moved] = nextFields.splice(index, 1);
    nextFields.splice(targetIndex, 0, moved);

    const reordered = nextFields.map((f, idx) => ({ ...f, order: idx + 1 }));
    setFields(reordered);
  };

  const handleSave = async () => {
    const trimmedTitle = form.title.trim();
    if (!trimmedTitle) {
      showToast.error("Please enter a title for your form");
      return;
    }

    if (fields.length === 0) {
      showToast.error("Please add at least one field before saving");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        title: trimmedTitle,
        description: form.description || "",
        slug: form.slug || generateSlug(trimmedTitle),
        coverImage: form.coverImage || "",
        logo: form.logo || "",
        status: form.status,
        primaryColor: form.primaryColor || "#2563eb",
        theme: {
          primaryColor: form.primaryColor || "#2563eb",
        },
        settings: {
          collectEmail: form.collectEmail,
          allowMultipleResponses: form.allowMultipleResponses,
          showProgressBar: form.showProgressBar,
        },
        successPage: {
          title: "Thank You!",
          message:
            form.successMessage ||
            "Your response has been submitted successfully.",
        },
        fields,
      };

      if (isEditMode && formId) {
        await formsService.updateForm(formId, payload);
        showToast.success("Form updated successfully!");
      } else {
        await formsService.createForm(payload);
        showToast.success("Form created successfully!");
      }

      setIsDirty(false);
      navigate("/forms");
    } catch (error) {
      console.error("Failed to save form:", error);
      showToast.error("Failed to save form. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const statusBadgeConfig = {
    draft: {
      label: "Draft",
      className: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-400 border-amber-300",
    },
    published: {
      label: "Published",
      className: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border-emerald-300",
    },
    archived: {
      label: "Archived",
      className: "bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300 border-slate-300",
    },
  }[form.status] ?? {
    label: form.status,
    className: "bg-muted text-muted-foreground",
  };

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground font-medium">
            Loading form builder...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-background">
      {/* Header */}
      <header className="flex h-16 shrink-0 items-center justify-between border-b bg-background px-4 z-10 shadow-xs">
        <div className="flex min-w-0 items-center gap-3">
          <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
            <Link to="/forms">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>

          <div className="min-w-0 flex items-center gap-3">
            <div>
              <Input
                value={form.title}
                onChange={(event) => handleTitleChange(event.target.value)}
                className="h-8 w-[240px] sm:w-[320px] border-transparent px-2 text-base font-semibold shadow-none focus-visible:border-input focus-visible:ring-1 focus-visible:ring-primary"
                placeholder="Untitled Form"
              />
            </div>

            {/* Quick Status Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Badge
                  variant="outline"
                  className={`cursor-pointer hover:opacity-80 transition-opacity ${statusBadgeConfig.className}`}
                >
                  {statusBadgeConfig.label}
                </Badge>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuItem
                  onClick={() => updateForm({ status: "draft" })}
                  className="flex items-center justify-between"
                >
                  Draft
                  {form.status === "draft" && <Check className="h-4 w-4 ml-2 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateForm({ status: "published" })}
                  className="flex items-center justify-between"
                >
                  Published
                  {form.status === "published" && <Check className="h-4 w-4 ml-2 text-primary" />}
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => updateForm({ status: "archived" })}
                  className="flex items-center justify-between"
                >
                  Archived
                  {form.status === "archived" && <Check className="h-4 w-4 ml-2 text-primary" />}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Quick Theme Color Picker Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div
                  className="flex items-center gap-1.5 rounded-full border bg-muted/40 px-2 py-1 cursor-pointer hover:bg-muted transition-colors shadow-2xs"
                  title="Form theme color"
                >
                  <span
                    style={{ backgroundColor: form.primaryColor || "#2563eb" }}
                    className="h-3.5 w-3.5 rounded-full border border-black/10 shadow-2xs"
                  />
                  <Palette className="h-3 w-3 text-muted-foreground" />
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="p-3 w-64 space-y-3">
                <div>
                  <p className="text-xs font-bold text-foreground">Form Theme Color</p>
                  <p className="text-[10px] text-muted-foreground">Customize your form's primary accent</p>
                </div>
                <div className="grid grid-cols-4 gap-1.5">
                  {THEME_COLOR_PRESETS.map((preset) => (
                    <button
                      key={preset.hex}
                      type="button"
                      onClick={() => updateForm({ primaryColor: preset.hex })}
                      style={{ backgroundColor: preset.hex }}
                      className={`h-7 w-full rounded-md transition-all flex items-center justify-center ${
                        (form.primaryColor || "#2563eb").toLowerCase() === preset.hex.toLowerCase()
                          ? "ring-2 ring-foreground scale-105 shadow-xs"
                          : "hover:scale-105 opacity-90 hover:opacity-100"
                      }`}
                      title={preset.name}
                    >
                      {(form.primaryColor || "#2563eb").toLowerCase() === preset.hex.toLowerCase() && (
                        <span className="text-white text-[10px] font-bold">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                <div className="flex items-center gap-2 pt-2 border-t">
                  <Label className="text-[11px] text-muted-foreground shrink-0">Custom:</Label>
                  <input
                    type="color"
                    value={form.primaryColor || "#2563eb"}
                    onChange={(e) => updateForm({ primaryColor: e.target.value })}
                    className="h-7 w-8 cursor-pointer rounded border p-0.5 bg-transparent"
                  />
                  <Input
                    value={form.primaryColor || "#2563eb"}
                    onChange={(e) => updateForm({ primaryColor: e.target.value })}
                    className="h-7 text-xs font-mono uppercase"
                  />
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {isDirty && (
              <span className="hidden sm:inline-block text-[11px] text-amber-600 font-medium">
                • Unsaved changes
              </span>
            )}
          </div>
        </div>

        {/* Right Header Actions */}
        <div className="flex items-center gap-2.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => setPreviewOpen(true)}
            className="gap-1.5"
          >
            <Eye className="h-4 w-4 text-muted-foreground" />
            Preview
          </Button>

          <Button
            type="button"
            disabled={saving || !form.title.trim()}
            onClick={handleSave}
            size="sm"
            style={{
              backgroundColor: form.primaryColor || undefined,
            }}
            className="gap-1.5 shadow-sm min-w-[100px]"
          >
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                {isEditMode ? "Save Changes" : "Save Form"}
              </>
            )}
          </Button>
        </div>
      </header>

      {/* Builder 3-Column Layout */}
      <div className="flex min-h-0 flex-1">
        {/* Left: Palette */}
        <FieldPalette
          onAddField={handleAddField}
          fieldCount={fields.length}
        />

        {/* Center: Canvas */}
        <BuilderCanvas
          form={form}
          fields={fields}
          selectedFieldId={selectedFieldId}
          isFormHeaderSelected={isFormHeaderSelected}
          onSelectFormHeader={handleSelectFormHeader}
          onTitleChange={handleTitleChange}
          onDescriptionChange={handleDescriptionChange}
          onColorChange={(color) => updateForm({ primaryColor: color })}
          onSelectField={handleSelectField}
          onDeleteField={handleDeleteField}
          onDuplicateField={handleDuplicateField}
          onMoveField={handleMoveField}
          onAddField={handleAddField}
          onOpenFormSettings={() => {
            handleSelectFormHeader();
            setActiveEditorTab("form");
          }}
        />

        {/* Right: Field & Form Editor */}
        <FieldEditor
          field={selectedField}
          fields={fields}
          form={form}
          open={true}
          activeTab={activeEditorTab}
          onTabChange={setActiveEditorTab}
          onClose={() => {
            setSelectedFieldId(null);
            setIsFormHeaderSelected(false);
            setActiveEditorTab("form");
          }}
          onUpdateField={handleUpdateField}
          onUpdateForm={updateForm}
        />
      </div>

      {/* Live Interactive Preview Modal */}
      <FormPreviewModal
        open={previewOpen}
        onClose={() => setPreviewOpen(false)}
        form={form}
        fields={fields}
      />
    </div>
  );
};

const getDefaultLabel = (type: string) => {
  const labels: Record<string, string> = {
    text: "Short Text",
    textarea: "Long Text",
    email: "Email Address",
    password: "Password",
    number: "Number",
    phone: "Phone Number",
    url: "Website URL",
    date: "Date",
    time: "Time",
    "datetime-local": "Date & Time",
    month: "Month",
    week: "Week",
    select: "Select an Option",
    multiselect: "Select Options",
    radio: "Multiple Choice",
    checkbox: "Checkboxes",
    file: "File Upload",
    image: "Image Upload",
    rating: "Rating",
    range: "Slider",
    color: "Color Picker",
    toggle: "Toggle Switch",
    switch: "Switch",
    tags: "Tags",
    hidden: "Hidden Field",
  };

  return labels[type] ?? "New Field";
};

const getDefaultPlaceholder = (type: string) => {
  const placeholders: Record<string, string> = {
    text: "Type your answer here...",
    textarea: "Type your detailed answer here...",
    email: "name@example.com",
    password: "Enter your password...",
    number: "Enter a number...",
    phone: "+1 (555) 000-0000",
    url: "https://example.com",
    select: "Choose an option...",
    multiselect: "Select one or more options...",
    radio: "Select an option...",
    checkbox: "Select all that apply...",
    tags: "Type tag and press enter...",
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
    return "#3b82f6";
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
    {
      label: "Option 3",
      value: "option_3",
      disabled: false,
    },
  ];
};

export default CreateFormPage;
