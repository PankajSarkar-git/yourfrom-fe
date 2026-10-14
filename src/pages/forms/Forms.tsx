import React from "react";
import {
  Archive,
  ArrowRight,
  BarChart3,
  Check,
  Clock,
  Copy,
  Edit3,
  ExternalLink,
  Eye,
  FileCheck2,
  FileText,
  Filter,
  Globe,
  LayoutGrid,
  List,
  Loader2,
  MoreVertical,
  Plus,
  RefreshCw,
  Search,
  Share2,
  Sparkles,
  Trash2,
  TrendingUp,
  Users,
  X,
  Zap,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

import { Button } from "../../components/ui/button";
import { Badge } from "../../components/ui/badge";
import { Input } from "../../components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../components/ui/dropdown-menu";
import { formsService, type FormPayload, type FormStatus } from "../../services/forms.service";
import { showToast } from "../../components/toast";

type FilterStatus = "all" | "published" | "draft" | "archived";
type SortOption = "updated" | "newest" | "title" | "responses";
type ViewMode = "grid" | "table";

export const FormsPage: React.FC = () => {
  const navigate = useNavigate();

  const [forms, setForms] = React.useState<FormPayload[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [searchQuery, setSearchQuery] = React.useState("");
  const [statusFilter, setStatusFilter] = React.useState<FilterStatus>("all");
  const [sortBy, setSortBy] = React.useState<SortOption>("updated");
  const [viewMode, setViewMode] = React.useState<ViewMode>("grid");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const loadForms = React.useCallback(async () => {
    try {
      setLoading(true);
      const response = await formsService.getForms();
      setForms((response.data as FormPayload[]) || []);
    } catch (error) {
      console.error("Failed to load forms:", error);
      showToast.error("Failed to load forms");
    } finally {
      setLoading(false);
    }
  }, []);

  React.useEffect(() => {
    loadForms();
  }, [loadForms]);

  const handleDeleteForm = async (formId?: string) => {
    if (!formId) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this form? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      await formsService.deleteForm(formId);
      setForms((current) => current.filter((form) => form._id !== formId));
      showToast.success("Form deleted successfully");
    } catch (error) {
      console.error("Failed to delete form:", error);
      showToast.error("Failed to delete form");
    }
  };

  const handleDuplicateForm = async (form: FormPayload) => {
    try {
      const duplicateData: Omit<FormPayload, "_id"> = {
        ...form,
        title: `${form.title || "Form"} (Copy)`,
        status: "draft",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        analytics: { views: 0, submissions: 0 },
      };

      const res = await formsService.createForm(duplicateData);
      const created = res.data.form;
      setForms((prev) => [created, ...prev]);
      showToast.success("Form duplicated as draft!");
    } catch (error) {
      console.error("Failed to duplicate form:", error);
      showToast.error("Failed to duplicate form");
    }
  };

  const handleToggleStatus = async (form: FormPayload) => {
    if (!form._id) return;
    const nextStatus: FormStatus =
      form.status === "published" ? "draft" : "published";

    try {
      await formsService.updateForm(form._id, { status: nextStatus });
      setForms((prev) =>
        prev.map((f) => (f._id === form._id ? { ...f, status: nextStatus } : f))
      );
      showToast.success(
        nextStatus === "published" ? "Form published live!" : "Form moved to draft"
      );
    } catch (error) {
      console.error("Failed to update status:", error);
      showToast.error("Failed to change form status");
    }
  };

  const handleCopyLink = (form: FormPayload) => {
    const url = `${window.location.origin}/forms/${form._id || "preview"}/preview`;
    navigator.clipboard.writeText(url);
    if (form._id) {
      setCopiedId(form._id);
      setTimeout(() => setCopiedId(null), 2000);
    }
    showToast.success("Public share link copied to clipboard!");
  };

  // Quick Starter Templates
  const handleCreateFromTemplate = async (templateName: string, category: string) => {
    const templateFields = [
      {
        _id: `tpl_${Date.now()}_1`,
        name: "full_name",
        label: "Full Name",
        type: "text",
        placeholder: "John Doe",
        required: true,
        order: 0,
      },
      {
        _id: `tpl_${Date.now()}_2`,
        name: "email",
        label: "Email Address",
        type: "email",
        placeholder: "john@example.com",
        required: true,
        order: 1,
      },
      {
        _id: `tpl_${Date.now()}_3`,
        name: "feedback",
        label: "Your Message or Feedback",
        type: "textarea",
        placeholder: "Share your thoughts with us...",
        required: false,
        order: 2,
      },
    ];

    try {
      const res = await formsService.createForm({
        title: templateName,
        description: `Pre-configured ${category.toLowerCase()} template ready for immediate response collection.`,
        status: "published",
        primaryColor: "#2563eb",
        fields: templateFields,
      });

      const newForm = res.data.form;
      showToast.success(`${templateName} created!`);
      navigate(`/forms/${newForm._id}/edit`);
    } catch (err) {
      console.error("Template creation failed:", err);
      showToast.error("Failed to create template");
    }
  };

  // Metrics computation
  const totalForms = forms.length;
  const publishedForms = forms.filter((f) => f.status === "published").length;
  const totalSubmissions = forms.reduce(
    (acc, f) => acc + (f.analytics?.submissions ?? 0),
    0
  );
  const totalViews = forms.reduce(
    (acc, f) => acc + (f.analytics?.views ?? 0),
    0
  );

  // Filtered & Sorted forms
  const filteredForms = React.useMemo(() => {
    return forms
      .filter((form) => {
        if (statusFilter !== "all" && form.status !== statusFilter) {
          return false;
        }
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchTitle = form.title?.toLowerCase().includes(q);
          const matchDesc = form.description?.toLowerCase().includes(q);
          const matchSlug = form.slug?.toLowerCase().includes(q);
          return matchTitle || matchDesc || matchSlug;
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === "newest") {
          return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
        }
        if (sortBy === "title") {
          return (a.title || "").localeCompare(b.title || "");
        }
        if (sortBy === "responses") {
          return (b.analytics?.submissions ?? 0) - (a.analytics?.submissions ?? 0);
        }
        // Default: "updated"
        return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
      });
  }, [forms, statusFilter, searchQuery, sortBy]);

  return (
    <div className="min-h-screen bg-muted/20 pb-16">
      {/* Top Banner / Hero Header */}
      <div className="border-b bg-background/80 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
          {/* Main Title Row */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                  My Forms
                </h1>
                <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary">
                  {forms.length}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Build, manage, preview, and collect responses with your customized forms.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              <Button
                variant="outline"
                size="sm"
                onClick={loadForms}
                disabled={loading}
                className="gap-1.5 rounded-xl text-xs h-9"
                title="Refresh form list"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>

              <Button
                size="sm"
                onClick={() => navigate("/forms/create")}
                className="gap-2 rounded-xl h-9 px-4 font-semibold shadow-md shadow-primary/20 text-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Create Form</span>
              </Button>
            </div>
          </div>

          {/* Quick Metrics KPI Bar */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 pt-2">
            <div className="rounded-2xl border bg-card/60 p-4 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Total Forms</span>
                <FileText className="h-4 w-4 text-blue-500" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {totalForms}
              </p>
              <p className="text-[11px] text-muted-foreground">Created across workspaces</p>
            </div>

            <div className="rounded-2xl border bg-card/60 p-4 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Active & Live</span>
                <Globe className="h-4 w-4 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-emerald-600 dark:text-emerald-400 flex items-center gap-2">
                <span>{publishedForms}</span>
                {publishedForms > 0 && (
                  <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                )}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {totalForms > 0
                  ? `${Math.round((publishedForms / totalForms) * 100)}% published`
                  : "0% published"}
              </p>
            </div>

            <div className="rounded-2xl border bg-card/60 p-4 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Total Responses</span>
                <Users className="h-4 w-4 text-purple-500" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {totalSubmissions.toLocaleString()}
              </p>
              <p className="text-[11px] text-muted-foreground">Completed submissions</p>
            </div>

            <div className="rounded-2xl border bg-card/60 p-4 shadow-2xs space-y-1">
              <div className="flex items-center justify-between text-muted-foreground">
                <span className="text-xs font-medium">Total Page Views</span>
                <TrendingUp className="h-4 w-4 text-amber-500" />
              </div>
              <p className="text-2xl font-bold tracking-tight text-foreground">
                {totalViews.toLocaleString()}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {totalViews > 0
                  ? `${Math.round((totalSubmissions / totalViews) * 100)}% conversion`
                  : "Awaiting views"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Workspace */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        {/* Filter, Search & Controls Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center overflow-x-auto rounded-xl border bg-card p-1 shadow-2xs gap-1">
            <button
              type="button"
              onClick={() => setStatusFilter("all")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                statusFilter === "all"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              All ({forms.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("published")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                statusFilter === "published"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Published ({forms.filter((f) => f.status === "published").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("draft")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                statusFilter === "draft"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              Draft ({forms.filter((f) => f.status === "draft").length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter("archived")}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold transition-all shrink-0 ${
                statusFilter === "archived"
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              Archived ({forms.filter((f) => f.status === "archived").length})
            </button>
          </div>

          {/* Right: Search, Sort & View Mode */}
          <div className="flex items-center gap-2.5 flex-wrap">
            {/* Search Box */}
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground pointer-events-none" />
              <Input
                type="text"
                placeholder="Search forms..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-8 pr-7 text-xs rounded-xl bg-card border-border/70 shadow-2xs"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
            </div>

            {/* Sort Selector */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-9 rounded-xl border border-border/70 bg-card px-3 text-xs font-medium text-foreground shadow-2xs outline-none focus:border-primary transition-colors cursor-pointer"
            >
              <option value="updated">Recently Updated</option>
              <option value="newest">Newest First</option>
              <option value="title">Alphabetical (A-Z)</option>
              <option value="responses">Most Responses</option>
            </select>

            {/* View Mode Toggle */}
            <div className="flex items-center rounded-xl border bg-card p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "grid"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Grid view"
              >
                <LayoutGrid className="h-3.5 w-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode("table")}
                className={`p-1.5 rounded-lg transition-all ${
                  viewMode === "table"
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="Table view"
              >
                <List className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Loading State Skeleton */}
        {loading && (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="rounded-3xl border bg-card p-6 shadow-xs animate-pulse space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="h-10 w-10 rounded-xl bg-muted" />
                  <div className="h-5 w-16 rounded-full bg-muted" />
                </div>
                <div className="space-y-2">
                  <div className="h-5 w-3/4 rounded-md bg-muted" />
                  <div className="h-4 w-1/2 rounded-md bg-muted" />
                </div>
                <div className="h-12 rounded-xl bg-muted/60" />
                <div className="h-9 rounded-xl bg-muted" />
              </div>
            ))}
          </div>
        )}

        {/* Empty Forms State */}
        {!loading && forms.length === 0 && (
          <EmptyFormsState onSelectTemplate={handleCreateFromTemplate} />
        )}

        {/* No Results from Search/Filter */}
        {!loading && forms.length > 0 && filteredForms.length === 0 && (
          <div className="rounded-3xl border border-dashed bg-card/60 p-12 text-center space-y-3">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
              <Search className="h-6 w-6" />
            </div>
            <h3 className="text-base font-bold text-foreground">No matching forms</h3>
            <p className="text-xs text-muted-foreground max-w-sm mx-auto">
              No forms matched your current query &quot;{searchQuery}&quot; or status filter.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setSearchQuery("");
                setStatusFilter("all");
              }}
              className="mt-2 text-xs rounded-xl"
            >
              Clear All Filters
            </Button>
          </div>
        )}

        {/* Grid View */}
        {!loading && filteredForms.length > 0 && viewMode === "grid" && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {filteredForms.map((form) => (
              <FormCard
                key={form._id}
                form={form}
                copied={copiedId === form._id}
                onDelete={() => handleDeleteForm(form._id)}
                onDuplicate={() => handleDuplicateForm(form)}
                onToggleStatus={() => handleToggleStatus(form)}
                onCopyLink={() => handleCopyLink(form)}
              />
            ))}
          </div>
        )}

        {/* Table / List View */}
        {!loading && filteredForms.length > 0 && viewMode === "table" && (
          <div className="rounded-2xl border bg-card shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b bg-muted/40 font-semibold text-muted-foreground">
                  <tr>
                    <th className="py-3.5 px-4">Form</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-center">Questions</th>
                    <th className="py-3.5 px-4 text-center">Views</th>
                    <th className="py-3.5 px-4 text-center">Submissions</th>
                    <th className="py-3.5 px-4">Last Updated</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {filteredForms.map((form) => {
                    const primaryColor =
                      form.theme?.primaryColor || form.primaryColor || "#2563eb";

                    return (
                      <tr
                        key={form._id}
                        className="hover:bg-muted/30 transition-colors group"
                      >
                        {/* Title & Info */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl font-bold"
                            >
                              <FileText className="h-4 w-4" />
                            </div>
                            <div className="min-w-0">
                              <Link
                                to={`/forms/${form._id}/edit`}
                                className="font-bold text-foreground hover:text-primary transition-colors truncate block max-w-xs"
                              >
                                {form.title || "Untitled Form"}
                              </Link>
                              <p className="text-[11px] text-muted-foreground truncate max-w-xs">
                                {form.description || "No description provided"}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Status */}
                        <td className="py-3.5 px-4">
                          <StatusBadge status={form.status} />
                        </td>

                        {/* Question Count */}
                        <td className="py-3.5 px-4 text-center font-medium">
                          {form.fields?.length ?? 0}
                        </td>

                        {/* Views */}
                        <td className="py-3.5 px-4 text-center font-medium">
                          {form.analytics?.views ?? 0}
                        </td>

                        {/* Submissions */}
                        <td className="py-3.5 px-4 text-center font-bold text-foreground">
                          {form.analytics?.submissions ?? 0}
                        </td>

                        {/* Updated At */}
                        <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                          {form.updatedAt ? formatDate(form.updatedAt) : "Recently"}
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/forms/${form._id}/edit`)}
                              className="h-7 px-2.5 text-xs rounded-lg gap-1"
                            >
                              <Edit3 className="h-3 w-3" />
                              Edit
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => navigate(`/forms/${form._id}/preview`)}
                              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                              title="Preview Form"
                            >
                              <Eye className="h-3.5 w-3.5" />
                            </Button>

                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleCopyLink(form)}
                              className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                              title="Copy Share Link"
                            >
                              {copiedId === form._id ? (
                                <Check className="h-3.5 w-3.5 text-emerald-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5" />
                              )}
                            </Button>

                            <DropdownMenu>
                              <DropdownMenuTrigger>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                                >
                                  <MoreVertical className="h-3.5 w-3.5" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-44 text-xs">
                                <DropdownMenuItem onClick={() => handleToggleStatus(form)}>
                                  <Globe className="mr-2 h-3.5 w-3.5" />
                                  {form.status === "published" ? "Unpublish Form" : "Publish Form"}
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleDuplicateForm(form)}>
                                  <Copy className="mr-2 h-3.5 w-3.5" />
                                  Duplicate
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => navigate("/responses")}>
                                  <BarChart3 className="mr-2 h-3.5 w-3.5" />
                                  View Responses
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={() => handleDeleteForm(form._id)}
                                >
                                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

interface FormCardProps {
  form: FormPayload;
  copied: boolean;
  onDelete: () => void;
  onDuplicate: () => void;
  onToggleStatus: () => void;
  onCopyLink: () => void;
}

const FormCard: React.FC<FormCardProps> = ({
  form,
  copied,
  onDelete,
  onDuplicate,
  onToggleStatus,
  onCopyLink,
}) => {
  const navigate = useNavigate();
  const primaryColor = form.theme?.primaryColor || form.primaryColor || "#2563eb";
  const questionCount = form.fields?.length ?? 0;

  return (
    <div className="group relative flex flex-col rounded-3xl border bg-card text-card-foreground shadow-2xs transition-all duration-200 hover:shadow-lg hover:border-primary/40 overflow-hidden">
      {/* Top Accent / Cover Banner */}
      {form.coverImage ? (
        <div className="relative h-24 w-full overflow-hidden bg-muted">
          <img
            src={form.coverImage}
            alt="Cover"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={(e) => {
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        </div>
      ) : (
        <div
          className="h-2 w-full transition-all"
          style={{ backgroundColor: primaryColor }}
        />
      )}

      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        {/* Card Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2.5 min-w-0">
              {form.logo ? (
                <div className="h-10 w-10 shrink-0 rounded-xl border bg-background p-1.5 shadow-2xs overflow-hidden">
                  <img
                    src={form.logo}
                    alt="Logo"
                    className="h-full w-full object-contain"
                    onError={(e) => {
                      (e.target as HTMLElement).style.display = "none";
                    }}
                  />
                </div>
              ) : (
                <div
                  style={{ backgroundColor: `${primaryColor}15`, color: primaryColor }}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl shadow-2xs font-bold"
                >
                  <FileText className="h-5 w-5" />
                </div>
              )}

              <div className="min-w-0">
                <StatusBadge status={form.status} />
              </div>
            </div>

            {/* Menu Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 rounded-lg text-muted-foreground hover:text-foreground opacity-70 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-44 text-xs">
                <DropdownMenuItem onClick={() => navigate(`/forms/${form._id}/edit`)}>
                  <Edit3 className="mr-2 h-3.5 w-3.5" />
                  Edit Form
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => navigate(`/forms/${form._id}/preview`)}>
                  <Eye className="mr-2 h-3.5 w-3.5" />
                  Preview
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onCopyLink}>
                  <Copy className="mr-2 h-3.5 w-3.5" />
                  Copy Share Link
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onDuplicate}>
                  <Sparkles className="mr-2 h-3.5 w-3.5 text-amber-500" />
                  Duplicate
                </DropdownMenuItem>

                <DropdownMenuItem onClick={onToggleStatus}>
                  <Globe className="mr-2 h-3.5 w-3.5 text-blue-500" />
                  {form.status === "published" ? "Unpublish Form" : "Publish Live"}
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  className="text-destructive focus:text-destructive"
                  onClick={onDelete}
                >
                  <Trash2 className="mr-2 h-3.5 w-3.5" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div>
            <Link
              to={`/forms/${form._id}/edit`}
              className="font-bold text-base text-foreground hover:text-primary transition-colors tracking-tight line-clamp-1"
            >
              {form.title || "Untitled Form"}
            </Link>

            <p className="mt-1 line-clamp-2 text-xs text-muted-foreground leading-relaxed">
              {form.description || "No description provided for this form."}
            </p>
          </div>
        </div>

        {/* Stats & Meta Section */}
        <div className="space-y-3 pt-2">
          <div className="grid grid-cols-3 gap-2 rounded-2xl bg-muted/30 p-2.5 text-center border border-border/50">
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Questions
              </p>
              <p className="mt-0.5 text-sm font-bold text-foreground">
                {questionCount}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Views
              </p>
              <p className="mt-0.5 text-sm font-bold text-foreground">
                {form.analytics?.views ?? 0}
              </p>
            </div>
            <div>
              <p className="text-[10px] uppercase font-bold text-muted-foreground tracking-wider">
                Responses
              </p>
              <p className="mt-0.5 text-sm font-bold text-primary">
                {form.analytics?.submissions ?? 0}
              </p>
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center gap-2 pt-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate(`/forms/${form._id}/edit`)}
              className="flex-1 rounded-xl text-xs font-semibold gap-1.5 h-8 border-border/70 hover:border-primary/50"
            >
              <Edit3 className="h-3.5 w-3.5" />
              Edit
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={() => navigate(`/forms/${form._id}/preview`)}
              className="rounded-xl h-8 w-8 text-muted-foreground hover:text-foreground"
              title="Preview Form"
            >
              <Eye className="h-3.5 w-3.5" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              onClick={onCopyLink}
              className="rounded-xl h-8 w-8 text-muted-foreground hover:text-foreground"
              title="Copy Public Link"
            >
              {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <Copy className="h-3.5 w-3.5" />
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatusBadge = ({ status = "draft" }: { status?: FormStatus }) => {
  if (status === "published") {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 border border-emerald-500/30">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
        Live
      </span>
    );
  }

  if (status === "archived") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-slate-500/15 px-2.5 py-0.5 text-[11px] font-bold text-slate-700 dark:text-slate-400 border border-slate-500/30">
        Archived
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 dark:text-amber-400 border border-amber-500/30">
      Draft
    </span>
  );
};

interface EmptyFormsStateProps {
  onSelectTemplate: (name: string, category: string) => void;
}

const EmptyFormsState: React.FC<EmptyFormsStateProps> = ({ onSelectTemplate }) => {
  const navigate = useNavigate();

  const templates = [
    {
      title: "Contact Us Form",
      category: "Customer Support",
      desc: "Gather user inquiries with Name, Email, and message inputs.",
      color: "#2563eb",
    },
    {
      title: "Customer Feedback",
      category: "Surveys",
      desc: "Collect user satisfaction ratings and detailed comments.",
      color: "#059669",
    },
    {
      title: "Event Registration",
      category: "Events",
      desc: "Sign up attendees and gather contact information easily.",
      color: "#7c3aed",
    },
  ];

  return (
    <div className="space-y-8 py-6">
      <div className="rounded-3xl border border-dashed bg-card/60 p-8 sm:p-12 text-center shadow-xs">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary shadow-xs">
          <Sparkles className="h-8 w-8" />
        </div>

        <h2 className="mt-5 text-xl font-extrabold tracking-tight text-foreground">
          No forms created yet
        </h2>

        <p className="mt-2 max-w-md mx-auto text-xs text-muted-foreground leading-relaxed">
          Create custom forms, surveys, and questionnaires in seconds. Start with a blank canvas or choose a starter template below.
        </p>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <Button
            onClick={() => navigate("/forms/create")}
            className="gap-2 rounded-xl px-5 font-semibold shadow-md shadow-primary/20 text-xs"
          >
            <Plus className="h-4 w-4" />
            Create Blank Form
          </Button>
        </div>
      </div>

      {/* Starter Template Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold text-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-amber-500" />
            Quick Starter Templates
          </h3>
          <span className="text-xs text-muted-foreground">Click to instantiate</span>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          {templates.map((tpl) => (
            <div
              key={tpl.title}
              onClick={() => onSelectTemplate(tpl.title, tpl.category)}
              className="group rounded-2xl border bg-card p-5 shadow-2xs hover:border-primary/50 hover:shadow-md transition-all cursor-pointer space-y-3"
            >
              <div className="flex items-center justify-between">
                <span
                  style={{ backgroundColor: `${tpl.color}15`, color: tpl.color }}
                  className="rounded-lg px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider"
                >
                  {tpl.category}
                </span>
                <ArrowRight className="h-4 w-4 text-muted-foreground opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
              </div>

              <div>
                <h4 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {tpl.title}
                </h4>
                <p className="mt-1 text-xs text-muted-foreground leading-relaxed">
                  {tpl.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
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
