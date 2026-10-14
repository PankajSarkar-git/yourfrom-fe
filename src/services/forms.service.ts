import { api } from "../api/axios";
import type { FormFieldConfig } from "../components/FormBuilder/FormField";

export type FormStatus = "draft" | "published" | "archived";

export interface FormTheme {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
  borderRadius?: number;
  fontFamily?: string;
}

export interface FormSettings {
  collectEmail?: boolean;
  requireLogin?: boolean;
  allowMultipleResponses?: boolean;
  shuffleQuestions?: boolean;
  showProgressBar?: boolean;
  saveDraft?: boolean;
  captcha?: boolean;
  isPublic?: boolean;
  passwordProtected?: boolean;
  password?: string;
}

export interface FormSuccessPage {
  title?: string;
  message?: string;
  redirectUrl?: string;
}

export interface FormPayload {
  _id?: string;
  title: string;
  description?: string;
  slug?: string;
  coverImage?: string;
  logo?: string;
  status: FormStatus;
  primaryColor?: string;
  theme?: FormTheme;
  settings?: FormSettings;
  successPage?: FormSuccessPage;
  fields: FormFieldConfig[];
  analytics?: {
    views?: number;
    submissions?: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

const LOCAL_STORAGE_KEY = "yourform_saved_forms";

const getLocalForms = (): FormPayload[] => {
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error("Failed to parse local forms:", error);
    return [];
  }
};

const saveLocalForms = (forms: FormPayload[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(forms));
  } catch (error) {
    console.error("Failed to save local forms:", error);
  }
};

export const formsService = {
  createForm: async (data: FormPayload): Promise<{ data: { form: FormPayload; fields?: FormFieldConfig[] } }> => {
    try {
      const response = await api.post("/api/v1/forms", data);
      const createdForm = response.data?.data?.form || response.data?.data || response.data;
      const createdFields = response.data?.data?.fields || data.fields;

      // Sync to localStorage
      const localForms = getLocalForms();
      const updatedLocal = [{ ...data, ...createdForm, fields: createdFields }, ...localForms.filter((f) => f._id !== createdForm._id)];
      saveLocalForms(updatedLocal);

      return {
        data: {
          form: createdForm,
          fields: createdFields,
        },
      };
    } catch (apiError) {
      console.warn("Backend API error or unauthenticated, falling back to local storage:", apiError);
      
      const newId = `form_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
      const savedForm: FormPayload = {
        ...data,
        _id: newId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        analytics: { views: 0, submissions: 0 },
      };

      const localForms = getLocalForms();
      saveLocalForms([savedForm, ...localForms]);

      return {
        data: {
          form: savedForm,
          fields: data.fields,
        },
      };
    }
  },

  getForms: async (): Promise<{ data: FormPayload[] }> => {
    try {
      const response = await api.get("/api/v1/forms");
      const forms = response.data?.data || response.data || [];
      if (Array.isArray(forms) && forms.length > 0) {
        saveLocalForms(forms);
        return { data: forms };
      }
      // If server returned empty, check local storage
      const localForms = getLocalForms();
      if (localForms.length > 0) {
        return { data: localForms };
      }
      return { data: forms };
    } catch (apiError) {
      console.warn("Could not fetch forms from API, using local storage:", apiError);
      return { data: getLocalForms() };
    }
  },

  getFormById: async (id: string): Promise<{ data: { form: FormPayload; fields: FormFieldConfig[] } }> => {
    try {
      const response = await api.get(`/api/v1/forms/${id}`);
      const result = response.data?.data || response.data;
      if (result?.form) {
        return { data: { form: result.form, fields: result.fields || [] } };
      }
      if (result) {
        return { data: { form: result, fields: result.fields || [] } };
      }
    } catch (apiError) {
      console.warn(`Could not fetch form ${id} from API, checking local storage:`, apiError);
    }

    const localForms = getLocalForms();
    const found = localForms.find((f) => f._id === id);
    if (found) {
      return {
        data: {
          form: found,
          fields: found.fields || [],
        },
      };
    }

    throw new Error("Form not found");
  },

  updateForm: async (id: string, data: Partial<FormPayload>): Promise<{ data: { form: FormPayload; fields?: FormFieldConfig[] } }> => {
    try {
      const response = await api.put(`/api/v1/forms/${id}`, data);
      const updatedForm = response.data?.data?.form || response.data?.data || response.data;
      const updatedFields = response.data?.data?.fields || data.fields;

      const localForms = getLocalForms();
      const nextLocal = localForms.map((f) => (f._id === id ? { ...f, ...updatedForm, fields: updatedFields || f.fields } : f));
      saveLocalForms(nextLocal);

      return {
        data: {
          form: updatedForm,
          fields: updatedFields,
        },
      };
    } catch (apiError) {
      console.warn("Backend API error on update, updating local storage:", apiError);
      const localForms = getLocalForms();
      let updatedForm: FormPayload | null = null;
      const nextLocal = localForms.map((f) => {
        if (f._id === id) {
          updatedForm = {
            ...f,
            ...data,
            updatedAt: new Date().toISOString(),
          } as FormPayload;
          return updatedForm;
        }
        return f;
      });

      if (!updatedForm) {
        updatedForm = {
          _id: id,
          title: data.title || "Untitled Form",
          status: data.status || "draft",
          fields: data.fields || [],
          ...data,
          updatedAt: new Date().toISOString(),
        } as FormPayload;
        nextLocal.push(updatedForm);
      }

      saveLocalForms(nextLocal);
      return {
        data: {
          form: updatedForm,
          fields: data.fields,
        },
      };
    }
  },

  deleteForm: async (id: string): Promise<void> => {
    try {
      await api.delete(`/api/v1/forms/${id}`);
    } catch (apiError) {
      console.warn("Backend API delete failed, deleting from local storage:", apiError);
    }

    const localForms = getLocalForms();
    saveLocalForms(localForms.filter((f) => f._id !== id));
  },
};
