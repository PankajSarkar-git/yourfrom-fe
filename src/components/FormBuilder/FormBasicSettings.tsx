import React from "react";
import { Palette, Sparkles } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";
import { Switch } from "../ui/switch";
import { Separator } from "../ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export type FormStatus = "draft" | "published" | "archived";

export interface FormBasicData {
  title: string;
  description: string;
  coverImage?: string;
  logo?: string;
  status: FormStatus;
  primaryColor?: string;
  collectEmail?: boolean;
  allowMultipleResponses?: boolean;
  showProgressBar?: boolean;
  successMessage?: string;
}

interface FormBasicSettingsProps {
  form: FormBasicData;
  onChange: (updates: Partial<FormBasicData>) => void;
}

export const THEME_COLOR_SWATCHES = [
  { name: "Electric Blue", hex: "#2563eb", bg: "bg-blue-600" },
  { name: "Royal Purple", hex: "#7c3aed", bg: "bg-purple-600" },
  { name: "Emerald Green", hex: "#059669", bg: "bg-emerald-600" },
  { name: "Crimson Rose", hex: "#e11d48", bg: "bg-rose-600" },
  { name: "Sunset Amber", hex: "#d97706", bg: "bg-amber-600" },
  { name: "Ocean Cyan", hex: "#0891b2", bg: "bg-cyan-600" },
  { name: "Deep Indigo", hex: "#4f46e5", bg: "bg-indigo-600" },
  { name: "Fuchsia Pink", hex: "#db2777", bg: "bg-pink-600" },
  { name: "Dark Slate", hex: "#1e293b", bg: "bg-slate-800" },
];

const COVER_PRESETS = [
  {
    name: "Gradient Aura",
    url: "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Pastel Waves",
    url: "https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Neon Tech",
    url: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?w=1200&auto=format&fit=crop&q=80",
  },
  {
    name: "Clean Nature",
    url: "https://images.unsplash.com/photo-1518495973542-4542c06a5843?w=1200&auto=format&fit=crop&q=80",
  },
];

const FormBasicSettings = ({ form, onChange }: FormBasicSettingsProps) => {
  const activeColor = form.primaryColor || "#2563eb";

  return (
    <div className="space-y-6">
      {/* THEME & COLOR CUSTOMIZATION SECTION */}
      <div className="rounded-xl border p-4 bg-card/60 shadow-2xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              style={{ backgroundColor: activeColor }}
              className="flex h-6 w-6 items-center justify-center rounded-md text-white shadow-xs"
            >
              <Palette className="h-3.5 w-3.5" />
            </div>
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">
                Theme Color
              </h4>
              <p className="text-[11px] text-muted-foreground">
                Choose or customize your brand color
              </p>
            </div>
          </div>

          {/* Current color preview pill */}
          <span
            style={{ backgroundColor: `${activeColor}20`, color: activeColor, borderColor: `${activeColor}40` }}
            className="rounded-full px-2.5 py-0.5 text-[11px] font-mono font-bold border"
          >
            {activeColor}
          </span>
        </div>

        {/* Swatches Grid */}
        <div className="grid grid-cols-5 gap-2 pt-1">
          {THEME_COLOR_SWATCHES.map((swatch) => (
            <button
              key={swatch.hex}
              type="button"
              onClick={() => onChange({ primaryColor: swatch.hex })}
              style={{ backgroundColor: swatch.hex }}
              className={`h-8 w-full rounded-lg transition-all flex items-center justify-center shadow-xs ${
                activeColor.toLowerCase() === swatch.hex.toLowerCase()
                  ? "ring-2 ring-foreground ring-offset-2 scale-105"
                  : "hover:scale-105 opacity-90 hover:opacity-100"
              }`}
              title={swatch.name}
            >
              {activeColor.toLowerCase() === swatch.hex.toLowerCase() && (
                <span className="text-white text-xs font-bold">✓</span>
              )}
            </button>
          ))}

          {/* Custom Color Picker Button */}
          <label className="relative flex h-8 w-full cursor-pointer items-center justify-center rounded-lg border-2 border-dashed border-muted-foreground/30 hover:border-primary transition-colors bg-muted/30">
            <input
              type="color"
              value={activeColor}
              onChange={(e) => onChange({ primaryColor: e.target.value })}
              className="sr-only"
            />
            <span className="text-[10px] font-bold text-muted-foreground">+ Hex</span>
          </label>
        </div>

        {/* Manual Hex Input */}
        <div className="flex items-center gap-2 pt-1">
          <Input
            value={activeColor}
            onChange={(e) => onChange({ primaryColor: e.target.value })}
            placeholder="#2563eb"
            className="h-8 font-mono text-xs uppercase"
          />
          <div
            style={{ backgroundColor: activeColor }}
            className="h-8 w-8 shrink-0 rounded-md border shadow-xs"
          />
        </div>
      </div>

      {/* General Title & Description */}
      <div className="space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <Label htmlFor="form-title" className="text-xs font-semibold">
            Form Title
          </Label>
          <Input
            id="form-title"
            value={form.title}
            placeholder="e.g. Customer Feedback Survey"
            onChange={(e) => onChange({ title: e.target.value })}
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <Label htmlFor="form-description" className="text-xs font-semibold">
            Description
          </Label>
          <Textarea
            id="form-description"
            value={form.description}
            placeholder="Provide instructions or background for respondents..."
            rows={3}
            onChange={(e) => onChange({ description: e.target.value })}
          />
        </div>

        {/* Status */}
        <div className="space-y-1.5">
          <Label htmlFor="form-status" className="text-xs font-semibold">
            Form Status
          </Label>
          <Select
            value={form.status}
            onValueChange={(value) => onChange({ status: value as FormStatus })}
          >
            <SelectTrigger id="form-status">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">Draft (Private)</SelectItem>
              <SelectItem value="published">Published (Active)</SelectItem>
              <SelectItem value="archived">Archived (Closed)</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {/* Cover Image */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="form-cover-image" className="text-xs font-semibold">
            Cover Banner Image
          </Label>
          {form.coverImage && (
            <button
              type="button"
              onClick={() => onChange({ coverImage: "" })}
              className="text-[11px] text-destructive hover:underline"
            >
              Remove
            </button>
          )}
        </div>
        <Input
          id="form-cover-image"
          type="url"
          value={form.coverImage ?? ""}
          placeholder="https://images.unsplash.com/..."
          onChange={(e) => onChange({ coverImage: e.target.value })}
        />

        {/* Quick Presets */}
        <div className="pt-1">
          <p className="text-[11px] text-muted-foreground mb-1.5 flex items-center gap-1 font-medium">
            <Sparkles className="h-3 w-3 text-primary" />
            Popular cover presets:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {COVER_PRESETS.map((preset) => (
              <button
                key={preset.name}
                type="button"
                onClick={() => onChange({ coverImage: preset.url })}
                className="rounded-md border bg-muted/40 px-2 py-1 text-[11px] hover:bg-muted hover:border-primary/50 transition-colors"
              >
                {preset.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logo */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="form-logo" className="text-xs font-semibold">
            Brand Logo URL
          </Label>
          {form.logo && (
            <button
              type="button"
              onClick={() => onChange({ logo: "" })}
              className="text-[11px] text-destructive hover:underline"
            >
              Remove
            </button>
          )}
        </div>
        <Input
          id="form-logo"
          type="url"
          value={form.logo ?? ""}
          placeholder="https://example.com/logo.png"
          onChange={(e) => onChange({ logo: e.target.value })}
        />
      </div>

      <Separator />

      {/* Response Behaviors */}
      <div className="space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
          Submission Behaviors
        </h4>

        {/* Collect Email */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label htmlFor="collect-email" className="text-xs font-medium cursor-pointer">
              Collect Email Address
            </Label>
            <p className="text-[11px] text-muted-foreground">
              Require respondents to enter their email
            </p>
          </div>
          <Switch
            id="collect-email"
            checked={form.collectEmail ?? false}
            onCheckedChange={(checked) => onChange({ collectEmail: checked })}
          />
        </div>

        {/* Allow Multiple Responses */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label htmlFor="allow-multiple" className="text-xs font-medium cursor-pointer">
              Multiple Submissions
            </Label>
            <p className="text-[11px] text-muted-foreground">
              Allow user to submit more than once
            </p>
          </div>
          <Switch
            id="allow-multiple"
            checked={form.allowMultipleResponses ?? true}
            onCheckedChange={(checked) => onChange({ allowMultipleResponses: checked })}
          />
        </div>

        {/* Show Progress Bar */}
        <div className="flex items-center justify-between rounded-lg border p-3">
          <div className="space-y-0.5">
            <Label htmlFor="show-progress" className="text-xs font-medium cursor-pointer">
              Show Progress Bar
            </Label>
            <p className="text-[11px] text-muted-foreground">
              Display progress percentage indicator
            </p>
          </div>
          <Switch
            id="show-progress"
            checked={form.showProgressBar ?? true}
            onCheckedChange={(checked) => onChange({ showProgressBar: checked })}
          />
        </div>
      </div>

      <Separator />

      {/* Success Page Message */}
      <div className="space-y-2">
        <Label htmlFor="form-success" className="text-xs font-semibold">
          Submission Success Message
        </Label>
        <Textarea
          id="form-success"
          value={form.successMessage ?? ""}
          placeholder="Your response has been submitted successfully."
          rows={2}
          onChange={(e) => onChange({ successMessage: e.target.value })}
        />
      </div>
    </div>
  );
};

export default FormBasicSettings;