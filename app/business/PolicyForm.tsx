"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export function PolicyForm({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="
          w-full
          max-w-full
          md:w-[75vw]
          md:max-w-[75vw]
          md:h-[70vh]
          md:max-h-[70vh]
          overflow-y-auto
          rounded-2xl 
          p-6 md:p-12
        "
      >
        <DialogHeader>
          <DialogTitle className="text-2xl md:text-3xl font-bold text-gray-800">
            Car Park System Policy
          </DialogTitle>
        </DialogHeader>

        <div
          className="
            mt-6 
            grid md:grid-cols-2 gap-8 md:gap-12
            text-base md:text-lg 
            text-gray-700 
            leading-relaxed
          "
        >
          <section>
            <h3 className="font-semibold mb-2 text-lg md:text-xl">📌 General Requirements</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Provide truthful and updated information about your car park.</li>
              <li>Keep your profile information up to date at all times.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2 text-lg md:text-xl">🔐 Safety & Security</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Ensure your car park is well-lit and secure.</li>
              <li>Display clear emergency contact info and operating hours.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2 text-lg md:text-xl">💲 Pricing & Payments</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Prices must be transparent for all customers.</li>
              <li>Handle payments and refunds following consumer rights.</li>
            </ul>
          </section>

          <section>
            <h3 className="font-semibold mb-2 text-lg md:text-xl">🤝 Customer Service</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Respond quickly and politely to all customer questions.</li>
              <li>Provide clear support channels for complaints.</li>
            </ul>
          </section>

          <section className="md:col-span-2">
            <h3 className="font-semibold mb-2 text-lg md:text-xl">✅ Agreement</h3>
            <p>
              By registering, you confirm you have read, understood and agree to follow all the
              above policies. Non-compliance may lead to account suspension or legal consequences.
            </p>
          </section>
        </div>

        <DialogFooter className="mt-8">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="w-full md:w-auto"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
