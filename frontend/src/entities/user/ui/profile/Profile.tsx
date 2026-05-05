import { useState, useRef } from "react";
import { notification } from "antd";
import { useIntl } from "react-intl";

import { profileApi } from "@/shared/api/profileApi";
import { validateImageFile } from "@/shared/lib/validators/fileValidator";
import LoadingSpinner from "@/shared/ui/loading/LoadingSpinner";

import { useAuth } from "../../AuthContext";

import styles from "./Profile.module.css";
type ChangeEvent = React.ChangeEvent<HTMLInputElement>;

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

export default function Profile() {
  const { user, isLoading, logout, updateUserAvatar } = useAuth();
  const intl = useIntl();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [api, contextHolder] = notification.useNotification();

  const handleAvatarUpload = async (event: ChangeEvent) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const validation = validateImageFile(file);

    if (!validation.valid) {
      api.error({
        message: intl.formatMessage({ id: "profile.file.error.title" }),
        description:
          validation.error ||
          intl.formatMessage({ id: "profile.file.error.description" }),
      });
      return;
    }

    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append("avatar", file);

      const response = await profileApi.uploadAvatar(formData);

      if (response.data?.avatarUrl) {
        updateUserAvatar(response.data.avatarUrl);
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      api.error({
        message: intl.formatMessage({ id: "profile.upload.error.title" }),
        description:
          apiError.response?.data?.message ||
          intl.formatMessage({ id: "profile.upload.error.description" }),
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteAvatar = async () => {
    if (
      !window.confirm(
        intl.formatMessage({ id: "profile.avatar.delete.confirm" }),
      )
    ) {
      return;
    }

    setIsUploading(true);

    try {
      await profileApi.deleteAvatar();
      updateUserAvatar("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error: unknown) {
      const apiError = error as ApiError;
      api.error({
        message: intl.formatMessage({ id: "profile.delete.error.title" }),
        description:
          apiError.response?.data?.message ||
          intl.formatMessage({ id: "profile.delete.error.description" }),
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageError = (
    e: React.SyntheticEvent<HTMLImageElement, Event>,
  ) => {
    const target = e.target as HTMLImageElement;
    target.style.display = "none";
    const parent = target.parentElement;

    if (parent && user) {
      parent.innerHTML = user.username?.charAt(0).toUpperCase() || "?";
    }
  };

  const getAvatarUrl = (avatar: string | null | undefined) => {
    if (!avatar) return "";
    return avatar;
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return (
      <div className={styles.profileEmpty}>
        <p>{intl.formatMessage({ id: "profile.no.user.data" })}</p>
      </div>
    );
  }

  return (
    <>
      {contextHolder}
      <div className={styles.profileContainer}>
        <div className={styles.profileHeader}>
          <div className={styles.avatarContainer}>
            <div className={styles.profileAvatar}>
              {user.avatar ? (
                <img
                  src={getAvatarUrl(user.avatar)}
                  alt={user.username}
                  className={styles.avatarImage}
                  onError={handleImageError}
                />
              ) : (
                user.username?.charAt(0).toUpperCase() || "?"
              )}

              {isUploading && (
                <div className={styles.avatarOverlay}>
                  <LoadingSpinner size="small" />
                </div>
              )}
            </div>

            <div className={styles.avatarActions}>
              <label className={styles.avatarUploadLabel}>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                  onChange={handleAvatarUpload}
                  disabled={isUploading}
                  className={styles.avatarInput}
                  key={user.avatar ? "has-avatar" : "no-avatar"}
                />
                <span
                  className={styles.avatarUploadIcon}
                  title={intl.formatMessage({
                    id: "profile.avatar.upload.title",
                  })}
                >
                  📷
                </span>
              </label>

              {user.avatar && (
                <button
                  onClick={handleDeleteAvatar}
                  className={styles.avatarDeleteButton}
                  disabled={isUploading}
                  title={intl.formatMessage({
                    id: "profile.avatar.delete.title",
                  })}
                >
                  🗑️
                </button>
              )}
            </div>
          </div>

          <div className={styles.profileInfo}>
            <h3 className={styles.profileUsername}>{user.username}</h3>
            <p className={styles.profileEmail}>{user.email}</p>
          </div>
        </div>

        <div className={styles.profileDetails}>
          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>
              {intl.formatMessage({ id: "profile.user.id.label" })}
            </span>
            <span className={styles.detailValue}>{user.id}</span>
          </div>

          <div className={styles.detailItem}>
            <span className={styles.detailLabel}>
              {intl.formatMessage({ id: "profile.joined.label" })}
            </span>
            <span className={styles.detailValue}>
              {user.createdAt
                ? intl.formatDate(user.createdAt, {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "N/A"}
            </span>
          </div>
        </div>

        <button onClick={logout} className={styles.logoutButton}>
          {intl.formatMessage({ id: "profile.logout.button" })}
        </button>
      </div>
    </>
  );
}
