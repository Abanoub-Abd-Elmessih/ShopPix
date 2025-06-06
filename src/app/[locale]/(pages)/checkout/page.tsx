"use client";
import { useTranslations } from "next-intl";
import { Heading } from "@/components/Heading";
import { CheckoutAddress } from "@/components/shared/checkout/CheckoutAddress";
import { PaymentMethod } from "@/components/shared/checkout/PaymentMethod";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Address as AddressType } from "@/types/AddressType";
import { LoaderPinwheel, Lock } from "lucide-react";
import { useGetCart } from "@/hooks/useCart";
import { Loader } from "@/components/Loader";
import { toast } from "@/hooks/use-toast";
import {
  useCreateCashOrder,
  useCreateOnlinePaymentOrder,
} from "@/hooks/useOrders";
import { useRouter } from "next/navigation";

const Checkout = () => {
  const t = useTranslations("Checkout");
  const [paymentMethod, setPaymentMethod] = useState<
    "OnlinePayment" | "CashOnDelivery" | null
  >(null);
  const [selectedAddress, setSelectedAddress] = useState<AddressType | null>(
    null
  );
  const { data: cartData, isLoading, isFetching } = useGetCart();
  const { mutate: createCashOrder, isPending: loadingCashOrder } =
    useCreateCashOrder();
  const {
    mutate: createOnlinePaymentOrder,
    isPending: loadingOnlinePaymentOrder,
  } = useCreateOnlinePaymentOrder();
  const router = useRouter();

  if (isLoading || isFetching) {
    return (
      <div className="flex items-center justify-center gap-3 text-3xl flex-1">
        <Loader /> {t("pleaseWait")}
      </div>
    );
  }

  const handlePlaceOrder = () => {
    if (!selectedAddress || !paymentMethod || !cartData?.cartId) {
      toast({
        title: t("failed"),
        description: t("pleaseSelectAddressAndPayment"),
        variant: "destructive",
      });
      return;
    }

    const baseUrl = window.location.origin;

    if (paymentMethod === "CashOnDelivery") {
      createCashOrder({
        data: selectedAddress,
        cartId: cartData?.data._id || "",
      });
      router.push("/allorders");
    } else {
      createOnlinePaymentOrder({
        data: selectedAddress,
        cartId: cartData.cartId,
        baseUrl,
      });
    }
  };

  return (
    <div className="container mx-auto pb-10">
      <div className="mb-6">
        <Heading
          title={t("secureCheckoutTitle")}
          description={t("secureCheckoutDescription")}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-5">
        {/* Left Column - Form Fields */}
        <div className="lg:w-2/3 space-y-6">
          {/* Address Selection */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-300">
              {t("shippingInformation")}
            </h2>
            <CheckoutAddress onSelect={setSelectedAddress} />
          </div>

          {/* Payment Method */}
          <div className="bg-white dark:bg-zinc-800 rounded-lg shadow p-6 border border-zinc-200 dark:border-zinc-700">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-300">
              {t("paymentMethod")}
            </h2>
            <PaymentMethod onSelect={setPaymentMethod} />
          </div>
        </div>

        {/* Right Column - Order Summary */}
        <div className="lg:w-1/3">
          <div className="bg-indigo-50 dark:bg-zinc-800 rounded-lg shadow p-6 sticky top-20 border border-indigo-100 dark:border-zinc-700">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700 dark:text-indigo-300">
              {t("orderSummary")}
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between pb-4 border-b border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-600 dark:text-zinc-300">
                  {t("items")}
                </span>
                <span>{cartData?.numOfCartItems}</span>
              </div>

              <div className="flex justify-between pb-4 border-b border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-600 dark:text-zinc-300">
                  {t("shipping")}
                </span>
                <span>{t("free")}</span>
              </div>

              <div className="flex justify-between pb-4 border-b border-zinc-200 dark:border-zinc-700">
                <span className="text-zinc-600 dark:text-zinc-300">
                  {t("tax")}
                </span>
                <span>$0</span>
              </div>

              <div className="flex justify-between font-semibold text-lg text-indigo-700 dark:text-indigo-300">
                <span>{t("total")}</span>
                <span>${cartData?.data.totalCartPrice.toFixed(2)}</span>
              </div>

              <div className="pt-6">
                <Button
                  onClick={handlePlaceOrder}
                  className="bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-600 text-white transition-colors w-full py-6 text-lg font-medium"
                  disabled={
                    !selectedAddress ||
                    !paymentMethod ||
                    loadingCashOrder ||
                    loadingOnlinePaymentOrder
                  }
                >
                  {loadingCashOrder || loadingOnlinePaymentOrder ? (
                    <LoaderPinwheel className="animate-spin" />
                  ) : paymentMethod === "OnlinePayment" ? (
                    t("proceedToPayment")
                  ) : (
                    t("placeOrder")
                  )}
                </Button>
              </div>

              <div className="text-center pt-2 text-zinc-500 dark:text-zinc-400 flex items-center justify-center gap-1">
                <Lock size={15} className="text-indigo-400" />
                <p className="text-xs xl:text-sm">{t("orderSecured")}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Checkout;
