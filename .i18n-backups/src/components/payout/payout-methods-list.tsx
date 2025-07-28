"use client"

import { useState } from "react"
import { BanknoteIcon as Bank, ShoppingCartIcon as Paypal, Trash2 } from "lucide-react"
import ButtonPrimary from "@/shared/ButtonPrimary"

interface PayoutMethod {
  id: string
  type: string
  email?: string
  accountHolderName?: string
  accountNumber?: string
  bankName?: string
  country: string
  currency: string
  isDefault: boolean
}

interface PayoutMethodsListProps {
  payoutMethods: PayoutMethod[]
  onAddMethod: () => void
  onDeleteMethod: (id: string) => void
  onSetDefault: (id: string) => void
}

export default function PayoutMethodsList({
  payoutMethods,
  onAddMethod,
  onDeleteMethod,
  onSetDefault,
}: PayoutMethodsListProps) {
  const [expandedMethod, setExpandedMethod] = useState<string | null>(null)

  const toggleExpand = (id: string) => {
    setExpandedMethod(expandedMethod === id ? null : id)
  }

  if (payoutMethods.length === 0) {
    return (
      <div className="space-y-6">
        <div className="text-center p-8 border border-gray-200 rounded-lg">
          <h3 className="text-lg font-medium mb-2">No payout methods added yet</h3>
          <p className="mb-6 text-gray-600">Add a payout method to receive money from your bookings.</p>
          <ButtonPrimary onClick={onAddMethod}>Add payout method</ButtonPrimary>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {payoutMethods.map((method) => (
        <div key={method.id} className="border border-gray-200 rounded-lg overflow-hidden">
          <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => toggleExpand(method.id)}>
            <div className="flex items-center">
              {method.type === "paypal" ? (
                <Paypal className="h-6 w-6 mr-3 text-[#00457C]" />
              ) : (
                <Bank className="h-6 w-6 mr-3 text-gray-700" />
              )}
              <div>
                <p className="font-medium">
                  {method.type === "paypal" ? `PayPal: ${method.email}` : `Bank account: ${method.bankName}`}
                </p>
                <p className="text-sm text-gray-500">
                  {method.country} • {method.currency}
                </p>
              </div>
            </div>
            <div className="flex items-center">
              {method.isDefault && <span className="text-xs bg-gray-100 px-2 py-1 rounded-full mr-3">Default</span>}
            </div>
          </div>

          {expandedMethod === method.id && (
            <div className="p-4 border-t border-gray-200 bg-gray-50">
              <div className="grid gap-3">
                {method.type === "paypal" ? (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm">{method.email}</p>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-sm font-medium">Account holder</p>
                      <p className="text-sm">{method.accountHolderName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Bank name</p>
                      <p className="text-sm">{method.bankName}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Account number</p>
                      <p className="text-sm">••••{method.accountNumber?.slice(-4)}</p>
                    </div>
                  </div>
                )}

                <div className="flex justify-end gap-3 mt-2">
                  {!method.isDefault && (
                    <button onClick={() => onSetDefault(method.id)} className="text-sm font-medium text-gray-700">
                      Set as default
                    </button>
                  )}
                  <button
                    onClick={() => onDeleteMethod(method.id)}
                    className="text-sm font-medium text-red-600 flex items-center gap-1"
                  >
                    <Trash2 className="h-4 w-4" /> Remove
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ))}

      <div className="mt-6">
        <ButtonPrimary onClick={onAddMethod}>Add another payout method</ButtonPrimary>
      </div>
    </div>
  )
}
