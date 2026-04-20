import type { ReportStatus } from "./types";
import type { UseAdminPanelState } from "./useAdminPanel";
import { DataPanel } from "./ui";

export function ReportsSection({ admin }: { admin: UseAdminPanelState }) {
  return (
    <DataPanel title="User Reports">
      <div className="mb-4 flex items-center justify-between gap-3">
        <p className="text-sm text-slate-300">
          Track and update issue statuses from users.
        </p>
        <button
          onClick={admin.handleGetReports}
          className="rounded-lg bg-cyan-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-cyan-700"
        >
          Refresh Reports
        </button>
      </div>

      {admin.reports.length === 0 ? (
        <p className="text-sm text-slate-400">No reports loaded yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-slate-700">
          <table className="min-w-full text-sm">
            <thead className="bg-slate-800 text-slate-100">
              <tr>
                <th className="px-3 py-2 text-left">ID</th>
                <th className="px-3 py-2 text-left">User ID</th>
                <th className="px-3 py-2 text-left">Type</th>
                <th className="px-3 py-2 text-left">Message</th>
                <th className="px-3 py-2 text-left">Status</th>
                <th className="px-3 py-2 text-left">Created</th>
              </tr>
            </thead>
            <tbody>
              {admin.reports.map((report) => (
                <tr
                  key={report.report_id}
                  className="border-t border-slate-800 align-top"
                >
                  <td className="px-3 py-2">{report.report_id}</td>
                  <td className="px-3 py-2">{report.user_id ?? "-"}</td>
                  <td className="px-3 py-2 uppercase tracking-wide text-cyan-200">
                    {report.type}
                  </td>
                  <td className="px-3 py-2 max-w-lg whitespace-pre-wrap wrap-break-word">
                    {report.message}
                  </td>
                  <td className="px-3 py-2">
                    <select
                      value={report.status}
                      onChange={(e) =>
                        void admin.handleUpdateReportStatus(
                          report.report_id,
                          e.target.value as ReportStatus,
                        )
                      }
                      className="rounded-md border border-slate-600 bg-slate-900 px-2 py-1"
                    >
                      <option value="open">open</option>
                      <option value="in_progress">in_progress</option>
                      <option value="resolved">resolved</option>
                      <option value="closed">closed</option>
                    </select>
                  </td>
                  <td className="px-3 py-2 whitespace-nowrap">
                    {new Date(report.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </DataPanel>
  );
}
