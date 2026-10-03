'use client';

import { useEffect, useState } from 'react';

import WalletCard from './WalletCard';
import WalletHistory from './WalletHistory';
import WalletSkeleton from './WalletSkeleton';
import WithdrawModal from './WithdrawModal';
import EmptyWallet from './EmptyWallet';

import walletService from '../services/wallet.service';

import {
  WalletOverview as WalletOverviewType,
  WalletHistoryResponse,
} from '../types';

export default function WalletOverview() {
  const [wallet, setWallet] =
    useState<WalletOverviewType | null>(null);

  const [history, setHistory] =
    useState<WalletHistoryResponse | null>(null);

  const [loading, setLoading] = useState(true);

  const [withdrawOpen, setWithdrawOpen] =
    useState(false);

  const loadWallet = async () => {
    try {
      const [overview, walletHistory] =
        await Promise.all([
          walletService.getOverview(),
          walletService.getHistory(),
        ]);

      setWallet(overview);
      setHistory(walletHistory);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadWallet();
  }, []);

  if (loading) {
    return <WalletSkeleton />;
  }

  if (!wallet) {
    return <EmptyWallet />;
  }

  return (
    <>
      <div className="space-y-8">

        <WalletCard
          wallet={wallet}
          onWithdraw={() =>
            setWithdrawOpen(true)
          }
        />

        {history && (
          <WalletHistory
            transactions={history.transactions}
            
          />
        )}

      </div>

      <WithdrawModal
        open={withdrawOpen}
        onClose={() =>
          setWithdrawOpen(false)
        }
        wallet={wallet}
        onSuccess={() => {
          setWithdrawOpen(false);
          loadWallet();
        }}
      />
    </>
  );
}