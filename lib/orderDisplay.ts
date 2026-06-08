/** Fields captured at checkout and shown in staff/admin order views */
export type OrderDeliveryDetails = {
  delivery_location?: string | null;
  delivery_address?: string | null;
  delivery_city?: string | null;
  gift_message?: string | null;
  special_instructions?: string | null;
  recipient_name?: string | null;
  recipient_phone?: string | null;
  notes?: string | null;
};

export function getOrderDeliveryLocation(order: OrderDeliveryDetails): string | null {
  const location =
    order.delivery_location?.trim() ||
    order.delivery_city?.trim() ||
    null;
  return location || null;
}

export function getOrderGiftMessage(order: OrderDeliveryDetails): string | null {
  const msg = order.gift_message?.trim();
  return msg || null;
}

export function getOrderSpecialInstructions(order: OrderDeliveryDetails): string | null {
  const instructions = order.special_instructions?.trim();
  return instructions || null;
}

export function hasOrderDeliveryDetails(order: OrderDeliveryDetails): boolean {
  return Boolean(
    getOrderDeliveryLocation(order) ||
      getOrderGiftMessage(order) ||
      getOrderSpecialInstructions(order) ||
      order.recipient_name?.trim() ||
      order.recipient_phone?.trim()
  );
}

export type CheckoutOrderMetaInput = {
  delivery?: { location?: string; address?: string; instructions?: string | null };
  giftMessage?: string | null;
  recipient?: { name?: string; phone?: string };
};

export function buildCheckoutOrderMeta(
  orderData: CheckoutOrderMetaInput | null | undefined,
  overrides?: {
    address?: string;
    city?: string;
  }
) {
  const deliveryLocation =
    orderData?.delivery?.location?.trim() ||
    overrides?.city?.trim() ||
    "Nairobi";
  const deliveryAddress =
    overrides?.address?.trim() ||
    orderData?.delivery?.address?.trim() ||
    "To be confirmed";

  return {
    delivery_address: deliveryAddress,
    delivery_city: deliveryLocation,
    delivery_location: deliveryLocation,
    gift_message: orderData?.giftMessage?.trim() || null,
    special_instructions: orderData?.delivery?.instructions?.trim() || null,
    recipient_name: orderData?.recipient?.name?.trim() || null,
    recipient_phone: orderData?.recipient?.phone?.trim() || null,
  };
}
