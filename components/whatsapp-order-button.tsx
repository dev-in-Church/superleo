"use client";

import { FaWhatsapp } from "react-icons/fa";
import type { BakeryProduct } from "@/lib/types";
import { formatKES } from "@/lib/pricing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// Replace with your bakery's WhatsApp number, in international format, no "+" or spaces
const WHATSAPP_NUMBER = "254713616998";

export function buildWhatsAppLink(product: BakeryProduct) {
  const message = `Hello! I'd like to order:\n\n*${product.name}* - ${formatKES(product.price)}\n\nIs this available?`;
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}

export function WhatsAppOrderButton({
  product,
  className,
}: {
  product: BakeryProduct;
  className?: string;
}) {
  function handleClick() {
    window.open(buildWhatsAppLink(product), "_blank", "noopener,noreferrer");
  }

  return (
    <Button
      onClick={handleClick}
      className={cn(
        "w-full bg-[#25D366] text-white hover:bg-[#1ebe57] focus-visible:ring-[#25D366]",
        className,
      )}
    >
      <FaWhatsapp className="size-4" /> Order via WhatsApp
    </Button>
  );
}
