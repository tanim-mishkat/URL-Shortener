import React, { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "@tanstack/react-router";
import { fetchTimeseries, fetchBreakdown } from "../api/analytics.api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

dayjs.extend(utc);

// helpers
const regionName = new Intl.DisplayNames(["en"], { type: "region" });
const formatCountry = (cc) =>
  cc && cc !== "UNK" ? regionName.of(cc) || cc : "Unknown";
const prettyRef = (l) => (l === "direct" ? "Direct" : l);

const RANGE_PRESETS = [
  { label: "7d", days: 7 },
  { label: "30d", days: 30 },
  { label: "90d", days: 90 },
];

const DEVICE_COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", "#10b981"];

const EmptyChart = ({ label = "No data for this range" }) => (
  <div className="h-full flex items-center justify-center text-slate-500 text-sm">
    {label}
  </div>
);

export default function StatsPage() {
  const { linkId } = useParams({ from: "/stats/$linkId" });
  const [days, setDays] = useState(30);

  // Include today's bucket by sending "to = now" and "from = startOfDay(...)".
  const { from, to } = useMemo(() => {
    const end = new Date(); // now (local); server truncates to UTC day
    const start = dayjs(end)
      .subtract(days - 1, "day")
      .startOf("day")
      .toDate();
    return { from: start.toISOString(), to: end.toISOString() };
  }, [days]);

  const qs = { from, to };

  // common query options (prevents surprise refresh on tab focus)
  const commonQ = {
    keepPreviousData: true,
    placeholderData: (prev) => prev,
    staleTime: 60_000,
    refetchOnWindowFocus: false,
  };

  const {
    data: tsData,
    isLoading: tsLoading,
    isFetching: tsFetching,
  } = useQuery({
    queryKey: ["analytics", "timeseries", linkId, qs],
    queryFn: () => fetchTimeseries(linkId, qs),
    ...commonQ,
  });

  const { data: refData, isFetching: refFetching } = useQuery({
    queryKey: ["analytics", "breakdown", linkId, "referrer", qs],
    queryFn: () =>
      fetchBreakdown(linkId, { ...qs, dimension: "referrer", limit: 8 }),
    ...commonQ,
  });

  const { data: countryData, isFetching: countryFetching } = useQuery({
    queryKey: ["analytics", "breakdown", linkId, "country", qs],
    queryFn: () =>
      fetchBreakdown(linkId, { ...qs, dimension: "country", limit: 8 }),
    ...commonQ,
  });

  const { data: deviceData, isFetching: deviceFetching } = useQuery({
    queryKey: ["analytics", "breakdown", linkId, "device", qs],
    queryFn: () => fetchBreakdown(linkId, { ...qs, dimension: "device" }),
    ...commonQ,
  });

  const timeseries = useMemo(() => {
    const raw = tsData?.series || [];
    const totalsByUTC = new Map(
      raw.map((d) => [dayjs(d.day).utc().format("YYYY-MM-DD"), d.total])
    );

    // iterate day-by-day from 'from' (startOf day already) to 'to' (now)
    const start = dayjs(from).startOf("day");
    const endUtcDay = dayjs(to).utc().startOf("day");
    const out = [];
    for (
      let d = start;
      d.utc().isBefore(endUtcDay) || d.utc().isSame(endUtcDay, "day");
      d = d.add(1, "day")
    ) {
      const key = d.utc().format("YYYY-MM-DD");
      out.push({ day: d.format("MMM D"), total: totalsByUTC.get(key) || 0 });
    }
    return out;
  }, [tsData, from, to]);

  const refRows = (refData?.rows || []).map((r) => ({
    ...r,
    label: prettyRef(r.label),
  }));
  const countryRows = (countryData?.rows || []).map((r) => ({
    ...r,
    label: formatCountry(r.label),
  }));
  const deviceRows = deviceData?.rows || [];

  const noData =
    !tsData?.series?.length &&
    !refData?.rows?.length &&
    !countryData?.rows?.length &&
    !deviceData?.rows?.length;

  const anyFetching =
    tsFetching || refFetching || countryFetching || deviceFetching;
  const totalClicks = timeseries.reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/50">
      {/* Mobile-first container with proper padding */}
      <div className="w-full px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-12 max-w-7xl mx-auto">
        {/* Enhanced Header - Mobile Stack, Desktop Flex */}
        <div className="mb-8 space-y-4 sm:space-y-0 sm:flex sm:items-center sm:justify-between">
          <div className="text-center sm:text-left">
            <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
              <div className="w-2 h-8 bg-gradient-to-b from-indigo-500 to-purple-600 rounded-full"></div>
              <h1 className="text-2xl sm:text-3xl xl:text-4xl font-bold bg-gradient-to-r from-slate-800 via-indigo-700 to-purple-700 bg-clip-text text-transparent">
                Link Analytics
              </h1>
            </div>
            <p className="text-slate-600 text-sm sm:text-base">
              Insights and performance metrics for your link
            </p>
            {totalClicks > 0 && (
              <div className="mt-2 inline-flex items-center px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-sm font-medium">
                {totalClicks.toLocaleString()} total clicks
              </div>
            )}
          </div>

          {/* Controls + light updating chip */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center bg-white rounded-2xl p-1 shadow-lg shadow-indigo-500/10 border border-indigo-100">
              {RANGE_PRESETS.map((r) => (
                <button
                  key={r.days}
                  onClick={() => setDays(r.days)}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                    days === r.days
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 transform scale-105"
                      : "text-slate-600 hover:text-indigo-600 hover:bg-indigo-50"
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>

            {anyFetching && timeseries.length > 0 && (
              <span className="px-3 py-1 rounded-xl bg-indigo-50 text-indigo-700 text-xs font-medium">
                Updating…
              </span>
            )}

            <Link
              to="/dashboard"
              className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-white text-slate-700 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md text-center font-medium"
            >
              ← Back
            </Link>
          </div>
        </div>

        {/* Initial loading veil ONLY for first load of the main chart */}
        {tsLoading && !timeseries.length && (
          <div className="fixed inset-0 bg-white/50 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white shadow-xl border border-indigo-100">
              <div className="w-5 h-5 border-2 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <span className="text-slate-700 font-medium">Loading data…</span>
            </div>
          </div>
        )}

        {/* Enhanced Empty State */}
        {noData && !anyFetching && (
          <div className="mb-8 p-8 rounded-3xl bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-100 shadow-sm">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-2xl flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-indigo-300 rounded-lg"></div>
              </div>
              <h3 className="text-lg font-semibold text-slate-800 mb-2">
                No data yet
              </h3>
              <p className="text-slate-600 max-w-md mx-auto">
                Share your short link to start collecting analytics data and
                insights.
              </p>
            </div>
          </div>
        )}

        {/* Enhanced Grid Layout - Mobile Stack, Desktop Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Timeseries Chart - Mobile full width, Desktop spans 2 columns */}
          <div className="lg:col-span-2 group">
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 overflow-hidden">
              <div className="p-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-indigo-500 to-blue-500 rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                    Clicks Over Time
                  </h2>
                </div>
                <p className="text-slate-500 text-sm mt-1">
                  Daily click performance
                </p>
                <p className="text-slate-500 text-xs mt-1">
                  Range: {dayjs(from).format("MMM D, YYYY")} –{" "}
                  {dayjs(to).format("MMM D, YYYY")}
                </p>
              </div>
              <div className="p-6 pt-4">
                <div className="h-64 sm:h-72">
                  {timeseries.length ? (
                    <ResponsiveContainer>
                      <LineChart data={timeseries}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="day"
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          tickLine={{ stroke: "#e2e8f0" }}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          tickLine={{ stroke: "#e2e8f0" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Line
                          type="monotone"
                          dataKey="total"
                          stroke="url(#lineGradient)"
                          strokeWidth={3}
                          dot={{ fill: "#6366f1", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: "#6366f1" }}
                        />
                        <defs>
                          <linearGradient
                            id="lineGradient"
                            x1="0"
                            y1="0"
                            x2="1"
                            y2="0"
                          >
                            <stop offset="0%" stopColor="#6366f1" />
                            <stop offset="100%" stopColor="#8b5cf6" />
                          </linearGradient>
                        </defs>
                      </LineChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Device Chart */}
          <div className="group">
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 overflow-hidden h-full">
              <div className="p-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                    Devices
                  </h2>
                </div>
                <p className="text-slate-500 text-sm mt-1">
                  Click distribution by device
                </p>
              </div>
              <div className="p-6 pt-4">
                <div className="h-64 sm:h-72">
                  {deviceRows.length ? (
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie
                          data={deviceRows.map((r) => ({
                            name: r.label,
                            value: r.count,
                          }))}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label={({ name, percent }) =>
                            `${name} ${(percent * 100).toFixed(0)}%`
                          }
                          labelLine={false}
                        >
                          {deviceRows.map((_, i) => (
                            <Cell
                              key={i}
                              fill={DEVICE_COLORS[i % DEVICE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart label="No device data for this range" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Top Referrers */}
          <div className="group">
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 overflow-hidden h-full">
              <div className="p-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                    Top Referrers
                  </h2>
                </div>
                <p className="text-slate-500 text-sm mt-1">Traffic sources</p>
              </div>
              <div className="p-6 pt-4">
                <div className="h-64 sm:h-72">
                  {refRows.length ? (
                    <ResponsiveContainer>
                      <BarChart data={refRows}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="label"
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          tickLine={{ stroke: "#e2e8f0" }}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          tickLine={{ stroke: "#e2e8f0" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill="url(#barGradient1)"
                          radius={[4, 4, 0, 0]}
                        />
                        <defs>
                          <linearGradient
                            id="barGradient1"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#10b981" />
                            <stop offset="100%" stopColor="#059669" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart label="No referrer data for this range" />
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Top Countries */}
          <div className="group">
            <div className="bg-white rounded-3xl border border-slate-200/60 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-300 overflow-hidden h-full">
              <div className="p-6 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-800">
                    Top Countries
                  </h2>
                </div>
                <p className="text-slate-500 text-sm mt-1">
                  Geographic distribution
                </p>
              </div>
              <div className="p-6 pt-4">
                <div className="h-64 sm:h-72">
                  {countryRows.length ? (
                    <ResponsiveContainer>
                      <BarChart data={countryRows}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                        <XAxis
                          dataKey="label"
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          tickLine={{ stroke: "#e2e8f0" }}
                        />
                        <YAxis
                          allowDecimals={false}
                          tick={{ fontSize: 12, fill: "#64748b" }}
                          tickLine={{ stroke: "#e2e8f0" }}
                        />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: "white",
                            border: "1px solid #e2e8f0",
                            borderRadius: "12px",
                            boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                          }}
                        />
                        <Bar
                          dataKey="count"
                          fill="url(#barGradient2)"
                          radius={[4, 4, 0, 0]}
                        />
                        <defs>
                          <linearGradient
                            id="barGradient2"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop offset="0%" stopColor="#f59e0b" />
                            <stop offset="100%" stopColor="#d97706" />
                          </linearGradient>
                        </defs>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <EmptyChart label="No country data for this range" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
