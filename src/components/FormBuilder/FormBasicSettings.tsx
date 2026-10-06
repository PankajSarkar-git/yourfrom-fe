import React from "react";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Label } from "../ui/label";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export type FormStatus =
  | "draft"
  | "published"
  | "archived";

export interface FormBasicData {
  title: string;
  description: string;
  coverImage: string;
  logo: string;
  status: FormStatus;
}

interface FormBasicSettingsProps {
  form: FormBasicData;

  onChange: (
    updates: Partial<FormBasicData>
  ) => void;
}

const FormBasicSettings = ({
  form,
  onChange,
}: FormBasicSettingsProps) => {
  return (
    <div className="space-y-5">
      {/* Title */}
      <div className="space-y-2">
        <Label htmlFor="form-title">
          Form Title
        </Label>

        <Input
          id="form-title"
          value={form.title}
          placeholder="Job Application Form"
          onChange={(event) =>
            onChange({
              title:
                event.target.value,
            })
          }
        />

        <p className="text-xs text-muted-foreground">
          Give your form a clear and recognizable name.
        </p>
      </div>

      {/* Description */}
      <div className="space-y-2">
        <Label htmlFor="form-description">
          Description
        </Label>

        <Textarea
          id="form-description"
          value={form.description}
          placeholder="Please fill in all required details."
          rows={4}
          onChange={(event) =>
            onChange({
              description:
                event.target.value,
            })
          }
        />

        <p className="text-xs text-muted-foreground">
          Explain what users should do with this form.
        </p>
      </div>

      {/* Cover Image */}
      <div className="space-y-2">
        <Label htmlFor="form-cover-image">
          Cover Image
        </Label>

        <Input
          id="form-cover-image"
          type="url"
          value={form.coverImage}
          placeholder="https://example.com/banner.jpg"
          onChange={(event) =>
            onChange({
              coverImage:
                event.target.value,
            })
          }
        />

        <p className="text-xs text-muted-foreground">
          URL of the image displayed at the top of the form.
        </p>
      </div>

      {/* Logo */}
      <div className="space-y-2">
        <Label htmlFor="form-logo">
          Logo
        </Label>

        <Input
          id="form-logo"
          type="url"
          value={form.logo}
          placeholder="https://example.com/logo.png"
          onChange={(event) =>
            onChange({
              logo:
                event.target.value,
            })
          }
        />

        <p className="text-xs text-muted-foreground">
          URL of your logo.
        </p>
      </div>

      {/* Status */}
      <div className="space-y-2">
        <Label htmlFor="form-status">
          Status
        </Label>

        <Select
          value={form.status}
          onValueChange={(value) =>
            onChange({
              status:
                value as FormStatus,
            })
          }
        >
          <SelectTrigger id="form-status">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>

          <SelectContent>
            <SelectItem value="draft">
              Draft
            </SelectItem>

            <SelectItem value="published">
              Published
            </SelectItem>

            <SelectItem value="archived">
              Archived
            </SelectItem>
          </SelectContent>
        </Select>

        <p className="text-xs text-muted-foreground">
          New forms should normally remain in draft until they are ready.
        </p>
      </div>
    </div>
  );
};

export default FormBasicSettings;