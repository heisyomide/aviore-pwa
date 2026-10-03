'use client';

import { useEffect, useState, useCallback } from "react";
import { ShipmentService } from "../services/shipments.service";
import { useAuth } from "@/src/context/AuthContext";
import { Shipment } from "../types";

export interface DashboardStats {
  active: number;
  inTransit: number;
  delivered: number;
}

export interface DashboardResponse {
  shipments: Shipment[];
  stats: DashboardStats;
}

export function useShipments() {
  const { token } = useAuth();

  const [loading, setLoading] = useState<boolean>(true);
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    active: 0,
    inTransit: 0,
    delivered: 0,
  });

  const loadDashboard = useCallback(async () => {
    if (!token) return;

    try {
      setLoading(true);

      const response = (await ShipmentService.getDashboard(
        token
      )) as DashboardResponse;

      setShipments(response.shipments || []);
      setStats(
        response.stats || {
          active: 0,
          inTransit: 0,
          delivered: 0,
        }
      );
    } catch (error) {
      console.error("Failed to load shipment dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  return {
    loading,
    shipments,
    stats,
    refresh: loadDashboard,
  };
}