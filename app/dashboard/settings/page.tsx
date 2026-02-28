"use client";

import { useState } from "react";

import Image from "next/image";
import { useRouter } from "next/navigation";

import { toast } from "sonner";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { AlertTriangle } from "lucide-react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserInfo,
  getUserInfo,
  deleteAccount,
  updateAccountInfo,
} from "@/data-service/mutations";
import { generateProfileImage } from "@/lib/utils";
import { InputGroup } from "@/components/input-group";

export default function SettingsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { data, status, refetch } = useQuery({
    staleTime: Infinity,
    queryFn: getUserInfo,
    queryKey: ["user"],
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const { mutate: deleteMyAccount, isPending: isDeleting } = useMutation({
    mutationFn: deleteAccount,

    onSuccess: () => {
      router.push("/");
    },

    onError: (error) => {
      toast.error(error.message);

      if (error.cause === 401) {
        return router.push("/");
      }
    },
  });

  const { mutate: updateMyAccountInfo, isPending: isUpdating } = useMutation({
    mutationFn: updateAccountInfo,

    onSuccess: async () => {
      toast.success("Account updated successfully");
      await queryClient.invalidateQueries({ queryKey: ["user"] });
    },

    onError: (error) => {
      toast.error(error.message);

      if (error.cause === 401) {
        return router.push("/");
      }
    },
  });

  function handleDeleteAccount() {
    deleteMyAccount();
  }

  function handleUpdateAccountInfo({ name }: { name: string }) {
    updateMyAccountInfo({ name });
  }

  return (
    <div className="space-y-6 font-mono w-full">
      {status === "pending" && <LoadingState />}

      {status === "success" && (
        <AccountInfo
          data={data}
          isDeleting={isDeleting}
          isUpdating={isUpdating}
          handleUpdateAccountInfo={handleUpdateAccountInfo}
        />
      )}

      <DeleteAccount
        isDeleting={isDeleting}
        isUpdating={isUpdating}
        showDeleteConfirm={showDeleteConfirm}
        handleDeleteAccount={handleDeleteAccount}
        setShowDeleteConfirm={setShowDeleteConfirm}
      />

      {status === "error" && <ErrorState onRetry={() => refetch()} />}
    </div>
  );
}

function AccountInfo({
  data,
  isUpdating,
  isDeleting,
  handleUpdateAccountInfo,
}: {
  data: UserInfo;
  isUpdating: boolean;
  isDeleting: boolean;
  handleUpdateAccountInfo: ({ name }: { name: string }) => void;
}) {
  const [name, setName] = useState(data.name);

  function handleCancelUpdate() {
    setName(data.name);
  }

  return (
    <Card className="p-6 bg-card border border-border shadow-none gap-y-6">
      <div className="space-y-0.5">
        <h2 className="text-3xl font-bold text-heading font-playfair tracking-tight">
          Account Information
        </h2>

        <p className="text-sm text-leading font-light">
          Manage your account information.
        </p>
      </div>

      <div className="space-y-6">
        <div>
          <div className="relative size-16 rounded-full overflow-hidden">
            <Image
              fill
              alt={"Avatar"}
              src={data?.picture || generateProfileImage(data.name)}
            />
          </div>
        </div>

        <InputGroup label="Name" showRequired={false}>
          <input
            id="name"
            type="text"
            value={name}
            minLength={3}
            maxLength={30}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded text-sm border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </InputGroup>

        <InputGroup label="Email" showRequired={false}>
          <input
            id="email"
            type="email"
            disabled
            value={data?.email}
            className="w-full px-3 py-2 border rounded text-sm border-border bg-muted text-muted-foreground cursor-not-allowed"
          />

          <p className="text-xs text-leading mt-2">Email cannot be changed.</p>
        </InputGroup>

        {name !== data.name && (
          <div className="flex gap-4 justify-end pt-4">
            <Button
              variant="secondary"
              onClick={handleCancelUpdate}
              className="font-medium flex-1"
            >
              Cancel
            </Button>

            <Button
              disabled={isUpdating || isDeleting}
              onClick={() => handleUpdateAccountInfo({ name })}
              className="primary-btn font-medium flex-1"
            >
              {isUpdating ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}

function DeleteAccount({
  isDeleting,
  isUpdating,
  showDeleteConfirm,
  handleDeleteAccount,
  setShowDeleteConfirm,
}: {
  isDeleting: boolean;
  isUpdating: boolean;
  showDeleteConfirm: boolean;
  handleDeleteAccount: () => void;
  setShowDeleteConfirm: (show: boolean) => void;
}) {
  return (
    <Card className="p-6 bg-destructive/5 border border-destructive/20 gap-y-4 shadow-none">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold font-playfair text-heading tracking-tight">
          Danger Zone
        </h2>

        <p className="text-sm text-leading">
          Permanently delete your account and all associated data. This action
          cannot be undone.
        </p>
      </div>

      {!showDeleteConfirm && (
        <Button
          variant="destructive"
          className="cursor-pointer"
          onClick={() => setShowDeleteConfirm(true)}
        >
          Delete Account
        </Button>
      )}

      {showDeleteConfirm && (
        <div className="space-y-4 p-4 bg-background border border-destructive/20 rounded">
          <p className="text-sm font-light text-heading">
            Are you sure you want to delete your account?
          </p>

          <p className="text-xs text-leading">
            This will permanently delete your account and all your data. This
            action cannot be undone.
          </p>

          <div className="flex gap-4">
            <Button
              variant={"secondary"}
              disabled={isDeleting}
              onClick={() => setShowDeleteConfirm(false)}
              className="font-medium flex-1"
            >
              Cancel
            </Button>

            <Button
              variant="destructive"
              className="font-medium flex-1"
              onClick={handleDeleteAccount}
              disabled={isDeleting || isUpdating}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}

function LoadingState() {
  return (
    <Card className="p-6 bg-card border border-border">
      <div className="animate-pulse space-y-4">
        <div className="h-6 bg-muted rounded w-1/3 mb-6"></div>
        <div className="space-y-6">
          <div>
            <div className="h-4 bg-muted rounded w-1/4 mb-3"></div>
            <div className="h-16 w-16 rounded-full bg-muted"></div>
          </div>
          <div>
            <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-muted rounded"></div>
          </div>
          <div>
            <div className="h-4 bg-muted rounded w-1/4 mb-2"></div>
            <div className="h-10 bg-muted/50 rounded"></div>
          </div>
        </div>
      </div>
    </Card>
  );
}

function ErrorState({ onRetry }: { onRetry: () => void }) {
  return (
    <Card className="p-6 bg-card border border-border shadow-none font-mono">
      <div className="text-center space-y-1">
        <AlertTriangle className="size-10 mx-auto" />

        <h3 className="text-xl md:text-3xl tracking-tighter font-playfair font-medium text-heading">
          Oops! Something went wrong...
        </h3>

        <p className="text-leading text-sm tracking-tight">
          We couldn&apos;t load your account details. Please try again.
        </p>

        <Button variant="secondary" onClick={onRetry} className="mt-4">
          Try Again
        </Button>
      </div>
    </Card>
  );
}
