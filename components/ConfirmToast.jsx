// components/ConfirmToast.jsx
"use client";

import { toast } from "react-toastify";

export function confirmToast(message, onConfirm, onCancel) {
  let confirmed = false;
  let cancelled = false;

  const toastId = toast(
    ({ closeToast }) => (
      <div>
        <p className="mb-3 font-medium">{message}</p>
        <div className="flex gap-2 justify-end">
          <button
            type="button"
            onClick={() => {
              cancelled = true;
              onCancel?.();
              closeToast();
            }}
            className="px-3 py-1 rounded-md bg-gray-200 hover:bg-gray-300 text-gray-800 text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              confirmed = true;
              onConfirm?.();
              closeToast();
            }}
            className="px-3 py-1 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    ),
    {
      position: "top-center",
      autoClose: false,
      closeOnClick: false,
      draggable: false,
      closeButton: false,
      onClose: () => {
        // Only fire onCancel if user didn't already cancel or confirm
        if (!confirmed && !cancelled) {
          onCancel?.();
        }
      },
    }
  );

  return toastId;
}