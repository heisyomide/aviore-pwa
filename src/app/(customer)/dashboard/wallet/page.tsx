"use client";

import PaymentHeader from "./components/PaymentHeader";
import PaymentSummaryCard from "./components/PaymentSummaryCard";
import PaymentHistory from "./components/PaymentHistory";
import PaymentDetailsDrawer from "./components/PaymentDetailsDrawer";
import EmptyPayment from "./components/EmptyPayments";

import { usePayments } from "./hooks/usePayments";

export default function PaymentsPage() {
  const {
    loading,
    payments,
    summary,

    drawerOpen,
    selectedPayment,

    refresh,
    openPayment,
    closeDrawer,
  } = usePayments();

  if (loading) {
    return (
      <div className="flex h-[70vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-3 border-neutral-300 border-t-black" />
      </div>
    );
  }

  return (
    <div className="space-y-4 px-3 sm:px-4 text-sm">
      <PaymentHeader
        onRefresh={refresh}
      />

      {summary && (
        <PaymentSummaryCard
          summary={summary}
        />
      )}

      {(payments ?? []).length === 0 ? (
        <EmptyPayment />
      ) : (
        <PaymentHistory
          payments={payments ?? []}
          onOpen={openPayment}
        />
      )}

      <PaymentDetailsDrawer
        open={drawerOpen}
        payment={selectedPayment}
        onClose={closeDrawer}
      />
    </div>
  );
}