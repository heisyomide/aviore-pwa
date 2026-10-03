"use client";

import { useCallback, useEffect, useState } from "react";

import { useAuth } from "@/src/context/AuthContext";

import { PaymentsService } from "../services/payment.services";

import type {
  Payment,
  PaymentDetails,
  PaymentSummary,
} from "../types";

export function usePayments() {
  const { token } = useAuth();

  const [loading, setLoading] = useState(true);

  const [payments, setPayments] = useState<PaymentDetails[]>([]);

  const [summary, setSummary] =
    useState<PaymentSummary | null>(null);

  const [selectedPayment, setSelectedPayment] =
    useState<PaymentDetails | null>(null);

  const [drawerOpen, setDrawerOpen] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const refresh = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      const data =
        await PaymentsService.getPayments(token);

      setPayments(data.payments);

      setSummary(data.summary);

      setError(null);
    } catch (err) {
      console.error(err);

      setError("Unable to load payments.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  async function openPayment(
    paymentId: string,
  ) {
    if (!token) return;

    try {
      const payment =
        await PaymentsService.getPayment(
          paymentId,
          token,
        );

      setSelectedPayment(payment);

      setDrawerOpen(true);
    } catch (err) {
      console.error(err);
    }
  }

  function closeDrawer() {
    setDrawerOpen(false);

    setSelectedPayment(null);
  }

  useEffect(() => {
    refresh();
  }, [refresh]);

  return {
    loading,
    error,

    payments,
    summary,

    drawerOpen,
    selectedPayment,

    refresh,
    openPayment,
    closeDrawer,
  };
}