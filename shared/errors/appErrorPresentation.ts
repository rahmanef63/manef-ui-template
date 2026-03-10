import { toast } from "@/components/ui/use-toast";
import { isConvexNetworkError } from "@/lib/convex/errors";
import {
  APP_ERROR_DEFINITIONS,
  getAppErrorDefinition,
  isAppErrorData,
  type AppErrorData,
  type AppErrorFeature,
} from "@manef/db/errors";
import { ConvexError } from "convex/values";

export type UiErrorFeature = AppErrorFeature | "settings";

export interface ErrorPresentation {
  code?: string;
  description: string;
  details?: string[];
  feature: UiErrorFeature;
  title: string;
}

export interface ErrorPresentationOptions {
  description?: string;
  feature?: UiErrorFeature;
  title?: string;
}

const DEFAULT_UNKNOWN_DESCRIPTION =
  "Aplikasi menerima kesalahan yang belum dipetakan. Periksa log backend untuk detail teknisnya.";

const FEATURE_DEFAULTS: Record<UiErrorFeature, Omit<ErrorPresentation, "code" | "details">> = {
  auth: {
    description:
      "Proses login belum bisa diselesaikan. Periksa kredensial, status perangkat, dan koneksi ke backend autentikasi.",
    feature: "auth",
    title: "Login belum berhasil diproses",
  },
  common: {
    description:
      "Aksi belum bisa diselesaikan. Coba lagi beberapa saat lagi atau periksa log aplikasi untuk detail teknis.",
    feature: "common",
    title: "Terjadi kesalahan saat memproses permintaan",
  },
  members: {
    description:
      "Perubahan anggota workspace belum berhasil disimpan. Periksa izin admin, alamat email tujuan, dan konfigurasi email backend.",
    feature: "members",
    title: "Aksi anggota belum berhasil",
  },
  messages: {
    description:
      "Pesan belum berhasil dikirim atau dimuat. Pastikan workspace aktif dan backend manef-db bisa dijangkau.",
    feature: "messages",
    title: "Aksi pesan belum berhasil",
  },
  settings: {
    description:
      "Perubahan pengaturan belum berhasil disimpan. Periksa validasi input dan koneksi ke backend manef-db.",
    feature: "settings",
    title: "Pengaturan belum berhasil diperbarui",
  },
  workspaces: {
    description:
      "Perubahan workspace belum berhasil diproses. Pastikan nama workspace valid dan akun Anda masih punya akses.",
    feature: "workspaces",
    title: "Aksi workspace belum berhasil",
  },
};

const LOCAL_ERROR_PRESENTATIONS: Record<string, ErrorPresentation> = {
  "1": {
    code: "1",
    description:
      "Email atau password yang Anda masukkan tidak cocok dengan akun yang terdaftar. Periksa lagi lalu coba login ulang.",
    feature: "auth",
    title: "Email atau password tidak valid",
  },
  device_approval_required: {
    code: "device_approval_required",
    description:
      "Perangkat ini belum pernah disetujui untuk akun Anda. Minta admin menyetujui perangkat ini sebelum login dilanjutkan.",
    feature: "auth",
    title: "Perangkat menunggu persetujuan",
  },
  device_revoked: {
    code: "device_revoked",
    description:
      "Perangkat ini pernah dicabut aksesnya. Anda perlu meminta approval perangkat baru agar sesi login bisa dibuat lagi.",
    feature: "auth",
    title: "Perangkat ini sudah dicabut",
  },
  email_domain_not_allowed: {
    code: "email_domain_not_allowed",
    description:
      "Domain email akun ini tidak termasuk domain yang diizinkan oleh policy autentikasi workspace.",
    feature: "auth",
    title: "Domain email tidak diizinkan",
  },
  service_unavailable: {
    code: "service_unavailable",
    description: getAppErrorDefinition("AUTH_SERVICE_UNAVAILABLE").description,
    feature: "auth",
    title: getAppErrorDefinition("AUTH_SERVICE_UNAVAILABLE").title,
  },
  user_blocked: {
    code: "user_blocked",
    description:
      "Akun ini diblokir oleh admin atau policy akses. Hubungi admin workspace jika akses ini seharusnya masih aktif.",
    feature: "auth",
    title: "Akun diblokir",
  },
};

function appendDetails(description: string, details?: string[]) {
  if (details == null || details.length === 0) {
    return description;
  }
  return `${description} Detail: ${details.join(" ")}`;
}

function getFeatureFallback(
  feature: UiErrorFeature = "common",
  options: ErrorPresentationOptions = {},
): ErrorPresentation {
  const fallback = FEATURE_DEFAULTS[feature];
  return {
    code: undefined,
    description: options.description ?? fallback.description,
    feature,
    title: options.title ?? fallback.title,
  };
}

function createBackendPresentation(
  data: AppErrorData,
  options: ErrorPresentationOptions = {},
): ErrorPresentation {
  return {
    code: data.code,
    description: appendDetails(
      options.description ?? data.description,
      data.details,
    ),
    details: data.details,
    feature: data.feature,
    title: options.title ?? data.title,
  };
}

export function getErrorPresentationFromCode(
  code: string,
  feature: UiErrorFeature = "common",
): ErrorPresentation {
  const normalizedCode = code.trim();
  if (normalizedCode.length === 0) {
    return getFeatureFallback(feature);
  }

  const localPresentation = LOCAL_ERROR_PRESENTATIONS[normalizedCode];
  if (localPresentation) {
    return localPresentation;
  }

  const backendCode = normalizedCode.toUpperCase();
  if (backendCode in APP_ERROR_DEFINITIONS) {
    return createBackendPresentation({
      code: backendCode,
      ...getAppErrorDefinition(backendCode),
    });
  }

  return {
    ...getFeatureFallback(feature),
    code: normalizedCode,
  };
}

export function resolveErrorPresentation(
  error: unknown,
  options: ErrorPresentationOptions = {},
): ErrorPresentation {
  const feature = options.feature ?? "common";
  const fallback = getFeatureFallback(feature, options);

  if (typeof error === "string") {
    const presentation = getErrorPresentationFromCode(error, feature);
    return {
      ...presentation,
      description: options.description ?? presentation.description,
      title: options.title ?? presentation.title,
    };
  }

  if (error instanceof ConvexError) {
    if (isAppErrorData(error.data)) {
      return createBackendPresentation(error.data, options);
    }

    if (typeof error.data === "string" && error.data.trim().length > 0) {
      return {
        ...fallback,
        title: options.title ?? error.data,
      };
    }
  }

  if (error instanceof Error) {
    const explicitCode =
      "code" in error && typeof error.code === "string" ? error.code : undefined;
    if (explicitCode) {
      const presentation = getErrorPresentationFromCode(explicitCode, feature);
      return {
        ...presentation,
        description: options.description ?? presentation.description,
        title: options.title ?? presentation.title,
      };
    }

    if (LOCAL_ERROR_PRESENTATIONS[error.message]) {
      const presentation = LOCAL_ERROR_PRESENTATIONS[error.message];
      return {
        ...presentation,
        description: options.description ?? presentation.description,
        title: options.title ?? presentation.title,
      };
    }

    if (isConvexNetworkError(error)) {
      return {
        ...fallback,
        description:
          options.description ??
          "Koneksi ke backend manef-db sedang bermasalah. Periksa domain ggdb, sertifikat TLS, dan status deploy Dokploy sebelum mencoba lagi.",
        title: options.title ?? "Layanan backend belum bisa dijangkau",
      };
    }

    const normalizedMessage = error.message.trim();
    if (normalizedMessage.length > 0) {
      return {
        ...fallback,
        description:
          options.description ??
          `${fallback.description} Detail teknis: ${normalizedMessage}`,
        title: options.title ?? fallback.title,
      };
    }
  }

  return fallback;
}

export function showErrorToast(
  error: unknown,
  options: ErrorPresentationOptions = {},
) {
  const presentation = resolveErrorPresentation(error, options);
  toast({
    description: presentation.description,
    title: presentation.title,
    variant: "destructive",
  });
  console.error(error);
  return presentation;
}

export function getBackendErrorPresentation(code: string) {
  const backendCode = code.toUpperCase();
  if (!(backendCode in APP_ERROR_DEFINITIONS)) {
    return {
      code: backendCode,
      description: DEFAULT_UNKNOWN_DESCRIPTION,
      feature: "common" as const,
      title: "Terjadi kesalahan",
    };
  }

  return createBackendPresentation({
    code: backendCode,
    ...getAppErrorDefinition(backendCode),
  });
}
