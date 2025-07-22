"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  CreditCard,
  Wallet,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  XCircle,
  Download,
  Search,
  Calendar,
  MoreHorizontal,
  Loader2,
  RefreshCw,
} from "lucide-react"

export default function FinancialManagement() {
  const [selectedPeriod, setSelectedPeriod] = useState("30d")
  const [transactionFilter, setTransactionFilter] = useState("all")
  const [financialOverview, setFinancialOverview] = useState(null)
  const [recentTransactions, setRecentTransactions] = useState([])
  const [paymentMethods, setPaymentMethods] = useState([])
  const [monthlyRevenue, setMonthlyRevenue] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [overviewRes, transactionsRes, paymentMethodsRes, monthlyRevenueRes] = await Promise.all([
        fetch("/api/financial/overview"),
        fetch(`/api/financial/transactions?filter=${transactionFilter}`),
        fetch("/api/financial/payment-methods"),
        fetch(`/api/financial/monthly-revenue?period=${selectedPeriod}`),
      ])

      // Check if responses are OK before parsing JSON
      if (!overviewRes.ok) {
        const errorData = await overviewRes.json().catch(() => ({ error: "Unknown error fetching overview" }))
        throw new Error(errorData.error || `HTTP error! status: ${overviewRes.status} for overview`)
      }
      if (!transactionsRes.ok) {
        const errorData = await transactionsRes.json().catch(() => ({ error: "Unknown error fetching transactions" }))
        throw new Error(errorData.error || `HTTP error! status: ${transactionsRes.status} for transactions`)
      }
      if (!paymentMethodsRes.ok) {
        const errorData = await paymentMethodsRes
          .json()
          .catch(() => ({ error: "Unknown error fetching payment methods" }))
        throw new Error(errorData.error || `HTTP error! status: ${paymentMethodsRes.status} for payment methods`)
      }
      if (!monthlyRevenueRes.ok) {
        const errorData = await monthlyRevenueRes
          .json()
          .catch(() => ({ error: "Unknown error fetching monthly revenue" }))
        throw new Error(errorData.error || `HTTP error! status: ${monthlyRevenueRes.status} for monthly revenue`)
      }

      const overviewData = await overviewRes.json()
      const transactionsData = await transactionsRes.json()
      const paymentMethodsData = await paymentMethodsRes.json()
      const monthlyRevenueData = await monthlyRevenueRes.json()

      setFinancialOverview(overviewData)
      setRecentTransactions(transactionsData)
      setPaymentMethods(paymentMethodsData)
      setMonthlyRevenue(monthlyRevenueData)
    } catch (err) {
      console.error("Failed to fetch financial data:", err)
      setError(err.message || "An unexpected error occurred.")
    } finally {
      setLoading(false)
    }
  }, [selectedPeriod, transactionFilter])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const getTransactionIcon = (type) => {
    switch (type) {
      case "entry_fee":
        return <ArrowUpRight className="h-4 w-4 text-green-600" />
      case "payout":
        return <ArrowDownLeft className="h-4 w-4 text-red-600" />
      case "refund":
        return <ArrowDownLeft className="h-4 w-4 text-orange-600" />
      default:
        return <DollarSign className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status) => {
    const statusConfig = {
      completed: { label: "Completed", className: "bg-green-100 text-green-800", icon: CheckCircle },
      pending: { label: "Pending", className: "bg-yellow-100 text-yellow-800", icon: Clock },
      processing: { label: "Processing", className: "bg-blue-100 text-blue-800", icon: Clock },
      failed: { label: "Failed", className: "bg-red-100 text-red-800", icon: XCircle },
      cancelled: { label: "Cancelled", className: "bg-gray-100 text-gray-800", icon: XCircle },
    }
    const config = statusConfig[status] || statusConfig.pending
    const Icon = config.icon
    return (
      <Badge className={config.className}>
        <Icon className="h-3 w-3 mr-1" />
        {config.label}
      </Badge>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={fetchData}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Financial Management</h2>
          <p className="text-gray-600">Monitor revenue, payouts, and financial performance</p>
        </div>
        <div className="flex items-center space-x-2">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Report
          </Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : financialOverview ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${financialOverview.total_revenue.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">This month</p>
                </div>
                <div className="flex flex-col items-end">
                  <DollarSign className="h-8 w-8 text-green-500 mb-2" />
                  <div className="flex items-center space-x-1 text-green-600">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-sm font-medium">+{financialOverview.monthly_growth}%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : financialOverview ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Payouts</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${financialOverview.total_payouts.toLocaleString()}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Distributed to winners</p>
                </div>
                <div className="flex flex-col items-end">
                  <Wallet className="h-8 w-8 text-blue-500 mb-2" />
                  <div className="flex items-center space-x-1 text-blue-600">
                    <ArrowDownLeft className="h-3 w-3" />
                    <span className="text-sm font-medium">70.1%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : financialOverview ? (
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Net Profit</p>
                  <p className="text-2xl font-bold text-gray-900">${financialOverview.net_profit.toLocaleString()}</p>
                  <p className="text-xs text-gray-500 mt-1">After all expenses</p>
                </div>
                <div className="flex flex-col items-end">
                  <TrendingUp className="h-8 w-8 text-purple-500 mb-2" />
                  <div className="flex items-center space-x-1 text-purple-600">
                    <TrendingUp className="h-3 w-3" />
                    <span className="text-sm font-medium">+18.3%</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Trend */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5" />
              <span>Revenue Trend</span>
            </CardTitle>
            <CardDescription>Monthly revenue growth over time</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : monthlyRevenue.length > 0 ? (
              <div className="space-y-4">
                {monthlyRevenue.map((data, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">{data.month_year}</span>
                    <div className="flex items-center space-x-4">
                      <span className="text-sm font-medium">${data.revenue.toLocaleString()}</span>
                      <div
                        className={`flex items-center space-x-1 ${data.growth >= 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {data.growth >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        <span className="text-sm">{data.growth}%</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>

        {/* Payment Methods */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CreditCard className="h-5 w-5" />
              <span>Payment Methods</span>
            </CardTitle>
            <CardDescription>Revenue breakdown by payment method</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center h-32">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            ) : paymentMethods.length > 0 ? (
              <div className="space-y-4">
                {paymentMethods.map((method, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">{method.method_name}</span>
                      <span className="text-sm text-gray-600">{method.percentage}%</span>
                    </div>
                    <Progress value={method.percentage} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{method.transactions_count} transactions</span>
                      <span>${method.revenue.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500">No data available</div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Recent Transactions</CardTitle>
            <div className="flex items-center space-x-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
                />
              </div>
              <select
                value={transactionFilter}
                onChange={(e) => setTransactionFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Types</option>
                <option value="entry_fee">Entry Fees</option>
                <option value="payout">Payouts</option>
                <option value="refund">Refunds</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : recentTransactions.length > 0 ? (
            <div className="space-y-4">
              {recentTransactions.map((transaction) => (
                <div
                  key={transaction.transaction_id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">{getTransactionIcon(transaction.type)}</div>
                    <div>
                      <div className="flex items-center space-x-2">
                        <h4 className="font-medium text-gray-900">{transaction.transaction_id}</h4>
                        {getStatusBadge(transaction.status)}
                      </div>
                      <p className="text-sm text-gray-600">
                        {transaction.user} • {transaction.tournament}
                      </p>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                        <span className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {new Date(transaction.timestamp).toLocaleString()}
                        </span>
                        <span className="flex items-center">
                          <CreditCard className="h-3 w-3 mr-1" />
                          {transaction.payment_method}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="text-right">
                      <p
                        className={`text-lg font-semibold ${transaction.amount > 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {transaction.amount > 0 ? "+" : ""}${Math.abs(transaction.amount).toFixed(2)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{transaction.type.replace("_", " ")}</p>
                    </div>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500">No transactions available</div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
