import React from "react";
import {
  Check,
  CheckCircle2,
  Copy,
  Laptop,
  Moon,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Sun,
  Tablet,
  X,
  Zap,
} from "lucide-react";

import { Button } from "../ui/button";
import DynamicField from "./DynamicField";
import type { FormFieldConfig } from "./FormField";
import { showToast } from "../toast";

interface FormPreviewModalProps {
  open: boolean;
  onClose: () => void;
  form: {
    _id?: string;
    title: string;
    description?: string;
    coverImage?: string;
    logo?: string;
    status?: string;
    primaryColor?: string;
    successMessage?: string;
  };
  fields: FormFieldConfig[];
}

type ViewportMode = "desktop" | "tablet" | "mobile";

const THEME_PALETTES = [
  { name: "Blue", color: "#2563eb" },
  { name: "Indigo", color: "#4f46e5" },
  { name: "Purple", color: "#7c3aed" },
  { name: "Emerald", color: "#059669" },
  { name: "Rose", color: "#e11d48" },
  { name: "Amber", color: "#d97706" },
  { name: "Slate", color: "#334155" },
];

export const FormPreviewModal: React.FC<FormPreviewModalProps> = ({
  open,
  onClose,
  form,
  fields,
}) => {
  const [viewport, setViewport] = React.useState<ViewportMode>("desktop");
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [activePrimaryColor, setActivePrimaryColor] = React.useState(
    form.primaryColor || "#2563eb"
  );

  const [formValues, setFormValues] = React.useState<Record<string, unknown>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [submitted, setSubmitted] = React.useState(false);
  const [submitting, setSubmitting] = React.useState(false);
  const [copiedLink, setCopiedLink] = React.useState(false);

  // Sync color when form prop changes
  React.useEffect(() => {
    if (form.primaryColor) {
      setActivePrimaryColor(form.primaryColor);
    }
  }, [form.primaryColor]);

  // Initialize values when opened
  React.useEffect(() => {
    if (open) {
      const initialValues: Record<string, unknown> = {};
      fields.forEach((field) => {
        const key = field.name;
        if (field.defaultValue !== undefined && field.defaultValue !== null) {
          initialValues[key] = field.defaultValue;
        } else if (
          field.type === "checkbox" ||
          field.type === "multiselect" ||
          field.type === "tags"
        ) {
          initialValues[key] = [];
        } else if (field.type === "toggle" || field.type === "switch") {
          initialValues[key] = false;
        } else if (
          field.type === "number" ||
          field.type === "range" ||
          field.type === "rating"
        ) {
          initialValues[key] = 0;
        } else {
          initialValues[key] = "";
        }
      });
      setFormValues(initialValues);
      setErrors({});
      setSubmitted(false);
    }
  }, [open, fields]);

  // ALL HOOKS CALLED UNCONDITIONALLY BEFORE ANY CONDITIONAL RETURN
  if (!open) return null;

  const handleFieldChange = (fieldName: string, value: unknown) => {
    setFormValues((prev) => ({
      ...prev,
      [fieldName]: value,
    }));

    if (errors[fieldName]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[fieldName];
        return next;
      });
    }
  };

  // Evaluate conditional visibility
  const isFieldVisible = (field: FormFieldConfig): boolean => {
    if (field.hidden) return false;
    if (!field.conditions || field.conditions.length === 0) return true;

    return field.conditions.every((cond) => {
      if (!cond.fieldId) return true;
      const targetField = fields.find(
        (f) => f._id === cond.fieldId || f.name === cond.fieldId
      );
      if (!targetField) return true;

      const currentValue = formValues[targetField.name];
      const targetValue = cond.value;

      switch (cond.operator) {
        case "equals":
          return String(currentValue ?? "") === String(targetValue ?? "");
        case "notEquals":
          return String(currentValue ?? "") !== String(targetValue ?? "");
        case "contains":
          if (Array.isArray(currentValue)) {
            return currentValue.includes(targetValue);
          }
          return String(currentValue ?? "")
            .toLowerCase()
            .includes(String(targetValue ?? "").toLowerCase());
        case "greaterThan":
          return Number(currentValue ?? 0) > Number(targetValue ?? 0);
        case "lessThan":
          return Number(currentValue ?? 0) < Number(targetValue ?? 0);
        default:
          return true;
      }
    });
  };

  const visibleFields = fields.filter((f) => isFieldVisible(f));

  // Compute completion stats
  const answeredCount = visibleFields.filter((f) => {
    const val = formValues[f.name];
    if (val === undefined || val === null || val === "") return false;
    if (Array.isArray(val) && val.length === 0) return false;
    return true;
  }).length;

  const completionPercentage =
    visibleFields.length > 0
      ? Math.round((answeredCount / visibleFields.length) * 100)
      : 0;

  const handleReset = () => {
    const initialValues: Record<string, unknown> = {};
    fields.forEach((field) => {
      initialValues[field.name] = field.defaultValue ?? "";
    });
    setFormValues(initialValues);
    setErrors({});
    setSubmitted(false);
    showToast.info("Responses reset");
  };

  const validateField = (field: FormFieldConfig): string | null => {
    const val = formValues[field.name];

    if (field.required) {
      if (
        val === undefined ||
        val === null ||
        val === "" ||
        (Array.isArray(val) && val.length === 0)
      ) {
        return `${field.label || field.name} is required`;
      }
    }

    if (typeof val === "string" && val.length > 0) {
      if (field.validation?.minLength && val.length < field.validation.minLength) {
        return `Minimum length is ${field.validation.minLength} characters`;
      }
      if (field.validation?.maxLength && val.length > field.validation.maxLength) {
        return `Maximum length is ${field.validation.maxLength} characters`;
      }
      if (field.validation?.regex) {
        try {
          const re = new RegExp(field.validation.regex);
          if (!re.test(val)) return "Invalid format";
        } catch {
          // ignore
        }
      }
    }

    if (typeof val === "number") {
      const hasValue = field.type === "rating" ? val > 0 : val !== 0 || field.required;
      if (hasValue) {
        if (field.validation?.min !== undefined && val < field.validation.min) {
          return `Minimum value is ${field.validation.min}`;
        }
        if (field.validation?.max !== undefined && val > field.validation.max) {
          return `Maximum value is ${field.validation.max}`;
        }
      }
    }

    return null;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    visibleFields.forEach((field) => {
      const err = validateField(field);
      if (err) newErrors[field.name] = err;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      showToast.error("Please fill in all required questions");
      return;
    }

    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      showToast.success("Test response recorded!");
    }, 450);
  };

  const handleCopyLink = () => {
    const previewUrl = `${window.location.origin}/forms/${form._id || "preview"}/preview`;
    navigator.clipboard.writeText(previewUrl);
    setCopiedLink(true);
    showToast.success("Preview URL copied!");
    setTimeout(() => setCopiedLink(false), 2000);
  };

  // Viewport container width classes
  const viewportWidthClass = {
    desktop: "max-w-3xl",
    tablet: "max-w-xl",
    mobile: "max-w-md",
  }[viewport];

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col transition-colors duration-200 ${
        isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-900/90 text-slate-900"
      } backdrop-blur-md overflow-hidden`}
    >
      {/* Top Studio Control Bar */}
      <header className="relative z-20 flex h-15 shrink-0 items-center justify-between border-b border-white/10 bg-slate-950/80 px-4 sm:px-6 backdrop-blur-xl">
        {/* Left: Title & Status */}
        <div className="flex items-center gap-3 min-w-0">
          <div
            style={{ backgroundColor: activePrimaryColor }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-white shadow-sm"
          >
            <Sparkles className="h-4 w-4" />
          </div>

          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-white tracking-tight truncate max-w-[180px] sm:max-w-xs">
                {form.title || "Untitled Form"}
              </span>
              <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-400 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Preview Mode
              </span>
            </div>
            <p className="text-[11px] text-white/50">
              {visibleFields.length} {visibleFields.length === 1 ? "question" : "questions"} • {completionPercentage}% completed
            </p>
          </div>
        </div>

        {/* Center: Viewport Size Switcher (Desktop, Tablet, Mobile) */}
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-xl border border-white/10 bg-white/5 p-1 backdrop-blur-md">
            <button
              type="button"
              onClick={() => setViewport("desktop")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                viewport === "desktop"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
              title="Desktop Size (100%)"
            >
              <Laptop className="h-3.5 w-3.5" />
              <span>Desktop</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport("tablet")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                viewport === "tablet"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
              title="Tablet Size (640px)"
            >
              <Tablet className="h-3.5 w-3.5" />
              <span>Tablet</span>
            </button>
            <button
              type="button"
              onClick={() => setViewport("mobile")}
              className={`flex items-center gap-1.5 rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
                viewport === "mobile"
                  ? "bg-white text-slate-950 shadow-sm"
                  : "text-white/70 hover:text-white"
              }`}
              title="Mobile Size (420px)"
            >
              <Smartphone className="h-3.5 w-3.5" />
              <span>Mobile</span>
            </button>
          </div>

          {/* Theme Quick Palettes */}
          <div className="hidden md:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-2 py-1">
            {THEME_PALETTES.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => setActivePrimaryColor(p.color)}
                style={{ backgroundColor: p.color }}
                title={`Preview with ${p.name}`}
                className={`h-4 w-4 rounded-full transition-transform ${
                  activePrimaryColor === p.color
                    ? "scale-125 ring-2 ring-white ring-offset-2 ring-offset-slate-950"
                    : "opacity-70 hover:opacity-100 hover:scale-110"
                }`}
              />
            ))}
          </div>

          {/* Dark / Light Toggle */}
          <button
            type="button"
            onClick={() => setIsDarkMode((prev) => !prev)}
            className="flex h-8 w-8 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title={isDarkMode ? "Switch to Light theme" : "Switch to Dark theme"}
          >
            {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopyLink}
            className="text-white/80 hover:text-white hover:bg-white/10 text-xs gap-1.5 border border-white/10 rounded-xl"
            title="Copy Public Link"
          >
            {copiedLink ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
            <span className="hidden sm:inline">Copy Link</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleReset}
            className="text-white/70 hover:text-white hover:bg-white/10 text-xs gap-1.5"
            title="Clear responses"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </Button>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 rounded-full text-white/70 hover:text-white hover:bg-white/15"
            aria-label="Close preview"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </header>

      {/* Main Preview Workspace Canvas */}
      <div className="relative z-10 flex-1 min-h-0 overflow-y-auto p-4 sm:p-8 py-8 sm:py-12 flex justify-center items-start">
        {/* Responsive Form Container */}
        <div
          className={`w-full ${viewportWidthClass} transition-all duration-300 rounded-3xl border bg-card text-card-foreground shadow-2xl overflow-hidden ring-1 ring-border/50`}
        >
          {/* Top Brand Accent Stripe */}
          <div
            className="h-2 w-full transition-all"
            style={{
              backgroundColor: activePrimaryColor,
            }}
          />

          {/* Cover Image */}
          {form.coverImage && (
            <div className="relative h-44 sm:h-56 w-full overflow-hidden bg-muted">
              <img
                src={form.coverImage}
                alt="Form Cover"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}

          <div className="p-6 sm:p-10 space-y-8">
            {/* Form Header */}
            <div className="space-y-4 pb-6 border-b">
              {form.logo && (
                <div className="h-16 w-16 rounded-2xl border bg-background p-2 shadow-xs overflow-hidden">
                  <img
                    src={form.logo}
                    alt="Logo"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              )}

              <div className="space-y-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground leading-tight">
                  {form.title || "Untitled Form"}
                </h1>

                {form.description && (
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {form.description}
                  </p>
                )}
              </div>

              {/* Progress Indicator */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" style={{ color: activePrimaryColor }} />
                    Progress
                  </span>
                  <span style={{ color: activePrimaryColor }} className="font-bold">
                    {completionPercentage}% complete ({answeredCount}/{visibleFields.length})
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${completionPercentage}%`,
                      backgroundColor: activePrimaryColor,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Form Body: Submitted Confirmation OR All Fields List */}
            {submitted ? (
              <div className="py-8 text-center space-y-6 animate-in zoom-in-95 duration-200">
                <div
                  style={{
                    backgroundColor: `${activePrimaryColor}15`,
                    color: activePrimaryColor,
                  }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm"
                >
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold tracking-tight text-foreground">
                    Thank You!
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    {form.successMessage ||
                      "Your response has been submitted successfully."}
                  </p>
                </div>

                {/* Submitted Answers Summary */}
                <div className="rounded-2xl border bg-muted/30 p-5 text-left space-y-3 max-w-md mx-auto text-xs">
                  <div className="flex items-center justify-between border-b pb-2 font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                    <span>Your Responses</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 normal-case">
                      <Check className="h-3 w-3" />
                      Recorded
                    </span>
                  </div>

                  <div className="max-h-56 overflow-y-auto space-y-2.5 divide-y divide-border/40">
                    {visibleFields.map((f) => {
                      const val = formValues[f.name];
                      const displayStr = Array.isArray(val)
                        ? val.join(", ")
                        : val == null || val === ""
                          ? "—"
                          : String(val);

                      return (
                        <div key={f.name} className="flex justify-between items-center gap-4 pt-2">
                          <span className="text-muted-foreground font-medium truncate max-w-[140px]">
                            {f.label || f.name}
                          </span>
                          <span className="font-semibold text-foreground text-right truncate max-w-[180px]">
                            {displayStr}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="gap-2 rounded-xl text-xs"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    Submit Another Response
                  </Button>
                  <Button
                    type="button"
                    onClick={onClose}
                    style={{ backgroundColor: activePrimaryColor }}
                    className="rounded-xl shadow-sm text-white font-semibold text-xs px-5"
                  >
                    Back to Builder
                  </Button>
                </div>
              </div>
            ) : (
              /* All Questions Listed Professionally */
              <form onSubmit={handleSubmit} className="space-y-6">
                {visibleFields.length === 0 ? (
                  <div className="py-12 text-center text-muted-foreground text-sm">
                    No questions added yet. Add questions from the palette to preview them.
                  </div>
                ) : (
                  visibleFields.map((field, index) => {
                    const val = formValues[field.name];
                    const err = errors[field.name];

                    return (
                      <div
                        key={field._id || field.name}
                        className="rounded-2xl border bg-card p-5 sm:p-6 shadow-2xs space-y-3 transition-all hover:border-primary/40"
                      >
                        {/* Question Header */}
                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                          <span className="flex items-center gap-2 font-bold text-foreground">
                            <span
                              style={{
                                backgroundColor: `${activePrimaryColor}18`,
                                color: activePrimaryColor,
                              }}
                              className="h-5 w-5 rounded-md flex items-center justify-center text-[10px] font-black"
                            >
                              {index + 1}
                            </span>
                            <span>Question {index + 1}</span>
                          </span>

                          {field.required && (
                            <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider bg-red-500/10 px-2 py-0.5 rounded-md">
                              Required
                            </span>
                          )}
                        </div>

                        {/* Interactive Dynamic Field */}
                        <DynamicField
                          field={field}
                          value={val}
                          onChange={(v) => handleFieldChange(field.name, v)}
                          error={err}
                        />
                      </div>
                    );
                  })
                )}

                {/* Form Bottom Submission Bar */}
                {visibleFields.length > 0 && (
                  <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-4">
                    <Button
                      type="submit"
                      disabled={submitting}
                      style={{ backgroundColor: activePrimaryColor }}
                      className="px-8 py-2.5 font-bold text-white shadow-md hover:opacity-95 transition-all rounded-xl text-sm"
                    >
                      {submitting ? "Submitting..." : "Submit Response"}
                    </Button>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="h-4 w-4 text-emerald-500" />
                      <span>Never submit sensitive passwords.</span>
                    </div>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreviewModal;
