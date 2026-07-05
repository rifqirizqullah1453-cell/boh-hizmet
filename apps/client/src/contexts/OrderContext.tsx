import { createContext, useContext, useCallback, type ReactNode } from 'react';
import { trpc } from '@/providers/trpc';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import type { ServiceType, OrderStatus, Order } from '@/types';

const OrderContext = createContext<ReturnType<typeof useOrderData> | null>(null);

export function useOrders() {
  const ctx = useContext(OrderContext);
  if (!ctx) throw new Error('useOrders must be used within OrderProvider');
  return ctx;
}

function mapStatus(s: string): OrderStatus {
  const m: Record<string, OrderStatus> = {
    PENDING: 'searching_worker',
    ACCEPTED: 'worker_found',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
  };
  return m[s] ?? 'searching_worker';
}

function mapOrder(o: any): Order {
  return {
    id: o.id,
    customerId: String(o.customerId),
    customerName: o.customerName || o.customer?.name || 'Customer',
    customerPhone: o.customerPhone || o.customer?.phone || '',
    workerId: o.workerId ? String(o.workerId) : undefined,
    workerName: o.workerName || o.worker?.name,
    workerPhone: o.workerPhone || o.worker?.phone,
    serviceType: o.serviceType as ServiceType,
    status: mapStatus(o.status),
    pickupAddress: o.pickupAddress,
    pickupLat: parseFloat(String(o.pickupLat)),
    pickupLng: parseFloat(String(o.pickupLng)),
    destinationAddress: o.destinationAddress,
    destinationLat: parseFloat(String(o.destinationLat)),
    destinationLng: parseFloat(String(o.destinationLng)),
    stops: o.stops ? JSON.parse(String(o.stops)) : undefined,
    notes: o.notes || '',
    price: o.price,
    distance: parseFloat(String(o.distance || '0')),
    paymentMethod: o.paymentMethod || 'cod',
    paymentStatus: o.paymentStatus || 'pending',
    cancelledBy: o.cancelledBy,
    cancelReason: o.cancelReason,
    customerRating: o.customerRating,
    customerReview: o.customerReview,
    workerRating: o.workerRating,
    workerReview: o.workerReview,
    workerLocation: o.workerLocation ? JSON.parse(String(o.workerLocation)) : undefined,
    isScheduled: o.isScheduled || false,
    scheduledAt: o.scheduledAt ? new Date(o.scheduledAt).getTime() : undefined,
    paidAt: o.paidAt ? new Date(o.paidAt).getTime() : undefined,
    createdAt: new Date(o.createdAt).getTime(),
    updatedAt: new Date(o.updatedAt || o.createdAt).getTime(),
    completedAt: o.completedAt ? new Date(o.completedAt).getTime() : undefined,
  };
}

function useOrderData() {
  const { userProfile } = useAuth();
  const { toast } = useToast();
  const utils = trpc.useUtils();

  const myOrdersQ = trpc.order.listMine.useQuery(
    { limit: 50 },
    { enabled: !!userProfile && userProfile.role !== 'worker' }
  );

  const myActiveQ = trpc.order.myActive.useQuery(undefined, {
    enabled: !!userProfile && userProfile.role === 'worker',
    refetchInterval: 5000,
  });

  const rawOrders = userProfile?.role === 'worker'
    ? (myActiveQ.data || [])
    : (myOrdersQ.data?.items || []);

  const orders: Order[] = rawOrders.map(mapOrder);

  const createMut = trpc.order.create.useMutation({
    onSuccess: () => {
      utils.order.listMine.invalidate();
      utils.order.myActive.invalidate();
    },
  });

  const acceptMut = trpc.order.accept.useMutation({
    onSuccess: () => {
      utils.order.myActive.invalidate();
      utils.order.listMine.invalidate();
    },
  });

  const updateStatusMut = trpc.order.updateStatus.useMutation({
    onSuccess: () => {
      utils.order.listMine.invalidate();
      utils.order.myActive.invalidate();
    },
  });

  const ratingMut = trpc.rating.submit.useMutation({
    onSuccess: () => utils.order.listMine.invalidate(),
  });

  const createOrder = useCallback(async (orderData: {
    serviceType: ServiceType;
    pickupAddress: string;
    pickupLat: number;
    pickupLng: number;
    destinationAddress: string;
    destinationLat: number;
    destinationLng: number;
    notes?: string;
    [key: string]: unknown;
  }) => {
    return await createMut.mutateAsync({
      serviceType: orderData.serviceType,
      pickupAddress: orderData.pickupAddress,
      pickupLat: orderData.pickupLat,
      pickupLng: orderData.pickupLng,
      destinationAddress: orderData.destinationAddress,
      destinationLat: orderData.destinationLat,
      destinationLng: orderData.destinationLng,
      notes: orderData.notes,
      stopCount: typeof orderData.stopCount === 'number' ? orderData.stopCount : 0,
    });
  }, [createMut]);

  const acceptOrder = useCallback(async (orderId: string) => {
    await acceptMut.mutateAsync({ orderId });
  }, [acceptMut]);

  const cancelOrder = useCallback(async (orderId: string, reason: string) => {
    await updateStatusMut.mutateAsync({ orderId, status: 'CANCELLED', cancelReason: reason });
  }, [updateStatusMut]);

  const rateOrder = useCallback(async (orderId: string, rating: number, review: string, _isCustomer: boolean) => {
    await ratingMut.mutateAsync({ orderId, stars: rating, comment: review || undefined });
    toast('Rating submitted!', 'success');
  }, [ratingMut, toast]);

  const markPaid = useCallback(async (_orderId: string) => {
    toast('Payment recorded', 'success');
  }, [toast]);

  const updateOrderStatus = useCallback(async (orderId: string, status: string) => {
    const backendStatus: Record<string, string> = {
      in_progress: 'IN_PROGRESS',
      completed: 'COMPLETED',
      cancelled: 'CANCELLED',
    };
    await updateStatusMut.mutateAsync({ orderId, status: (backendStatus[status] || status.toUpperCase()) as any });
  }, [updateStatusMut]);

  const updateWorkerLocation = useCallback(async (_orderId: string, _lat: number, _lng: number) => {}, []);
  const addOrderPhoto = useCallback(async (_orderId: string, _type: 'before' | 'after', _url: string) => {}, []);

  const refreshOrders = useCallback(() => {
    utils.order.listMine.invalidate();
    utils.order.myActive.invalidate();
  }, [utils]);

  const sendEmergency = useCallback((_orderId: string, message: string) => {
    console.log('EMERGENCY:', message);
    toast('Emergency alert sent!', 'error');
  }, [toast]);

  return {
    orders,
    createOrder,
    acceptOrder,
    cancelOrder,
    rateOrder,
    markPaid,
    updateOrderStatus,
    updateWorkerLocation,
    addOrderPhoto,
    refreshOrders,
    sendEmergency,
    isLoading: myOrdersQ.isLoading || myActiveQ.isLoading,
  };
}

export function OrderProvider({ children }: { children: ReactNode }) {
  const data = useOrderData();
  return <OrderContext.Provider value={data}>{children}</OrderContext.Provider>;
}
