import { getOrderDeliveryLocation, getOrderGiftMessage, getOrderSpecialInstructions } from "@/lib/orderDisplay";

type Props = {
  order: {
    delivery_location?: string | null;
    delivery_address?: string | null;
    delivery_city?: string | null;
    gift_message?: string | null;
    special_instructions?: string | null;
    recipient_name?: string | null;
    recipient_phone?: string | null;
    notes?: string | null;
  };
  className?: string;
};

function DetailBlock({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className={highlight ? "rounded-lg border border-brand-pink/30 bg-brand-pink/5 p-3" : undefined}>
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--staff-muted)] mb-1">
        {label}
      </p>
      <p className="text-sm whitespace-pre-wrap">{value}</p>
    </div>
  );
}

export function OrderDeliveryDetailsPanel({ order, className = "" }: Props) {
  const location = getOrderDeliveryLocation(order);
  const giftMessage = getOrderGiftMessage(order);
  const instructions = getOrderSpecialInstructions(order);
  const address = order.delivery_address?.trim() || null;
  const recipientName = order.recipient_name?.trim() || null;
  const recipientPhone = order.recipient_phone?.trim() || null;

  return (
    <div className={`space-y-3 ${className}`}>
      {location && <DetailBlock label="Delivery location" value={location} />}
      {address && <DetailBlock label="Delivery address" value={address} />}
      {(recipientName || recipientPhone) && (
        <DetailBlock
          label="Recipient"
          value={[recipientName, recipientPhone].filter(Boolean).join(" · ")}
        />
      )}
      {giftMessage && (
        <DetailBlock label="Message on card" value={giftMessage} highlight />
      )}
      {instructions && (
        <DetailBlock label="Delivery instructions" value={instructions} />
      )}
    </div>
  );
}

/** Admin panel variant — same fields, admin styling */
export function AdminOrderDeliveryDetails({ order }: Props) {
  const location = getOrderDeliveryLocation(order);
  const giftMessage = getOrderGiftMessage(order);
  const instructions = getOrderSpecialInstructions(order);
  const address = order.delivery_address?.trim() || null;
  const recipientName = order.recipient_name?.trim() || null;
  const recipientPhone = order.recipient_phone?.trim() || null;

  return (
    <div className="space-y-3">
      {location && (
        <p className="text-sm">
          <strong>Delivery location:</strong> {location}
        </p>
      )}
      {address && (
        <p className="text-sm">
          <strong>Address:</strong> {address}
        </p>
      )}
      {(recipientName || recipientPhone) && (
        <p className="text-sm">
          <strong>Recipient:</strong> {[recipientName, recipientPhone].filter(Boolean).join(" · ")}
        </p>
      )}
      {giftMessage && (
        <div className="rounded-lg border border-brand-pink/30 bg-brand-pink/5 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-500 mb-1">
            Message on card
          </p>
          <p className="text-sm whitespace-pre-wrap">{giftMessage}</p>
        </div>
      )}
      {instructions && (
        <div className="rounded-lg border border-brand-gray-200 bg-brand-gray-50 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-gray-500 mb-1">
            Delivery instructions
          </p>
          <p className="text-sm whitespace-pre-wrap">{instructions}</p>
        </div>
      )}
    </div>
  );
}
