import React from "react";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock,
  Edit,
  Loader2,
  Moon,
  RotateCcw,
  ShieldCheck,
  Sun,
  Zap,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { Button } from "../../components/ui/button";
import DynamicField from "../../components/FormBuilder/DynamicField";
import type { FormFieldConfig } from "../../components/FormBuilder/FormField";
import { formsService, type FormPayload } from "../../services/forms.service";
import { showToast } from "../../components/toast";

export const FormPreviewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const [form, setForm] = React.useState<FormPayload | null>(null);
  const [fields, setFields] = React.useState<FormFieldConfig[]>([]);
  const [formValues, setFormValues] = React.useState<Record<string, unknown>>({});
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [loading, setLoading] = React.useState(true);
  const [submitting, setSubmitting] = React.useState(false);
  const [submitted, setSubmitted] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  React.useEffect(() => {
    if (!id) return;

    const loadForm = async () => {
      try {
        setLoading(true);
        const { data } = await formsService.getFormById(id);
        setForm(data.form);
        const formFields = data.fields || [];
        setFields(formFields);

        // Initialize values
        const initialValues: Record<string, unknown> = {};
        formFields.forEach((field) => {
          if (field.defaultValue !== undefined && field.defaultValue !== null) {
            initialValues[field.name] = field.defaultValue;
          } else if (
            field.type === "checkbox" ||
            field.type === "multiselect" ||
            field.type === "tags"
          ) {
            initialValues[field.name] = [];
          } else if (field.type === "toggle" || field.type === "switch") {
            initialValues[field.name] = false;
          } else if (
            field.type === "number" ||
            field.type === "range" ||
            field.type === "rating"
          ) {
            initialValues[field.name] = 0;
          } else {
            initialValues[field.name] = "";
          }
        });
        setFormValues(initialValues);
      } catch (error) {
        console.error("Failed to load form preview:", error);
        showToast.error("Form not found or failed to load");
      } finally {
        setLoading(false);
      }
    };

    loadForm();
  }, [id]);

  const primaryColor =
    form?.theme?.primaryColor || form?.primaryColor || "#2563eb";

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
    return null;
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
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
      showToast.success("Form submitted successfully!");
    }, 450);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-950 text-white">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="h-9 w-9 animate-spin text-primary" />
          <p className="text-sm text-slate-400 font-medium">Loading form...</p>
        </div>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-muted/20 p-6 text-center">
        <h2 className="text-xl font-bold">Form not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          The requested form could not be found or has been removed.
        </p>
        <Button className="mt-6">
          <Link to="/forms">Return to Forms</Link>
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-200 ${
        isDarkMode ? "dark bg-slate-950 text-slate-100" : "bg-slate-50 text-slate-900"
      } relative py-8 px-4 sm:px-6 overflow-x-hidden`}
    >
      <div className="relative z-10 mx-auto max-w-3xl space-y-6">
        {/* Top Bar */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="gap-2 rounded-xl text-xs">
            <Link to="/forms" className="flex items-center gap-2">
              <ArrowLeft className="h-4 w-4" />
              My Forms
            </Link>
          </Button>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => setIsDarkMode((d) => !d)}
              className="h-8 w-8 rounded-xl"
              title="Toggle theme"
            >
              {isDarkMode ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </Button>

            <Button variant="outline" size="sm" className="gap-1.5 rounded-xl text-xs">
              <Link to={`/forms/${form._id}/edit`} className="flex items-center gap-1.5">
                <Edit className="h-3.5 w-3.5" />
                Edit Form
              </Link>
            </Button>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="rounded-3xl border bg-card text-card-foreground shadow-xl overflow-hidden ring-1 ring-border/50">
          {/* Top Brand Accent Bar */}
          <div
            className="h-2 w-full"
            style={{
              backgroundColor: primaryColor,
            }}
          />

          {/* Cover Image */}
          {form.coverImage && (
            <div className="relative h-48 sm:h-64 w-full overflow-hidden bg-muted">
              <img
                src={form.coverImage}
                alt="Cover"
                className="h-full w-full object-cover"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = "none";
                }}
              />
            </div>
          )}

          <div className="p-6 sm:p-10 space-y-8">
            {/* Header */}
            <div className="space-y-4 border-b pb-6">
              {form.logo && (
                <div className="h-16 w-16 rounded-2xl border bg-background p-2 shadow-sm overflow-hidden">
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
                <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight text-foreground leading-tight">
                  {form.title || "Untitled Form"}
                </h1>
                {form.description && (
                  <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
                    {form.description}
                  </p>
                )}
              </div>

              {/* Progress Tracker */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-[11px] font-semibold text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Zap className="h-3 w-3" style={{ color: primaryColor }} />
                    Progress
                  </span>
                  <span style={{ color: primaryColor }} className="font-bold">
                    {completionPercentage}% complete ({answeredCount}/{visibleFields.length})
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full transition-all duration-300 rounded-full"
                    style={{
                      width: `${completionPercentage}%`,
                      backgroundColor: primaryColor,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Submission Confirmation OR All Questions List */}
            {submitted ? (
              <div className="py-10 text-center space-y-6 animate-in zoom-in-95 duration-200">
                <div
                  style={{ backgroundColor: `${primaryColor}18`, color: primaryColor }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl shadow-sm"
                >
                  <CheckCircle2 className="h-10 w-10" />
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                    Thank You!
                  </h2>
                  <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
                    {form.successPage?.message ||
                      "Your response has been submitted successfully."}
                  </p>
                </div>

                {/* Response Summary Card */}
                <div className="rounded-2xl border bg-muted/30 p-5 text-left space-y-3 max-w-md mx-auto shadow-xs text-xs">
                  <div className="flex items-center justify-between border-b pb-2 font-bold text-muted-foreground uppercase tracking-wider text-[11px]">
                    <span>Your Responses</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 normal-case">
                      <Check className="h-3 w-3" />
                      Recorded
                    </span>
                  </div>
                  <div className="max-h-56 overflow-y-auto space-y-2 divide-y divide-border/40">
                    {visibleFields.map((f) => {
                      const val = formValues[f.name];
                      const displayStr = Array.isArray(val)
                        ? val.join(", ")
                        : val == null || val === ""
                          ? "—"
                          : String(val);

                      return (
                        <div key={f.name} className="flex justify-between items-center gap-4 pt-2">
                          <span className="text-muted-foreground font-medium truncate max-w-[150px]">
                            {f.label || f.name}
                          </span>
                          <span className="font-semibold text-foreground text-right truncate max-w-[200px]">
                            {displayStr}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="pt-2 flex justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleReset}
                    className="gap-2 rounded-xl text-xs"
                  >
                    <RotateCcw className="h-4 w-4" />
                    Submit Another Response
                  </Button>
                </div>
              </div>
            ) : (
              /* All Fields List */
              <form onSubmit={handleSubmit} className="space-y-6">
                {visibleFields.map((field, index) => (
                  <div
                    key={field._id || field.name}
                    className="rounded-2xl border bg-card p-5 sm:p-6 shadow-2xs space-y-3 transition-all hover:border-primary/40"
                  >
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="flex items-center gap-2 font-bold text-foreground">
                        <span
                          style={{
                            backgroundColor: `${primaryColor}18`,
                            color: primaryColor,
                          }}
                          className="h-5.5 w-5.5 rounded-lg flex items-center justify-center text-[10px] font-black"
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

                    <DynamicField
                      field={field}
                      value={formValues[field.name]}
                      onChange={(val) => handleFieldChange(field.name, val)}
                      error={errors[field.name]}
                    />
                  </div>
                ))}

                <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-4">
                  <Button
                    type="submit"
                    disabled={submitting}
                    style={{ backgroundColor: primaryColor }}
                    className="px-8 py-2.5 font-bold text-white shadow-md hover:opacity-95 transition-all rounded-xl text-sm"
                  >
                    {submitting ? "Submitting..." : "Submit Response"}
                  </Button>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <ShieldCheck className="h-4 w-4 text-emerald-500" />
                    <span>Your responses are private and secure.</span>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FormPreviewPage;
