import React from "react";
import {
  Archive,
  Edit,
  Eye,
  FileText,
  MoreHorizontal,
  Plus,
  Trash2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";

import { Badge } from "../../components/ui/badge";

interface FormItem {
  _id: string;
  title: string;
  description?: string;
  slug: string;
  status: "draft" | "published" | "archived";
  analytics?: {
    views?: number;
    submissions?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

const FormsPage = () => {
  /*
   * Replace this with your React Query hook:
   *
   * const { data, isLoading, isError } = useForms();
   *
   * For now this is page state.
   */

  const [forms, setForms] = React.useState<FormItem[]>([]);

  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    /*
     * Replace this with:
     *
     * fetchForms()
     *
     * or:
     *
     * useForms()
     */

    const loadForms = async () => {
      try {
        setLoading(true);

        // TODO: connect your API
        //
        // const response = await getForms();
        // setForms(response.data.forms);

        setForms([]);
      } catch (error) {
        console.error("Failed to load forms:", error);
      } finally {
        setLoading(false);
      }
    };

    loadForms();
  }, []);

  const deleteForm = async (formId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this form?",
    );

    if (!confirmed) {
      return;
    }

    try {
      /*
       * TODO:
       *
       * await deleteFormApi(formId);
       */

      setForms((current) => current.filter((form) => form._id !== formId));
    } catch (error) {
      console.error("Failed to delete form:", error);
    }
  };

  return (
    <div className="min-h-screen bg-muted/30">
      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">My Forms</h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Create and manage your forms.
            </p>
          </div>

          <Button >
            <Link to="/forms/create" className="flex items-center" >
              <Plus className="mr-2 h-4 w-4" />
              Create Form
            </Link>
          </Button>
        </div>

        {/* Loading */}
        {loading && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardHeader>
                  <div className="h-5 w-2/3 rounded bg-muted" />

                  <div className="h-4 w-full rounded bg-muted" />
                </CardHeader>

                <CardContent>
                  <div className="h-8 w-full rounded bg-muted" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && forms.length === 0 && <EmptyForms />}

        {/* Forms */}
        {!loading && forms.length > 0 && (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {forms.map((form) => (
              <FormCard
                key={form._id}
                form={form}
                onDelete={() => deleteForm(form._id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

interface FormCardProps {
  form: FormItem;
  onDelete: () => void;
}

const FormCard = ({ form, onDelete }: FormCardProps) => {
  return (
    <Card className="group transition-shadow hover:shadow-md">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
              <FileText className="h-5 w-5 text-primary" />
            </div>

            <div className="min-w-0">
              <CardTitle className="truncate text-base">{form.title}</CardTitle>

              <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                {form.description || "No description"}
              </p>
            </div>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger >
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
              >
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end">
              <DropdownMenuItem >
                <Link to={`/forms/${form._id}/edit`}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem >
                <Link to={`/forms/${form._id}/preview`}>
                  <Eye className="mr-2 h-4 w-4" />
                  Preview
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem>
                <Archive className="mr-2 h-4 w-4" />
                Archive
              </DropdownMenuItem>

              <DropdownMenuSeparator />

              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={onDelete}
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <StatusBadge status={form.status} />

          <span className="text-xs text-muted-foreground">
            {form.updatedAt ? formatDate(form.updatedAt) : "Recently"}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Stat label="Views" value={form.analytics?.views ?? 0} />

          <Stat label="Responses" value={form.analytics?.submissions ?? 0} />
        </div>

        <div className="mt-4 flex gap-2">
          <Button  variant="outline" className="flex-1">
            <Link to={`/forms/${form._id}/edit`}>
              <Edit className="mr-2 h-4 w-4" />
              Edit
            </Link>
          </Button>

          <Button  variant="outline" size="icon">
            <Link to={`/forms/${form._id}/preview`}>
              <Eye className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

const StatusBadge = ({ status }: { status: FormItem["status"] }) => {
  const config = {
    draft: {
      label: "Draft",
      className: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    },

    published: {
      label: "Published",
      className: "bg-green-100 text-green-800 hover:bg-green-100",
    },

    archived: {
      label: "Archived",
      className: "bg-gray-100 text-gray-800 hover:bg-gray-100",
    },
  };

  const current = config[status];

  return (
    <Badge variant="secondary" className={current.className}>
      {current.label}
    </Badge>
  );
};

const Stat = ({ label, value }: { label: string; value: number }) => {
  return (
    <div className="rounded-lg bg-muted/50 p-3">
      <p className="text-xs text-muted-foreground">{label}</p>

      <p className="mt-1 text-lg font-semibold">{value.toLocaleString()}</p>
    </div>
  );
};

const EmptyForms = () => {
  return (
    <Card className="border-dashed">
      <CardContent className="flex min-h-[400px] flex-col items-center justify-center text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted">
          <FileText className="h-6 w-6 text-muted-foreground" />
        </div>

        <h2 className="mt-5 text-lg font-semibold">No forms yet</h2>

        <p className="mt-2 max-w-sm text-sm text-muted-foreground">
          Create your first form and start collecting responses.
        </p>

        <Button  className="mt-5">
          <Link to="/forms/create" className="flex items-center">
            <Plus className="mr-2 h-4 w-4" />
            Create Form
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
};

const formatDate = (date: string) => {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

export default FormsPage;
