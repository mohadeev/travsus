"use client"

import type React from "react"

import { useState } from "react"
import { BanknoteIcon as Bank, ChevronDown, ShoppingCartIcon as Paypal, X } from "lucide-react"
import ButtonPrimary from "@/shared/ButtonPrimary"

interface AddPayoutMethodFormProps {
  onCancel: () => void
  onSubmit: (data: any) => Promise<void>
}

export default function AddPayoutMethodForm({ onCancel, onSubmit }: AddPayoutMethodFormProps) {
  const [methodType, setMethodType] = useState<string>("bank_account")
  const [country, setCountry] = useState<string>("")
  const [currency, setCurrency] = useState<string>("EUR")
  const [loading, setLoading] = useState<boolean>(false)
  const [formData, setFormData] = useState({
    // Bank account fields
    accountHolderName: "",
    accountNumber: "",
    bankName: "",
    swiftCode: "",
    iban: "",
    routingNumber: "",

    // PayPal fields
    email: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      await onSubmit({
        type: methodType,
        country,
        currency,
        ...formData,
      })
    } catch (error) {
      console.error("Error submitting payout method:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold">Add payout method</h2>
        <button onClick={onCancel} className="text-gray-500 hover:text-gray-700">
          <X className="h-5 w-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="p-6">
          <div className="mb-6">
            <label className="block mb-2 text-sm font-medium">Billing country/region</label>
            <div className="relative">
              <select
                name="country"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                required
                className="appearance-none w-full bg-white border border-gray-300 rounded-md py-2 px-4 pr-8 leading-tight focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              >
                <option value="">Select a country</option>
                <option value="US">United States</option>
                <option value="GB">United Kingdom</option>
                <option value="ES">Spain</option>
                <option value="FR">France</option>
                <option value="DE">Germany</option>
                <option value="IT">Italy</option>
                {/* Add more countries as needed */}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <ChevronDown className="h-4 w-4" />
              </div>
            </div>
            <p className="mt-1 text-sm text-gray-500">This is where you opened your financial account.</p>
          </div>

          <div className="mb-6">
            <h3 className="mb-4 text-lg font-medium">How would you like to get paid?</h3>

            <div className="space-y-3">
              <div
                className={`border rounded-lg p-4 flex items-center cursor-pointer ${
                  methodType === "bank_account" ? "border-black" : "border-gray-300"
                }`}
                onClick={() => setMethodType("bank_account")}
              >
                <div
                  className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                    methodType === "bank_account" ? "border-black" : "border-gray-300"
                  }`}
                >
                  {methodType === "bank_account" && <div className="w-3 h-3 rounded-full bg-black"></div>}
                </div>
                <div className="flex-1 flex items-center">
                  <Bank className="h-6 w-6 mr-3 text-gray-700" />
                  <div>
                    <p className="font-medium">Bank account in {currency}</p>
                    <p className="text-sm text-gray-500">1 business day • No fees</p>
                  </div>
                </div>
              </div>

              <div
                className={`border rounded-lg p-4 flex items-center cursor-pointer ${
                  methodType === "paypal" ? "border-black" : "border-gray-300"
                }`}
                onClick={() => setMethodType("paypal")}
              >
                <div
                  className={`w-5 h-5 rounded-full border mr-3 flex items-center justify-center ${
                    methodType === "paypal" ? "border-black" : "border-gray-300"
                  }`}
                >
                  {methodType === "paypal" && <div className="w-3 h-3 rounded-full bg-black"></div>}
                </div>
                <div className="flex-1 flex items-center">
                  <Paypal className="h-6 w-6 mr-3 text-[#00457C]" />
                  <div>
                    <p className="font-medium">PayPal in {currency}</p>
                    <p className="text-sm text-gray-500">1 business day • PayPal fees may apply</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {methodType === "bank_account" && (
            <div className="space-y-4">
              <div>
                <label htmlFor="accountHolderName" className="block mb-1 text-sm font-medium">
                  Account holder name
                </label>
                <input
                  id="accountHolderName"
                  name="accountHolderName"
                  type="text"
                  required
                  value={formData.accountHolderName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                />
              </div>

              <div>
                <label htmlFor="bankName" className="block mb-1 text-sm font-medium">
                  Bank name
                </label>
                <input
                  id="bankName"
                  name="bankName"
                  type="text"
                  required
                  value={formData.bankName}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                />
              </div>

              <div>
                <label htmlFor="accountNumber" className="block mb-1 text-sm font-medium">
                  Account number
                </label>
                <input
                  id="accountNumber"
                  name="accountNumber"
                  type="text"
                  required
                  value={formData.accountNumber}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                />
              </div>

              {country === "US" && (
                <div>
                  <label htmlFor="routingNumber" className="block mb-1 text-sm font-medium">
                    Routing number
                  </label>
                  <input
                    id="routingNumber"
                    name="routingNumber"
                    type="text"
                    value={formData.routingNumber}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  />
                </div>
              )}

              {["ES", "FR", "DE", "IT"].includes(country) && (
                <div>
                  <label htmlFor="iban" className="block mb-1 text-sm font-medium">
                    IBAN
                  </label>
                  <input
                    id="iban"
                    name="iban"
                    type="text"
                    value={formData.iban}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                  />
                </div>
              )}

              <div>
                <label htmlFor="swiftCode" className="block mb-1 text-sm font-medium">
                  SWIFT/BIC code
                </label>
                <input
                  id="swiftCode"
                  name="swiftCode"
                  type="text"
                  value={formData.swiftCode}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                />
              </div>
            </div>
          )}

          {methodType === "paypal" && (
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium">
                PayPal email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
              />
            </div>
          )}
        </div>

        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <ButtonPrimary type="submit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </ButtonPrimary>
        </div>
      </form>
    </div>
  )
}
